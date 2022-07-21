"use strict";

///////////////////////////////////
// Selections
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnLearnMoreEl = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////////////
// Create element
const messageEl = document.createElement("div");
messageEl.classList.add("cookie-message");
const strMessage = "We use cookies for improve functionality and analytics.";
messageEl.innerHTML = `${strMessage} <button class='btn btn--class-cookie'>Got it!</button>`;

header.append(messageEl);
document
  .querySelector(".btn--class-cookie")
  .addEventListener("click", () =>
    messageEl.parentElement.removeChild(messageEl)
  );

//////////////////////////
// styles
messageEl.style.backgroundColor = "#37383d";
messageEl.style.width = "120%";
messageEl.style.height =
  Number.parseFloat(getComputedStyle(messageEl).height) + 30 + "px";

// document.documentElement.style.setProperty("--color-primary", "orangered");

// // Attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.src);

////////////////////////////////
// btn smooth scroll
btnLearnMoreEl.addEventListener("click", (e) => {
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);
  // Scrolling...
  // window.scrollTo(s1Coords.left, s1Coords.top + window.scrollY);

  // new method, but unsopported older browsers:
  // section1.scrollIntoView({ behavior: "smooth" });

  window.scrollTo({
    left: s1Coords.left,
    top: s1Coords.top + window.scrollY,
    behavior: "smooth",
  });
});

////////////////////////////
// page navigator using "Event Delegation"

// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

document.querySelector(".nav__links").addEventListener("click", function (ev) {
  ev.preventDefault();
  if (ev.target.classList.contains("nav__link")) {
    const id = ev.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabbed component

tabsContainer.addEventListener("click", function (ev) {
  const clicked = ev.target.closest(".operations__tab");
  // Guard Clause when clicked outside button-tab
  if (!clicked) return;

  // activate tab
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // Activate content
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////////////////////////
// Menu fade animation
const handleHover = function (ev) {
  if (ev.target.classList.contains("nav__link")) {
    const link = ev.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

//////////////////////////////////
// sticky nav
//const initialS1Coords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialS1Coords.top) {
//     nav.classList.add("sticky");
//   } else nav.classList.remove("sticky");
// });

////////////////////////////
// Sticky Nav -> Intersection Observer API

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);

headerObserver.observe(header);

////////////////////////////////
// reveal sections
const allSections = document.querySelectorAll("section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const obsSecOpt = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, obsSecOpt);

allSections.forEach(function (section) {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});

//////////////////////////
// Lazy Loading Images

const imageTargets = document.querySelectorAll("img[data-src]");

const obsImgOpt = {
  root: null,
  threshold: 0,
  rootMargin: "200px",
};

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace src for data-src:
  entry.target.src = entry.target.dataset.src;
  // remove the lazi-img blur effect after the high resolution img is loaded
  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, obsImgOpt);
imageTargets.forEach(function (image) {
  imageObserver.observe(image);
});

///////////////////////////////////////////
// Sliders

const sliderFn = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  const maxIndexSlide = slides.length - 1;
  let currentSlide = 0;
  const minIndexSlide = 0;

  // FUNCTIONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class='dots__dot' data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    const dots = document.querySelectorAll(".dots__dot");
    dots.forEach((d) => {
      d.classList.remove("dots__dot--active");
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (indSlide) {
    slides.forEach((s, i) => {
      const currentIndex = i - indSlide;
      s.style.transform = `translateX(${currentIndex * 100}%)`;
    });
  };

  // next slide -100 0 100 200
  const nextSlide = function () {
    if (maxIndexSlide === currentSlide) currentSlide = 0;
    else currentSlide++;

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // previous slide
  const prevSlide = function () {
    if (currentSlide === minIndexSlide) currentSlide = maxIndexSlide;
    else currentSlide--;

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    else if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", function (ev) {
    if (ev.target.classList.contains("dots__dot")) {
      const slide = Number(ev.target.dataset.slide);
      currentSlide = slide;

      goToSlide(currentSlide);
      activateDot(currentSlide);
    }
  });
};

sliderFn();

////////////////////////////
// event propagation practice: bubbling-capturing
// // RGB(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   console.log("link");
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("links");
// });
// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("nav");
// });

// // Dom traversing
// const h1 = document.querySelector("h1");
// // going downwards
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children);

// // going upwards
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// console.log(h1.closest(".header"));

// // siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
