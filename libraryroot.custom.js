/*
 * Corrige les dimensions des fenêtres natives utilisées par
 * les menus et sous-menus de Steam.
 */
(() => {
    "use strict";

    const start = () => {
        const isLinux =
            navigator.userAgent.includes("Linux");

        let windowsDpiMode = isLinux ? "css" : null;
        let dpiProbePending = false;
        let dpiProbeAttempts = 0;
        const maximumDpiProbeAttempts = 2;

        let queued = false;

        const getDpiScale = () => {
            if (isLinux || windowsDpiMode === "css") {
                return 1;
            }

            return window.devicePixelRatio || 1;
        };

        const looksDoubleScaled = (
            observedSize,
            targetSize,
            dpiScale
        ) => {
            const tolerance = Math.max(
                4,
                targetSize * 0.03
            );

            if (observedSize <= targetSize + tolerance) {
                return false;
            }

            const distanceFromCssSize =
                Math.abs(observedSize - targetSize);

            const distanceFromScaledSize =
                Math.abs(
                    observedSize - (targetSize * dpiScale)
                );

            return (
                distanceFromScaledSize + tolerance <
                distanceFromCssSize
            );
        };

        const looksCorrectlyScaled = (
            observedSize,
            targetSize
        ) => {
            const tolerance = Math.max(
                4,
                targetSize * 0.03
            );

            return (
                Math.abs(observedSize - targetSize) <=
                tolerance
            );
        };

        const resizeMenu = () => {
            queued = false;

            if (dpiProbePending) {
                return;
            }

            const items = [
                ...document.querySelectorAll(".contextMenuItem")
            ];

            if (!items.length) return;

            const visibleLibraryMenus = [
                ...document.querySelectorAll(
                    ".LibraryContextMenu.visible"
                )
            ];

            if (visibleLibraryMenus.length > 1) {
                return;
            }

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
                ".contextMenuContents"
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

            /*
             * Windows / autres : conserve la marge historique de 2 px.
             * Linux : aucune marge supplémentaire.
             */
            const safetyMargin = isLinux ? 0 : 2;

            requiredWidth = Math.ceil(
                requiredWidth + safetyMargin
            );

            requiredHeight = Math.ceil(
                requiredHeight + safetyMargin
            );

            const maximumResizableMenuHeight =
                (screen.availHeight || window.innerHeight) * 0.8;

            const hasOversizedMenu = visibleLibraryMenus.some(
                menuElement =>
                    menuElement.getBoundingClientRect().height >
                    maximumResizableMenuHeight
            );

            const targetWidth = Math.max(
                window.innerWidth,
                requiredWidth
            );

            const targetHeight = hasOversizedMenu
                ? window.innerHeight
                : Math.max(
                    window.innerHeight,
                    requiredHeight
                );

            if (
                targetWidth === window.innerWidth &&
                targetHeight === window.innerHeight
            ) {
                return;
            }

            const previousWidth = window.innerWidth;
            const previousHeight = window.innerHeight;

            /*
             * Linux : facteur 1.
             * Windows : devicePixelRatio tant qu'aucun double scaling
             * n'a été détecté.
             */
            const dpiScale = getDpiScale();

            window.SteamClient?.Window?.ResizeTo?.(
                Math.ceil(targetWidth * dpiScale),
                Math.ceil(targetHeight * dpiScale),
                true
            );

            /*
             * Windows > 100 % :
             * vérifie si Steam a déjà appliqué le DPI.
             * Si la taille observée ressemble à target * DPR,
             * repasse automatiquement à un facteur 1.
             */
            if (
                !isLinux &&
                windowsDpiMode === null &&
                dpiScale > 1 &&
                dpiProbeAttempts < maximumDpiProbeAttempts
            ) {
                const widthWasResized =
                    targetWidth > previousWidth + 1;

                const heightWasResized =
                    targetHeight > previousHeight + 1;

                if (widthWasResized || heightWasResized) {
                    dpiProbePending = true;
                    dpiProbeAttempts += 1;

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                const observedWidth =
                                    window.innerWidth;

                                const observedHeight =
                                    window.innerHeight;

                                const widthLooksDoubleScaled =
                                    widthWasResized &&
                                    looksDoubleScaled(
                                        observedWidth,
                                        targetWidth,
                                        dpiScale
                                    );

                                const heightLooksDoubleScaled =
                                    heightWasResized &&
                                    looksDoubleScaled(
                                        observedHeight,
                                        targetHeight,
                                        dpiScale
                                    );

                                if (
                                    widthLooksDoubleScaled ||
                                    heightLooksDoubleScaled
                                ) {
                                    windowsDpiMode = "css";

                                    window.SteamClient?.Window?.ResizeTo?.(
                                        Math.ceil(targetWidth),
                                        Math.ceil(targetHeight),
                                        true
                                    );
                                } else {
                                    const widthLooksCorrect =
                                        !widthWasResized ||
                                        looksCorrectlyScaled(
                                            observedWidth,
                                            targetWidth
                                        );

                                    const heightLooksCorrect =
                                        !heightWasResized ||
                                        looksCorrectlyScaled(
                                            observedHeight,
                                            targetHeight
                                        );

                                    if (
                                        widthLooksCorrect &&
                                        heightLooksCorrect
                                    ) {
                                        windowsDpiMode = "dpr";
                                    } else if (
                                        dpiProbeAttempts >=
                                        maximumDpiProbeAttempts
                                    ) {
                                        windowsDpiMode = "dpr";
                                    }
                                }

                                dpiProbePending = false;
                                queueResize();
                            }, 50);
                        });
                    });
                }
            }
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
        document.addEventListener(
            "DOMContentLoaded",
            start,
            { once: true }
        );
    } else {
        start();
    }
})();

