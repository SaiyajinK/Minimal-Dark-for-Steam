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
        const cover = document.querySelector(".WYgDg9NyCcMIVuMyZ_NBC");
        if (!cover) return;

        const width = Math.round(cover.getBoundingClientRect().width);
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
