(() => {
    "use strict";

    const INSTALL_KEY =
        "__minimalDarkCompactLibraryGridSynchronizer";

    const VERSION = 1;

    const MEASURE_SELECTOR = ".CSSGrid_Measure";
    const GRID_SELECTOR = "._3vHkmRShhzwd67_MtEq8-n";
    const ENABLE_PROPERTY =
        "--minimal-dark-compact-grid-enabled";

    const MANAGED_PROPERTIES = [
        "position",
        "left",
        "top",
        "width",
        "height",
        "max-width",
        "max-height",
        "overflow",
        "pointer-events",
        "visibility",
        "contain",
        "z-index"
    ];

    const previousInstallation = window[INSTALL_KEY];

    if (previousInstallation?.version === VERSION) {
        previousInstallation.refresh();
        return;
    }

    previousInstallation?.destroy?.();

    const records = new Map();
    const observedElements = new Map();

    let refreshFrame = 0;
    let destroyed = false;

    const readPixelValue = (value) => {
        const number = Number.parseFloat(value);

        return Number.isFinite(number) ? number : 0;
    };

    const readTrackWidth = (value) => {
        if (!value || value === "none") {
            return 0;
        }

        const repeatMatch = value.match(
            /repeat\(\s*auto-(?:fill|fit)\s*,\s*([0-9.]+)px/i
        );

        if (repeatMatch) {
            return readPixelValue(repeatMatch[1]);
        }

        const widths = [...value.matchAll(/([0-9.]+)px/gi)]
            .map((match) => readPixelValue(match[1]))
            .filter((width) => width > 0.5);

        return widths[0] ?? 0;
    };

    const rememberOriginalStyles = (element) => {
        const styles = new Map();

        for (const property of MANAGED_PROPERTIES) {
            styles.set(property, {
                value: element.style.getPropertyValue(property),
                priority:
                    element.style.getPropertyPriority(property)
            });
        }

        return styles;
    };

    const restoreOriginalStyles = (record) => {
        if (!record.modified) {
            return;
        }

        for (const [property, original] of record.originalStyles) {
            if (original.value) {
                record.measure.style.setProperty(
                    property,
                    original.value,
                    original.priority
                );
            } else {
                record.measure.style.removeProperty(property);
            }
        }

        record.modified = false;
        record.lastTargetWidth = 0;
    };

    const findGrid = (measure) => {
        const container = measure.nextElementSibling;

        if (!container) {
            return null;
        }

        if (container.matches?.(GRID_SELECTOR)) {
            return container;
        }

        return container.querySelector?.(GRID_SELECTOR) ?? null;
    };

    const isOptionEnabled = (computedStyle) =>
        computedStyle
            .getPropertyValue(ENABLE_PROPERTY)
            .trim() === "1";

    const synchronize = (record) => {
        const { measure, grid } = record;

        if (!measure.isConnected || !grid.isConnected) {
            return;
        }

        const computed = getComputedStyle(grid);

        if (!isOptionEnabled(computed)) {
            restoreOriginalStyles(record);
            return;
        }

        const originalTrackWidth = readTrackWidth(
            grid.style.gridTemplateColumns
        );

        const actualTrackWidth = readTrackWidth(
            computed.gridTemplateColumns
        ) || originalTrackWidth;

        const originalColumnGap = readPixelValue(
            grid.style.columnGap || grid.style.gridColumnGap
        );

        const actualColumnGap = readPixelValue(
            computed.columnGap
        );

        const originalPaddingLeft = readPixelValue(
            grid.style.paddingLeft
        );

        const originalPaddingRight = readPixelValue(
            grid.style.paddingRight
        );

        const actualPaddingLeft = readPixelValue(
            computed.paddingLeft
        );

        const actualPaddingRight = readPixelValue(
            computed.paddingRight
        );

        if (
            originalTrackWidth <= 0 ||
            actualTrackWidth <= 0 ||
            grid.clientWidth <= 0
        ) {
            return;
        }

        const availableWidth = Math.max(
            0,
            grid.clientWidth -
                actualPaddingLeft -
                actualPaddingRight
        );

        const compactPitch =
            actualTrackWidth + actualColumnGap;

        if (compactPitch <= 0) {
            return;
        }

        const desiredColumns = Math.max(
            1,
            Math.floor(
                (availableWidth + actualColumnGap) /
                    compactPitch
            )
        );

        /*
         * Steam applique :
         * floor((largeurMesuree - paddings + gap) / (largeur + gap)).
         * On choisit donc la plus petite largeur qui donne exactement le
         * nombre de colonnes que la grille compacte peut reellement contenir.
         */
        const targetMeasureWidth =
            desiredColumns *
                (originalTrackWidth + originalColumnGap) -
            originalColumnGap +
            originalPaddingLeft +
            originalPaddingRight +
            0.5;

        if (
            record.modified &&
            Math.abs(
                targetMeasureWidth - record.lastTargetWidth
            ) < 0.25
        ) {
            return;
        }

        const managedStyles = {
            position: "fixed",
            left: "-100000px",
            top: "0px",
            width: `${targetMeasureWidth}px`,
            height: "0px",
            "max-width": "none",
            "max-height": "0px",
            overflow: "hidden",
            "pointer-events": "none",
            visibility: "hidden",
            contain: "strict",
            "z-index": "-2147483648"
        };

        for (const [property, value] of Object.entries(
            managedStyles
        )) {
            measure.style.setProperty(
                property,
                value,
                "important"
            );
        }

        record.modified = true;
        record.lastTargetWidth = targetMeasureWidth;
    };

    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (observedElements.has(entry.target)) {
                scheduleRefresh();
                break;
            }
        }
    });

    const unregister = (measure) => {
        const record = records.get(measure);

        if (!record) {
            return;
        }

        restoreOriginalStyles(record);
        resizeObserver.unobserve(record.grid);
        observedElements.delete(record.grid);
        records.delete(measure);
    };

    const register = (measure, grid) => {
        const previous = records.get(measure);

        if (previous?.grid === grid) {
            return previous;
        }

        if (previous) {
            unregister(measure);
        }

        const record = {
            measure,
            grid,
            originalStyles: rememberOriginalStyles(measure),
            modified: false,
            lastTargetWidth: 0
        };

        records.set(measure, record);
        observedElements.set(grid, measure);
        resizeObserver.observe(grid);

        return record;
    };

    const refresh = () => {
        if (destroyed) {
            return;
        }

        const currentMeasures = new Set(
            document.querySelectorAll(MEASURE_SELECTOR)
        );

        for (const measure of currentMeasures) {
            const grid = findGrid(measure);

            if (grid) {
                register(measure, grid);
            } else {
                unregister(measure);
            }
        }

        for (const measure of [...records.keys()]) {
            if (!currentMeasures.has(measure)) {
                unregister(measure);
            }
        }

        for (const record of records.values()) {
            synchronize(record);
        }
    };

    function scheduleRefresh() {
        if (destroyed || refreshFrame) {
            return;
        }

        refreshFrame = requestAnimationFrame(() => {
            refreshFrame = 0;
            refresh();
        });
    }

    const containsRelevantElement = (node) => {
        if (!(node instanceof Element)) {
            return false;
        }

        if (
            node.matches(
                `${MEASURE_SELECTOR}, ${GRID_SELECTOR}, style, link[rel="stylesheet"]`
            )
        ) {
            return true;
        }

        return Boolean(
            node.querySelector(
                `${MEASURE_SELECTOR}, ${GRID_SELECTOR}`
            )
        );
    };

    const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (
                mutation.type === "attributes" &&
                mutation.target.matches?.(GRID_SELECTOR)
            ) {
                scheduleRefresh();
                return;
            }

            if (mutation.type !== "childList") {
                continue;
            }

            const changedNodes = [
                ...mutation.addedNodes,
                ...mutation.removedNodes
            ];

            if (changedNodes.some(containsRelevantElement)) {
                scheduleRefresh();
                return;
            }
        }
    });

    const destroy = () => {
        if (destroyed) {
            return;
        }

        destroyed = true;

        if (refreshFrame) {
            cancelAnimationFrame(refreshFrame);
            refreshFrame = 0;
        }

        mutationObserver.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("resize", scheduleRefresh);

        for (const record of records.values()) {
            restoreOriginalStyles(record);
        }

        records.clear();
        observedElements.clear();

        if (window[INSTALL_KEY]?.destroy === destroy) {
            delete window[INSTALL_KEY];
        }
    };

    mutationObserver.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style"]
    });

    window.addEventListener("resize", scheduleRefresh);

    window[INSTALL_KEY] = {
        version: VERSION,
        refresh: scheduleRefresh,
        destroy
    };

    scheduleRefresh();
})();
