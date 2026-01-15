const colorPicker = document.getElementById('theme-color-picker'); // Get the color picker element

// set intial color
const currentColor = localStorage.getItem('theme-color'); || '#3f10ad';
document.documentElement.style.setProperty('--primary-color', currentColor);
colorPicker.value = currentColor;

// update theme color and sae in local storage
colorPicker.addEventListener('input', (event) => {
    const newColor = event.target.value;
    document.documentElement.style.setProperty('--primary-color', newColor);
    localStorage.setItem('theme-color', newColor);
})