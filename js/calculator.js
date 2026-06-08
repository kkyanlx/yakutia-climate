document.addEventListener("DOMContentLoaded", () => {
    const convSelect = document.getElementById("conversionType");
    const calcInput = document.getElementById("calcInput");
    const calcResult = document.getElementById("calcResult");

    function updateCalc() {
        const val = parseFloat(calcInput.value);
        if (isNaN(val)) { calcResult.textContent = "—"; return; }
        let result, unit;
        switch (convSelect.value) {
            case "temp": result = val * 9/5 + 32; unit = "°F"; break;
            case "rain": result = val / 25.4; unit = "дюйм"; break;
            case "wind": result = val * 3.6; unit = "км/ч"; break;
            default: result = val; unit = "";
        }
        calcResult.textContent = `${result.toFixed(2)} ${unit}`;
    }

    calcInput.addEventListener("input", updateCalc);
    convSelect.addEventListener("change", () => {
        calcResult.textContent = "—";
        calcInput.value = "";
        updateCalc();
    });
});
