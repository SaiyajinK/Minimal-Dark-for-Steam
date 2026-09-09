/*
 * Snaps Steam Overlay popup dimensions to the CSS-pixel grid required by
 * the current device scale factor. This keeps opposite CSS borders on the
 * same physical-pixel phase without drawing or replacing the border itself.
 */
(() => {
    "use strict";

    const INSTALL_KEY = "__minimalDarkOverlaySizeSnapInstalled";
    const RESIZE_END_DELAY = 120;
    const MAX_SCALE_DENOMINATOR = 8;
    const SCALE_TOLERANCE = 0.001;

    if (window[INSTALL_KEY]) return;
    window[INSTALL_KEY] = true;

    let resizeTimer = 0;
    let applyingSize = false;

    const getCssPixelStep = (scale) => {
        for (
            let denominator = 1;
            denominator <= MAX_SCALE_DENOMINATOR;
            denominator += 1
        ) {
            const scaled = scale * denominator;

            if (
                Math.abs(scaled - Math.round(scaled)) <
                SCALE_TOLERANCE
            ) {
                return denominator;
            }
        }

        return 1;
    };

    const snapToStep = (value, step) =>
        Math.max(step, Math.round(value / step) * step);

    const snapWindowSize = async () => {
        if (applyingSize) return;

        const steamWindow = globalThis.SteamClient?.Window;

        if (
            typeof steamWindow?.GetWindowDimensions !== "function" ||
            typeof steamWindow?.ResizeTo !== "function"
        ) {
            return;
        }

        const step = getCssPixelStep(window.devicePixelRatio || 1);

        if (step === 1) return;

        const dimensions = await steamWindow.GetWindowDimensions();
        const width = snapToStep(dimensions.width, step);
        const height = snapToStep(dimensions.height, step);

        if (
            width === dimensions.width &&
            height === dimensions.height
        ) {
            return;
        }

        applyingSize = true;

        try {
            steamWindow.ResizeTo(width, height, true);
        } finally {
            requestAnimationFrame(() => {
                applyingSize = false;
            });
        }
    };

    const scheduleSizeSnap = () => {
        if (applyingSize) return;

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(
            snapWindowSize,
            RESIZE_END_DELAY
        );
    };

    const install = () => {
        const isOverlayPopup = document.body?.classList.contains(
            "OverlayPopupBody"
        );
        const isOverlayFriendsWindow =
            document.documentElement.classList.contains(
                "friendsui-container"
            ) &&
            typeof globalThis.SteamClient?.Overlay === "object";

        if (!isOverlayPopup && !isOverlayFriendsWindow) return;

        if (isOverlayFriendsWindow) {
            document.documentElement.classList.add(
                "minimal-dark-overlay-friends"
            );
        }

        window.addEventListener("resize", scheduleSizeSnap, {
            passive: true
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install, {
            once: true
        });
    } else {
        install();
    }
})();
