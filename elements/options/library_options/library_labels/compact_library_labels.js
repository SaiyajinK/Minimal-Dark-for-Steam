(() => {
    let style = document.getElementById("md-compact-scale-test");

    if (!style) {
        style = document.createElement("style");
        style.id = "md-compact-scale-test";
        document.head.appendChild(style);
    }

    function compactY(width) {
        return Math.round(
            -167 + (width - 110) * ((-349 + 167) / (220 - 110))
        );
    }

    function update() {
		const covers = document.querySelectorAll(".WYgDg9NyCcMIVuMyZ_NBC.Portrait");

		const cover = Array.from(covers).reduce((largest, current) => {
			return !largest || current.offsetWidth > largest.offsetWidth
				? current
				: largest;
		}, null);
        if (!cover) return;

        const width = cover.offsetWidth;
        const y = compactY(width);

        style.textContent = `
            ._1LJqx_qFOC8199RBQO5kU8 {
                transform: translate(1px, ${y}px) !important;
                display: inline-block !important;
            }

            ._1LJqx_qFOC8199RBQO5kU8._31wTtQjCH2ZSKgMiMZLhAM {
                transform: translate(1px, ${y}px) !important;
            }
        `;

        console.log(
            `[Minimal Dark] width: ${width}px | compactY: ${y}px`
        );
    }

    clearInterval(window.__mdCompactScaleTest);
    window.__mdCompactScaleTest = setInterval(update, 250);

    update();
})();