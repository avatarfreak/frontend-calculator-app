const radioBtn = document.querySelectorAll('input[type="radio"');

/*------------Theme Section-------------*/
//Logic to switch theme
const toggleBackground = (val) => {
  //clear class name before updating new class
  document.body.className = "";
  document.body.classList.toggle(`theme-${val}`);
};

//Change theme on selecting radio btn
radioBtn.forEach((btn) => {
  btn.addEventListener("change", (evt) => {
    let val = evt.target.value;
    toggleBackground(val);
  });
});
