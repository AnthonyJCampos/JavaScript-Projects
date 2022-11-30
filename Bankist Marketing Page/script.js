'use strict';

/** Webpage Elements */

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');
const navBar = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/** Modal Window Functions */

const openModal = function (event) {
  // by defualt it moves to the top of the page
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}; // end openModal

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}; // end closeModal

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/**  Button / Smooth Scrolling  */

// Events

btnScrollTo.addEventListener('click', function (event) {
  const s1coords = section1.getBoundingClientRect();

  // Scrolling

  // old school way
  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

/** Page Navigation */

// using event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

navBar.addEventListener('click', function (event) {
  // use event target
  // use this to figure out which element this event originated from
  event.preventDefault();
  // Matching Strategy
  if (
    event.target.classList.contains('nav__link') &&
    !event.target.classList.contains('nav__link--btn')
  ) {
    const id = event.target.getAttribute('href');
    // look into why this is not always working
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  } // end if
});

/** Tabbed component */

// more event delegation

tabsContainer.addEventListener('click', function (event) {
  // Matching Strategy
  // need to select parent element, use the closest method
  const clicked = event.target.closest('.operations__tab');

  // ignore clicks not on button, Guard clause
  if (!clicked) {
    return;
  } // end if

  // first remove active from all, then add to the clicked tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // remove content
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Active Tab
  clicked.classList.add('operations__tab--active');

  // Activated content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/** Menu Fade Animation */

const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    // we will simply search for a parent that matches our query
    // find the closest nav parent and  get all the sibling
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element !== link) {
        element.style.opacity = this;
      } // end if
    });

    logo.style.opacity = this;
  } // end if
}; // end handleHover

// Pasing an 'argument' into handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Nav: Intersection Observer API
const initialS1Coords = section1.getBoundingClientRect();

/* bad for perforamnce 
window.addEventListener('scroll', function (event) {
  if (this.window.scrollY > initialS1Coords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
}; // end stickyNav

const headerObsOptions = {
  root: null, // the root is the element the target is intercepting
  threshold: 0, // the % of interception at which the callback will be called
  rootMargin: `-${navHeight}px`, // make the element appear the height of the navbar px before the threshold is reached
};

const headerObserver = new IntersectionObserver(stickyNav, headerObsOptions);
headerObserver.observe(header);

// Reveal Sections

const allSections = document.querySelectorAll('.section');

const sectionObsOptions = {
  root: null,
  threshold: 0.15,
};
const revealSection = function (entries, observer) {
  const [entry] = entries; // use destructing
  // base case
  if (!entry.isIntersecting) {
    return;
  } // end if
  // use the target prop of the entry toremove the hidden CSS class
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}; // end revealSection

const sectionObserver = new IntersectionObserver(
  revealSection,
  sectionObsOptions
);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/** Lazy Loading Images */

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // base case
  if (!entry.isIntersecting) {
    return;
  } // end if

  // Replace src with data-src on img element
  entry.target.src = entry.target.dataset.src;

  // when loading is complete remove the blur effect
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // we not longer need to watch the current element as it has loaded
  observer.unobserve(entry.target);
}; // end loadingImg

const imgObOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(loadImg, imgObOptions);
imgTargets.forEach(img => imgObserver.observe(img));

/** Slider */

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const creatDots = function () {
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button`
      );
    });
  };

  creatDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  activateDot(0);

  // event deligation

  dotContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      // use destructing
      const { slide } = event.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    } // end if
  });

  const goToSlide = function (pos) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - pos)}%)`)
    );
  };

  goToSlide(0);
  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // next slide
  btnRight.addEventListener('click', nextSlide);
  // keyboard event
  document.addEventListener('keydown', function (event) {
    // using short circuit
    event.key === 'ArrowRight' && nextSlide();
    event.key === 'ArrowLeft' && prevSlide();
  });

  // prev slide
  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnLeft.addEventListener('click', prevSlide);
}; // end of slider()

slider();
