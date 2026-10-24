/* Minimal Dark — Capsule Glow (library shelves only) */
(() => {
    'use strict';

    const key = '__minimalDarkCapsuleGlow';
    window[key]?.dispose?.();

    const shelfClass = 'minimal-dark-capsule-glow-shelf';
    const layerClass = 'minimal-dark-capsule-glow-layer';
    const activeClass = 'minimal-dark-capsule-glow-active';
    const xName = '--minimal-dark-capsule-glow-x';
    const yName = '--minimal-dark-capsule-glow-y';

    const layers = new Map();
    const fadeTimers = new Map();

    let active = null;
    let frame = 0;
    let glowX = 0;
    let glowY = 0;
    let lastX = null;
    let lastY = null;

    const clamp = (n, min, max) =>
        Math.max(min, Math.min(max, n));

    function find(target) {
        if (!(target instanceof Element)) return null;

        const card = target.closest('.LibraryItemBox');

        if (!card || (
			!card.closest('.BoxCarouselContents') &&
			!card.classList.contains('InCollection')
		)) return null;

        const shelf = card.closest('.ShowcaseOuter');
        if (!shelf) return null;

        const image = card.querySelector(
            '.PortraitImage img, .LandscapeImage img, .Container img[role="presentation"]'
        );

        const url = image?.currentSrc || image?.getAttribute('src');

        return url ? { card, shelf, url } : null;
    }

    function layerFor(shelf) {
        if (!layers.has(shelf)) {
            const layer = document.createElement('div');

            layer.className = layerClass;
            layer.setAttribute('aria-hidden', 'true');

            shelf.appendChild(layer);
            layers.set(shelf, layer);
        }

        return layers.get(shelf);
    }

    function position(entry) {
        const rect = entry.card.getBoundingClientRect();
        const shelfRect = entry.shelf.getBoundingClientRect();
        const layer = layerFor(entry.shelf);

        layer.style.left = `${rect.left - shelfRect.left}px`;
        layer.style.top = `${rect.top - shelfRect.top}px`;
        layer.style.width = `${rect.width}px`;
        layer.style.height = `${rect.height}px`;

        layer.style.setProperty(
            xName,
            `${glowX.toFixed(1)}px`
        );

        layer.style.setProperty(
            yName,
            `${glowY.toFixed(1)}px`
        );
    }

    function hide(entry) {
        const layer = layers.get(entry.shelf);
        if (!layer) return;

        layer.classList.remove(activeClass);

        clearTimeout(fadeTimers.get(entry.shelf));

        fadeTimers.set(
            entry.shelf,
            setTimeout(() => {
                if (active?.shelf !== entry.shelf) {
                    entry.shelf.classList.remove(shelfClass);
                }

                fadeTimers.delete(entry.shelf);
            }, 450)
        );
    }

    function show(next) {
        if (active?.card === next.card) return;

        if (active && active.shelf !== next.shelf) {
            hide(active);
        }

        active = next;

        clearTimeout(fadeTimers.get(next.shelf));
        fadeTimers.delete(next.shelf);

        const layer = layerFor(next.shelf);

        next.shelf.classList.add(shelfClass);

        layer.style.backgroundImage =
            `url(${JSON.stringify(next.url)})`;

        position(next);

        /* Keep the glow continuous between capsules. */
        if (!layer.classList.contains(activeClass)) {
            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                if (active?.card === next.card) {
                    layer.classList.add(activeClass);
                }
            });
        }
    }

    function over(event) {
        const next = find(event.target);

        if (next) show(next);
    }

    function out(event) {
        if (!active || !active.card.contains(event.target)) {
            return;
        }

        if (
            event.relatedTarget instanceof Node &&
            active.card.contains(event.relatedTarget)
        ) {
            return;
        }

        const next = find(event.relatedTarget);

        if (next) {
            show(next);
        } else {
            cancelAnimationFrame(frame);
            hide(active);
            active = null;
        }
    }

    /* Continuous mouse tracking. */
    function move(event) {
        const dx = lastX === null
            ? 0
            : event.clientX - lastX;

        const dy = lastY === null
            ? 0
            : event.clientY - lastY;

        lastX = event.clientX;
        lastY = event.clientY;

        if (!active || !active.card.contains(event.target)) {
            return;
        }

        glowX = clamp(glowX + dx * .12, -16, 16);
        glowY = clamp(glowY + dy * .10, -12, 12);

        position(active);
    }

    function refreshPosition() {
        if (active?.card.isConnected) {
            position(active);
        }
    }

    document.addEventListener('mouseover', over, true);
    document.addEventListener('mouseout', out, true);
    document.addEventListener('mousemove', move, true);

    window.addEventListener('scroll', refreshPosition, true);
    window.addEventListener('resize', refreshPosition);

    window[key] = {
        dispose() {
            document.removeEventListener('mouseover', over, true);
            document.removeEventListener('mouseout', out, true);
            document.removeEventListener('mousemove', move, true);

            window.removeEventListener('scroll', refreshPosition, true);
            window.removeEventListener('resize', refreshPosition);

            cancelAnimationFrame(frame);

            for (const timer of fadeTimers.values()) {
                clearTimeout(timer);
            }

            for (const [shelf, layer] of layers) {
                shelf.classList.remove(shelfClass);
                layer.remove();
            }

            layers.clear();
            fadeTimers.clear();
            active = null;
        }
    };

    console.info('[Minimal Dark] Capsule Glow script loaded');
})();
