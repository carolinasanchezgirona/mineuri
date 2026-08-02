const cards = document.querySelectorAll(".area-card");
const panel = document.querySelector("#seleccion");
const title = document.querySelector("#selection-title");
const description = document.querySelector("#selection-description");
const firstActivity = document.querySelector("#first-activity");
const secondActivity = document.querySelector("#second-activity");

function selectArea(card, shouldScroll = true) {
  cards.forEach((item) => item.setAttribute("aria-pressed", "false"));
  card.setAttribute("aria-pressed", "true");

  const area = card.dataset.area;
  localStorage.setItem("mineuri_area_seleccionada", area);

  title.textContent = card.dataset.title;
  description.textContent = card.dataset.description;
  firstActivity.textContent = card.dataset.first;
  secondActivity.textContent = card.dataset.second;
  panel.hidden = false;

  if (shouldScroll) {
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

cards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => selectArea(card));
});

const savedArea = localStorage.getItem("mineuri_area_seleccionada");
if (savedArea) {
  const savedCard = document.querySelector(`[data-area="${savedArea}"]`);
  if (savedCard) {
    selectArea(savedCard, false);
  }
}
