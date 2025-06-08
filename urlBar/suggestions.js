document.getElementById("urlBar").addEventListener("input", () => {
    // get the query
    const attemptedQuery = document.getElementById("urlBar").innerText;

    if (attemptedQuery.trim() !== "") {
        // fetch search suggestions from DuckDuckGo
        fetch(`https://duckduckgo.com/ac/?q=${attemptedQuery}&type=list`)
            .then(response => response.json())
            .then(data => {
                // clear current suggestions (and display if hidden)
                document.getElementById("searchSuggestions").innerHTML = "";
                document.getElementById("searchSuggestions").style.display = "block";

                // show current text
                const suggestDiv = document.createElement("div");
                const isLink = isUrl(attemptedQuery);
                if (isLink) {
                    suggestDiv.innerHTML = `<i class="bi bi-globe-americas"></i> ${attemptedQuery}`;
                    suggestDiv.addEventListener("click", () => {
                        if (!attemptedQuery.startsWith("http") && !attemptedQuery.startsWith("https")) {
                            sendToURL(`https://${attemptedQuery}`);
                        } else {
                            sendToURL(attemptedQuery);
                        }
                        document.getElementById("searchSuggestions").style.display = "none";
                    });
                } else {
                    suggestDiv.innerHTML = `<i class="bi bi-search"></i> ${attemptedQuery} - DuckDuckGo Search`;
                    suggestDiv.addEventListener("click", () => {
                        sendToURL(`https://duckduckgo.com/search?q=${attemptedQuery}`);
                        document.getElementById("searchSuggestions").style.display = "none";
                    });
                }
                suggestDiv.classList.add("suggestion");
                document.getElementById("searchSuggestions").appendChild(suggestDiv);

                // then show results
                const suggestions = data[1];

                suggestions.forEach((suggestion, index) => {
                    // make sure its not the same as the query
                    if (suggestion === attemptedQuery) {
                        return;
                    }

                    // create & add text/class
                    const suggestDiv = document.createElement("div");
                    suggestDiv.innerHTML = `<i class="bi bi-search"></i> ${suggestion}`;
                    suggestDiv.className = "suggestion";
                    suggestDiv.addEventListener("click", () => {
                        sendToURL(`https://duckduckgo.com/search?q=${suggestion}`);
                        document.getElementById("searchSuggestions").style.display = "none";
                    });

                    // then add to search suggestions
                    document.getElementById("searchSuggestions").appendChild(suggestDiv);
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    } else {
        document.getElementById("searchSuggestions").style.display = "none";
    }
});