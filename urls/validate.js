function isUrl(url) {
    try {
        // if successful, URL is valid
        new URL(url);
        return true;
    } catch (e) {
        // if an error is thrown, its invalid
        return false;
    }
}