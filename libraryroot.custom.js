/*
 * Corrige les dimensions des fenêtres natives utilisées par
 * les menus et sous-menus de Steam.
 */
(() => {
    "use strict";

    /*
     * Démarre le système de redimensionnement automatique.
     */
    const start = () => {
        /*
         * Empêche plusieurs calculs d’être programmés simultanément.
         */
        let queued = false;

        /*
         * Mesure le contenu du menu et redimensionne sa fenêtre native.
         */
        const resizeMenu = () => {
            queued = false;

            /*
             * Récupère toutes les entrées présentes dans les menus.
             */
            const items = [
                ...document.querySelectorAll(".contextMenuItem")
            ];

            /*
             * Aucun menu n’est actuellement affiché.
             */
            if (!items.length) return;

            /*
             * Récupère les menus contextuels visibles de la bibliothèque.
             *
             * Un seul élément correspond au menu principal.
             * Deux éléments ou plus indiquent qu’un sous-menu est ouvert.
             */
            const visibleLibraryMenus = [
                ...document.querySelectorAll(
                    ".LibraryContextMenu.visible"
                )
            ];

            /*
             * Lorsqu’un sous-menu de la bibliothèque est ouvert,
             * la fenêtre Steam conserve strictement sa taille actuelle.
             *
             * Cela empêche notamment le sous-menu « Ajouter à » contenant
             * beaucoup de collections d’agrandir Steam vers le bas.
             */
            if (visibleLibraryMenus.length > 1) {
                return;
            }

            /*
             * Dimensions nécessaires pour afficher le menu complet.
             */
            let requiredWidth = 0;
            let requiredHeight = 0;

            /*
             * Mesure chaque entrée afin de trouver :
             * - l’élément allant le plus loin vers la droite ;
             * - l’élément allant le plus loin vers le bas.
             */
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

            /*
             * Récupère le conteneur principal du contenu du menu.
             *
             * Cette classe est plus stable que l’ancien nom généré
             * « _2EstNjFIIZm_WUSKm5Wt7n ».
             */
            const menu = document.querySelector(
                ".contextMenuContents"
            );

            /*
             * Prend également en compte les dimensions complètes
             * du conteneur, y compris son éventuel contenu masqué.
             */
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
             * Arrondit les dimensions et ajoute une marge de sécurité
             * de deux pixels contre les bordures tronquées.
             */
            requiredWidth = Math.ceil(requiredWidth + 2);
            requiredHeight = Math.ceil(requiredHeight + 2);

            /*
             * Un menu unique ne doit pas agrandir la fenêtre au-delà
             * de 80 % de la hauteur disponible sur l’écran.
             */
            const maximumResizableMenuHeight =
                (screen.availHeight || window.innerHeight) * 0.8;

            /*
             * Vérifie si le menu actuellement visible dépasse cette limite.
             */
            const hasOversizedMenu = visibleLibraryMenus.some(
                menuElement =>
                    menuElement.getBoundingClientRect().height >
                    maximumResizableMenuHeight
            );

            /*
             * La largeur peut uniquement être agrandie.
             * Elle ne peut jamais devenir inférieure à la largeur actuelle.
             */
            const targetWidth = Math.max(
                window.innerWidth,
                requiredWidth
            );

            /*
             * Si le menu est excessivement haut, la hauteur actuelle
             * est conservée. Sinon, elle est adaptée à son contenu.
             */
            const targetHeight = hasOversizedMenu
                ? window.innerHeight
                : Math.max(window.innerHeight, requiredHeight);

            /*
             * Aucun redimensionnement n’est nécessaire lorsque
             * les dimensions calculées sont déjà appliquées.
             */
            if (
                targetWidth === window.innerWidth &&
                targetHeight === window.innerHeight
            ) {
                return;
            }

            /*
             * Fonction interne de Steam qui redimensionne
             * la fenêtre native actuellement ouverte.
             */
            window.SteamClient?.Window?.ResizeTo?.(
                targetWidth,
                targetHeight,
                true
            );
        };

        /*
         * Programme une seule mesure après deux images de rendu.
         * Cela laisse le temps à Steam et au thème d’appliquer leurs styles.
         */
        const queueResize = () => {
            if (queued) return;

            queued = true;

            requestAnimationFrame(() => {
                requestAnimationFrame(resizeMenu);
            });
        };

        /*
         * Relance la vérification lorsque Steam ajoute, supprime
         * ou modifie des éléments dans l’interface du menu.
         */
        new MutationObserver(queueResize).observe(
            document.documentElement,
            {
                childList: true,
                subtree: true,
                attributes: true
            }
        );

        /*
         * Effectue plusieurs vérifications après l’ouverture du menu
         * afin de couvrir le chargement différé des styles et des polices.
         */
        [0, 50, 150, 300, 600, 1000].forEach(delay => {
            setTimeout(queueResize, delay);
        });
    };

    /*
     * Attend que le document soit prêt avant de démarrer le script.
     */
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
