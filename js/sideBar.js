const sidebar = document.querySelector(".sidebar");

if (sidebar) {
  const init = () => {
    attachEvents();
  };

  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const hamburgerMenuContainer = document.querySelector(
    ".hamburger-menu__container"
  );
  const navItem = document.querySelectorAll(".nav__item");
  const nav = document.querySelector(".nav");

  const attachEvents = () => {
    hamburgerMenuContainer.addEventListener("click", toggleMenu);
  };

  const toggleMenu = () => {
    hamburgerMenu.classList.toggle("hamburger-menu--open");
    nav.classList.toggle("nav--open");

    navItem.forEach((item) => {
      if (item.classList.contains("activeIndex")) {
        item.classList.remove("activeIndex");
      } else {
        item.classList.add("activeIndex");
      }
    });
  };

  init();
}

function openPage(page) {
  window.location.href = page;
}
