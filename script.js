document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("name-container");
  const input = document.getElementById("player-name");

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
    const inputs = document.querySelectorAll("textarea");
    inputs.forEach(input => {
      input.value = "";
      input.closest("td").style.background = "#ccc";
    });
    usedWords.clear();
  }
    
  const buttonContainer = document.querySelector(".button-container");
  const cellClickHandlers = new Map();

  function enableCellClick(td) {
    if (cellClickHandlers.has(td)) return;
    const handler = () => toggleCellColor(td);
    td.addEventListener("click", handler);
    cellClickHandlers.set(td, handler);
    td.style.cursor = "pointer";
  }

  function disableCellClick(td) {
    const handler = cellClickHandlers.get(td);
    if (handler) {
      td.removeEventListener("click", handler);
      cellClickHandlers.delete(td);
    }
    td.style.cursor = "default";
  }

  function confirmBoard() {
    const nameInput = document.getElementById("player-name");
    const cells = Array.from(document.querySelectorAll("#bingo td"));
    const inputs = cells.filter((td, i) => i !== 12).map(td => td.querySelector("textarea"));

    let alertMessage = "";

    if (nameInput && nameInput.value.trim() === "") {
      alertMessage += "名前を入力してください！\n";
    }

    const emptyCell = inputs.some(input => !input || input.value.trim() === "");
    if (emptyCell) {
      alertMessage += "マスを全て埋めてください！";
    }

    if (alertMessage) {
      alert(alertMessage);
      return;
    }

    alert("マスを確定します！\n解除ボタンで再配置できます！");
    
    cells.forEach((td, i) => {
      if (i !== 12) {
        const overlay = td.querySelector(".cell-overlay");
        if (overlay) overlay.remove();
        td.dataset.clicked = "false";
      }
    });

    inputs.forEach(input => {
      const td = input.closest("td");
      td.innerHTML = '<div class="cell-text-wrapper"><div class="cell-text">' + input.value + '</div></div>';
    });

    const centerCell = document.querySelector("#bingo td[data-row='2'][data-col='2']");
    centerCell.dataset.clicked = "true";

    let overlay = centerCell.querySelector(".cell-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "cell-overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "0";
      centerCell.insertBefore(overlay, centerCell.firstChild);
    }

    const randomBtn = document.getElementById("random-btn");
    if (randomBtn) randomBtn.remove();
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) confirmBtn.remove();
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) resetBtn.remove();

    if (!document.getElementById("color-reset-btn")) {
      const colorResetBtn = document.createElement("button");
      colorResetBtn.id = "color-reset-btn";
      colorResetBtn.textContent = "色リセット";
      colorResetBtn.onclick = () => {
        const cells = document.querySelectorAll("#bingo td");
        cells.forEach(td => {
          let overlay = td.querySelector(".cell-overlay");
          if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "cell-overlay";
            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "0";
            td.insertBefore(overlay, td.firstChild);
          }

          if (!(td.dataset.row === "2" && td.dataset.col === "2")) {
            td.dataset.clicked = "false";
          }

          overlay.style.backgroundColor = "";
          overlay.style.border = "";
        });

        const centerCell = document.querySelector("#bingo td[data-row='2'][data-col='2']");
        const centerOverlay = centerCell.querySelector(".cell-overlay");
        if (centerOverlay) {
          centerOverlay.style.backgroundColor = "rgba(181, 141, 200, 0.9)";
        }

        prevReachCount = 0;
        prevBingoCount = 0;
      };
      buttonContainer.appendChild(colorResetBtn);
    }

    if (!document.getElementById("undo-btn")) {
      const undoBtn = document.createElement("button");
      undoBtn.id = "undo-btn";
      undoBtn.textContent = "解除";
      undoBtn.addEventListener("click", undoConfirm);
      buttonContainer.appendChild(undoBtn);
    }

    const textCells = document.querySelectorAll("#bingo td");
    textCells.forEach(td => {
      if (td.dataset.row === "2" && td.dataset.col === "2") return;
      enableCellClick(td);
    });

    checkBingo();
  }

  function undoConfirm() {
    const cells = Array.from(document.querySelectorAll("#bingo td"));

    cells.forEach((td, i) => {
      if (i !== 12) disableCellClick(td);
    });

    cells.forEach(td => {
      const overlay = td.querySelector(".cell-overlay");
      if (overlay) overlay.style.backgroundColor = "";
    });

    cells.forEach((td, i) => {
      if (i !== 12) {
        const value = td.textContent.trim();
        td.innerHTML = `
          <div class="cell-content">
            <textarea class="cell-input" rows="1" wrap="soft">${value}</textarea>
          </div>
        `;
      }
    });

    ["undo-btn", "color-reset-btn", "save-btn"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.remove();
    });

    if (!document.getElementById("random-btn")) {
      const btn = document.createElement("button");
      btn.id = "random-btn";
      btn.textContent = "ランダム配置";
      btn.onclick = randomFill;
      buttonContainer.appendChild(btn);
    }

    if (!document.getElementById("reset-btn")) {
      const btn = document.createElement("button");
      btn.id = "reset-btn";
      btn.textContent = "リセット";
      btn.onclick = resetBoard;
      buttonContainer.appendChild(btn);
    }

    if (!document.getElementById("confirm-btn")) {
      const btn = document.createElement("button");
      btn.id = "confirm-btn";
      btn.textContent = "確定";
      btn.onclick = confirmBoard;
      buttonContainer.appendChild(btn);
    }
  }

  function toggleCellColor(td) {
    td.dataset.clicked = td.dataset.clicked === "true" ? "false" : "true";

    let overlay = td.querySelector(".cell-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "cell-overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "0";
      td.insertBefore(overlay, td.firstChild);
    }

    overlay.style.backgroundColor = td.dataset.clicked === "true" 
                                   ? "rgba(181, 141, 200, 0.9)" 
                                   : "";

    checkBingo();
  }

    const boardData = JSON.parse(saved);
    const cells = Array.from(document.querySelectorAll("#bingo td"));

    usedWords.clear();

    cells.forEach((td, i) => {
      if (i === 12) return;

      const textarea = td.querySelector("textarea");
      if (textarea) {
        textarea.value = "";
        const val = boardData[i] || "";
        textarea.value = val;

        if (val) {
          usedWords.add(val);
          finalizeInput(textarea, td, val);
        } else {
          td.style.background = "#ccc";
        }
      }
    });

    alert("保存データを読み込みました");
  }

  let prevReachCount = 0;
  let prevBingoCount = 0;

  function checkBingo() {
    const cells = Array.from(document.querySelectorAll("#bingo td"));

    const lines = [
      [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
      [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
      [0,6,12,18,24],[4,8,12,16,20]
    ];

    cells.forEach(td => {
      let overlay = td.querySelector(".cell-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "cell-overlay";
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "0";
        td.insertBefore(overlay, td.firstChild);
      }
      overlay.style.backgroundColor = td.dataset.clicked === "true" ? "rgba(181, 141, 200, 0.9)" : "";
      overlay.style.border = "";
    });

    let reachCells = [];
    let bingoLines = [];
    let newReachLines = new Set();
    let newBingoLines = new Set();

    lines.forEach(line => {
      const filled = line.filter(i => cells[i].dataset.clicked === "true");
      if (filled.length === 5) {
        bingoLines.push(line);
        newBingoLines.add(line.toString());
      } else if (filled.length === 4) {
        const remaining = line.find(i => cells[i].dataset.clicked !== "true");
        if (remaining !== undefined) {
          reachCells.push(remaining);
          newReachLines.add(line.toString());
        }
      }
    });

    newBingoLines.forEach(line => {
      newReachLines.delete(line);
    });

    const reachCount = newReachLines.size;
    const bingoCount = newBingoLines.size;

    reachCells.forEach(i => {
      const overlay = cells[i].querySelector(".cell-overlay");
      overlay.style.backgroundColor = "transparent";
      overlay.style.border = "3px solid red";
      overlay.style.boxSizing = "border-box";
    });

    bingoLines.forEach(line => {
      line.forEach(i => {
        const overlay = cells[i].querySelector(".cell-overlay");
        overlay.style.backgroundColor = "rgba(255, 0, 0, 0.9)";
        overlay.style.border = "";
      });
    });

    let message = "";
    if (reachCount > prevReachCount) {
      message += `リーチ ${reachCount}列！\n`;
    }
    if (bingoCount > prevBingoCount) {
      message += `ビンゴ ${bingoCount}列！\nおめでとうございます！`;
    }

    if (message) alert(message);

    prevReachCount = reachCount;
    prevBingoCount = bingoCount;
  }

  // ボタンイベントのバインド
  document.getElementById("random-btn")?.addEventListener("click", randomFill);
  document.getElementById("reset-btn")?.addEventListener("click", resetBoard);
  document.getElementById("confirm-btn")?.addEventListener("click", confirmBoard);
});
