import { useEffect } from 'react';

const ThemeToggle = () => {
    useEffect(() => {
        const colorPicker = document.getElementById('theme-color-picker') as HTMLInputElement;
        if (!colorPicker) return;

        const currentColor = localStorage.getItem('theme-color') || '#3f10ad';
        document.documentElement.style.setProperty('--primary-color', currentColor);
        colorPicker.value = currentColor;

        const handleInput = (event: Event) => {
            const input = event.target as HTMLInputElement;
            const newColor = input.value;
            document.documentElement.style.setProperty('--primary-color', newColor);
            localStorage.setItem('theme-color', newColor);
        };

        colorPicker.addEventListener('input', handleInput);

        return () => {
            colorPicker.removeEventListener('input', handleInput);
        };
    }, []);

    return null;
};

export default ThemeToggle;
