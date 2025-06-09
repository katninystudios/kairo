let selectedIndex = 0;
let suggestionsData = [];

const urlBar = document.getElementById("urlBar");
const suggestionsContainer = document.getElementById("searchSuggestions");

urlBar.addEventListener("input", () => {
    const attemptedQuery = urlBar.innerText.trim();
    selectedIndex = 0;
    highlightSelection(suggestionsContainer.querySelectorAll(".suggestion"), false);

    if (attemptedQuery !== "") {
        fetch(`https://duckduckgo.com/ac/?q=${attemptedQuery}&type=list`)
            .then(response => response.json())
            .then(data => {
                suggestionsContainer.innerHTML = "";
                suggestionsContainer.style.display = "block";

                suggestionsData = [attemptedQuery, ...data[1].filter(s => s !== attemptedQuery)];

                suggestionsData.forEach((suggestion, index) => {
                    const div = document.createElement("div");
                    const isLink = isUrl(suggestion);

                    if (index === 0) {
                        div.innerHTML = isLink
                            ? `<i class="bi bi-globe-americas"></i> ${suggestion}`
                            : `<i class="bi bi-search"></i> ${suggestion} - DuckDuckGo Search`;
                    } else {
                        div.innerHTML = `<i class="bi bi-search"></i> ${suggestion}`;
                    }

                    div.className = "suggestion";
                    div.dataset.index = index;
                    div.addEventListener("click", () => {
                        sendSuggestion(index);
                        suggestionsContainer.style.display = "none";
                    })
                    suggestionsContainer.appendChild(div);
                })
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