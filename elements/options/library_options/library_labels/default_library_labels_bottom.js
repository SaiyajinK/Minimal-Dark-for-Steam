(() => {
    let style = document.getElementById("md-default-bottom-scale-test");

    if (!style) {
        style = document.createElement("style");
        style.id = "md-default-bottom-scale-test";
        document.head.appendChild(style);
    }

    function defaultBottomY(width) {
        return Math.round(
            -27 * (width / 154)
        );
    }

    function update() {
        const cover = document.querySelector(".WYgDg9NyCcMIVuMyZ_NBC");
        if (!cover) return;

        const width = Math.round(cover.getBoundingClientRect().width);
        const y = defaultBottomY(width);

        style.textContent = `
            ._1LJqx_qFOC8199RBQO5kU8 {
                transform: translate(-2px, ${y}px) !important;
            }

            ._1LJqx_qFOC8199RBQO5kU8._31wTtQjCH2ZSKgMiMZLhAM {
                transform: translate(-2px, ${y}px) !important;
            }
        `;

        console.log(
            `[Minimal Dark] width: ${width}px | defaultBottomY: ${y}px`
        );
    }

    clearInterval(window.__mdDefaultBottomScaleTest);
    window.__mdDefaultBottomScaleTest = setInterval(update, 250);

    update();
})();
