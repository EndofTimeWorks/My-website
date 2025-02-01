import React, { useEffect } from 'react';

function ThemeToggle() {
  useEffect(() => {
    const colorPicker = document.getElementById('theme-color-picker');
    const currentColor = localStorage.getItem('theme-color') || '#3f10ad';
    document.documentElement.style.setProperty('--primary-color', currentColor);
    colorPicker.value = currentColor;

    colorPicker.addEventListener('input', (event) => {
      const newColor = event.target.value;
      document.documentElement.style.setProperty('--primary-color', newColor);
      localStorage.setItem('theme-color', newColor);
    });
  }, []);

  return null;
}

export default ThemeToggle;
