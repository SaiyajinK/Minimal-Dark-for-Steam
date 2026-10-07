(() => {
    let style = document.getElementById("md-default-scale-test");

    if (!style) {
        style = document.createElement("style");
        style.id = "md-default-scale-test";
        document.head.appendChild(style);
    }

    function defaultY(width) {
        return Math.round(
            -195 * (width / 154)
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
        const y = defaultY(width);

        style.textContent = `
            ._1LJqx_qFOC8199RBQO5kU8 {
                transform: translate(0px, ${y}px) !important;
            }

            ._1LJqx_qFOC8199RBQO5kU8._31wTtQjCH2ZSKgMiMZLhAM {
                transform: translate(0px, ${y}px) !important;
            }
        `;

        console.log(
            `[Minimal Dark] width: ${width}px | defaultY: ${y}px`
        );
    }

    clearInterval(window.__mdDefaultScaleTest);
    window.__mdDefaultScaleTest = setInterval(update, 250);

    update();
})();
