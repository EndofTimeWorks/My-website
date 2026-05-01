const colorPicker = document.getElementById("theme-color-picker");

if (colorPicker && colorPicker.tagName === "INPUT") {
    const currentColor = localStorage.getItem("theme-color") || "#3f10ad";
    document.documentElement.style.setProperty("--primary-color", currentColor);
    colorPicker.value = currentColor;

    colorPicker.addEventListener("input", (event) => {
        const target = event.target;
        if (!target || target.tagName !== "INPUT") {
            return;
        }

        document.documentElement.style.setProperty(
            "--primary-color",
            target.value,
        );
        localStorage.setItem("theme-color", target.value);
    });
}
