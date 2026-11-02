/* Aperçu des options existantes */
(() => {
    'use strict';
    if (window.__mdOptionsPreviewLoaded) return;
    window.__mdOptionsPreviewLoaded = true;

    const README = 'https://raw.githubusercontent.com/SaiyajinK/Minimal-Dark-for-Steam/root/README.md';
    const EDITOR = '.MillenniumDesktopSidebar_Editor[data-theme-name="Minimal Dark"]';
    const previews = new Map();

    const EYE_NORMAL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGYElEQVR4nO2cW4iVVRSAP+/mDbIszYSwjC5mF7UIAjUfiqTeMg2dhyC6UWJXqBd7SRELKzI1LRBUpJeiy4sY1ISX6UoKWVLWlJYOqOVocxxtYscaOAzov/a/9n/Of2bWBxsOZ87svfb697/2XmuvvcFxHMdxHMdxHMdxHMdxHMdxHKd+DAKmAk3AS8AWoBn4ETgCHAO6pByT736Q32yR/1kodYS6nAz6AzcDS4BPgRNVCraWE1LnEmkjtOUI04FXgT8TKjyr/AGsBKbRRwkj8G5gew2VfrbytZi5gfQBBktnvy+B4rt6lJ+ARcAweilhxO8vgaK7MsrvMkh6DZcDH5VAsV2RZRtwNQ1u518AOkqgzK6c5R/g+UZcNV0MbE2ggFMyUa8FngLmANcBE4HzZU4ZLJ8nyt/myG/XAJ8DlQRyhL5cRIMwEzho6Gwr8DJwFzAigTzDgTuA5cY56KD0rdQ8ApzO0bkOYAMwu+DXvR8wA3gbOJlDztPSx1LyXI4OtYsTdmkd5B0jnvHRHHIvo0QMEBsd04EzYqMvrLfwMn+EQdAZ2Yc10ve60l9MR4zgX5Q0BDBFAnkxfdlQ7xXSK5H2c1nJI5P9xBuOWTm9US9hl0YIeQC4jcZhGvBzRP+CLmrKwxHCfQmMT9DmKGA+8BbQAhwWP+GUfG6RuWgeMDLRJB1jkoJOasIM6bRGqPcTBLeuBNZH7g+E364DJhnbDk7eRmWbp0Q3hXIZ0KYUaLPR3p8HrMixOumplOCADTXI0T9ilXdYdFQIg+Q1164OLEu0ScBug+J7lh3AOOPkvErZ1q6iFhpLI8yOZXPjRhlJXYnLb7LUtLwJm5Vthf3opMwS50kz0oLpsIz8wwUov/ohjDXIF0b2J4p2zojOkjBMdouyGj1kDCkMBb4tUPnVqzLLILlAGdT7JVEw8f/IZFZjnQkihStqoPzu8qJR1luU+xxBdyamKqObIf5uXWp2KpX3nXir10qoebh8XhQxcR83miKtLxR0d5Nl5tc4Iu/Jby2sV7TTIaHgc8Vewt8eVYYSwqrGimZSbs6rn/sUlR81Lu+6PdwTCuXHTGq3Kx5CewIbPUbpF82NrTgsI/cpKn4AO/MLcvMfU9QbBpmVBYp29sUuzZuU+6RW04PEdrJsfp6Qb3AE9yhi+in4WKGvphjB92ZU1pkwZaMlo60nDHUvVvgtKZioMHnqt+B+xdN8k3S0ZbR1jaHuyQrfJRWvK/QWdGsekSmWcNVUMtqzTJQjFZN7KsKE/FdGe19pKtqleAAh76cRHsCoGj6AkDf0d0Z7O1OZoNcSCt7WS0zQmlQmSDMJhzj7FYkEb8loK3i4eXmyRpPwVQpPPmopqlmGfphI+LUZ7ezOubegWYauTiB/P2WEtKkIR0z1SmUwT9FOCC/E8rii3nsTyP9gEY6YNhTRliC5aqQiFFGR8IKW2TUKRYzvcVgwWSgiJhi3CTvrFO1UJLxwLnM0QEa+JhgXTJ+FoJ8PigzGxYSjHzJ2ZlJEpsUe8XAnywgeIZ8XK2x+9cMM3quFZ4sOR8dsyHTI8U8Ly5XKS1GsiVSzlQPTvCETsyXZKt6gZUtyRw2UHw58DDHIOUG5b51sSzJmU36bMSVjnGycF6X8VmMYZZgkF9d0Uz42LWWTMWN4SkEPoVWOMOVlkDLsXEhaSmxi1irjXsHYxOZou3HkD4jICSosMSs2NXGt8U0YItkL7QbFV2Q0Wmx+UOa7ZUhNzJOcu1ESXC2MlTcq5kG0S3DMutQcrlzr1yw5N096erNxddTNCPHOV0tY95CM8Ip83ikbRXMTrT7CauebMqan5zmgsb+kx5LOxky5UaW0BzTyHFHqlFOJdT/Ydg4GioynG+GIUt5Des3GLOWiuFWurmmoQ3p5j6l2yq7a6HoLL87fO8C/jXhM1XpQ+7ic0b2kDvJOkLZPNvpB7RRXFZyUUTir4Fc6jNg7xVuv9LarClJd1vFr4ss6QmbEPWLyDvT2yzqKvK7mabl163pxsEZXXVczWr67QZT9jGzy7DIe8mvI62q68QubSoJfWVYS/NK+EuDXVpYEv7i1ZFcXr4wMfllLn7+6+GxvxfQaXN49vdFXNbVioOTULKy6vv4zSRw+0uOut6Py3V75Tff19Qukjj5rXhzHcRzHcRzHcRzHcRzHcRzHoe78B9vwu9kh8wHjAAAAAElFTkSuQmCC';

    const EYE_HOVER = 'data:image/png;base64,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';

    const normalize = text => (text || '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s*:\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const DB_NAME = 'MinimalDarkOptionsPreviewCache';
    const DB_VERSION = 1;
    const cachedSources = new Map();
    const objectUrls = new Set();
    const attemptedDownloads = new Set();
    let corsProbe = null;

    const database = new Promise(resolve => {
        if (!window.indexedDB) return resolve(null);
        try {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('images')) db.createObjectStore('images');
                if (!db.objectStoreNames.contains('metadata')) db.createObjectStore('metadata');
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
            request.onblocked = () => resolve(null);
        } catch (error) {
            resolve(null);
        }
    });

    async function readCache(storeName, key) {
        const db = await database;
        if (!db) return null;
        return new Promise(resolve => {
            try {
                const request = db.transaction(storeName, 'readonly')
                    .objectStore(storeName).get(key);
                request.onsuccess = () => resolve(request.result ?? null);
                request.onerror = () => resolve(null);
            } catch (error) {
                resolve(null);
            }
        });
    }

    async function writeCache(storeName, key, value) {
        const db = await database;
        if (!db) return false;
        return new Promise(resolve => {
            try {
                const transaction = db.transaction(storeName, 'readwrite');
                transaction.objectStore(storeName).put(value, key);
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => resolve(false);
                transaction.onabort = () => resolve(false);
            } catch (error) {
                resolve(false);
            }
        });
    }

    function blobUrl(blob) {
        const url = URL.createObjectURL(blob);
        objectUrls.add(url);
        return url;
    }

    function cachedImageSource(url) {
        if (!cachedSources.has(url)) {
            cachedSources.set(url, readCache('images', url).then(blob =>
                blob instanceof Blob && blob.size && blob.type.startsWith('image/')
                    ? blobUrl(blob)
                    : null
            ));
        }
        return cachedSources.get(url);
    }

    async function downloadImage(url) {
        const response = await fetch(url, { credentials: 'omit' });
        if (!response.ok || response.type === 'opaque') throw new Error('Réponse inaccessible');
        const blob = await response.blob();
        if (!blob.size || !blob.type.startsWith('image/')) throw new Error('Fichier non reconnu comme image');
        if (!await writeCache('images', url, blob)) {
            throw new Error('Écriture du cache IndexedDB refusée');
        }
    }

    function persistImage(url) {
        if (attemptedDownloads.has(url)) return;
        attemptedDownloads.add(url);

        if (!corsProbe) {
            corsProbe = downloadImage(url).then(
                () => true,
                error => {
                    console.warn('[Minimal Dark] Cache d’images hors ligne indisponible depuis GitHub (CORS possible). Les images restent affichables en ligne.', error);
                    return false;
                }
            );
            return;
        }

        corsProbe.then(allowed => {
            if (allowed) downloadImage(url).catch(error =>
                console.warn('[Minimal Dark] Image non enregistrée en cache :', url, error)
            );
        });
    }

    function loadPreviewImage(img, url) {
        img.classList.add('md-preview-loading');
        img.addEventListener('load', () => {
            img.classList.remove('md-preview-loading');
            if (img.naturalWidth && img.naturalHeight && (
                img.naturalHeight / img.naturalWidth > 1.7 ||
                img.naturalWidth / img.naturalHeight > 3 ||
                img.naturalHeight > 650
            )) {
                img.classList.add('md-preview-compact');
            }
            schedulePositionForImage?.();
        });
        img.addEventListener('error', () => {
            img.classList.add('md-preview-loading');
            schedulePositionForImage?.();
        });

        cachedImageSource(url).then(source => {
            if (source) {
                img.src = source;
            } else {
                img.addEventListener('load', () => persistImage(url), { once: true });
                img.src = url;
            }
        });
    }

    let schedulePositionForImage = null;

    window.addEventListener('pagehide', () => {
        objectUrls.forEach(url => URL.revokeObjectURL(url));
        objectUrls.clear();
    });

    function init() {
        const style = document.createElement('style');
        style.id = 'md-options-preview-style';
        style.textContent = `
            ${EDITOR} [data-condition].md-preview-row {
                position: relative;
                padding-left: 52px !important;
                box-sizing: border-box;
            }
            .md-preview-eye {
                position: absolute;
                left: 2px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 25px;
                padding: 0;
                border: 0;
                background: transparent;
                cursor: pointer;
            }
            .md-preview-eye:focus-visible {
                outline: none;
            }
            .md-preview-eye .md-eye-default, .md-preview-eye .md-eye-hover {
                position: absolute;
                width: 17px;
                height: 17px;
                pointer-events: none;
                -webkit-mask-image: var(--md-eye-mask);
                mask-image: var(--md-eye-mask);
                -webkit-mask-position: center;
                mask-position: center;
                -webkit-mask-size: contain;
                mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                transition: opacity .25s ease-out;
            }
            .md-preview-eye .md-eye-default {
                background-color: #dcdedf;
                opacity: 1;
            }
            .md-preview-eye .md-eye-hover {
                background-color: var(--minimal_dark_color, #1a9fff);
                opacity: 0;
            }
            .md-preview-eye:hover .md-eye-default, .md-preview-eye:focus-visible .md-eye-default {
                opacity: 0;
            }
            .md-preview-eye:hover .md-eye-hover, .md-preview-eye:focus-visible .md-eye-hover {
                opacity: 1;
            }
            #md-options-preview-popup {
                position: fixed;
                display: none;
                z-index: 2147483647;
                width: max-content;
                max-width: min(480px, calc(100vw - 16px));
                max-height: calc(100vh - 16px);
                box-sizing: border-box;
                overflow: auto;
                padding: 11px;
                border: 1px solid var(--minimal_dark_be_grey);
                border-radius: var(--minimal_dark_corner);
                background-color: #121212ad;
                backdrop-filter: blur(8px);
                color: #c7d5e0;
                box-shadow: 0 9px 28px #000a;
                font: 12px Arial, sans-serif;
            }
            #md-options-preview-popup .md-preview-title {
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 8px;
                color: var(--minimal_dark_color);
            }
            #md-options-preview-popup .md-preview-label {
                color: var(--minimal_dark_topgrey);
                margin: 9px 0 4px;
            }
            #md-options-preview-popup img {
                display: block;
                width: auto;
                max-width: 100%;
                height: auto;
                box-sizing: border-box;
                border: 1px solid var(--minimal_dark_be_grey);
                border-radius: var(--minimal_dark_corner);
                cursor: zoom-in !important;
            }
            #md-options-preview-popup img.md-preview-loading {
                display: none;
            }
            #md-options-preview-popup img.md-preview-compact {
                max-height: 260px;
                object-fit: contain;
            }
            #md-options-preview-lightbox {
                position: fixed;
                inset: 0;
                display: none;
                z-index: 2147483647;
                overflow: auto;
                box-sizing: border-box;
                padding: 24px;
                background: #121212e8;
                backdrop-filter: blur(8px);
                cursor: zoom-out;
            }
            #md-options-preview-lightbox img {
                display: block;
                flex: none;
                width: auto;
                max-width: none;
                height: auto;
                max-height: none;
                margin: auto;
                border: 1px solid var(--minimal_dark_be_grey);
                border-radius: var(--minimal_dark_corner);
                cursor: zoom-out !important;
            }
        `;
        document.head.appendChild(style);

        const popup = document.createElement('div');
        popup.id = 'md-options-preview-popup';
        document.body.appendChild(popup);
        const previewPanels = new Map();

        const lightbox = document.createElement('div');
        lightbox.id = 'md-options-preview-lightbox';
        const fullImage = document.createElement('img');
        lightbox.appendChild(fullImage);
        document.body.appendChild(lightbox);

        let active = null, timer;
        let positionQueued = false;
        let draggingPopup = false;

        const ZOOM_OPEN_DURATION = 320;
        const ZOOM_CLOSE_DURATION = 260;
        const ZOOM_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
        let zoomAnimating = false;
        let zoomOrigin = null;

        const cancelHide = () => clearTimeout(timer);
        const hide = () => {
            cancelHide();
            popup.style.display = 'none';
            active = null;
        };
        const delayHide = () => {
            cancelHide();
            if (lightbox.style.display === 'flex' || zoomAnimating || draggingPopup) return;
            timer = setTimeout(hide, 150);
        };

        function zoomTransform(from, to) {
            if (!from || !to || !to.width || !to.height) return 'none';

            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const scaleX = from.width / to.width;
            const scaleY = from.height / to.height;

            return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
        }

        function completeAnimations(animations, callback) {
            Promise.all(animations.map(animation =>
                animation.finished.catch(() => {})
            )).then(() => {
                animations.forEach(animation => animation.cancel());
                callback();
            });
        }

        function closeFull() {
            if (lightbox.style.display !== 'flex' || zoomAnimating) return;

            zoomAnimating = true;

            const imageRect = fullImage.getBoundingClientRect();
            const hasScrolled = lightbox.scrollTop > 0 || lightbox.scrollLeft > 0;
            const canReturn = zoomOrigin && !hasScrolled;

            const imageAnimation = fullImage.animate(
                canReturn ? [
                    { transform: 'none', opacity: 1 },
                    { transform: zoomTransform(zoomOrigin, imageRect), opacity: .8 }
                ] : [
                    { transform: 'scale(1)', opacity: 1 },
                    { transform: 'scale(.96)', opacity: 0 }
                ],
                {
                    duration: ZOOM_CLOSE_DURATION,
                    easing: ZOOM_EASING,
                    fill: 'forwards'
                }
            );

            const overlayAnimation = lightbox.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: ZOOM_CLOSE_DURATION,
                easing: 'ease-out',
                fill: 'forwards'
            });

            completeAnimations([imageAnimation, overlayAnimation], () => {
                lightbox.style.display = 'none';
                fullImage.removeAttribute('src');
                fullImage.style.removeProperty('width');
                fullImage.style.removeProperty('height');
                zoomOrigin = null;
                zoomAnimating = false;
            });
        }

        function openFull(img) {
            if (!img.src || !img.naturalWidth || !img.naturalHeight ||
                zoomAnimating || lightbox.style.display === 'flex') return;

            zoomAnimating = true;
            zoomOrigin = img.getBoundingClientRect();

            cancelHide();

            fullImage.src = img.currentSrc || img.src;
            fullImage.alt = img.alt;
            fullImage.style.width = `${img.naturalWidth}px`;
            fullImage.style.height = `${img.naturalHeight}px`;

            lightbox.style.display = 'flex';
            lightbox.scrollTop = 0;
            lightbox.scrollLeft = 0;

            const targetRect = fullImage.getBoundingClientRect();
            const fromTransform = zoomTransform(zoomOrigin, targetRect);

            const imageAnimation = fullImage.animate([
                { transform: fromTransform, opacity: .85 },
                { transform: 'none', opacity: 1 }
            ], {
                duration: ZOOM_OPEN_DURATION,
                easing: ZOOM_EASING,
                fill: 'forwards'
            });

            const overlayAnimation = lightbox.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: ZOOM_OPEN_DURATION,
                easing: 'ease-out',
                fill: 'forwards'
            });

            completeAnimations([imageAnimation, overlayAnimation], () => {
                zoomAnimating = false;
            });
        }

        lightbox.addEventListener('click', event => {
            if (event.target === lightbox || event.target === fullImage) closeFull();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && lightbox.style.display === 'flex') closeFull();
        });

        popup.addEventListener('pointerenter', cancelHide);
        popup.addEventListener('pointerdown', () => {
            draggingPopup = true;
            cancelHide();
        });
        popup.addEventListener('pointerleave', event => {
            if (event.buttons) {
                draggingPopup = true;
                cancelHide();
                return;
            }
            delayHide();
        });

        const finishPopupDrag = () => {
            if (!draggingPopup) return;
            draggingPopup = false;
            if (popup.matches(':hover') || active?.matches(':hover')) {
                cancelHide();
            } else {
                delayHide();
            }
        };

        document.addEventListener('pointerup', finishPopupDrag, true);
        document.addEventListener('pointercancel', finishPopupDrag, true);

        document.addEventListener('wheel', event => {
            if (!active || popup.style.display === 'none') return;
            if (!popup.contains(event.target) && !active.contains(event.target)) return;

            event.preventDefault();
            event.stopPropagation();

            const unit = event.deltaMode === 1 ? 16 :
                event.deltaMode === 2 ? popup.clientHeight : 1;

            popup.scrollTop += event.deltaY * unit;
            popup.scrollLeft += event.deltaX * unit;
        }, { capture: true, passive: false });

        function positionPopup() {
            if (!active || popup.style.display === 'none') return;

            const margin = 8;
            const gap = 12;
            const rect = active.getBoundingClientRect();
            const bounds = popup.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const spaceRight = viewportWidth - rect.right - margin;
            const spaceLeft = rect.left - margin;

            let left;
            if (spaceRight >= bounds.width + gap) {
                left = rect.right + gap;
            } else if (spaceLeft >= bounds.width + gap) {
                left = rect.left - bounds.width - gap;
            } else if (spaceRight >= spaceLeft) {
                left = rect.right + gap;
            } else {
                left = rect.left - bounds.width - gap;
            }

            left = Math.max(margin, Math.min(left, viewportWidth - bounds.width - margin));
            let top = rect.top + (rect.height - bounds.height) / 2;
            top = Math.max(margin, Math.min(top, viewportHeight - bounds.height - margin));
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
        }

        function schedulePosition() {
            if (positionQueued || !active) return;
            positionQueued = true;
            requestAnimationFrame(() => {
                positionQueued = false;
                positionPopup();
            });
        }

        new ResizeObserver(schedulePosition).observe(popup);
        window.addEventListener('resize', schedulePosition);
        schedulePositionForImage = schedulePosition;

        function getPreviewPanel(name, images) {
            const key = normalize(name);
            const signature = JSON.stringify(images);
            const existing = previewPanels.get(key);
            if (existing?.signature === signature) return existing.panel;

            const panel = document.createElement('div');
            const title = document.createElement('div');
            title.className = 'md-preview-title';
            title.textContent = name;
            panel.append(title);

            for (const entry of images) {
                const label = document.createElement('div');
                label.className = 'md-preview-label';
                label.textContent = entry.label;

                const img = document.createElement('img');
                img.alt = `${name} – ${entry.label}`;
                img.loading = 'eager';
                img.addEventListener('click', () => openFull(img));
                panel.append(label, img);
                loadPreviewImage(img, entry.url);
            }

            previewPanels.set(key, { signature, panel });
            return panel;
        }

        function show(eye, name, images) {
            if (!images?.length) return;
            cancelHide();
            active = eye;
            popup.replaceChildren(getPreviewPanel(name, images));
            popup.style.left = '8px';
            popup.style.top = '8px';
            popup.style.display = 'block';
            positionPopup();
            schedulePosition();
        }

        function ensureEyeHoverColor(hoverEye) {
            const isTransparent = color => !color || color === 'transparent' ||
                /^rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(color) ||
                /^color\([^)]*\/\s*0(?:\.0+)?\)$/.test(color);

            hoverEye.style.removeProperty('background-color');

            if (!isTransparent(getComputedStyle(hoverEye).backgroundColor)) return;

            hoverEye.style.backgroundColor = 'var(--SystemAccentColor, #1a9fff)';

            if (isTransparent(getComputedStyle(hoverEye).backgroundColor)) {
                hoverEye.style.backgroundColor = '#1a9fff';
            }
        }

        function refresh() {
            document.querySelectorAll(`${EDITOR} [data-condition]`).forEach(row => {
                const name = row.getAttribute('data-condition') || '';
                const images = previews.get(normalize(name));
                if (!images?.length || row.querySelector('.md-preview-eye')) return;

                const eye = document.createElement('button');
                eye.type = 'button';
                eye.className = 'md-preview-eye';
                eye.title = '';
                eye.setAttribute('aria-label', `Preview ${name}`);

                const defaultEye = document.createElement('span');
                defaultEye.className = 'md-eye-default';
                defaultEye.style.setProperty('--md-eye-mask', `url("${EYE_NORMAL}")`);

                const hoverEye = document.createElement('span');
                hoverEye.className = 'md-eye-hover';
                hoverEye.style.setProperty('--md-eye-mask', `url("${EYE_HOVER}")`);

                eye.append(defaultEye, hoverEye);

                eye.addEventListener('pointerenter', () => {
                    ensureEyeHoverColor(hoverEye);
                    show(eye, name, previews.get(normalize(name)));
                });
                eye.addEventListener('pointerleave', delayHide);
                eye.addEventListener('focus', () => {
                    ensureEyeHoverColor(hoverEye);
                    show(eye, name, previews.get(normalize(name)));
                });
                eye.addEventListener('blur', delayHide);
                eye.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();
                });

                row.classList.add('md-preview-row');
                row.prepend(eye);

                ensureEyeHoverColor(hoverEye);
            });

            if (active && !active.isConnected) hide();
        }

        function readReadme(markdown) {
            const found = new Map();
            const sections = markdown.matchAll(
                /<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>/gi
            );

            for (const section of sections) {
                const start = section.index + section[0].length;
                const end = markdown.indexOf('</details>', start);
                if (end < 0) continue;

                const name = normalize(section[1]);
                const content = markdown.slice(start, end);
                const images = [];
                let previous = 0;
                const imgRegex = /<img\b[^>]*\bsrc=["'](https:\/\/github\.com\/user-attachments\/assets\/[^"']+)["'][^>]*>/gi;

                for (const match of content.matchAll(imgRegex)) {
                    const prefix = content.slice(previous, match.index);
                    const labels = [...prefix.matchAll(/_([^_\n]+)_\s*:/g)];
                    images.push({
                        label: labels.at(-1)?.[1]?.trim() || `Preview ${images.length + 1}`,
                        url: match[1]
                    });
                    previous = match.index + match[0].length;
                }
                if (images.length) found.set(name, images);
            }
            return found;
        }

        let queued = false;
        new MutationObserver(() => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                refresh();
            });
        }).observe(document.body, { childList: true, subtree: true });

        document.addEventListener('scroll', event => {
            if (!active) return;
            if (event.target === popup || popup.contains(event.target)) return;
            if (event.target === lightbox || lightbox.contains(event.target)) return;
            if (draggingPopup) return;
            hide();
        }, true);

        refresh();

        (async () => {
            const saved = await readCache('metadata', 'readme-previews');
            if (Array.isArray(saved)) {
                for (const [name, images] of saved) {
                    if (typeof name === 'string' && Array.isArray(images)) previews.set(name, images);
                }
                refresh();
            }

            try {
                const response = await fetch(README, { credentials: 'omit', cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const found = readReadme(await response.text());
                for (const [name, images] of found) previews.set(name, images);
                if (found.size) await writeCache('metadata', 'readme-previews', [...found]);
                refresh();
            } catch (error) {
                console.warn('[Minimal Dark] README indisponible ; utilisation des correspondances en cache :', error);
            }
        })();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
