function parseURL(url) {
    // temporary a element to easily parse the URL
    const anchor = document.createElement("a");
    anchor.href = url;

    // split URL into parts
    const protocol = anchor.protocol;
    const hostnameParts = anchor.hostname.split(".");
    const subdomain = hostnameParts.length > 2 ? hostnameParts[0] : null;
    const domain = hostnameParts.slice(-2).join(".");
    const trailing = anchor.pathname + anchor.search + anchor.hash;

    // create styled elements for each part of the URL
    const urlElement = document.createElement("span");

    const protocolElement = document.createElement("span");
    protocolElement.textContent = protocol + "//";
    protocolElement.style.color = "gray";
    urlElement.appendChild(protocolElement);

    // add subdomain part (only if it exists and is not the main domain)
    if (subdomain && subdomain !== "www") {
        const subdomainElement = document.createElement("span");
        subdomainElement.textContent = subdomain + ".";
        subdomainElement.style.color = "gray";
        urlElement.appendChild(subdomainElement);
    } else if (subdomain === "www") {
        const wwwElement = document.createElement("span");
        wwwElement.textContent = subdomain + ".";
        wwwElement.style.color = "black";
        urlElement.appendChild(wwwElement);
    }

    const domainElement = document.createElement("span");
    domainElement.textContent = domain;
    domainElement.style.color = "black";
    urlElement.appendChild(domainElement);

    const trailingElement = document.createElement("span");
    trailingElement.textContent = trailing;
    trailingElement.style.color = "gray";
    urlElement.appendChild(trailingElement);

    // append the styled URL
    document.getElementById("urlBar").innerHTML = "";
    document.getElementById("urlBar").appendChild(urlElement);
}