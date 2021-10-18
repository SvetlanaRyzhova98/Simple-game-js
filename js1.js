function main(difficulty = "normal") {
  let oneClick = null;
  let twoClick = null;
  let fieldSize = 6;
  if (difficulty === "hard") {
    fieldSize = 10;
  }
  if (difficulty === "easy") {
    fieldSize = 4;
  }

  const unicPosition = [
    { name: "🦁" },
    { name: "🍏" },
    { name: "🐕" },
    { name: "🐈" },
    { name: "🐁" },
    { name: "🐄" },
    { name: "🐘" },
    { name: "🌹" },
    { name: "🍉" },
    { name: "🐑" },
    { name: "🚩" },
    { name: "🍌" },
    { name: "🤏" },
    { name: "💤" },
    { name: "🦢" },
    { name: "🌎" },
    { name: "🌎" },
  ];

  function shuffle(arr) {
    var j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  function prepereField(arr) {
    const Field = [];
    for (let i = 0; i < fieldSize; i++) {
      Field[i] = arr.slice(i * fieldSize, fieldSize + i * fieldSize);
    }
    return Field;
  }
  function generateRawField() {
    const rawField = [];
    let unicPositionIdx = 0;
    for (let i = 0; i < (fieldSize * fieldSize) / 2; i++) {
      rawField.push(unicPosition[unicPositionIdx]);
      rawField.push(unicPosition[unicPositionIdx]);
      unicPositionIdx = (unicPositionIdx + 1) % unicPosition.length;
    }
    return rawField;
  }

  const rawField = generateRawField();

  shuffle(rawField); //рандом
  const Field = prepereField(rawField); //разложить по 4 секциям
  const fieldElem = document.querySelector("#field");
  fieldElem.innerHTML = "";
  fieldElem.style["width"] = `${fieldSize * 60 + fieldSize * 2}px`; //динамическое изменение размера
  const clickCounterElem = document.querySelector("#counter");

  let clickCounter = 0;
  clickCounterElem.innerHTML = clickCounter;
  let victory = 0;

  let disableClick = false;

  for (let i = 0; i < Field.length; i++) {
    for (let j = 0; j < Field[i].length; j++) {
      let cellElem = document.createElement("div"); //создание элемента  дом
      cellElem.setAttribute("name", Field[i][j].name);
      cellElem.setAttribute("x", j);
      cellElem.setAttribute("y", i);

      cellElem.innerHTML = `
            <div class="card__face card__face--front">?</div>
            <div class="card__face card__face--back">${Field[i][j].name}</div>
      `;
      fieldElem.appendChild(cellElem);
      cellElem.classList.add("cell");

      cellElem.addEventListener("click", (event) => {
        //добавить слушатель события
        if (disableClick) {
          return;
        }
        clickCounter++;
        clickCounterElem.innerHTML = clickCounter;
        const target = event.currentTarget;
        const name = target.getAttribute("name");
        target.classList.add("is-flipped");

        if (oneClick) {
          twoClick = target;
          disableClick = true;
        } else {
          oneClick = target;
        }

        if (
          twoClick &&
          oneClick.getAttribute("name") === twoClick.getAttribute("name") &&
          !(
            oneClick.getAttribute("x") === twoClick.getAttribute("x") &&
            oneClick.getAttribute("y") === twoClick.getAttribute("y")
          )
        ) {
          oneClick.classList.add("deleteCell");
          twoClick.classList.add("deleteCell");

          victory++;
          if (victory * 2 === fieldSize * fieldSize) {
            alert("Победа!!!");
          }

          twoClick = null;
          oneClick = null;
        }

        setTimeout(() => {
          if (
            twoClick &&
            oneClick.getAttribute("name") !== twoClick.getAttribute("name")
          ) {
            //alert("Не то");

            // oneClick.innerHTML = "?";
            // twoClick.innerHTML = "?";
            oneClick.classList.remove("is-flipped");
            twoClick.classList.remove("is-flipped");
            twoClick = null;
            oneClick = null;
          }
          disableClick = false;
        }, 1500);
      });
    }
  }
}

(function () {
  const difficultyElement = document.querySelector("#difficulty");

  difficultyElement.addEventListener("click", (event) => {
    const targetButton = event.target;
    if (targetButton.classList.contains("button")) {
      document.querySelectorAll("#difficulty button").forEach((button) => {
        button.classList.remove("active");
      });
      const difficulty = targetButton.dataset.difficulty;
      targetButton.classList.add("active");

      main(difficulty);
      // console.log(difficulty);
    }
  });
})();

main();
