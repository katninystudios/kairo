let tabs = 0; // keep count of tabs, used to associate webviews with tabs

// this is where all the tabs logic is
function createTab(switchTo, type, url) {
    // increment, then keep track
    tabs++;
    const current = tabs;

    // keep track of if a webview is loading a new page
    let isNavigating = true;

    // create webview
    const webview = document.createElement("webview");
    if (url) {
        webview.setAttribute("src", url);
    } else {
        webview.setAttribute("src", "https://start.duckduckgo.com/");
    }
    webview.setAttribute("allowpopups", "");
    webview.setAttribute("view", current);
    webview.setAttribute("preload", "ui/webviewPreload.js");
    webview.classList.add("hidden");  

    // if switch to, then hide the current webview
    // and mark this one as the one to switch to
    if (switchTo === true) {
        webview.classList.remove("hidden");
        webview.classList.add("visible");

        // get visible webview
        const visibleWebview = document.querySelectorAll("webview.visible");
        
        // then mark it as hidden
        visibleWebview.forEach(webview => {
            webview.classList.add("hidden");
            webview.classList.remove("visible");

            // get the tab that it belongs to
            const viewId = webview.getAttribute("view");
            const matchingTab = document.querySelector(`.tab[associated-with-view="${viewId}"]`);
            matchingTab.classList.remove("active");
        });
    }

    // then append webview
    document.getElementById("webviewContainer").appendChild(webview);

    // now, create tab
    const tab = document.createElement("div");
    tab.classList.add("tab");
    if (switchTo) {
        tab.classList.add("active");
    }
    tab.setAttribute("associated-with-view", current);
    tab.innerHTML = `
        <p><span id="favicon-for-tab-${current}" class="favicon"> </span> <span id="audio-playing-from-tab-${current}" class="audioIcon" style="display: none; font-size: larger;"> <i class="bi bi-volume-up-fill"></i> </span></p>
    `;

    const tabTitle = document.createElement("span");
    tabTitle.textContent = "Loading...";
    tabTitle.classList.add("title");
    tab.appendChild(tabTitle);
    
    document.getElementById("tabs").appendChild(tab);

    // now, associate event listeners
    // when the user wants to switch a tab
    tab.addEventListener("click", (event) => {
        const associatedViewNum = tab.getAttribute("associated-with-view");
        const associatedView = document.querySelector(`webview[view="${associatedViewNum}"]`);
        const visibleWebview = document.querySelectorAll("webview.visible");
        
        // then mark it as hidden
        visibleWebview.forEach(webview => {
            webview.classList.add("hidden");
            webview.classList.remove("visible");

            // get the tab that it belongs to
            const viewId = webview.getAttribute("view");
            const matchingTab = document.querySelector(`.tab[associated-with-view="${viewId}"]`);
            matchingTab.classList.remove("active");
        });

        tab.classList.add("active");

        // change URL to current webviews
        parseURL(webview.getURL());

        associatedView.classList.add("visible");
    });

    // when the pages title updates
    webview.addEventListener("page-title-updated", () => {
        tabTitle.textContent = webview.getTitle();

        const event = new Event("did-navigate");
        webview.dispatchEvent(event);
    });

    // when a webview starts playing audio
    setTimeout(() => {
        setInterval(() => {
            if (webview.isCurrentlyAudible()) {
                document.getElementById(`audio-playing-from-tab-${current}`).style.display = "inline-flex";
            } else {
                document.getElementById(`audio-playing-from-tab-${current}`).style.display = "none";
            }
        }, 50);
    }, 50);

    let lastFaviconUrl = null;
    let faviconLoaded = false;

    function setFaviconSpinner() {
        const faviconEl = document.getElementById(`favicon-for-tab-${current}`);
        faviconEl.innerHTML = `<div class="faviconSpinner"></div>`;
        faviconLoaded = false;
    }

    webview.addEventListener("will-navigate", () => {
        setFaviconSpinner();
        isNavigating = true;
    });

    webview.addEventListener("did-start-loading", () => {
        if (isNavigating) setFaviconSpinner();
    });

    webview.addEventListener("did-stop-loading", () => {
        isNavigating = false;
        const event = new Event("page-favicon-updated");
        webview.dispatchEvent(event);
    });

    webview.addEventListener("page-favicon-updated", (event) => {
        const faviconEl = document.getElementById(`favicon-for-tab-${current}`);

        if (event.favicons && event.favicons.length > 0) {
            for (const faviconUrl of event.favicons) {
                if (faviconUrl === lastFaviconUrl) continue;

                const img = new Image();
                img.src = faviconUrl;
                img.draggable = false;

                img.onload = () => {
                    faviconEl.innerHTML = "";
                    faviconEl.appendChild(img);
                    lastFaviconUrl = faviconUrl;
                    faviconLoaded = true; // favicon successfully loaded
                };

                img.onerror = () => {
                    // fallback only if no favicon has ever loaded
                    if (!faviconLoaded && !lastFaviconUrl) {
                        faviconEl.innerHTML = ``;
                    }
                };

                break; // only try the first new favicon
            }
        } else if (!faviconLoaded && !lastFaviconUrl) {
            faviconEl.innerHTML = ``;
        }
    });

    // when the page link updates
    webview.addEventListener("did-navigate", () => {
        if (webview.classList.contains("visible")) {
            parseURL(webview.getURL());
        }
    });

    // detect when a link is hovered
    let clearTextTimeout;
    webview.addEventListener("ipc-message", (event) => {
        const linkStatus = document.getElementById("linkStatus");

        if (event.channel === "link-hover" && linkStatus) {
            clearTimeout(clearTextTimeout);
            linkStatus.textContent = event.args[0];
            linkStatus.style.opacity = "1";
        } else if (event.channel === "link-unhover" && linkStatus) {
            linkStatus.style.opacity = "0";
            clearTextTimeout = setTimeout(() => {
                linkStatus.textContent = "";
            }, 500);
        }
    });
}