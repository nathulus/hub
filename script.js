document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const contentFrame = document.getElementById('content-frame');
    const iframePlaceholder = document.getElementById('iframe-placeholder');
    const siteList = document.getElementById('site-list');
    const refreshFrameBtn = document.getElementById('refresh-frame-btn');
    const topbarTitle = document.getElementById('current-site-title');
    const homeLink = document.getElementById('home-link');

    const appSites = [
        { name: "AppTache", url: "https://apptache.onrender.com" },
        { name: "Interface Nathan", url: "https://interface-nathan.onrender.com" },
        { name: "Bot Discord", url: "https://botdiscord-v1wr.onrender.com" },
    ];

    const infraSites = [
        { name: "Render Dashboard", url: "https://dashboard.render.com/project/prj-ctg6uk52ng1s73bdam20", description: "Hébergeur serveurs" },
        { name: "GitHub Dashboard", url: "https://github.com/dashboard", description: "Code source et gestion" },
        { name: "UptimeRobot Stats", url: "https://dashboard.uptimerobot.com/monitors", description: "Statistiques de disponibilité" },
    ];

    const localDashboardUrl = 'welcome.html';
    const localDashboardName = 'Tableau de Bord';

    const showPlaceholder = (message = "Sélectionnez une option dans le menu ou cliquez sur Accueil.") => {
        iframePlaceholder.innerHTML = `<i class="fas fa-home placeholder-icon"></i><p>${message}</p>`;
        iframePlaceholder.style.display = 'flex';
        contentFrame.style.display = 'none';
        contentFrame.src = 'about:blank';
        topbarTitle.textContent = "Mon Hub";
    };

    const showLoading = () => {
         iframePlaceholder.innerHTML = `<i class="fas fa-spinner fa-spin placeholder-icon"></i><p>Chargement...</p>`;
         iframePlaceholder.style.display = 'flex';
         contentFrame.style.display = 'none';
    }

    const showIframe = () => {
        iframePlaceholder.style.display = 'none';
        contentFrame.style.display = 'block';
    };

    const getFaviconUrl = (url) => {
        try {
             if (!url || url === '#' || url === 'about:blank') {
                 return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏠</text></svg>';
             }
             const urlObject = new URL(url);
             return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=32`;
        } catch (e) {
             console.error("Error generating favicon URL:", e);
             return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>';
        }
    };


    const loadUrlInFrame = (url, siteName = "Contenu") => {
        if (url && url !== '#') {
            console.log("[script.js] Loading URL:", url);
            topbarTitle.textContent = siteName;
            showLoading();

            if (window.location.protocol === 'https:' && url.startsWith('http:')) {
                console.warn("[script.js] Blocked loading insecure HTTP content:", url);
                alert("Impossible de charger une page HTTP non sécurisée (http://...) sur cette page sécurisée (https://...).");
                showPlaceholder("Impossible de charger le contenu non sécurisé.");
                return;
            }

             if (url === 'about:blank') {
                console.log("[script.js] Loading placeholder for about:blank link.");
                showPlaceholder(`Le lien "${siteName}" n'est pas configuré.`);
                return;
             }

            setTimeout(() => {
                try {
                    contentFrame.src = url;
                } catch (e) {
                    console.error("[script.js] Error setting iframe src:", e);
                    alert("Une erreur s'est produite lors de la tentative de chargement de l'URL.");
                    showPlaceholder("Erreur de chargement.");
                }
            }, 50);

        } else {
            console.log("[script.js] Loading placeholder (URL is blank, '#', or invalid).");
            showPlaceholder();
        }
    };

    const populateSidebar = () => {
        const dynamicLinks = siteList.querySelectorAll('li:not(:first-child):not(:last-child)');
        dynamicLinks.forEach(link => link.remove());

        const insertionPoint = siteList.querySelector('li:last-child');

        console.log("[script.js] Populating sidebar with app sites:", appSites);

        appSites.forEach(site => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.url = site.url;
            a.dataset.name = site.name;

            const img = document.createElement('img');
            img.src = getFaviconUrl(site.url);
            img.alt = `Icone ${site.name}`;
            img.classList.add('site-favicon');
            img.onerror = function() {
                 console.warn(`[script.js] Failed to load favicon for ${site.name}: ${this.src}. Using fallback.`);
                 this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>';
                 this.classList.add('favicon-fallback');
                 this.onerror = null;
            };


            a.appendChild(img);
            a.appendChild(document.createTextNode(` ${site.name}`));

            a.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = e.currentTarget.dataset.url;
                const targetName = e.currentTarget.dataset.name;
                if (targetUrl) {
                    loadUrlInFrame(targetUrl, targetName);
                }

                if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
                    sidebar.classList.add('collapsed');
                    mainContent.classList.add('full-width');
                }
            });

            li.appendChild(a);
            siteList.insertBefore(li, insertionPoint);
        });
         console.log("[script.js] Sidebar population complete.");
    };


    contentFrame.addEventListener('load', () => {
        console.log(`[script.js] Iframe load event fired. Current src: ${contentFrame.src}`);

        if (contentFrame.src && contentFrame.src !== 'about:blank') {
            try {
                 const canAccess = contentFrame.contentWindow && contentFrame.contentWindow.location.href;
                 const iframeLocation = canAccess ? contentFrame.contentWindow.location.href : ' inaccessible (cross-origin or empty)';
                 console.log(`[script.js] Iframe content location: ${iframeLocation}`);

                if (contentFrame.src.endsWith(localDashboardUrl)) {
                     console.log("[script.js] Local dashboard loaded. Sending infra sites data via postMessage.");
                     showIframe();

                     setTimeout(() => {
                         try {
                            console.log("[script.js] Sending message to iframe:", { type: 'loadInfraSites', sites: infraSites });
                            contentFrame.contentWindow.postMessage({
                                type: 'loadInfraSites',
                                sites: infraSites
                            }, '*');
                         } catch (e) {
                            console.error("[script.js] Failed to postMessage to iframe:", e);
                         }
                     }, 100);

                } else if (canAccess && contentFrame.contentWindow.location.href !== 'about:blank') {
                     console.log("[script.js] Other accessible content loaded.");
                     showIframe();
                } else {
                     console.warn("[script.js] Iframe loaded, but content access is restricted or page is blank after load. Assuming loaded.");
                     showIframe();
                }

            } catch (e) {
                console.warn("[script.js] Could not access iframe content (likely cross-origin restrictions):", contentFrame.src, e);
                 showIframe();
            }
        } else {
             if (!iframePlaceholder.textContent.includes("Chargement")) {
                 console.log("[script.js] Iframe src is about:blank, ensuring placeholder is shown.");
             }
        }
    });

    contentFrame.addEventListener('error', (e) => {
         console.error("[script.js] Iframe loading error event:", e);
         const failedUrl = contentFrame.src !== 'about:blank' ? contentFrame.src : (topbarTitle.textContent || "une page");
         showPlaceholder(`Erreur lors du chargement de ${failedUrl}.`);
     });


    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('full-width');
         console.log(`[script.js] Sidebar toggled. Collapsed: ${sidebar.classList.contains('collapsed')}`);
    });

    refreshFrameBtn.addEventListener('click', () => {
        if (contentFrame.style.display === 'block' && contentFrame.src && contentFrame.src !== 'about:blank') {
            console.log("[script.js] Refresh button clicked. Refreshing iframe:", contentFrame.src);
            const currentSrc = contentFrame.src;
            const currentName = topbarTitle.textContent;
            showLoading();
            setTimeout(() => {
                try {
                     if (contentFrame.contentWindow && contentFrame.contentWindow.location.href !== 'about:blank') {
                          contentFrame.contentWindow.location.reload();
                          console.log("[script.js] Attempting contentWindow.location.reload()");
                     } else {
                         contentFrame.src = currentSrc;
                         console.log("[script.js] Falling back to resetting iframe src to:", currentSrc);
                     }
                    topbarTitle.textContent = currentName;
                 } catch (e) {
                    console.warn("[script.js] Could not access iframe content for reload, resetting src:", e);
                    contentFrame.src = currentSrc;
                    topbarTitle.textContent = currentName;
                 }
            }, 50);
        } else {
            console.log("[script.js] Nothing to refresh or iframe not visible.");
        }
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("[script.js] Home link clicked.");
        loadUrlInFrame(localDashboardUrl, localDashboardName);

        if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('full-width');
        }
    });

    window.addEventListener('message', (event) => {
        const message = event.data;
        console.log("[script.js] Message received from iframe:", message);

        if (message.type === 'navigateToUrl' && message.url) {
            console.log("[script.js] Received navigation request from iframe:", message.url);
            loadUrlInFrame(message.url, message.name || "Contenu Externe");

             if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('full-width');
             }
        }
    });


    const initializeLayout = () => {
        console.log("[script.js] Initializing layout...");
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('full-width');
             console.log("[script.js] Mobile layout applied: sidebar collapsed.");
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('full-width');
             console.log("[script.js] Desktop layout applied: sidebar expanded.");
        }

        loadUrlInFrame(localDashboardUrl, localDashboardName);
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("[script.js] Window resized.");
            const isMobile = window.innerWidth <= 768;

            if (!isMobile) {
                 if (!sidebar.classList.contains('collapsed')) {
                    mainContent.classList.remove('full-width');
                 }
            } else {
                 if (!sidebar.classList.contains('collapsed')) {
                    sidebar.classList.add('collapsed');
                 }
                 mainContent.classList.add('full-width');
            }
        }, 150);
    });

    populateSidebar();
    initializeLayout();
    console.log("[script.js] DOMContentLoaded finished.");
});