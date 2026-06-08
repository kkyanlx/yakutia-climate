(function () {
    const THEME_KEY = "yakutia-climate-theme";
    const toggle = document.getElementById("themeToggle");

    if (!toggle) return;

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        toggle.innerHTML = theme === "dark"
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
        toggle.title = theme === "dark" ? "Светлая тема" : "Тёмная тема";

        document.querySelectorAll(".chart-container canvas").forEach(canvas => {
            const parent = canvas.closest(".chart-container");
            if (parent) {
                const bg = getComputedStyle(parent).backgroundColor;
                canvas.style.backgroundColor = bg;
            }
        });
    }

    function switchTheme() {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    // Инициализация: восстановить из localStorage
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved);

    // Обработчик клика
    toggle.addEventListener("click", switchTheme);

    // ===== ПЛАВНЫЙ ПЕРЕХОД МЕЖДУ СТРАНИЦАМИ =====
    document.querySelectorAll(".nav__link").forEach(link => {
        link.addEventListener("click", function(e) {
            if (this.classList.contains("nav__link--active")) return;
            e.preventDefault();
            const href = this.getAttribute("href");
            document.body.style.opacity = "0";
            document.body.style.transition = "opacity 0.2s ease";
            setTimeout(() => { window.location = href; }, 200);
        });
    });

    // ===== ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ =====
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
        reveals.forEach(el => obs.observe(el));
    }

    // ===== ЧАСЫ ЯКУТСКА (UTC+9) =====
    const clock = document.getElementById("yakutskClock");
    if (clock) {
        function tick() {
            const now = new Date();
            const yakutsk = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Yakutsk" }));
            const h = String(yakutsk.getHours()).padStart(2, "0");
            const m = String(yakutsk.getMinutes()).padStart(2, "0");
            const s = String(yakutsk.getSeconds()).padStart(2, "0");
            const d = yakutsk.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
            clock.textContent = `Якутск, ${d}  ${h}:${m}:${s}  (UTC+9)`;
        }
        tick();
        setInterval(tick, 1000);
    }

    // ===== КНОПКА «НАВЕРХ» =====
    const btn = document.getElementById("backToTop");
    if (btn) {
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            btn.classList.toggle("back-to-top--visible", y > 400);
        };
        document.addEventListener("scroll", onScroll, { passive: true });
        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
})();
