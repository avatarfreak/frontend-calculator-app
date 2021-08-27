const toggleBackground = (val) => {
  document.body.className = "";
  document.body.classList.toggle(`theme-${val}`);
};
const radioBtn = document.querySelectorAll('input[type="radio"');

radioBtn.forEach((btn) => {
  btn.addEventListener("change", (evt) => {
    let val = evt.target.value;
    toggleBackground(val);
  });
});
