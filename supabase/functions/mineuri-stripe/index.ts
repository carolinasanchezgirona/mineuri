// Mineuri secure Stripe Checkout and post-payment PDF delivery.
// Stripe secrets are read only on the server; never placed in public assets.
const ORIGINS = new Set(["https://mineuri.com", "https://www.mineuri.com"]);
const BASE = Deno.env.get("SUPABASE_URL") || "";
const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
function adminKey() {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return typeof keys.default === "string" ? keys.default : "";
  } catch { return ""; }
}
const ADMIN_KEY = adminKey();
const headers = (req) => {
  const origin = req.headers.get("origin") || "";
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    ...(ORIGINS.has(origin) ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type" } : {}),
  };
};
function reply(req, status, payload) { return new Response(JSON.stringify(payload), { status, headers: headers(req) }); }
function supaHeaders() { return { apikey: ADMIN_KEY, Authorization: "Bearer " + ADMIN_KEY }; }
async function getResource(field, value) {
  const query = new URL(BASE + "/rest/v1/resources");
  query.searchParams.set("select", "id,slug,title,status,is_free,price_cents,file_path");
  query.searchParams.set(field, "eq." + value);
  query.searchParams.set("limit", "1");
  const response = await fetch(query, { headers: supaHeaders(), signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw Error("Resource lookup unavailable");
  const rows = await response.json();
  return rows[0] || null;
}
async function stripe(path, init) {
  const resp = await fetch("https://api.stripe.com/v1/" + path, {
    ...init,
    headers: { Authorization: "Bearer " + STRIPE_KEY, ...(init?.headers || {}) },
    signal: AbortSignal.timeout(15000),
  });
  const data = await resp.json();
  if (!resp.ok) throw Error("Stripe request failed: " + resp.status);
  return data;
}
async function createCheckout(req, slug) {
  if (!STRIPE_KEY || !WEBHOOK_SECRET || !BASE || !ADMIN_KEY) return reply(req, 503, { error: "La compra aún no está activada." });
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120)
    return reply(req, 400, { error: "Recurso no válido." });
  const item = await getResource("slug", slug);
  if (!item || item.status !== "published" || item.is_free || !Number.isInteger(item.price_cents)
      || item.price_cents < 50 || !/^resources\/[0-9a-f-]{36}\.pdf$/i.test(item.file_path || ""))
    return reply(req, 409, { error: "Este recurso todavía no está disponible para comprar." });
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("locale", "es");
  body.set("customer_creation", "always");
  body.set("payment_method_types[0]", "card");
  body.set("line_items[0][price_data][currency]", "eur");
  body.set("line_items[0][price_data][unit_amount]", String(item.price_cents));
  body.set("line_items[0][price_data][product_data][name]", item.title);
  body.set("line_items[0][quantity]", "1");
  body.set("client_reference_id", item.id);
  body.set("metadata[resource_id]", item.id);
  body.set("metadata[resource_slug]", item.slug);
  body.set("payment_intent_data[metadata][resource_id]", item.id);
  body.set("success_url", "https://mineuri.com/tienda/compra-confirmada/?session_id={CHECKOUT_SESSION_ID}");
  body.set("cancel_url", "https://mineuri.com/tienda/?compra=cancelada#catalogo");
  const session = await stripe("checkout/sessions", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!/^https:\/\/checkout\.stripe\.com\//.test(session.url || ""))
    return reply(req, 502, { error: "No se ha podido abrir la compra segura." });
  return reply(req, 200, { url: session.url });
}
async function download(req, sessionId) {
  if (!STRIPE_KEY || !BASE || !ADMIN_KEY) return reply(req, 503, { error: "Descargas no disponibles." });
  if (typeof sessionId !== "string" || !/^cs_(test|live)_[A-Za-z0-9]{15,250}$/.test(sessionId))
    return reply(req, 400, { error: "Referencia de compra no válida." });
  const session = await stripe("checkout/sessions/" + encodeURIComponent(sessionId), { method: "GET" });
  if (session.mode !== "payment" || session.payment_status !== "paid" ||
      session.currency !== "eur" || !session.metadata?.resource_id)
    return reply(req, 403, { error: "El pago aún no está confirmado." });
  const id = String(session.metadata.resource_id);
  if (!/^[0-9a-f-]{36}$/i.test(id)) return reply(req, 403, { error: "Compra no válida." });
  const item = await getResource("id", id);
  if (!item || item.is_free || !/^resources\/[0-9a-f-]{36}\.pdf$/i.test(item.file_path || ""))
    return reply(req, 404, { error: "El archivo de esta compra no está disponible." });
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : "";
  if (paymentIntent) {
    const pi = await stripe("payment_intents/" + encodeURIComponent(paymentIntent) + "?expand[]=latest_charge", { method: "GET" });
    const charge = typeof pi.latest_charge === "object" ? pi.latest_charge : null;
    if (charge?.refunded || (charge?.amount_refunded && charge.amount_refunded >= charge.amount))
      return reply(req, 403, { error: "Esta compra ha sido reembolsada." });
  }
  const order = new URL(BASE + "/rest/v1/mineuri_resource_purchases");
  order.searchParams.set("select", "status");
  order.searchParams.set("stripe_session_id", "eq." + sessionId);
  order.searchParams.set("limit", "1");
  const orderRes = await fetch(order, { headers: supaHeaders(), signal: AbortSignal.timeout(8000) });
  if (!orderRes.ok) return reply(req, 503, { error: "No se ha podido comprobar la compra." });
  const orderRows = await orderRes.json();
  if (orderRows[0]?.status === "refunded") return reply(req, 403, { error: "Esta compra ha sido reembolsada." });
  const path = item.file_path.split("/").map(encodeURIComponent).join("/");
  const signed = await fetch(BASE + "/storage/v1/object/sign/mineuri-private/" + path, {
    method: "POST", headers: { ...supaHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: 120 }), signal: AbortSignal.timeout(8000),
  });
  if (!signed.ok) return reply(req, 503, { error: "No se ha podido preparar la descarga." });
  const signedData = await signed.json();
  const raw = signedData.signedURL || signedData.signedUrl || "";
  const url = new URL(raw.startsWith("/object/sign/") ? "/storage/v1" + raw : raw, BASE);
  if (url.origin !== new URL(BASE).origin || !url.pathname.startsWith("/storage/v1/object/sign/mineuri-private/resources/"))
    return reply(req, 503, { error: "Ruta de descarga no válida." });
  url.searchParams.set("download", item.slug + ".pdf");
  return reply(req, 200, { download_url: url.toString(), title: item.title, expires_in: 120 });
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(req) });
  if (req.method === "GET") {
    return reply(req, 200, { enabled: STRIPE_KEY.startsWith("sk_live_") && WEBHOOK_SECRET.startsWith("whsec_") && !!ADMIN_KEY });
  }
  if (req.method !== "POST") return reply(req, 405, { error: "Método no permitido." });
  if (req.headers.get("origin") && !ORIGINS.has(req.headers.get("origin"))) return reply(req, 403, { error: "Origen no autorizado." });
  try {
    if (Number(req.headers.get("content-length") || 0) > 2000) return reply(req, 413, { error: "Petición demasiado grande." });
    const input = await req.json();
    if (input?.action === "checkout") return await createCheckout(req, input.slug);
    if (input?.action === "download") return await download(req, input.session_id);
    return reply(req, 400, { error: "Acción no válida." });
  } catch (error) {
    console.error("Mineuri checkout failed:", error instanceof Error ? error.message : "unexpected");
    return reply(req, 503, { error: "Servicio de pagos temporalmente no disponible." });
  }
});
