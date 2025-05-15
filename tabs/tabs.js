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
        <p><span id="favicon-for-tab-${current}" class="favicon"> <i class="bi bi-globe-americas"></i> </span> <span id="audio-playing-from-tab-${current}" class="audioIcon" style="display: none; font-size: larger;"> <i class="bi bi-volume-up-fill"></i> </span></p>
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

    // when the webview starts loading
    webview.addEventListener("did-start-loading", () => {
        if (isNavigating) {
            document.getElementById(`favicon-for-tab-${current}`).innerHTML = `<i class="bi bi-arrow-repeat"></i>`;
            //console.log("Is loading!");
        }
    });

    webview.addEventListener("will-navigate", () => {
        document.getElementById(`favicon-for-tab-${current}`).innerHTML = `<i class="bi bi-arrow-repeat"></i>`;
        isNavigating = true;
        //console.log("Starting navigating...!");
    })

    webview.addEventListener("did-stop-loading", () => {
        isNavigating = false;
        //console.log("Done navigating!");

        // dispatch event to prevent the loading from sticking
        const event = new Event("page-favicon-updated");
        webview.dispatchEvent(event);
    });

    // when the pages favicon updates
    webview.addEventListener("page-favicon-updated", async (event) => {
        if (event.favicons && event.favicons.length > 0) {
            for (const faviconUrl of event.favicons) {
                try {
                    // attempt to fetch the favicon to validate accessibility
                    const response = await fetch(faviconUrl, {
                        method: "HEAD",
                        mode: "no-cors"
                    });

                    if (!response.ok) {
                        console.warn(`Favicon not accessible (Status ${response.status}): `, faviconUrl);
                        document.getElementById(`favicon-for-tab-${current}`).innerHTML = `<i class="bi bi-globe-americas"></i>`;
                        continue; // skip to the next favicon if this one is problematic
                    }

                    // additional content type validation
                    const contentType = response.headers.get("Content-Type");

                    if (!contentType) {
                        console.warn(`Invalid favicon content type: ${contentType} from ${faviconUrl}`);
                        document.getElementById(`favicon-for-tab-${current}`).innerHTML = `<i class="bi bi-globe-americas"></i>`;
                        continue;
                    }

                    document.getElementById(`favicon-for-tab-${current}`).innerHTML = `<img src="${faviconUrl}" draggable="false" />`;
                    //console.log("Valid favicon URL: ", faviconUrl);
                } catch (error) {
                    console.warn("Error checking favicon: ", faviconUrl, error);
                    document.getElementById(`favicon-for-tab-${current}`).innerHTML = `<i class="bi bi-globe-americas"></i>`;
                }
            }
        } else {
            //console.log("No favicon URLs found");
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