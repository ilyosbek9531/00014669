const lenguageList = document.querySelector(".books__lenguage-list");
const elTemplate = document.querySelector(".site-template").content;
const cardList = document.querySelector(".books__card-list");
const filterSelect = document.querySelector(".book-filter");
const filterList = document.querySelector(".book-filter__list");
const languageItem = document.querySelector(".books__lenguage-list");
const elForm = document.querySelector(".site-header__form");
const elInput = document.querySelector(".form-header__input");
const cardItem = document.querySelector(".card-item");
const bookmarkNum = document.querySelector(".basket-num");
const basketList = document.querySelector(".basket-list");
const selectItem = document.querySelectorAll(".book-filter__item");
const pageList = document.querySelector(".pagination-list");
const btnHamburger = document.querySelector(".btn-room");

let filtered = [];
books = books.map((item) => {
  item.id = `id${Math.random()}`;
  if (item.year < 0) {
    item.year = -1 * item.year;
  }
  return item;
});

let lenguageArr = [];
let bookmarkArr = [];
let languageValue = "All";

const lenFragment = new DocumentFragment();
const cardFragment = new DocumentFragment();

const createLanguageList = function () {
  books.forEach((item) => {
    if (!lenguageArr.includes(item.language)) {
      lenguageArr.push(item.language);
    }
  });

  lenguageArr.forEach((len) => {
    const newLi = document.createElement("li");
    newLi.setAttribute("class", "books__lenguage-item");
    newLi.textContent = `${len} (${
      books.filter((item) => item.language === len).length
    })`;
    lenFragment.appendChild(newLi);
  });
  lenguageList.appendChild(lenFragment);
};

createLanguageList();

const languageAll = document.querySelectorAll(".books__lenguage-item");

function renderUI(arr) {
  cardList.innerHTML = "";

  if (arr.length === 0) {
    const newTitle = document.createElement("h3");
    newTitle.textContent = "There is no movie in this filter";
    newTitle.setAttribute("class", "error");
    cardList.append(newTitle);
  }
  const regex = new RegExp(elInput.value, "gi");

  arr.slice(0, 10).forEach((item) => {
    const template = elTemplate.cloneNode(true);

    template.querySelector(".card-img").src = item.imageLink;
    template.querySelector(".card-title").innerHTML = `${
      item.author
    }: ${item.title.replace(
      item.title.match(regex),
      `<mark>${regex.source}</mark>`
    )}`;
    template.querySelector(".card-year").textContent = item.year;
    template.querySelector(".card-page").textContent = item.pages;
    template.querySelector(".card-leguage").textContent = item.language;
    template.querySelector(".card-wikipedia").href = item.link;
    template.querySelector(".card-basket").dataset.bookmarkId = item.id;
    cardFragment.appendChild(template);
  });
  cardList.appendChild(cardFragment);
}

renderUI(books);
filterSelect.addEventListener("click", function () {
  filterList.classList.toggle("book-filter__list-open");
});

languageItem.addEventListener("click", function (evt) {
  if (evt.target.matches(".books__lenguage-item")) {
    const language = evt.target.textContent.split(" ").slice(0, -1).join(" ");
    languageValue = language;
    filterAllCase();
    languageAll.forEach((item) => {
      item.classList.remove("selected");
    });
    evt.target.classList.add("selected");
  }
});

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  filterAllCase();
});

function basketRender(arr) {
  basketList.innerHTML = "";
  arr.forEach((item) => {
    // create element
    const newLi = document.createElement("li");
    const newImg = document.createElement("img");
    const newP = document.createElement("p");
    const newBtn = document.createElement("button");

    //textContent
    newLi.setAttribute("class", "basket-item");
    newImg.setAttribute("class", "basket-img");
    newP.setAttribute("class", "basket-text");
    newBtn.setAttribute("class", "basket-btn");
    newBtn.dataset.id = item.id;
    newImg.src = item.imageLink;
    newImg.width = "40";
    newImg.height = "40";
    newP.textContent = item.title;

    //append
    newLi.append(newImg, newP, newBtn);
    basketList.appendChild(newLi);
  });
}
const bookBasket = document.querySelectorAll(".card-basket");

