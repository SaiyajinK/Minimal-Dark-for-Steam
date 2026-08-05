/*
 * Option : ouvre les menus au survol au lieu du clic et désactive le clic.
 */
(() => {
    "use strict";

    const instanceKey = "__minimalDarkMenuHover";
    globalThis[instanceKey]?.stop?.();

    let hoverTimer = null;
    const hoverDelay = 120;

    const selector =
        ".RootMenuBar > .RootMenuButton, " +
        ".NotificationsButton, .AccountMenu";

    const getHoverControl = target => {
        const control = target.closest?.(selector);

        if (!control) {
            return null;
        }

        if (control.matches(".NotificationsButton, .AccountMenu")) {
            return control;
        }

        const buttons = [...control.parentElement.children]
            .filter(element => element.matches(".RootMenuButton"));

        return buttons.indexOf(control) < 5
            ? control
            : null;
    };

    const handlePointerOver = event => {
        const control = getHoverControl(event.target);

        if (
            !control ||
            (
                event.relatedTarget instanceof Node &&
                control.contains(event.relatedTarget)
            )
        ) {
            return;
        }

        clearTimeout(hoverTimer);

        hoverTimer = setTimeout(() => {
            hoverTimer = null;

            if (control.matches(":hover")) {
                control.click();
            }
        }, hoverDelay);
    };

    const handlePointerOut = event => {
        const control = getHoverControl(event.target);

        if (
            !control ||
            (
                event.relatedTarget instanceof Node &&
                control.contains(event.relatedTarget)
            )
        ) {
            return;
        }

        clearTimeout(hoverTimer);
        hoverTimer = null;
    };

    const blockMousePress = event => {
        const control = getHoverControl(event.target);

        if (
            !control ||
            (
                event.type === "pointerdown" &&
                event.pointerType !== "mouse"
            )
        ) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    };

    const blockMouseClick = event => {
        if (!getHoverControl(event.target) || event.detail === 0) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    document.addEventListener(
        "pointerdown",
        blockMousePress,
        true
    );

    document.addEventListener(
        "mousedown",
        blockMousePress,
        true
    );

    document.addEventListener(
        "click",
        blockMouseClick,
        true
    );

    globalThis[instanceKey] = {
        stop: () => {
            clearTimeout(hoverTimer);

            document.removeEventListener(
                "pointerover",
                handlePointerOver
            );

            document.removeEventListener(
                "pointerout",
                handlePointerOut
            );

            document.removeEventListener(
                "pointerdown",
                blockMousePress,
                true
            );

            document.removeEventListener(
                "mousedown",
                blockMousePress,
                true
            );

            document.removeEventListener(
                "click",
                blockMouseClick,
                true
            );
        }
    };
})();
/*
* Fin d'option : ouvre les menus au survol au lieu du clic et desactive le clic.
*/
