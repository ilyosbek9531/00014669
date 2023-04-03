const description = document.querySelector(".description");
const goToNotes = document.querySelector(".goToNotes");
const createNew = document.querySelector(".createNew");

const modal = document.querySelector(".wrap_modal");

description.defaultValue =
  description.dataset.value != undefined ? description.dataset.value : "";

goToNotes.addEventListener("click", () => {
  window.location.replace("/notes");
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});

createNew.addEventListener("click", () => {
  window.location.replace("/add_notes");
  document.body.style.height = "100%";
  document.body.style.overflow = "unset";
});

if (modal !== null) {
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
}
