// Stripe webhook. No public fulfillment unless Stripe HMAC signature is verified.
const BASE = Deno.env.get("SUPABASE_URL") || "";
const SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
function adminKey() {
  if (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  try { const obj = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}"); return obj.default || ""; }
  catch { return ""; }
}
const KEY = adminKey();
const reply = (status, text) => new Response(text, { status, headers: {
  "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8",
} });
function sameHex(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function validStripeSignature(body, signature) {
  if (!SECRET.startsWith("whsec_") || !signature) return false;
  const parts = signature.split(",").map((x) => x.trim().split("="));
  const t = parts.find((p) => p[0] === "t")?.[1];
  const signatures = parts.filter((p) => p[0] === "v1").map((p) => p[1] || "");
  const secs = Number(t);
  if (!Number.isSafeInteger(secs) || Math.abs(Math.floor(Date.now() / 1000) - secs) > 300 || !signatures.length) return false;
  const hmacKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", hmacKey, new TextEncoder().encode(t + "." + body)));
  const expected = Array.from(bytes).map((n) => n.toString(16).padStart(2, "0")).join("");
  return signatures.some((x) => sameHex(x, expected));
}
function headers() { return { "apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json" }; }
async function recordPurchase(session) {
  if (session.mode !== "payment" || session.payment_status !== "paid" || session.currency !== "eur") return;
  const resourceId = session.metadata?.resource_id;
  if (!/^[0-9a-f-]{36}$/i.test(resourceId || "") || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(session.id || "")) return;
  const amount = session.amount_total;
  if (!Number.isInteger(amount) || amount < 50) throw Error("Unexpected checkout amount");
  const payload = {
    resource_id: resourceId,
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
    amount_cents: amount,
    currency: "eur",
    customer_email: session.customer_details?.email || session.customer_email || null,
    status: "paid",
  };
  const response = await fetch(BASE + "/rest/v1/mineuri_resource_purchases?on_conflict=stripe_session_id", {
    method: "POST", headers: { ...headers(), Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw Error("Purchase record failed: " + response.status);
}
async function recordRefund(charge) {
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : "";
  if (!pi || !(charge.refunded || (charge.amount_refunded && charge.amount_refunded >= charge.amount))) return;
  const url = new URL(BASE + "/rest/v1/mineuri_resource_purchases");
  url.searchParams.set("stripe_payment_intent_id", "eq." + pi);
  const response = await fetch(url, {
    method: "PATCH", headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify({ status: "refunded", updated_at: new Date().toISOString() }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw Error("Refund update failed: " + response.status);
}
Deno.serve(async (req) => {
  if (req.method !== "POST") return reply(405, "Method not allowed");
  if (!BASE || !KEY || !SECRET) return reply(503, "Webhook not configured");
  try {
    const body = await req.text();
    if (body.length > 524288) return reply(413, "Too large");
    if (!(await validStripeSignature(body, req.headers.get("stripe-signature")))) return reply(400, "Invalid signature");
    const event = JSON.parse(body);
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await recordPurchase(event.data.object);
    } else if (event.type === "charge.refunded") {
      await recordRefund(event.data.object);
    }
    return reply(200, "ok");
  } catch (e) {
    console.error("Stripe webhook error:", e instanceof Error ? e.message : "unexpected");
    return reply(500, "Webhook could not be processed");
  }
});
