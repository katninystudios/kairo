let selectedIndex = 0;
let suggestionsData = [];

const urlBar = document.getElementById("urlBar");
const suggestionsContainer = document.getElementById("searchSuggestions");

urlBar.addEventListener("input", () => {
    const attemptedQuery = urlBar.innerText.trim();
    selectedIndex = 0;
    suggestionsContainer.innerHTML = "";

    if (attemptedQuery !== "") {
        suggestionsContainer.style.display = "block";

        // reset suggestions
        suggestionsData = [];

        // add the immediate "search or url" option
        const firstDiv = document.createElement("div");
        const isLink = isUrl(attemptedQuery);

        firstDiv.innerHTML = isLink
            ? `<i class="bi bi-globe-americas"></i> ${attemptedQuery}`
            : `<i class="bi bi-search"></i> ${attemptedQuery} - DuckDuckGo Search`;

        firstDiv.className = "suggestion";
        firstDiv.dataset.index = 0;
        firstDiv.addEventListener("click", () => {
            sendSuggestion(0);
            suggestionsContainer.style.display = "none";
        });

        suggestionsContainer.appendChild(firstDiv);
        suggestionsData.push(attemptedQuery);

        // fetch autocomplete
        fetch(`https://duckduckgo.com/ac/?q=${attemptedQuery}&type=list`)
            .then(response => response.json())
            .then(data => {
                // use a Set to avoid duplicates
                const seen = new Set(suggestionsData);

                data[1].forEach(suggestion => {
                    if (!seen.has(suggestion)) {
                        seen.add(suggestion);
                        const div = document.createElement("div");
                        div.innerHTML = `<i class="bi bi-search"></i> ${suggestion}`;
                        div.className = "suggestion";
                        div.dataset.index = suggestionsData.length;

                        div.addEventListener("click", () => {
                            sendSuggestion(parseInt(div.dataset.index));
                            suggestionsContainer.style.display = "none";
                        });

                        suggestionsContainer.appendChild(div);
                        suggestionsData.push(suggestion);
                    }
                });
            })
            .catch(err => console.error("Error fetching suggestions:", err));
    } else {
        suggestionsContainer.style.display = "none";
    }
})

// key navigation
urlBar.addEventListener("keydown", (e) => {
    const items = suggestionsContainer.querySelectorAll(".suggestion");

    if (suggestionsContainer.style.display === "block" && items.length > 0) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            highlightSelection(items, true);
            placeCaretAtEnd(urlBar);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            highlightSelection(items, true);
            placeCaretAtEnd(urlBar);
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            sendSuggestion(selectedIndex);
            urlBar.blur();
            suggestionsContainer.style.display = "none";
        }
    }
})

// helper: update highlight + urlBar text
function highlightSelection(items, setInnerText) {
    // select item
    items.forEach((item, idx) => {
        if (idx === selectedIndex) {
            item.classList.add("selected");
            if (setInnerText) urlBar.innerText = suggestionsData[selectedIndex];
        } else {
            item.classList.remove("selected");
        }
    });
}

// helper: simulate clicking suggestion
function sendSuggestion(index) {
    const suggestion = suggestionsData[index];
    if (isUrl(suggestion)) {
        const fixed = suggestion.startsWith("http") ? suggestion : `https://${suggestion}`;
        sendToURL(fixed);
    } else {
        sendToURL(`https://duckduckgo.com/search?q=${suggestion}`);
    }
}

// helper: keep caret at end when updating text
function placeCaretAtEnd(el) {
    el.focus()
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
    }
}