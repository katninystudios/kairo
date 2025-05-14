const { app, BrowserWindow, session } = require("electron");
const path = require("node:path");
const { platform } = require("node:process"); 

function createWindow() {
    // the window itself
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            webviewTag: true,
            sandbox: true,
            nodeIntegration: true,
            //contextIsolation: true,
        },
        titleBarStyle: "hidden",
        titleBarOverlay: true,
        titleBarOverlay: {
            color: "#fff",
            symbolColor: "#000"
        }
    });

    // then, load!
    win.loadFile("index.html");
}

app.whenReady().then(() => {
    // set user agent
    if (process.platform === "win32") {
        app.userAgentFallback = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36 Kairo/${process.versions.electron}`;
    } else if (process.platform === "darwin") {
        app.userAgentFallback = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36 Kairo/${process.versions.electron}`;
    } else if (process.platform === "linux") {
        app.userAgentFallback = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36 Kairo/${process.versions.electron}`;
    } else if (process.platform === "android") {
        app.userAgentFallback = `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36 Kairo/${process.versions.electron}`;
    } else {
        app.userAgentFallback = `Mozilla/5.0 (Unsupported; Unknown Operating System) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36 Kairo/${process.versions.electron}`;
    }

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});