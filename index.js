"use strict";

const generateBtn = document.querySelector(".gen_btn");

const validityChecker = document.querySelector(".val_btn");

const verifyButton = document.querySelector(".verify_btn");
const carrier = {
  solutionGrid: [],
  unsolvedGrid: [],
};

generateBtn.addEventListener("click", () => {
  const loader = document.querySelector(".loader");
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "sudoku-board.p.rapidapi.com",
      "X-RapidAPI-Key": "5d7d5626e4mshc16290df7688929p1eba34jsn7aa162252253",
    },
  };
  loader.style.display = "block";
  fetch(
    "https://sudoku-board.p.rapidapi.com/new-board?diff=2&stype=list&solu=true",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      let { solution, "unsolved-sudoku": unsolvedsudoku } = response.response;
      carrier.unsolvedGrid = unsolvedsudoku;
      carrier.solutionGrid = solution;
      loader.style.display = "none";
      generateBoard(carrier.unsolvedGrid);
      generateBtn.disabled = true;
      validityChecker.disabled = false;
      verifyButton.disabled = false;
    })
    .catch((err) => console.error(err));
});

validityChecker.addEventListener("click", () => {
  let askingFirst = confirm("Are you sure ?");
  if (askingFirst) {
    solvegrid(carrier.solutionGrid);
    generateBtn.disabled = false;
    validityChecker.disabled = true;
    verifyButton.disabled = true;
  }
});

verifyButton.addEventListener("click", () => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "sudoku-board.p.rapidapi.com",
      "X-RapidAPI-Key": "5d7d5626e4mshc16290df7688929p1eba34jsn7aa162252253",
    },
  };
  const suggestion = document.querySelector(".suggest");
  const grid = document.querySelectorAll(".grid");
  const board = [...grid].map((x) => x.textContent).join("");
  fetch(
    `https://sudoku-board.p.rapidapi.com/verify-board?sudo=${board}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const { solvable } = response.response;
      if (solvable == "False") {
        suggestion.textContent = "Not doin it right";
      } else {
        suggestion.textContent = "You're on right track";
      }
    })
    .catch((err) => console.error(err));
});

function generateBoard(board) {
  const grid = document.querySelectorAll(".grid");
  const paint = board.flat(Infinity);
  for (let i = 0; i < grid.length; i++) {
    delay(paint, grid, i, "generate");
  }
}

function solvegrid(board) {
  const grid = document.querySelectorAll(".grid");
  const paint = board.flat(Infinity);
  for (let i = 0; i < grid.length; i++) {
    delay(paint, grid, i);
  }
}

function delay(paint, grid, i, type) {
  if (type == "generate") {
    setTimeout(() => {
      grid[i].textContent = paint[i];
      grid[i].classList.remove("solve");
      grid[i].classList.add("paint");
    }, i * 10);
  } else {
    setTimeout(() => {
      grid[i].textContent = paint[i];
      grid[i].classList.remove("paint");
      grid[i].classList.add("solve");
    }, i * 10);
  }
}
