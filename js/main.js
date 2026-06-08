document.addEventListener("DOMContentLoaded", () => {
    const mapEl = document.getElementById("yakutiaMap");
    if (!mapEl || typeof L === "undefined") return;

    const map = L.map("yakutiaMap", {
        attributionControl: false, zoomControl: true, scrollWheelZoom: true
    }).setView([63.5, 125], 4);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 12, subdomains: "abcd"
    }).addTo(map);

    const cityCoords = {
        "Якутск": [62.03, 129.73], "Нерюнгри": [56.66, 124.72],
        "Мирный": [62.53, 113.98], "Нюрба": [63.28, 118.33],
        "Оймякон": [63.46, 142.78], "Верхоянск": [67.55, 133.39],
        "Тикси": [71.64, 128.87]
    };
    const colors = ["#6da8c8", "#c88080", "#7dab7d", "#c8a878", "#9b88c0", "#c8b840", "#5aa8a0"];

    getCities().forEach((city, i) => {
        const coords = cityCoords[city];
        if (!coords) return;
        const temps = getCityData(city, "temperature");
        const rain  = getCityData(city, "rainfall");
        const hum   = getCityData(city, "humidity");
        const wnd   = getCityData(city, "wind");

        L.circleMarker(coords, {
            radius: 7, fillColor: colors[i % colors.length], color: "#fff",
            weight: 2, opacity: 1, fillOpacity: 0.85
        }).addTo(map).bindPopup(
            `<div style="font-family:'Comfortaa',sans-serif;font-size:13px;line-height:1.6;min-width:180px">
                <strong style="font-size:15px;color:${colors[i%colors.length]}">${city}</strong>
                <br>Средняя t°: <b>${yearlyAvg(temps)} °C</b>
                <br>Мин: ${yearlyMin(temps)} °C / Макс: ${yearlyMax(temps)} °C
                <br>Осадки: <b>${yearlyAvg(rain)} мм/год</b>
                <br>Влажность: ${yearlyAvg(hum)} % / Ветер: ${yearlyAvg(wnd)} м/с
            </div>`
        ).bindTooltip(city, {
            permanent: false, direction: "top", offset: [0, -8], className: "map-tooltip"
        });
    });

    setTimeout(() => map.invalidateSize(), 300);
});
