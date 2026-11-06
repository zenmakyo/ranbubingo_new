document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("name-container");
  const usedWords = new Set();
  const table = document.querySelector("#bingo tbody");
  let activeTargetCell = null; // 現在選択中のセル

  // モーダル要素の動的生成
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.style.display = "none";
  modalOverlay.innerHTML = `
    <div class="modal-content">
      <h3 style="margin:0; font-size:1.2rem;">幻獣を選択</h3>
      <input type="text" class="modal-search" placeholder="検索キーワードを入力...">
      <div class="modal-list"></div>
      <button class="modal-close-btn">キャンセル</button>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const modalSearch = modalOverlay.querySelector(".modal-search");
  const modalList = modalOverlay.querySelector(".modal-list");
  const modalCloseBtn = modalOverlay.querySelector(".modal-close-btn");

  // モーダルの閉じる処理
  function closeModal() {
    modalOverlay.style.display = "none";
    activeTargetCell = null;
  }
  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // 検索入力時のリアルタイム絞り込み
  modalSearch.addEventListener("input", () => {
    renderModalList(modalSearch.value.trim());
  });

  // モーダル内リストの描画処理
  function renderModalList(filterKeyword = "") {
    modalList.innerHTML = "";
    
    // 現在選択中のセルの値（再選択時にリストに復元するため）
    const currentVal = activeTargetCell ? activeTargetCell.dataset.value || "" : "";

    // 未選択の単語（または自身が選択中の単語）を抽出
    const availableWords = wordList.filter(word => {
      const isNotUsed = !usedWords.has(word) || word === currentVal;
      const matchesSearch = word.includes(filterKeyword);
      return isNotUsed && matchesSearch;
    });

    if (availableWords.length === 0) {
      modalList.innerHTML = `<div style="padding:1rem; color:#888; text-align:center;">該当する幻獣がありません</div>`;
      return;
    }

    availableWords.forEach(word => {
      const item = document.createElement("div");
      item.className = "modal-item";
      item.textContent = word;
      item.addEventListener("click", () => {
        selectWordForCell(activeTargetCell, word);
        closeModal();
      });
      modalList.appendChild(item);
    });
  }

  // セルへの単語適用と配色処理
  function selectWordForCell(td, word) {
    const oldVal = td.dataset.value;
    if (oldVal) usedWords.delete(oldVal);

    if (word) {
      td.dataset.value = word;
      usedWords.add(word);
      const btn = td.querySelector(".cell-select-btn");
      if (btn) btn.textContent = word;
      finalizeInput(td, word);
    } else {
      delete td.dataset.value;
      const btn = td.querySelector(".cell-select-btn");
      if (btn) btn.textContent = "未選択";
      td.style.background = "#ccc";
    }
  }

  // 5x5 テーブルの生成
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

        const btn = document.createElement("button");
        btn.className = "cell-select-btn";
        btn.textContent = "未選択";
        btn.addEventListener("click", () => {
          activeTargetCell = td;
          modalSearch.value = "";
          renderModalList();
          modalOverlay.style.display = "flex";
          modalSearch.focus();
        });

        wrapper.appendChild(btn);
        td.appendChild(wrapper);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  function finalizeInput(td, val) {
    if (rainbowWords.includes(val)) {
      td.style.background = "linear-gradient(135deg, #f4d7f4, #d6c6e1, #c0d4f7, #bde5c8, #fffabf, #ffe4b5, #f7b3b3)";
    } else if (roseWord.includes(val)) {
      td.style.background = "#c05d69";
    } else if (mixWords.includes(val)) {
      td.style.background = `
        linear-gradient(
          120deg,
          #f4d7f4 0%, #d6c6e1 9%, #c0d4f7 18%, #bde5c8 27%,
          #fffabf 36%, #ffe4b5 45%, #f7b3b3 54%, #ccc 63%, #ccc 100%
        )
      `;
    } else {
      td.style.background = "#ccc";
    }
  }

  function randomFill() {
    const cells = Array.from(document.querySelectorAll("#bingo td")).filter((_, i) => i !== 12);
    const filledCells = cells.filter(td => td.dataset.value);

    if (filledCells.length === cells.length) {
      resetBoard();
    }

    const currentCells = Array.from(document.querySelectorAll("#bingo td")).filter((_, i) => i !== 12);
    const emptyCells = currentCells.filter(td => !td.dataset.value);

    const availableRainbow = rainbowWords.filter(w => !usedWords.has(w));
    const availableNormal = wordList.filter(w => !usedWords.has(w) && !rainbowWords.includes(w));

    const rainbowCount = Math.min(8, Math.max(3, Math.floor(Math.random() * 9)));
    const selectedRainbow = availableRainbow.sort(() => Math.random() - 0.5).slice(0, rainbowCount);
    const remainingCount = emptyCells.length - selectedRainbow.length;
    const selectedNormal = availableNormal.sort(() => Math.random() - 0.5).slice(0, remainingCount);

    const selectedWords = [...selectedRainbow, ...selectedNormal].sort(() => Math.random() - 0.5);

    let idx = 0;
    emptyCells.forEach(td => {
      const val = selectedWords[idx++];
      if (val) selectWordForCell(td, val);
    });
  }

  function resetBoard() {
    const cells = Array.from(document.querySelectorAll("#bingo td")).filter((_, i) => i !== 12);
    cells.forEach(td => {
      delete td.dataset.value;
      const btn = td.querySelector(".cell-select-btn");
      if (btn) btn.textContent = "未選択";
      td.style.background = "#ccc";
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
    const normalCells = cells.filter((_, i) => i !== 12);

    let alertMessage = "";

    if (!nameInput || nameInput.value.trim() === "") {
      alertMessage += "名前を入力してください！\n";
    }

    const emptyCell = normalCells.some(td => !td.dataset.value);
    if (emptyCell) {
      alertMessage += "マスを全て埋めてください！";
    }

    if (alertMessage) {
      alert(alertMessage);
      return;
    }

    alert("マスを確定します！\n解除ボタンで再配置できます！");

    const name = nameInput.value.trim();
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

    cells.forEach((td, i) => {
      if (i !== 12) {
        const overlay = td.querySelector(".cell-overlay");
        if (overlay) overlay.remove();
        td.dataset.clicked = "false";

        // ボタンからテキスト表示へ置き換え
        const val = td.dataset.value || "";
        td.innerHTML = `<div class="cell-text-wrapper"><div class="cell-text">${val}</div></div>`;
      }
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

    document.getElementById("random-btn")?.remove();
    document.getElementById("confirm-btn")?.remove();
    document.getElementById("reset-btn")?.remove();
    document.getElementById("load-btn")?.remove();

    if (!document.getElementById("save-btn")) {
      const saveBtn = document.createElement("button");
      saveBtn.id = "save-btn";
      saveBtn.textContent = "保存";
      saveBtn.addEventListener("click", saveBoard5);
      buttonContainer.appendChild(saveBtn);
    }

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
    const currentNameDiv = container.querySelector("div");
    const currentName = currentNameDiv ? currentNameDiv.textContent.trim() : "";
    
    container.innerHTML = `
      <input type="text" id="player-name" 
             placeholder="名前を入力してください"
             value="${currentName}"
             style="width:90%; font-size:1.2rem; text-align:center; box-sizing:border-box; display:inline-block; font-family:sans-serif; -webkit-text-stroke: 0; font-weight: normal; color: black; background-color: white; border: 1px solid #767676; border-radius: 2px; padding: 3px 6px;">
    `;

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
        const value = td.dataset.value || "";
        td.innerHTML = `
          <div class="cell-content">
            <button class="cell-select-btn">${value || "未選択"}</button>
          </div>
        `;
        const btn = td.querySelector(".cell-select-btn");
        btn.addEventListener("click", () => {
          activeTargetCell = td;
          modalSearch.value = "";
          renderModalList();
          modalOverlay.style.display = "flex";
          modalSearch.focus();
        });
      }
    });

    ["undo-btn", "color-reset-btn", "save-btn"].forEach(id => {
      document.getElementById(id)?.remove();
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

    if (!document.getElementById("load-btn")) {
      const btn = document.createElement("button");
      btn.id = "load-btn";
      btn.textContent = "読込";
      btn.onclick = loadBoard5;
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

  function saveBoard5() {
    const currentNameDiv = container.querySelector("div");
    const name = currentNameDiv ? currentNameDiv.textContent.trim() : "";

    const cells = Array.from(document.querySelectorAll("#bingo td"));
    const boardData = cells.map((td, i) => {
      if (i === 12) return null;
      return td.dataset.value || "";
    });

    const saveData = {
      name: name,
      board: boardData
    };

    localStorage.setItem("bingoBoard5", JSON.stringify(saveData));
    alert("保存しました！");
  }

  function loadBoard5() {
    const saved = localStorage.getItem("bingoBoard5");
    if (!saved) {
      alert("保存データがありません");
      return;
    }

    const parsedData = JSON.parse(saved);
    const boardData = Array.isArray(parsedData) ? parsedData : parsedData.board;
    const savedName = !Array.isArray(parsedData) && parsedData.name ? parsedData.name : "";

    if (savedName) {
      const nameInput = document.getElementById("player-name");
      if (nameInput) nameInput.value = savedName;
    }

    const cells = Array.from(document.querySelectorAll("#bingo td"));
    usedWords.clear();

    cells.forEach((td, i) => {
      if (i === 12) return;
      const val = boardData[i] || "";
      selectWordForCell(td, val);
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

  document.getElementById("random-btn")?.addEventListener("click", randomFill);
  document.getElementById("reset-btn")?.addEventListener("click", resetBoard);
  document.getElementById("confirm-btn")?.addEventListener("click", confirmBoard);
  document.getElementById("load-btn")?.addEventListener("click", loadBoard5);
});
