function sendToURL(url) {
    const activeWebview = document.querySelectorAll("webview.visible");

    activeWebview.forEach(webview => {
        webview.src = url;
    });
}