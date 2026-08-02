const cards = document.querySelectorAll(".area-card");
const panel = document.querySelector("#seleccion");
const title = document.querySelector("#selection-title");
const description = document.querySelector("#selection-description");
const firstActivity = document.querySelector("#first-activity");
const secondActivity = document.querySelector("#second-activity");
const selectionEyebrow = document.querySelector("#selection-status-eyebrow");
const previewHeading = document.querySelector("#preview-heading");
const selectionNote = document.querySelector("#selection-note");

function selectArea(card, shouldScroll = true) {
  cards.forEach((item) => item.setAttribute("aria-pressed", "false"));
  card.setAttribute("aria-pressed", "true");

  const area = card.dataset.area;
  const status = card.dataset.status;
  localStorage.setItem("mineuri_area_seleccionada_v6", area);

  title.textContent = card.dataset.title;
  description.textContent = card.dataset.description;
  firstActivity.textContent = card.dataset.first;
  secondActivity.textContent = card.dataset.second;

  if (status === "Próximamente") {
    selectionEyebrow.textContent = "PRÓXIMAMENTE";
    previewHeading.textContent = "Estado de la sección";
    selectionNote.textContent = "Estamos preparando esta área para próximas fases de Mineuri. Formará parte del desarrollo del proyecto.";
  } else {
    selectionEyebrow.textContent = "YA DISPONIBLE EN EL PROTOTIPO";
    previewHeading.textContent = "Primeras actividades previstas";
    selectionNote.textContent = "La selección queda guardada únicamente en este navegador.";
  }

  panel.hidden = false;

  if (shouldScroll) {
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

cards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => selectArea(card));
});

const savedArea = localStorage.getItem("mineuri_area_seleccionada_v6");
if (savedArea) {
  const savedCard = document.querySelector(`[data-area="${savedArea}"]`);
  if (savedCard) {
    selectArea(savedCard, false);
  }
}
