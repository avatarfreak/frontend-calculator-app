//pipe transform
export const pipe =
  (...fns) =>
  (val) =>
    fns.reduce((acc, fn) => fn(acc), val);
//check for Infinity
const isInfinity = (a, b) => (b === 0 ? true : false);

//Basic mathematic operation verb
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const div = (a, b) => (isInfinity(a, b) ? "Infinity" : a / b);
export const mul = (a, b) => a * b;

//transform
export const arrToStr = (data) => data.join("");

//Get Dom elements
export const selector = (elem) => document.querySelector(elem);
export const selectors = (elem) => document.querySelectorAll(elem);
