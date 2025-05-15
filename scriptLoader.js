// if a script is used on every page, we can call it here
// as a "dependency"

// copied from https://github.com/katniny/transsocial/blob/main/assets/js/requiredScripts.js
function loadScript(src, async) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = async;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

async function loadAllScripts() {
    try {
        await loadScript("tabs/newTabRequested.js", false);
        await loadScript("tabs/tabs.js", false);
        await loadScript("tabs/parseUrl.js", false);
        await loadScript("tabs/sendToUrl.js", false);
        await loadScript("urls/validate.js", false);
        await loadScript("urlBar/suggestions.js", false);

        // finished!
        console.log("Scripts loaded successfully.");
        document.dispatchEvent(new Event("scriptsLoaded"));
        // create a tab!
        createTab(true, "default");
    } catch (error) {
        console.error("Error loading scripts: ", error);
    }
}

loadAllScripts();