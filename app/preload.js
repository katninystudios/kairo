const { contextBridge, ipcRenderer } = require("electron");
const path = require("node:path");

// expose kairo API
contextBridge.exposeInMainWorld('api', {
    dirname: () => __dirname,
    send: (channel, data) => {
        let validChannels = ['hover-link', "open-url"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    handle: (channel, callback) => {
        const validChannels = ['hover-link', "open-url"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => callback(event, ...args));
        }
    },
    receive: (channel, callback) => {
        const validChannels = ["display-url"];
        if (validChannels.includes(channel)) {
            console.log(`valid: ${channel}`);
            ipcRenderer.on(channel, (event, ...args) => callback(...args));
        }
    }
});

// detect when a link is hovered
contextBridge.exposeInMainWorld("link", {
    sendLinkHover: (href) => ipcRenderer.send("link-hover", href),
    sendLinkUnhover: () => ipcRenderer.send("link-unhover"),
    on: (channel, callback) => {
        ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
});