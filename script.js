document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("name-container");
  const input = document.getElementById("player-name");

  if (input) {
    input.addEventListener("change", () => {
      const name = input.value.trim();
      if (name === "") return;

      container.innerHTML = `
        <div style="
          font-family: 'Zen Kurenaido', sans-serif;
          font-size: 2rem;
          color: white;
          -webkit-text-stroke: 3px black;
          paint-order: stroke fill;
          font-weight: bold;
          padding: 0.5rem;
          line-height: 1.1;
          text-align: center;
        ">
          ${name}
        </div>
      `;
    });
  }

  const usedWords = new Set();
  const table = document.querySelector("#bingo tbody");

  for (let row = 0; row < 5; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 5; col++) {
      const td = document.createElement("td");
      td.dataset.row = row;
      td.dataset.col = col;

      if (row === 2 && col === 2) {
        td.classList.add("free-cell");
      } else {
        const wrapper = document.createElement("div");
        wrapper.className = "cell-content";

        const input = document.createElement("textarea");
        input.className = "cell-input";
        input.setAttribute("placeholder", "未選択");
        input.setAttribute("rows", "1");
        input.setAttribute("wrap", "soft");
        input.addEventListener("keydown", e => {
          if (e.key === "Enter") e.preventDefault();
        });

        const suggestionBox = document.createElement("div");
        suggestionBox.className = "suggestions";

        input.addEventListener("input", () => {
          updateSuggestions(input, suggestionBox);
          suggestionBox.style.display = "block";
        });
        
        input.addEventListener("focus", () => {
          updateSuggestions(input, suggestionBox);
          suggestionBox.style.display = "block";
        });

        let suggestionLocked = false;

        input.addEventListener("compositionend", () => {
          suggestionLocked = false;
          updateSuggestions(input, suggestionBox);
        });

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = input.value.trim();
            const td = input.closest("td");

            const currentUsed = Array.from(document.querySelectorAll("textarea")).map(i => i.value.trim());
            const matches = wordList.filter(word => !currentUsed.includes(word) && word.includes(val));

            if (!suggestionLocked) {
              updateSuggestions(input, suggestionBox);
              suggestionBox.style.display = "block";
              suggestionLocked = true;
              return;
            }

            if (matches.length === 1) {
              input.value = matches[0];
              suggestionBox.style.display = "none";
              finalizeInput(input, td, matches[0]);
              suggestionLocked = false;
            } else if (matches.length > 1) {
              alert("リストから選んでください");
              setTimeout(() => {
                updateSuggestions(input, suggestionBox, true);
                suggestionBox.style.display = "block";
                input.focus();
              }, 0);
            } else {
              alert("別の幻獣を探してください");
              input.value = "";
              td.style.background = "#ccc";
              suggestionBox.style.display = "none";
              suggestionLocked = false;
            }
          }
        });
        
        input.addEventListener("blur", () => {
          setTimeout(() => suggestionBox.style.display = "none", 200);
        });

        suggestionBox.addEventListener("mousedown", (e) => {
          if (e.target.tagName === "DIV") {
            const selected = e.target.textContent;
            if (usedWords.has(selected)) {
              alert("その幻獣は選択済みです！");
              return;
            }
            input.value = selected;
            suggestionBox.style.display = "none";
            finalizeInput(input, td, selected);
          }
        });

        input.addEventListener("change", () => {
          const val = input.value.trim();
          if (usedWords.has(val)) {
            alert("その幻獣は選択済みです！");
            input.value = "";
            td.style.background = "#ccc";
            return;
          }
          if (!wordList.includes(val)) {
            alert("乱舞の儀に出現しません！");
            input.value = "";
            td.style.background = "#ccc";
            return;
          }
          finalizeInput(input, td, val);
        });

        wrapper.appendChild(input);
        wrapper.appendChild(suggestionBox);
        td.appendChild(wrapper);
      }

      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  function updateSuggestions(input, suggestionBox, forceDisplay = false) {
    const val = input.value.trim();
    const currentUsed = Array.from(document.querySelectorAll("textarea")).map(i => i.value.trim());
    const matches = wordList.filter(word => !currentUsed.includes(word) && word.includes(val));

    suggestionBox.innerHTML = "";

    if (forceDisplay || val === "") {
      wordList.forEach(word => {
        if (!currentUsed.includes(word)) {
          const item = document.createElement("div");
          item.className = "suggestion-item";
          item.textContent = word;
          item.addEventListener("click", () => {
            input.value = word;
            suggestionBox.style.display = "none";
            finalizeInput(input, input.closest("td"), word);
            suggestionLocked = false;
          });
          suggestionBox.appendChild(item);
        }
      });
    } else {
      matches.forEach(word => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.textContent = word;
        item.addEventListener("click", () => {
          input.value = word;
          suggestionBox.style.display = "none";
          finalizeInput(input, input.closest("td"), word);
          suggestionLocked = false;
        });
        suggestionBox.appendChild(item);
      });
    }

    suggestionBox.style.display = suggestionBox.children.length > 0 ? "block" : "none";
  }

  function finalizeInput(input, td, val) {
    usedWords.add(val);
    if (rainbowWords.includes(val)) {
      td.style.background = "linear-gradient(135deg, #f4d7f4, #d6c6e1, #c0d4f7, #bde5c8, #fffabf, #ffe4b5, #f7b3b3)";
    } else if (roseWord.includes(val)) {
      td.style.background = "#c05d69";
    } else if (mixWords.includes(val)) {
      td.style.background = `
        linear-gradient(
          120deg,
          #f4d7f4 0%,
          #d6c6e1 9%,
          #c0d4f7 18%,
          #bde5c8 27%,
          #fffabf 36%,
          #ffe4b5 45%,
          #f7b3b3 54%,
          #ccc 63%,
          #ccc 100%
        )
      `;
    } else {
      td.style.background = "#ccc";
    }
  }

  function randomFill() {
    const inputs = Array.from(document.querySelectorAll("textarea"));
    const filledInputs = inputs.filter(input => input.value.trim());
    const allFilled = filledInputs.length === inputs.length;

    if (allFilled) {
      resetBoard();
    }

    const updatedInputs = Array.from(document.querySelectorAll("textarea"));
    const emptyInputs = updatedInputs.filter(input => !input.value.trim());

    const currentUsed = new Set(updatedInputs.map(input => input.value.trim()).filter(Boolean));
    const availableRainbow = rainbowWords.filter(w => !currentUsed.has(w));
    const availableNormal = wordList.filter(w => !currentUsed.has(w) && !rainbowWords.includes(w));

    const rainbowCount = Math.min(8, Math.max(3, Math.floor(Math.random() * 9)));
    const selectedRainbow = availableRainbow.sort(() => Math.random() - 0.5).slice(0, rainbowCount);
    const remainingCount = emptyInputs.length - selectedRainbow.length;
    const selectedNormal = availableNormal.sort(() => Math.random() - 0.5).slice(0, remainingCount);

    const selectedWords = [...selectedRainbow, ...selectedNormal].sort(() => Math.random() - 0.5);

    let idx = 0;
    emptyInputs.forEach(input => {
      const val = selectedWords[idx++];
      if (!val) return;
      input.value = val;
      const td = input.closest("td");
      finalizeInput(input, td, val);
    });
  }

  function resetBoard() {
    const inputs = document.querySelectorAll
  }
