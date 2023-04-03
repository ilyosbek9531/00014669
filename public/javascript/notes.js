const singleNote = document.querySelectorAll(".note");

singleNote.forEach((item) => {
  item.addEventListener("click", () => {
    window.location.replace(`/notes/${item.dataset.value}`);
  });
});
