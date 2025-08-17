function isUrl(input) {
    if (typeof input !== "string") return false;

    const str = input.trim();

    // reject plain spaces (unless encoded like %20)
    if (/\s/.test(str)) return false;

    // add https:// if no protocol
    let urlStr = str;
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(urlStr)) {
        urlStr = "https://" + urlStr;
    }

    try {
        const url = new URL(urlStr);
        const host = url.hostname;

        if (!host) return false;

        // allow domains with at least one dot
        if (host.includes(".")) return true;

        // allow localhost
        if (host === "localhost") return true;

        // allow ipv4 (e.g. 127.0.0.1)
        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;

        // allow ipv6 (e.g. [::1])
        if (/^\[.*\]$/.test(host)) return true;

        return false;
    } catch {
        return false;
    }
}