document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#climateTable tbody");
    const statsGrid = document.getElementById("statsGrid");
    const tabBtns = document.querySelectorAll("#dataTabs .tab-btn");
    let currentMode = "temp";

    const MODE_LABELS = {
        temp: { type: "temperature", unit: "°C" },
        rain: { type: "rainfall", unit: " мм" },
        humidity: { type: "humidity", unit: "%" },
        wind: { type: "wind", unit: " м/с" }
    };

    function renderTable(mode) {
        if (!tableBody) return;
        const cfg = MODE_LABELS[mode];
        const cities = getCities();
        tableBody.innerHTML = cities.map(city => {
            const data = getCityData(city, cfg.type);
            const avg = yearlyAvg(data);
            const cells = data.map(val => {
                let cls = "";
                if (mode === "temp") {
                    if (val < -20) cls = "cell-cold";
                    else if (val > 10) cls = "cell-hot";
                }
                return `<td class="${cls}">${val}</td>`;
            }).join("");
            return `<tr><td>${city}</td>${cells}<td><strong>${avg}</strong>${cfg.unit}</td></tr>`;
        }).join("");
    }

    function renderStats() {
        if (!statsGrid) return;
        const cities = getCities();
        const cards = [];
        cities.forEach(city => {
            const temps = getCityData(city, "temperature");
            cards.push({ value: `${yearlyMin(temps)} °C`, label: "Мин. среднемесячная", city });
            cards.push({ value: `${yearlyMax(temps)} °C`, label: "Макс. среднемесячная", city });
        });
        statsGrid.innerHTML = cards.map(c =>
            `<div class="stat-card">
                <div class="stat-card__value">${c.value}</div>
                <div class="stat-card__label">${c.label}</div>
                <div class="stat-card__city">${c.city}</div>
            </div>`
        ).join("");
    }

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("tab-btn--active"));
            btn.classList.add("tab-btn--active");
            currentMode = btn.dataset.mode;
            renderTable(currentMode);
        });
    });

    renderTable(currentMode);
    renderStats();
});
