/*
 * Option : un clic sur le bouton Steam ouvre son menu.
 * Un double-clic affiche ou masque le reste de la barre supérieure.
 */
(() => {
    "use strict";

    const instanceKey = "__minimalDarkRootMenuToggle";
    globalThis[instanceKey]?.stop?.();

    let cleanup = () => {};

    const controller = {
        stop: () => {
            cleanup();
            cleanup = () => {};
        }
    };

    globalThis[instanceKey] = controller;

    const start = () => {
        const html = document.documentElement;
        const topBar = document.querySelector(".TopBar");

        if (!topBar) {
            const waitingObserver = new MutationObserver(() => {
                if (!document.querySelector(".TopBar")) {
                    return;
                }

                waitingObserver.disconnect();
                start();
            });

            waitingObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

            cleanup = () => {
                waitingObserver.disconnect();
            };

            return;
        }

        const modeClass = "MinimalDarkRootMenuMode";
        const expandedClass = "MinimalDarkTopbarExpanded";
        const rootMenuBarSelector = ".RootMenuBar";
        const rootButtonSelector =
            ".RootMenuBar > .RootMenuButton:first-child";
        const superNavSelector = ".SuperNav";

        let expanded = false;
        let allowNativeRootClick = false;
        let measurementFrame = null;
        let rootClickTimer = null;
        const doubleClickDelay = 250;

        const getRootButton = target => {
            const button = target?.closest?.(rootButtonSelector);
            const currentButton = document.querySelector(
                rootButtonSelector
            );

            return button && button === currentButton
                ? button
                : null;
        };

        const setExpanded = value => {
            expanded = value;
            html.classList.toggle(expandedClass, expanded);

            document.querySelector(rootButtonSelector)
                ?.setAttribute("aria-expanded", String(expanded));
        };

        const updateMeasurements = () => {
            measurementFrame = null;

            const rootMenuBar = document.querySelector(
                rootMenuBarSelector
            );
            const rootButton = document.querySelector(
                rootButtonSelector
            );
            const superNav = document.querySelector(
                superNavSelector
            );

            if (!rootMenuBar || !rootButton || !superNav) {
                return;
            }

            const rootMenuBarRect =
                rootMenuBar.getBoundingClientRect();
            const rootButtonRect =
                rootButton.getBoundingClientRect();
            const superNavRect = superNav.getBoundingClientRect();

            const rootMenuFullWidth = Math.ceil(
                Math.max(rootMenuBar.scrollWidth, rootMenuBarRect.width)
            );

            const rootButtonWidth = Math.ceil(
                rootButtonRect.right - rootMenuBarRect.left
            );

            const superNavFullWidth = Math.ceil(
                Math.max(superNav.scrollWidth, superNavRect.width)
            );

            html.style.setProperty(
                "--minimal-dark-root-menu-full-width",
                `${rootMenuFullWidth}px`
            );

            html.style.setProperty(
                "--minimal-dark-root-menu-button-width",
                `${rootButtonWidth}px`
            );

            html.style.setProperty(
                "--minimal-dark-super-nav-full-width",
                `${superNavFullWidth}px`
            );

            rootButton.setAttribute(
                "aria-expanded",
                String(expanded)
            );
        };

        const scheduleMeasurements = () => {
            if (measurementFrame !== null) {
                return;
            }

            measurementFrame = requestAnimationFrame(
                updateMeasurements
            );
        };

        /*
         * Empêche une autre option d'ouvrir le bouton Steam au survol.
         * L'effet visuel CSS :hover reste inchangé.
         */
        const blockRootHoverOpening = event => {
            const rootButton = getRootButton(event.target);

            if (!rootButton) {
                return;
            }

            if (
                event.relatedTarget instanceof Node &&
                rootButton.contains(event.relatedTarget)
            ) {
                return;
            }

            event.stopImmediatePropagation();
        };

        /*
         * Le clic physique est remplacé par un clic synthétique afin
         * de conserver exclusivement l'ouverture native du menu Steam.
         */
        const handleRootClick = event => {
            if (allowNativeRootClick) {
                return;
            }

            const rootButton = getRootButton(event.target);

            if (
                !rootButton ||
                event.button !== 0 ||
                event.detail === 0
            ) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            clearTimeout(rootClickTimer);

            rootClickTimer = setTimeout(() => {
                rootClickTimer = null;

                const currentRootButton = document.querySelector(
                    rootButtonSelector
                );

                if (!currentRootButton) {
                    return;
                }

                allowNativeRootClick = true;

                try {
                    currentRootButton.click();
                } finally {
                    allowNativeRootClick = false;
                }
            }, doubleClickDelay);
        };

        const handleRootDoubleClick = event => {
            if (!getRootButton(event.target) || event.button !== 0) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            clearTimeout(rootClickTimer);
            rootClickTimer = null;

            setExpanded(!expanded);
            scheduleMeasurements();
        };

        /*
         * Mesure d'abord la barre complète, puis active l'état replié.
         */
        updateMeasurements();
        html.classList.add(modeClass);
        setExpanded(false);

        const observer = new MutationObserver(scheduleMeasurements);

        observer.observe(topBar, {
            childList: true,
            subtree: true
        });

        window.addEventListener("resize", scheduleMeasurements);

        window.addEventListener(
            "pointerover",
            blockRootHoverOpening,
            true
        );

        window.addEventListener(
            "click",
            handleRootClick,
            true
        );

        window.addEventListener(
            "dblclick",
            handleRootDoubleClick,
            true
        );

        cleanup = () => {
            observer.disconnect();

            if (measurementFrame !== null) {
                cancelAnimationFrame(measurementFrame);
            }

            clearTimeout(rootClickTimer);

            window.removeEventListener(
                "resize",
                scheduleMeasurements
            );

            window.removeEventListener(
                "pointerover",
                blockRootHoverOpening,
                true
            );

            window.removeEventListener(
                "click",
                handleRootClick,
                true
            );

            window.removeEventListener(
                "dblclick",
                handleRootDoubleClick,
                true
            );

            html.classList.remove(modeClass, expandedClass);
            html.style.removeProperty(
                "--minimal-dark-root-menu-full-width"
            );
            html.style.removeProperty(
                "--minimal-dark-root-menu-button-width"
            );
            html.style.removeProperty(
                "--minimal-dark-super-nav-full-width"
            );

            document.querySelector(rootButtonSelector)
                ?.removeAttribute("aria-expanded");
        };
    };

    if (document.readyState === "loading") {
        const handleReady = () => start();

        document.addEventListener("DOMContentLoaded", handleReady, {
            once: true
        });

        cleanup = () => {
            document.removeEventListener(
                "DOMContentLoaded",
                handleReady
            );
        };
    } else {
        start();
    }
})();
/*
 * Fin d'option : affichage repliable de la barre supérieure.
 */
