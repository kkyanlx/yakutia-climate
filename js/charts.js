document.addEventListener("DOMContentLoaded", () => {
    const chipGroup = document.getElementById("cityCheckboxes");
    const tempCtx = document.getElementById("tempChart")?.getContext("2d");
    const rainCtx = document.getElementById("rainChart")?.getContext("2d");
    const humCtx  = document.getElementById("humChart")?.getContext("2d");
    const windCtx = document.getElementById("windChart")?.getContext("2d");

    if (!chipGroup || !tempCtx || !rainCtx || !humCtx || !windCtx) return;

    const cities = getCities();
    const colors = ["#6da8c8", "#c88080", "#7dab7d", "#c8a878", "#9b88c0", "#c8b840", "#5aa8a0"];
    let selectedCities = [...cities];

    // Render chips
    function renderChips() {
        chipGroup.innerHTML = cities.map((city, i) => {
            const active = selectedCities.includes(city);
            const bg = active ? colors[i] : "transparent";
            const fg = active ? "#fff" : colors[i];
            return `<span class="chip${active ? " chip--active" : ""}" data-city="${city}"
                style="color:${fg}; background:${bg}; border-color:${colors[i]};">
                ${active ? "✦ " : ""}${city}
            </span>`;
        }).join("");

        chipGroup.querySelectorAll(".chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const city = chip.dataset.city;
                if (selectedCities.includes(city)) {
                    if (selectedCities.length <= 1) return;
                    selectedCities = selectedCities.filter(c => c !== city);
                } else {
                    selectedCities.push(city);
                }
                renderChips();
                updateCharts();
            });
        });
    }

    const commonOptions = (labelY) => ({
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 20, font: { size: 13 } } } },
        scales: {
            y: { title: { display: true, text: labelY, font: { size: 13, weight: "bold" } }, grid: { color: "#e2e8f0" } },
            x: { title: { display: true, text: "Месяц", font: { size: 13, weight: "bold" } }, grid: { display: false } }
        }
    });

    let tempChart = new Chart(tempCtx, { type: "line", data: buildChartData("temperature"), options: commonOptions("Температура, °C") });
    let rainChart = new Chart(rainCtx, { type: "bar",  data: buildChartData("rainfall"),    options: commonOptions("Осадки, мм") });
    let humChart  = new Chart(humCtx,  { type: "line", data: buildChartData("humidity"),    options: commonOptions("Влажность, %") });
    let windChart = new Chart(windCtx, { type: "bar",  data: buildChartData("wind"),        options: commonOptions("Ветер, м/с") });

    function buildChartData(type) {
        const filtered = cities.filter(c => selectedCities.includes(c));
        const isBar = type === "rainfall" || type === "wind";
        return {
            labels: MONTHS_FULL,
            datasets: filtered.map((city, i) => {
                const origIdx = cities.indexOf(city);
                return {
                    label: city,
                    data: getCityData(city, type),
                    borderColor: colors[origIdx],
                    backgroundColor: isBar ? colors[origIdx] + "99" : colors[origIdx] + "22",
                    borderWidth: 3, pointRadius: 5, pointHoverRadius: 7, tension: 0.3, fill: !isBar
                };
            })
        };
    }

    function updateCharts() {
        tempChart.data = buildChartData("temperature"); tempChart.update();
        rainChart.data = buildChartData("rainfall");    rainChart.update();
        humChart.data  = buildChartData("humidity");    humChart.update();
        windChart.data = buildChartData("wind");        windChart.update();
    }

    function setCanvasHeight() {
        const height = window.innerWidth < 600 ? 250 : 320;
        document.querySelectorAll(".chart-container canvas").forEach(c => c.style.maxHeight = height + "px");
    }
    setCanvasHeight();
    window.addEventListener("resize", setCanvasHeight);

    renderChips();
});
