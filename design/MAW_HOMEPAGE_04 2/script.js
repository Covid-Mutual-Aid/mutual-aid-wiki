const fadeIn = document.querySelectorAll(".fadeIn");
const circleText = document.querySelectorAll(".circleText");
const spinner = document.querySelectorAll(".spinner");
const wonky = document.querySelectorAll(".wonky");
const baselineShift = document.querySelectorAll(".baselineShift");

// This adds the Mexican-wave effect to text on the homepage
baselineShift.forEach((baselineShift, index) => {
  baselineShift.classList.add("baselineShifter");
  baselineShift.style.animationDelay = index / 10 + "s";
});

// Add some wonkiness to elements with the class .wonky
wonky.forEach((wonky, index) => {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  // wonky.style.transform = ("rotate("+randomNumber+"deg) translateX("+randomNumber2+"px)")
  wonky.style.transform =
    "rotate(" + rand(-3, 3) + "deg) translateX(" + rand(0, 6) + "vw)";
});

// Set 'OPEN-SOURCE' in a circular shape
circleText.forEach((circleText, index) => {
  const textSpinner = index * 18;
  circleText.style.transform = "rotate(" + textSpinner + "deg)";
});

// Rotate each letter in 'OPEN-SOURCE' back so they all share the same baseline
spinner.forEach((spinner, index) => {
  const letterSpinner = index * -18;
  spinner.style.transform = "rotate(" + letterSpinner + "deg)";
});

//  For use with in-view.js
// 	Trigger fade-in when user enters the section .iconHolder
inView(".iconHolder")
  .on("enter", (iconHolder) => {
    fadeIn.forEach((fadeIn, index) => {
      fadeIn.classList.add("fader");

      const delay = index * 40;

      // Make OPEN-SOURCE fade-in twice as fast as the others because it has more letters
      if (index > 19) {
        fadeIn.style.transitionDelay = delay * 2 - 1000 + "ms";
      } else {
        fadeIn.style.transitionDelay = delay + "ms";
      }
    });
  })

  // 	Remove fade-in when user exits the section .iconHolder
  .on("exit", (iconHolder) => {
    fadeIn.forEach((fadeIn, index) => {
      // remove fader class
      fadeIn.classList.remove("fader");

      // Remove staggered fade-in
      fadeIn.style.transitionDelay = "0ms";
    });
  });

inView.threshold(0.3);

// This is for adding wobbliness to baseline

Splitting();

const baselineWonky = document.querySelectorAll(".char");

baselineWonky.forEach((baselineWonky, index) => {
  function random_1(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const randomNumber = random_1(-1, 1);

  baselineWonky.style.verticalAlign = randomNumber + "px";
});