cardList.addEventListener("click", function (evt) {
  if (evt.target.matches(".card-basket")) {
    const id = evt.target.dataset.bookmarkId;
    const item = books.find((item) => item.id == id);
    const index = bookmarkArr.indexOf(item);
    if (!bookmarkArr.includes(item)) {
      bookmarkArr.push(item);
    } else {
      bookmarkArr.splice(index, 1);
    }
    evt.target.classList.add("bg-orange");
    setTimeout(function () {
      evt.target.classList.remove("bg-orange");
    }, 500);
    console.log(evt.target);
    bookmarkNum.textContent = bookmarkArr.length;
    basketRender(bookmarkArr);
    console.log(bookBasket);
  }
});

basketList.addEventListener("click", function (evt) {
  if (evt.target.matches(".basket-btn")) {
    const id = evt.target.dataset.id;
    const item = bookmarkArr.find((item) => item.id === id);
    const index = bookmarkArr.indexOf(item);
    bookmarkArr.splice(index, 1);
    basketRender(bookmarkArr);
  }
  bookmarkNum.textContent = bookmarkArr.length;
});

selectItem.forEach((item) => {
  item.addEventListener("click", function (evt) {
    const value = item.dataset.value;
    const regex = new RegExp(elInput.value, "gi");
    const filtered = books.filter((item) => {
      return (
        item.title.match(regex) &&
        (languageValue == "All" || item.language.includes(languageValue))
      );
    });
    if (value === "a-z") {
      sortAZ(filtered);
    } else if (value === "z-a") {
      sortZA(filtered);
    } else if (value === "tohighpage") {
      sortToHighPage(filtered);
    } else if (value === "tolowpage") {
      sortToLowPage(filtered);
    } else if (value === "tohighyear") {
      sortToHighYear(filtered);
    } else if (value === "tolowyear") {
      sortToLowYear(filtered);
    }
  });
});

const sortAZ = (arr) => {
  let sortedArr = [...arr].sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else {
      return 0;
    }
  });
  renderUI(sortedArr);
};

const sortZA = (arr) => {
  let sortedArr = [...arr].sort((a, b) => {
    if (a.title > b.title) {
      return -1;
    } else if (a.title < b.title) {
      return 1;
    } else {
      return 0;
    }
  });
  renderUI(sortedArr);
};

const sortToHighPage = (arr) => {
  let sorted = [...arr].sort((a, b) => a.pages - b.pages);
  renderUI(sorted);
};

const sortToLowPage = (arr) => {
  let sorted = [...arr].sort((a, b) => b.pages - a.pages);
  renderUI(sorted);
};

const sortToHighYear = (arr) => {
  let sorted = [...arr].sort((a, b) => a.year - b.year);
  renderUI(sorted);
};

const sortToLowYear = (arr) => {
  let sorted = [...arr].sort((a, b) => b.year - a.year);
  renderUI(sorted);
};

const filterAllCase = () => {
  const regex = new RegExp(elInput.value, "gi");
  filtered = books.filter((item) => {
    return (
      item.title.match(regex) &&
      (languageValue == "All" || item.language.includes(languageValue))
    );
  });

  renderUI(filtered);
  pagination(filtered);
};

pagination(books);

function pagination(arr) {
  pageList.innerHTML = "";

  const pages = Math.ceil(arr.length / 10);
  for (let page = 1; page <= pages; page++) {
    const newLi = document.createElement("li");
    const newBtn = document.createElement("button");

    newLi.setAttribute("class", "pagination-item");
    newBtn.setAttribute("class", "pagination-btn");
    newBtn.textContent = page;

    newLi.appendChild(newBtn);
    pageList.appendChild(newLi);

    newBtn.addEventListener("click", function (evt) {
      const valuePage = Number(newBtn.textContent);
      const pagedArr = (filtered.length === 0 ? books : filtered).slice(
        (valuePage - 1) * 10,
        valuePage * 10
      );
      renderUI(pagedArr);
    });
  }
}

btnHamburger.addEventListener("click", () => {});
