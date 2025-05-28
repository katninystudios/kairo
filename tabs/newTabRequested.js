// listen for open-url messages from the main process
// this will open a new tab when the web page requests one/a new window
window.api.handle("open-url", (event, disposition, url) => {
    if (disposition !== "background-tab") {
        createTab(true, "default", url);
    } else {
        createTab(false, "default", url);
    }
});