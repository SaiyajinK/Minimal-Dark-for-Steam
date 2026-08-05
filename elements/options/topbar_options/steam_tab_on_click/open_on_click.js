/*
 * Option : ouvre les menus des onglets Steam au clic simple
 * et suit le lien de l'onglet au double-clic.
 */
(() => {
    "use strict";

    const instanceKey = "__minimalDarkSteamTabMenuClick";
    globalThis[instanceKey]?.stop?.();

    const menuSelector = ".SuperNav > .SuperNavMenu";
    const buttonSelector = ".MenuButton";
    const reactPropsPrefix = "__reactProps$";

    const menuStates = new WeakMap();
    const patchedMenus = new Set();

    let allowNavigationClick = false;
    let openedMenu = null;
    let menuObserver = null;

    const blockedMouseEnter = () => {};

    const getMenu = target =>
        target?.closest?.(menuSelector) || null;

    const getReactPropsKey = menu =>
        Object.getOwnPropertyNames(menu).find(key =>
            key.startsWith(reactPropsPrefix) &&
            menu[key]?.onMouseEnter
        );

    /*
     * Remplace uniquement le gestionnaire React responsable de
     * l'ouverture au survol. Le gestionnaire de fermeture reste natif.
     */
    const patchMenu = menu => {
        if (!menu) {
            return null;
        }

        const propsKey = getReactPropsKey(menu);

        if (!propsKey) {
            return null;
        }

        const props = menu[propsKey];
        let state = menuStates.get(menu);

        if (!state) {
            state = {
                propsKey,
                originalMouseEnter: null
            };

            menuStates.set(menu, state);
            patchedMenus.add(menu);
        }

        state.propsKey = propsKey;

        if (props.onMouseEnter !== blockedMouseEnter) {
            state.originalMouseEnter = props.onMouseEnter;

            menu[propsKey] = {
                ...props,
                onMouseEnter: blockedMouseEnter
            };
        }

        return state;
    };

    const patchAllMenus = () => {
        document.querySelectorAll(menuSelector)
            .forEach(patchMenu);
    };

    const openMenu = menu => {
        const state = patchMenu(menu);

        if (!state?.originalMouseEnter) {
            return;
        }

        openedMenu = menu;

        state.originalMouseEnter({
            type: "mouseenter",
            target: menu,
            currentTarget: menu
        });
    };

    /*
     * Avant que React traite un changement de survol, neutralise
     * le gestionnaire du nouvel onglet, quel que soit son état.
     */
    const patchMouseTransition = event => {
        const previousMenu = getMenu(event.target);
        const nextMenu = getMenu(event.relatedTarget);

        patchMenu(previousMenu);
        patchMenu(nextMenu);

        if (
            openedMenu &&
            nextMenu &&
            nextMenu !== openedMenu
        ) {
            openedMenu = null;
        }
    };

    /*
     * Un clic simple affiche le menu et bloque la navigation
     * normalement associée à l'onglet.
     */
    const handleSingleClick = event => {
        if (allowNavigationClick) {
            return;
        }

        const menu = getMenu(event.target);

        if (
            !menu ||
            event.button !== 0 ||
            event.detail === 0
        ) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        openMenu(menu);
    };

    /*
     * Un double-clic reproduit un clic autorisé sur le bouton
     * interne afin de suivre le lien natif de Steam.
     */
    const handleDoubleClick = event => {
        const menu = getMenu(event.target);

        if (!menu || event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        const button = menu.querySelector(buttonSelector);

        if (!button) {
            return;
        }

        allowNavigationClick = true;

        try {
            button.click();
        } finally {
            allowNavigationClick = false;
        }
    };

    const superNav = document.querySelector(".SuperNav");

    patchAllMenus();

    if (superNav) {
        menuObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                const menu = mutation.target;

                if (!menu.matches?.(menuSelector)) {
                    continue;
                }

                patchMenu(menu);

                if (
                    openedMenu === menu &&
                    !menu.classList.contains("MenuOpen")
                ) {
                    openedMenu = null;
                }
            }
        });

        menuObserver.observe(superNav, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"]
        });
    }

    window.addEventListener(
        "mouseover",
        patchMouseTransition,
        true
    );

    window.addEventListener(
        "mouseout",
        patchMouseTransition,
        true
    );

    window.addEventListener(
        "click",
        handleSingleClick,
        true
    );

    window.addEventListener(
        "dblclick",
        handleDoubleClick,
        true
    );

    globalThis[instanceKey] = {
        stop: () => {
            menuObserver?.disconnect();

            window.removeEventListener(
                "mouseover",
                patchMouseTransition,
                true
            );

            window.removeEventListener(
                "mouseout",
                patchMouseTransition,
                true
            );

            window.removeEventListener(
                "click",
                handleSingleClick,
                true
            );

            window.removeEventListener(
                "dblclick",
                handleDoubleClick,
                true
            );

            for (const menu of patchedMenus) {
                const state = menuStates.get(menu);
                const props = state && menu[state.propsKey];

                if (
                    props?.onMouseEnter === blockedMouseEnter
                ) {
                    menu[state.propsKey] = {
                        ...props,
                        onMouseEnter: state.originalMouseEnter
                    };
                }
            }

            patchedMenus.clear();
        }
    };
})();
/*
 * Fin d'option : ouvre les menus des onglets Steam au clic simple
 * et suit le lien de l'onglet au double-clic.
 */
