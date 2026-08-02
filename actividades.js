const cards = document.querySelectorAll(".card");
const panel = document.querySelector("#seleccion");
const title = document.querySelector("#selection-title");
const description = document.querySelector("#selection-description");
const first = document.querySelector("#first-activity");
const second = document.querySelector("#second-activity");

function selectArea(card, scroll = true) {
  cards.forEach(item => item.setAttribute("aria-pressed", "false"));
  card.setAttribute("aria-pressed", "true");

  localStorage.setItem("mineuri_area_seleccionada", card.dataset.area);

  title.textContent = card.dataset.title;
  description.textContent = card.dataset.description;
  first.textContent = card.dataset.first;
  second.textContent = card.dataset.second;
  panel.hidden = false;

  if (scroll) {
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

cards.forEach(card => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => selectArea(card));
});

const saved = localStorage.getItem("mineuri_area_seleccionada");
if (saved) {
  const card = document.querySelector(`[data-area="${saved}"]`);
  if (card) selectArea(card, false);
}
