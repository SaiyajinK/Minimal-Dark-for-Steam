(() => {
    let style = document.getElementById("md-compact-bottom-test");

    if (!style) {
        style = document.createElement("style");
        style.id = "md-compact-bottom-test";
        document.head.appendChild(style);
    }

	function compactY(width) {
		return Math.round(
			(width * width) / 14520 - (39 * width) / 220 - 16 / 3
		);
	}

    function update() {
        const cover = document.querySelector(".WYgDg9NyCcMIVuMyZ_NBC");
        if (!cover) return;

        const width = Math.round(cover.getBoundingClientRect().width);
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

    clearInterval(window.__mdCompactBottomTest);
    window.__mdCompactBottomTest = setInterval(update, 250);

    update();
})();