/*
 * Fin de correction des dimensions des fenêtres natives utilisées par
 * les menus et sous-menus de Steam.
 */

/*
 * Correction "à quoi on joue ?" pour la taille de la bibliothèque "petite" uniquement.
 */
(() => {
    const STYLE_ID = "md-submessage-marquee-style";

    function getSubMessage() {
        return document.querySelector(
            ".PlayNextSuggestions .RecentGameFooter .PortraitMessage.SubMessage"
        );
    }

    function isSmallMode() {
        return !!document.querySelector(".LibraryDisplaySizeSmall");
    }

    function restoreSubMessage() {
        const sub = getSubMessage();
        if (!sub || !sub.dataset.mdOriginalText) return;

        sub.textContent = sub.dataset.mdOriginalText;
        delete sub.dataset.mdOriginalText;
    }

    function enableSmallMarquee() {
        const footer = document.querySelector(
            ".LibraryDisplaySizeSmall .PlayNextSuggestions .RecentGameFooter"
        );

        if (!footer) return;

        const steamMarquee = footer.querySelector(".Marquee");
        const steamContent = steamMarquee?.querySelector(".Content");
        const sub = footer.querySelector(".PortraitMessage.SubMessage.Short");

        if (!sub || !steamMarquee || !steamContent) return;
        if (sub.querySelector(".md-submessage-marquee")) return;

        const text = sub.textContent.trim();

        sub.dataset.mdOriginalText = text;
        sub.textContent = "";

        const viewport = document.createElement("div");
        viewport.className = "md-submessage-marquee";

        const track = document.createElement("div");
        track.className = "md-submessage-marquee-track";

        const text1 = document.createElement("span");
        const text2 = document.createElement("span");

        text1.textContent = text;
        text2.textContent = text;

        track.append(text1, text2);
        viewport.appendChild(track);
        sub.appendChild(viewport);

        const steamDuration =
            parseFloat(
                getComputedStyle(steamMarquee)
                    .getPropertyValue("--duration")
            ) || 6;

        const steamTextWidth =
            steamContent.getBoundingClientRect().width;

        const gap = 48;
        const speed = (steamTextWidth + gap) / steamDuration;

        const textWidth = text1.getBoundingClientRect().width;
        const distance = textWidth + gap;
        const duration = distance / speed;

		track.animate(
			[
				{
					transform: "translateX(0)"
				},
				{
					transform: `translateX(-${distance}px)`
				}
			],
			{
				duration: duration * 1000,
				easing: "linear",
				iterations: Infinity,
				delay: 2000
			}
		);
    }

    function update() {
        if (isSmallMode()) {
            enableSmallMarquee();
        } else {
            restoreSubMessage();
        }
    }

    let style = document.getElementById(STYLE_ID);

    if (!style) {
        style = document.createElement("style");
        style.id = STYLE_ID;
        document.head.appendChild(style);
    }

    style.textContent = `
        .LibraryDisplaySizeSmall .PlayNextSuggestions
        .RecentGameFooter > .PortraitMessage {
            width: calc(100% - 7px) !important;
        }

        .LibraryDisplaySizeSmall .PlayNextSuggestions
        .RecentGameFooter .PortraitMessage.SubMessage.Short {
            width: 213px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
        }

        .LibraryDisplaySizeSmall .md-submessage-marquee {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            -webkit-mask-image: linear-gradient(
                to right,
                transparent 0,
                black 24px,
                black calc(100% - 24px),
                transparent 100%
            );
        }

		.LibraryDisplaySizeSmall .md-submessage-marquee-track {
			display: flex;
			width: max-content;
			gap: 48px;
		}

        .LibraryDisplaySizeSmall .md-submessage-marquee-track span {
            flex: none;
            white-space: nowrap;
        }
    `;

    clearInterval(window.__mdPlayNextSmallMarquee);

    window.__mdPlayNextSmallMarquee = setInterval(update, 250);

    update();
})();
/*
 * Fin correction "à quoi on joue ?" pour la taille de la bibliothèque "petite"
 */
