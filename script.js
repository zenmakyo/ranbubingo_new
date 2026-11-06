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
    
  const wordList = [
    "ケロペン先生", "憤慨するタウマース", "ハマガイ", "ふにゃ渡し", "かぼプキン", "星ノ位・天秤の傍役", "カラマリン", "てる坊主", "スカディの傍役", "謎掛の悪戯猫の傍役",
    "甘言に従う者の傍役", "キーウィ", "パヨカムイ（Lv49)", "ストラプト", "ウシャマル", "グリモワール", "木霊里", "錬金術師ソフィアの傍役", "ガネーシャ", "丙申",
    "氷灯の隠者", "ペリタマ", "アプサラス", "星跳のティアミ", "ゴールデンゴーレム", "メタルゴーレム", "一言主", "探偵ショルメ", "ファットドラゴン", "ツドイガイ",
    "にゃぶぎょう", "赤い頭巾の娘・悲", "夢路の蠱術師", "激浪の略奪者", "森羅の後継者の傍役", "薛茘鬼の傍役", "明狐", "宵狐", "バステト", "呼福童",
    "デーモンローズ", "シャムシード", "タンクドラゴン", "天空鯨", "虹色の番竜", "カラフラウム", "ヒデリガミ", "不知火", "紅酒のポジョン", "夜色の番竜",
    "天女海月", "水母娘娘", "デスコーピオン", "海御前", "猿飛", "ジン", "鵺", "タナトス", "ドルチェ", "冬将軍ユキムネ",
    "ヘル", "点睛を欠く画龍", "烏天狗", "ココペリ", "蜃", "スキムドラゴン", "ノーム", "ベロニカの乙女", "フェダーイン", "紫怨万代朧車",
    "ルドラ", "高雅たる詠人", "ファラク", "ベルゼブル", "パッチワークドラゴン", "ミヅハノメ", "亡霊船フリゲート", "イセキモリ", "おみくじ小町【大吉】", "クラーケン",
    "パウチカムイ", "のっぺらぼう・正", "瘴谷の邪竜", "エレシュキガル", "小雪姫", "伏姫", "リャナンシー", "迦陵頻伽", "高潔なる選定者", "双生の群夜灯",
    "イーリス", "ケライノー", "グレモリー", "ファーミュ", "ルーガルー", "薬湯殿ゆ屋", "濡髪童子", "ヴィシュヌ", "ガルーダ", "イシス",
    "エクチュアフ", "牛魔神", "晴朗な明察者", "白翼のマーテル", "王家の末路", "シュバリエディオン", "祝膳女将【絶品】", "アルテミス", "シャイターン", "五十嵐・卍",
    "エル・ラドル", "怨毒宿せし亡王", "キョンシー", "シヴァ", "薄幸佳人【微妙かも】", "スサノオ", "導きの魔奏者", "ファントム", "パヨカムイ(Lv179)", "魔導要塞クレイドル",
    "皇竜", "謎掛の悪戯猫", "執金剛神", "陽翼神ラー", "ぬらりひょん【狂宴】", "クエイクドラゴン", "滅鬼積鬼", "甘言に従う者", "薛茘鬼", "影獅子",
    "アジダハーカ", "座天使", "なまはげ", "夢魔", "悪路王", "道を外れし者", "闇に囁く者", "名状しがたい者", "緑の深淵の女王", "星間を駆ける者",
    "獄星の千年花", "地を穿つ魔", "旧支配者の大祭司", "反魂竜", "破壊神", "渾沌", "饕餮", "窮奇", "難訓", "阿",
    "吽", "メデューサ", "エウリュアレ", "ステンノ", "創星神コスモ", "壊星神コスモ", "ロキ", "白澤", "禍津", "孟極",
    "アナト", "ヘイムダル", "アテナ", "アポロンα", "夢幻の胡蝶【正夢】", "獅子丸・護", "獅子丸・荒", "戦嵐ノ影獅子", "遅咲蝶", "オキクムシ",
    "鋼鉄オオヒラタ", "森羅の後継者", "花蟷フルルテス", "ネフティス", "白猪坊", "アルピィ", "コトノハミ", "時の腐肉喰らい", "ガランドーヴ", "壬寅",
    "鈴鹿御前", "ヴァイシュラヴァナ", "戦風の皇女", "幻綴司書アナムネシア", "スケイジー", "火鼠", "八咫烏", "天真娘メイメイ", "ジャックランタン", "召喚士テオの傍役",
    "グリムメアの傍役", "ノームの傍役", "小結きんたろう", "御使い", "柚子あひる【並】", "閻魔大女将", "ドン・ムグラ", "海幽魚ガッツゥーヲ", "千の仔を随えし黒山羊", "染乃撫子",
    "塵塚怪王", "灯髏鬼", "甘殻ヤドコロネ", "石川五右衛門", "アルセーヌ・ルパン", "錬金生命ポビルコ", "マンドラゴラ【喜】", "ネイト・トントゥ", "ヤンヤン・テイテイ", "揺蕩う白影（Lv200）", 
    "睡臥雲客", "ペインティール", "幻惑師・藍丸", "紅藍ノ朋", "常世の車掌ワダチ", "ハーラグゥ", "オトリコガネ", "鬼ヶ臼", "幻月に蔓延りし者", "宇迦之御魂神",
    "大国主", "シュクレッタ", "タケミカヅチ", "牛若丸", "彩海のシウミゥ", "百々目鬼", "荒くれ番長ラウディ", "晴天狐", "有頂天狐", "アルタ・テオカリル", 
    "アルタ・ナインハーツ", "アルタ・ニ・コヴァン", "エーヌシトルイユ", "這い寄る混沌", "闇の狂信者", "高貴な洒落卵",
    "ゴールド・G・ゴーレム", "シルバー・G・ゴーレム", "つちのこ",
    "ヴァンピール", "アフロディーテ", "玉姫", "バアルゼブル", "ハルモニア", "アスモデウス", "竜扇陽", "キュベレー", "ベリアル", "白兎神",
    "羅刹鬼", "魔術師マーリン", "霊騎士シルドラント", "闇竜", "聖竜", "黒陸吾", "熾天使", "ダークロードナイトメア", "玉藻前", "ニーズヘッグ", 
    "緋翼のアグシャナ", "フェンリル", "バハムート", "創造神", "月日を追う者", "スカサハ", "ベヒモス", "エレクトラ", "金鵄", "赫轟魔イフリート",
    "フレイヤ", "斉天大聖", "ティアマト", "乙姫", "ゲンペイボタル", "オキクルミ", "百花仙子"
  ];
  const rainbowWords = [
    "ヴァンピール", "アフロディーテ", "玉姫", "バアルゼブル", "ハルモニア", "アスモデウス", "竜扇陽", "キュベレー", "ベリアル", "白兎神",
    "羅刹鬼", "魔術師マーリン", "霊騎士シルドラント", "闇竜", "聖竜", "黒陸吾", "熾天使", "ダークロードナイトメア", "玉藻前", "ニーズヘッグ", 
    "緋翼のアグシャナ", "フェンリル", "バハムート", "創造神", "月日を追う者", "スカサハ", "ベヒモス", "エレクトラ", "金鵄", "赫轟魔イフリート",
    "フレイヤ", "斉天大聖", "ティアマト", "乙姫", "ゲンペイボタル", "オキクルミ", "百花仙子"
  ];
  const roseWord = [ "デーモンローズ" ];
  const mixWords = [ "ゴールド・G・ゴーレム", "シルバー・G・ゴーレム", "つちのこ" ];
    
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
    const loadBtn = document.getElementById("load-btn");
    if (loadBtn) loadBtn.remove();

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
    const cells = Array.from(document.querySelectorAll("#bingo td"));
    const boardData = cells.map((td, i) => {
      if (i === 12) return null;
      return td.querySelector(".cell-text")?.textContent.trim() || "";
    });

    localStorage.setItem("bingoBoard5", JSON.stringify(boardData));
    alert("保存しました！");
  }

  function loadBoard5() {
    const saved = localStorage.getItem("bingoBoard5");
    if (!saved) {
      alert("保存データがありません");
      return;
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
  document.getElementById("load-btn")?.addEventListener("click", loadBoard5);
});
