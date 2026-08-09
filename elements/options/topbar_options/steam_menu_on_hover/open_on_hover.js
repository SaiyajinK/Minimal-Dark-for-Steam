/* Option : ouvre les menus au survol au lieu du clic et désactive le clic. */
(() => {
    "use strict";

    const instanceKey = "__minimalDarkMenuHover";
    const activeControlKey = "__minimalDarkActiveHoverControl";
    const popupRoot = document.documentElement;
    const ownerWindow = window.opener;
    const ownerControl = ownerWindow?.[activeControlKey] ?? null;

    globalThis[instanceKey]?.stop?.();

    const isNotificationsPopup =
        popupRoot.classList.contains("Notifications_Menu") ||
        popupRoot.className.includes("Notifications");

    /*
     * Vérifie si le curseur se trouve réellement dans une partie
     * visible du panneau de notifications.
     */
    const isPointInsideNotification = (x, y) => {
        const parts = document.querySelectorAll(
            ".NotificationHeader, .NotificationsMenuScrollable"
        );

        if (!parts.length) return true;

        return [...parts].some(element => {
            const rect = element.getBoundingClientRect();
            return x >= rect.left && x <= rect.right &&
                y >= rect.top && y <= rect.bottom;
        });
    };

    const isDirectHoverPopup = ownerControl?.matches?.(
        ".RootMenuButton, .NotificationsButton, .AccountMenu"
    ) === true;

    /* Popup ayant directement accès à son bouton d’origine. */
    if (isDirectHoverPopup && ownerWindow) {
        let outsideChecks = 0;
        let closing = false;
        let lastControl = ownerControl;
        let notificationPointerInside = true;

        const handleNotificationPointerMove = event => {
            notificationPointerInside = isPointInsideNotification(
                event.clientX,
                event.clientY
            );
        };

        const handleNotificationPointerLeave = () => {
            notificationPointerInside = false;
        };

        const clearOwnerState = () => {
            if (ownerWindow[activeControlKey] === lastControl) {
                ownerWindow[activeControlKey] = null;
            }
        };

        if (isNotificationsPopup) {
            document.addEventListener(
                "pointermove",
                handleNotificationPointerMove,
                true
            );

            popupRoot.addEventListener(
                "pointerleave",
                handleNotificationPointerLeave
            );
        }

        const hoverWatcher = setInterval(() => {
            const control =
                ownerWindow[activeControlKey] ?? lastControl;

            const popupHovered = isNotificationsPopup
                ? notificationPointerInside
                : popupRoot.matches(":hover");

            const controlHovered =
                control?.isConnected === true &&
                control.matches(":hover");

            if (popupHovered || controlHovered) {
                lastControl = control;
                outsideChecks = 0;
                closing = false;
                return;
            }

            if (++outsideChecks < 4 || closing) return;

            closing = true;

            if (
                control?.isConnected === true &&
                (
                    ownerWindow[activeControlKey] == null ||
                    ownerWindow[activeControlKey] === control
                )
            ) {
                clearOwnerState();
                control.click();
            } else {
                window.SteamClient?.Window?.Close?.();
            }
        }, 50);

        const handleVisibilityChange = () => {
            if (document.hidden) clearOwnerState();
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        window.addEventListener("pagehide", clearOwnerState);

        globalThis[instanceKey] = {
            stop: () => {
                clearInterval(hoverWatcher);

                document.removeEventListener(
                    "pointermove",
                    handleNotificationPointerMove,
                    true
                );

                popupRoot.removeEventListener(
                    "pointerleave",
                    handleNotificationPointerLeave
                );

                document.removeEventListener(
                    "visibilitychange",
                    handleVisibilityChange
                );

                window.removeEventListener(
                    "pagehide",
                    clearOwnerState
                );
            }
        };

        return;
    }

    /* Autres fenêtres de menu. */
    if (popupRoot.classList.contains("ContextMenuPopup")) {
        let closeTimer = null;

        const cancelClose = () => {
            clearTimeout(closeTimer);
            closeTimer = null;
        };

        const queueClose = () => {
            cancelClose();

            closeTimer = setTimeout(() => {
                closeTimer = null;
                window.SteamClient?.Window?.Close?.();
            }, 200);
        };

        const handleNotificationPointerMove = event => {
            if (
                isPointInsideNotification(
                    event.clientX,
                    event.clientY
                )
            ) {
                cancelClose();
            } else {
                queueClose();
            }
        };

        if (isNotificationsPopup) {
            document.addEventListener(
                "pointermove",
                handleNotificationPointerMove,
                true
            );
        } else {
            popupRoot.addEventListener(
                "pointerenter",
                cancelClose
            );
        }

        popupRoot.addEventListener(
            "pointerleave",
            queueClose
        );

        globalThis[instanceKey] = {
            stop: () => {
                cancelClose();

                document.removeEventListener(
                    "pointermove",
                    handleNotificationPointerMove,
                    true
                );

                popupRoot.removeEventListener(
                    "pointerenter",
                    cancelClose
                );

                popupRoot.removeEventListener(
                    "pointerleave",
                    queueClose
                );
            }
        };

        return;
    }

    /* Fenêtre principale de Steam. */
    let hoverTimer = null;
    let activeResetTimer = null;

    /* Les menus classiques s’ouvrent immédiatement. */
    const hoverDelay = 0;

    /* Le menu du compte attend la fin de son agrandissement. */
    const accountMenuDelay = 280;

    /* Les notifications s’ouvrent après une demi-seconde. */
    const notificationsButtonDelay = 500;

    const selector =
        ".RootMenuBar > .RootMenuButton, " +
        ".NotificationsButton, .AccountMenu";

    const getHoverControl = target => {
        const control = target.closest?.(selector);
        if (!control) return null;

        if (
            control.matches(
                ".NotificationsButton, .AccountMenu"
            )
        ) {
            return control;
        }

        const buttons = [
            ...control.parentElement.children
        ].filter(element =>
            element.matches(".RootMenuButton")
        );

        return buttons.indexOf(control) < 5
            ? control
            : null;
    };

    const getOpeningDelay = control => {
        if (control.matches(".NotificationsButton")) {
            return notificationsButtonDelay;
        }

        if (control.matches(".AccountMenu")) {
            return accountMenuDelay;
        }

        return hoverDelay;
    };

    const movedInsideControl = (control, event) =>
        event.relatedTarget instanceof Node &&
        control.contains(event.relatedTarget);

    const handlePointerOver = event => {
        const control = getHoverControl(event.target);

        if (
            !control ||
            movedInsideControl(control, event)
        ) {
            return;
        }

        clearTimeout(hoverTimer);
        clearTimeout(activeResetTimer);

        hoverTimer = setTimeout(() => {
            hoverTimer = null;

            if (
                control.matches(":hover") &&
                globalThis[activeControlKey] !== control
            ) {
                globalThis[activeControlKey] = control;
                control.click();
            }
        }, getOpeningDelay(control));
    };

    const handlePointerOut = event => {
        const control = getHoverControl(event.target);

        if (
            !control ||
            movedInsideControl(control, event)
        ) {
            return;
        }

        clearTimeout(hoverTimer);
        clearTimeout(activeResetTimer);
        hoverTimer = null;

        /*
         * Le menu Account conserve son état un peu plus longtemps
         * afin que sa popup puisse récupérer son bouton d’origine.
         */
        activeResetTimer = setTimeout(() => {
            activeResetTimer = null;

            if (
                globalThis[activeControlKey] === control
            ) {
                globalThis[activeControlKey] = null;
            }
        }, control.matches(".AccountMenu") ? 600 : 350);
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
        if (
            !getHoverControl(event.target) ||
            event.detail === 0
        ) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
    };

    document.addEventListener(
        "pointerover",
        handlePointerOver
    );

    document.addEventListener(
        "pointerout",
        handlePointerOut
    );

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
            clearTimeout(activeResetTimer);
            globalThis[activeControlKey] = null;

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

/* Fin d’option : ouvre les menus au survol et désactive le clic. */