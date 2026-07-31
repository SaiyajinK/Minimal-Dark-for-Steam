(() => {
    "use strict";

    const start = () => {
        let queued = false;

        const resizeMenu = () => {
            queued = false;

            const items = [...document.querySelectorAll(".contextMenuItem")];
            if (!items.length) return;

            let requiredWidth = 0;
            let requiredHeight = 0;

            for (const item of items) {
                const rect = item.getBoundingClientRect();

                requiredWidth = Math.max(
                    requiredWidth,
                    rect.left + item.scrollWidth
                );

                requiredHeight = Math.max(
                    requiredHeight,
                    rect.bottom
                );
            }

            const menu = document.querySelector(
                "._2EstNjFIIZm_WUSKm5Wt7n"
            );

            if (menu) {
                const rect = menu.getBoundingClientRect();

                requiredWidth = Math.max(
                    requiredWidth,
                    rect.left + menu.scrollWidth
                );

                requiredHeight = Math.max(
                    requiredHeight,
                    rect.top + menu.scrollHeight
                );
            }

            requiredWidth = Math.ceil(requiredWidth + 2);
            requiredHeight = Math.ceil(requiredHeight + 2);

            const targetWidth = Math.max(
                window.innerWidth,
                requiredWidth
            );

            const targetHeight = Math.max(
                window.innerHeight,
                requiredHeight
            );

            if (
                targetWidth === window.innerWidth &&
                targetHeight === window.innerHeight
            ) {
                return;
            }

            window.SteamClient?.Window?.ResizeTo?.(
                targetWidth,
                targetHeight,
                true
            );
        };

        const queueResize = () => {
            if (queued) return;

            queued = true;

            requestAnimationFrame(() => {
                requestAnimationFrame(resizeMenu);
            });
        };

        new MutationObserver(queueResize).observe(
            document.documentElement,
            {
                childList: true,
                subtree: true,
                attributes: true
            }
        );

        [0, 50, 150, 300, 600, 1000].forEach(delay => {
            setTimeout(queueResize, delay);
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
