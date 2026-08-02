/*
 *  Animation fiable d’ouverture des menus et menus contextuels
 */
(() => {
    "use strict";

    /* Sélecteur commun aux fenêtres de menus créées par Steam. */
    const MENU_SELECTOR = ".PP7LM0Ow1K5qkR8WElLpt";

    /* Nom et paramètres de l’animation définie dans le fichier CSS. */
    const ANIMATION_NAME =
        "MinimalDarkContextMenuOpen";

    const ANIMATION =
        `${ANIMATION_NAME} 420ms cubic-bezier(.2, .8, .2, 1) 70ms both`;

    /* Empêche le script d’être installé plusieurs fois dans la même fenêtre. */
    const INSTALL_KEY =
        "__minimalDarkContextMenuAnimationInstalled";

    /*
     * États associés à chaque menu :
     * animations en attente, actives, contenu précédent et dernier démarrage.
     * WeakMap et WeakSet permettent leur suppression automatique avec le menu.
     */
    const pendingAnimations = new WeakMap();
    const initialChecks = new WeakMap();
    const activeAnimations = new WeakMap();
    const previousContents = new WeakMap();
    const animatedNotifications = new WeakSet();
    const everSeen = new WeakSet();
    const lastCssAnimation = new WeakMap();
    const lastAnimationStarts = new WeakMap();

    /* Installe le système uniquement dans une fenêtre contextuelle Steam. */
    const install = () => {
        if (!document.body?.classList.contains("ContextMenuPopupBody")) {
            return;
        }

        const popupTarget = document.getElementById("popup_target");

        /* Arrête si le conteneur est absent ou si le script est déjà installé. */
        if (!popupTarget || window[INSTALL_KEY]) {
            return;
        }

        window[INSTALL_KEY] = true;

        /* Détecte la fenêtre spéciale utilisée pour les notifications. */
        const isNotificationsWindow =
            document.documentElement.classList.contains(
                "Notifications_Menu"
            );

        /* Vérifie que Steam considère le menu comme entièrement ouvert. */
        const isOpen = (menu) =>
            menu.classList.contains("visible") &&
            menu.classList.contains("ready");

        /* Normalise le texte afin de détecter un changement de contenu. */
        const getContent = (menu) =>
            menu.textContent.replace(/\s+/g, " ").trim();

        /* Annule une animation programmée, mais pas encore démarrée. */
        const clearPendingAnimation = (menu) => {
            const pending = pendingAnimations.get(menu);

            if (pending) {
                clearTimeout(pending.timer);
                pendingAnimations.delete(menu);
            }
        };

        /* Annule la vérification effectuée lors du premier affichage. */
        const clearInitialCheck = (menu) => {
            const pending = initialChecks.get(menu);

            if (pending) {
                cancelAnimationFrame(pending.frame);
                initialChecks.delete(menu);
            }
        };

        /* Arrête le suivi d’une animation active et retire ses événements. */
        const clearActiveAnimation = (menu) => {
            const active = activeAnimations.get(menu);

            if (!active) {
                return;
            }

            clearTimeout(active.fallbackTimer);

            menu.removeEventListener(
                "animationend",
                active.finish
            );

            menu.removeEventListener(
                "animationcancel",
                active.finish
            );

            activeAnimations.delete(menu);
        };

        /*
         * Suit une animation jusqu’à sa fin ou son annulation.
         * Le délai de 800 ms sert de sécurité si aucun événement n’est reçu.
         */
        const trackAnimation = (menu) => {
            clearActiveAnimation(menu);
            lastAnimationStarts.set(menu, performance.now());

            if (isNotificationsWindow) {
                animatedNotifications.add(menu);
            }

            const active = {
                fallbackTimer: 0,
                finish: null
            };

            active.finish = (event) => {
                if (
                    event &&
                    (
                        event.target !== menu ||
                        event.animationName !== ANIMATION_NAME
                    )
                ) {
                    return;
                }

                clearActiveAnimation(menu);

                if (isOpen(menu)) {
                    previousContents.set(
                        menu,
                        getContent(menu)
                    );
                }
            };

            active.fallbackTimer = setTimeout(
                () => active.finish(null),
                800
            );

            activeAnimations.set(menu, active);

            menu.addEventListener(
                "animationend",
                active.finish
            );

            menu.addEventListener(
                "animationcancel",
                active.finish
            );
        };

        /* Nettoie tous les états et styles ajoutés à un menu. */
        const resetMenu = (menu) => {
            clearPendingAnimation(menu);
            clearInitialCheck(menu);
            clearActiveAnimation(menu);

            previousContents.delete(menu);
            animatedNotifications.delete(menu);

            menu.style.removeProperty("animation");
            menu.style.removeProperty("opacity");
            menu.style.removeProperty("clip-path");
        };

		/*
		 * Si Steam ferme un menu avant la fin de son animation d’ouverture,
		 * conservez-le masqué au lieu de supprimer les styles d’animation.
		 * Leur suppression immédiate afficherait brièvement le menu complet
		 * avant la disparition de sa fenêtre contextuelle native.
		 */
        const hideInterruptedMenu = (menu) => {
            clearPendingAnimation(menu);
            clearInitialCheck(menu);
            clearActiveAnimation(menu);

            previousContents.delete(menu);
            animatedNotifications.delete(menu);

            menu.style.setProperty(
                "animation",
                "none",
                "important"
            );

            menu.style.setProperty(
                "opacity",
                "0",
                "important"
            );

            menu.style.setProperty(
                "clip-path",
                "inset(0 0 100% 0)",
                "important"
            );
        };

        const wasRecentlyAnimating = (menu) => {
            const startedAt = lastAnimationStarts.get(menu);

            return (
                typeof startedAt === "number" &&
                performance.now() - startedAt < 800
            );
        };

        const closeMenuSafely = (menu) => {
            if (wasRecentlyAnimating(menu)) {
                hideInterruptedMenu(menu);
            } else {
                resetMenu(menu);
            }
        };

        const getCssAnimation = (menu) => {
            if (typeof menu.getAnimations !== "function") {
                return null;
            }

            return menu.getAnimations().find((animation) => {
                const targetsMenu =
                    !animation.effect?.target ||
                    animation.effect.target === menu;

                return (
                    targetsMenu &&
                    animation.animationName === ANIMATION_NAME
                );
            }) ?? null;
        };

		/*
		 * Conserver l’animation CSS déjà démarrée par Steam.
		 * Le JavaScript ne doit pas annuler et rejouer cette première exécution.
		 */
        const adoptCssAnimation = (menu, animation) => {
            everSeen.add(menu);
            lastCssAnimation.set(menu, animation);
            previousContents.set(menu, getContent(menu));

            if (
                animation.playState === "running" ||
                animation.playState === "pending"
            ) {
                trackAnimation(menu);
            } else if (isNotificationsWindow) {
                animatedNotifications.add(menu);
            }
        };

        const startAnimation = (menu) => {
            if (!isOpen(menu)) {
                resetMenu(menu);
                return;
            }

            previousContents.set(menu, getContent(menu));

            menu.style.setProperty(
                "animation",
                "none",
                "important"
            );

            void menu.offsetWidth;

            menu.style.setProperty(
                "animation",
                ANIMATION,
                "important"
            );

            menu.style.removeProperty("opacity");
            menu.style.removeProperty("clip-path");

            trackAnimation(menu);
        };

        const scheduleJavaScriptAnimation = (
            menu,
            force = false
        ) => {
            if (!isOpen(menu)) {
                return;
            }

            const currentContent = getContent(menu);
            const previousPending = pendingAnimations.get(menu);

            if (
                !force &&
                !previousPending &&
                previousContents.get(menu) === currentContent
            ) {
                return;
            }

            if (previousPending) {
                clearTimeout(previousPending.timer);
                force = force || previousPending.force;
            }

			/*
			 * Ce chemin est utilisé uniquement lorsque Steam réutilise un menu
			 * déjà ouvert ou lorsqu’aucune animation CSS n’a été détectée.
			 */
            menu.style.setProperty(
                "animation",
                "none",
                "important"
            );

            menu.style.setProperty(
                "opacity",
                "0",
                "important"
            );

            menu.style.setProperty(
                "clip-path",
                "inset(0 0 100% 0)",
                "important"
            );

            const pending = {
                force,
                timer: 0
            };

            pending.timer = setTimeout(() => {
                pendingAnimations.delete(menu);

                requestAnimationFrame(() => {
                    startAnimation(menu);
                });
            }, 35);

            pendingAnimations.set(menu, pending);
        };

        const queueAnimation = (menu, force = false) => {
            if (!(menu instanceof Element) || !isOpen(menu)) {
                return;
            }

			/*
			 * Le contenu inséré pendant une animation en cours appartient
			 * à cette même ouverture et ne doit jamais la redémarrer.
			 */
            if (activeAnimations.has(menu)) {
                previousContents.set(menu, getContent(menu));
                return;
            }

            if (
                isNotificationsWindow &&
                animatedNotifications.has(menu)
            ) {
                return;
            }

            const currentContent = getContent(menu);

            if (
                !force &&
                previousContents.get(menu) === currentContent
            ) {
                return;
            }

			/*
			 * Un menu sans contenu mémorisé s’ouvre pour la première fois.
			 * Attendre une image permet au navigateur d’exposer l’animation CSS,
			 * puis de l’adopter au lieu de la redémarrer.
			 */
            if (!previousContents.has(menu)) {
                const existingCheck = initialChecks.get(menu);

                if (existingCheck) {
                    existingCheck.force =
                        existingCheck.force || force;

                    return;
                }

				/*
				 * Enregistrer immédiatement l’ouverture avant d’attendre
				 * requestAnimationFrame. Cela couvre également un second
				 * clic effectué pendant la toute première image affichée.
				 */
                lastAnimationStarts.set(
                    menu,
                    performance.now()
                );

                const pendingCheck = {
                    force,
                    frame: 0
                };

                pendingCheck.frame = requestAnimationFrame(() => {
                    initialChecks.delete(menu);

                    if (!isOpen(menu)) {
                        resetMenu(menu);
                        return;
                    }

                    const cssAnimation =
                        getCssAnimation(menu);

                    const firstEncounter =
                        !everSeen.has(menu);

                    const newCssAnimation =
                        cssAnimation &&
                        cssAnimation !==
                            lastCssAnimation.get(menu);

                    everSeen.add(menu);

					/*
					 * Conserver une animation CSS appartenant à cette ouverture,
					 * même si elle s’est terminée avant que ce JavaScript
					 * ait eu le temps de l’examiner.
					 */
                    if (
                        cssAnimation &&
                        (
                            firstEncounter ||
                            newCssAnimation
                        )
                    ) {
                        adoptCssAnimation(
                            menu,
                            cssAnimation
                        );
                    } else {
                        scheduleJavaScriptAnimation(
                            menu,
                            pendingCheck.force
                        );
                    }
                });

                initialChecks.set(menu, pendingCheck);
                return;
            }

            scheduleJavaScriptAnimation(menu, force);
        };

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (
                    mutation.type === "attributes" &&
                    mutation.target.matches?.(MENU_SELECTOR)
                ) {
                    const menu = mutation.target;
                    const oldClasses =
                        mutation.oldValue?.split(/\s+/) ?? [];

                    const wasOpen =
                        oldClasses.includes("visible") &&
                        oldClasses.includes("ready");

                    if (!isOpen(menu)) {
                        const notificationIsStillVisible =
                            isNotificationsWindow &&
                            animatedNotifications.has(menu) &&
                            menu.classList.contains("visible");

                        if (!notificationIsStillVisible) {
                            closeMenuSafely(menu);
                        }
                    } else if (!wasOpen) {
                        queueAnimation(menu, true);
                    }
                }

                if (
                    mutation.type === "childList" ||
                    mutation.type === "characterData"
                ) {
                    const element =
                        mutation.target instanceof Element
                            ? mutation.target
                            : mutation.target.parentElement;

                    const menu = element?.closest(MENU_SELECTOR);

                    if (menu) {
                        queueAnimation(menu);
                    }
                }

                for (const addedNode of mutation.addedNodes ?? []) {
                    if (!(addedNode instanceof Element)) {
                        continue;
                    }

                    if (addedNode.matches(MENU_SELECTOR)) {
                        queueAnimation(addedNode, true);
                    }

                    for (const menu of addedNode.querySelectorAll(
                        MENU_SELECTOR
                    )) {
                        queueAnimation(menu, true);
                    }
                }

                for (const removedNode of mutation.removedNodes ?? []) {
                    if (!(removedNode instanceof Element)) {
                        continue;
                    }

                    if (removedNode.matches(MENU_SELECTOR)) {
                        closeMenuSafely(removedNode);
                    }

                    for (const menu of removedNode.querySelectorAll(
                        MENU_SELECTOR
                    )) {
                        closeMenuSafely(menu);
                    }
                }
            }
        });

        observer.observe(popupTarget, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ["class"]
        });

        const resetNotificationsAnimation = () => {
            if (!isNotificationsWindow) {
                return;
            }

            for (const menu of popupTarget.querySelectorAll(
                MENU_SELECTOR
            )) {
                closeMenuSafely(menu);
            }
        };

        const replayNotificationsAnimation = () => {
            if (!isNotificationsWindow) {
                return;
            }

            requestAnimationFrame(() => {
                for (const menu of popupTarget.querySelectorAll(
                    `${MENU_SELECTOR}.visible.ready`
                )) {
                    queueAnimation(menu, true);
                }
            });
        };

        if (isNotificationsWindow) {
            window.addEventListener(
                "blur",
                resetNotificationsAnimation
            );

            window.addEventListener(
                "focus",
                replayNotificationsAnimation
            );

            document.addEventListener(
                "visibilitychange",
                () => {
                    if (document.hidden) {
                        resetNotificationsAnimation();
                    } else {
                        replayNotificationsAnimation();
                    }
                }
            );
        }

        for (const menu of popupTarget.querySelectorAll(
            `${MENU_SELECTOR}.visible.ready`
        )) {
            queueAnimation(menu, true);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            install,
            { once: true }
        );
    } else {
        install();
    }
})();
