/*
 * Draws a one-physical-pixel border around Steam Overlay popups.
 *
 * A regular CSS border can lose an edge when CEF converts a fractionally
 * sized popup to the physical pixel grid. This script draws the border in an
 * SVG viewBox measured directly in physical pixels instead.
 */
(() => {
    "use strict";

    const INSTALL_KEY =
        "__minimalDarkPhysicalOverlayBorderInstalled";

    if (window[INSTALL_KEY]) return;
    window[INSTALL_KEY] = true;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const TARGET_SELECTOR = [
        "#popup_target > .OverlayPopup",
        "#popup_target.popup_chat_frame"
    ].join(", ");

    const FRAME_ID = "minimal-dark-physical-overlay-border";
    const STYLE_ID = "minimal-dark-physical-overlay-border-style";
    const DEFAULT_COLOR = "#606062";
    const PHYSICAL_EDGE_INSET = 1.5;
    const RESIZE_END_DELAY = 90;
    const FADE_IN_DURATION = 70;

    let target = null;
    let frame = null;
    let border = null;
    let resizeObserver = null;
    let frameRequest = 0;
    let revealTimer = 0;

    const readNumber = (value) => {
        const number = Number.parseFloat(value);
        return Number.isFinite(number) ? number : 0;
    };

    const scheduleUpdate = () => {
        if (frameRequest) return;

        frameRequest = requestAnimationFrame(() => {
            frameRequest = 0;
            updateFrame();
        });
    };

    const updateFrame = () => {
        if (!target?.isConnected || !frame || !border) {
            attachToCurrentTarget();
            return;
        }

        const scale = window.devicePixelRatio || 1;
        const bounds = target.getBoundingClientRect();
        const physicalWidth = Math.max(
            1,
            Math.round(bounds.width * scale)
        );
        const physicalHeight = Math.max(
            1,
            Math.round(bounds.height * scale)
        );

        const styles = getComputedStyle(target);
        const cssRadius = readNumber(styles.borderTopLeftRadius);
        const physicalRadius = Math.max(
            0,
            cssRadius * scale - 0.5
        );
        const customColor = styles
            .getPropertyValue("--minimal_dark_overlay_border_color")
            .trim();

        frame.setAttribute(
            "viewBox",
            `0 0 ${physicalWidth} ${physicalHeight}`
        );
        border.setAttribute("x", String(PHYSICAL_EDGE_INSET));
        border.setAttribute("y", String(PHYSICAL_EDGE_INSET));
        border.setAttribute(
            "width",
            String(
                Math.max(
                    0,
                    physicalWidth - 2 * PHYSICAL_EDGE_INSET
                )
            )
        );
        border.setAttribute(
            "height",
            String(
                Math.max(
                    0,
                    physicalHeight - 2 * PHYSICAL_EDGE_INSET
                )
            )
        );
        border.setAttribute("rx", String(physicalRadius));
        border.setAttribute("ry", String(physicalRadius));
        border.setAttribute("stroke", customColor || DEFAULT_COLOR);
    };

    const createFrame = () => {
        frame?.remove();

        frame = document.createElementNS(SVG_NS, "svg");
        frame.id = FRAME_ID;
        frame.setAttribute("aria-hidden", "true");
        frame.setAttribute("preserveAspectRatio", "none");
        frame.style.cssText = [
            "position: fixed",
            "top: 0",
            "left: 0",
            "width: 100vw",
            "height: 100vh",
            "overflow: visible",
            "pointer-events: none",
            "z-index: 2147483647"
        ].join(";");

        border = document.createElementNS(SVG_NS, "rect");
        border.setAttribute("fill", "none");
        border.setAttribute("stroke-width", "1");
        frame.appendChild(border);
        document.body.appendChild(frame);
    };

    const handleResize = () => {
        if (!frame) return;

        frame.style.transition = "none";
        frame.style.opacity = "0";
        clearTimeout(revealTimer);
        scheduleUpdate();

        revealTimer = setTimeout(() => {
            updateFrame();

            requestAnimationFrame(() => {
                if (!frame) return;

                frame.style.transition =
                    `opacity ${FADE_IN_DURATION}ms ease-out`;
                frame.style.opacity = "1";
            });
        }, RESIZE_END_DELAY);
    };

    const attachToCurrentTarget = () => {
        const nextTarget = document.querySelector(TARGET_SELECTOR);

        if (!nextTarget) return;
        if (nextTarget === target && frame?.isConnected) {
            return;
        }

        resizeObserver?.disconnect();
        target = nextTarget;
        createFrame();

        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(target);
        resizeObserver.observe(document.documentElement);
        scheduleUpdate();
    };

    const install = () => {
        if (!document.body) return;

        const isOverlayPopup = document.body.classList.contains(
            "OverlayPopupBody"
        );
        const isFriendsWindow = document.documentElement.classList.contains(
            "friendsui-container"
        );

        if (!isOverlayPopup && !isFriendsWindow) return;

        let style = document.getElementById(STYLE_ID);

        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = `
                #popup_target > .OverlayPopup::after,
                #popup_target.popup_chat_frame::after {
                    content: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        attachToCurrentTarget();

        const mutationObserver = new MutationObserver(
            attachToCurrentTarget
        );
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener("resize", handleResize, {
            passive: true
        });
        window.visualViewport?.addEventListener(
            "resize",
            handleResize,
            { passive: true }
        );
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install, {
            once: true
        });
    } else {
        install();
    }
})();
