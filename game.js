let seconds = 0;
let minutes = 0;
let moves = 0;
let firstClick = false;
var solving = false;
let timer;
let matches1 = 0;
let matches2 = 0;
let solvable = false;
let gridLayout = [];
let firstRow = [];
let secondRow = [];
let thirdRow = [];
let fourthRow = [];
const emptyRow = [0, 0, 0, 0, 0].toString();

// Given patterns for the computer to use to find the answer's pattern
const quietPattern1 = [
  1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1,
];

const quietPattern2 = [
  1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1,
];

const quietPattern3 = [
  0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0,
];

init();

function init() {
  // Randomizing the layout
  randomizeLayout();
  // Lights up the board if solvable
  lightBoard();
  // Handles button logic
  buttonLogic();
}

function randomizeLayout() {
  // Reset layout each time
  gridLayout = [];

  for (var i = 0; i < $(".square").length; i++) {
    var randomNum = Math.random();
    if (randomNum < 0.5) {
      gridLayout.push(0);
    } else {
      gridLayout.push(1);
    }
  }
  testSolvability();
}

function testSolvability() {
  matches1 = 0;
  matches2 = 0;

  // Testing generated pattern vs first quiet pattern (comparing number of lit lights)
  for (i = 0; i < gridLayout.length; i++) {
    if (gridLayout[i] === 1 && quietPattern1[i] === 1) {
      matches1 += 1;
    }
  }

  // Number of matches must be even, otherwise start over
  if (matches1 % 2 != 0) {
    randomizeLayout();
  } else {
    // Test against second pattern if passed the first test
    for (i = 0; i < gridLayout.length; i++) {
      if (gridLayout[i] === 1 && quietPattern2[i] === 1) {
        matches2 += 1;
      }
    }
    if (matches2 % 2 != 0) {
      randomizeLayout();
    } else {
      solvable = true;
    }
  }
}

function lightBoard() {
  if (solvable == true) {
    for (i = 0; i < gridLayout.length; i++) {
      if (gridLayout[i] == 1) {
        $(".square").eq(i).toggleClass("lit");
      }
    }
  }
}

// New Game button
function buttonLogic() {
  $(".square").on("click", function () {
    // First click starts the timer (After page was first loaded)
    if (firstClick == false) {
      startTimer();
    }
    firstClick = true;

    moves += 1;
    $("#moves").text(moves);

    // Capture current firstClick square (by index)
    let clickedLight = $(this).index();
    // Light turns on/off when clicked
    $(this).toggleClass("lit");

    // Handling squares on RIGHT side
    if (
      clickedLight == 4 ||
      clickedLight == 9 ||
      clickedLight == 14 ||
      clickedLight == 19
    ) {
      $(this).prev(".square").toggleClass("lit");
      $(".square")
        .eq(clickedLight + 5)
        .toggleClass("lit");
      //handling negative number wrapping
      if (clickedLight - 5 >= 0) {
        $(".square")
          .eq(clickedLight - 5)
          .toggleClass("lit");
      }

      // Handling squares on LEFT side
    } else if (
      clickedLight == 5 ||
      clickedLight == 10 ||
      clickedLight == 15 ||
      clickedLight == 20
    ) {
      $(this).next(".square").toggleClass("lit");
      $(".square")
        .eq(clickedLight + 5)
        .toggleClass("lit");
      if (clickedLight - 5 >= 0) {
        $(".square")
          .eq(clickedLight - 5)
          .toggleClass("lit");
      }
    } else {
      // Otherwise handle middle squares as normal
      $(this).prev(".square").toggleClass("lit");
      $(this).next(".square").toggleClass("lit");
      $(".square")
        .eq(clickedLight + 5)
        .toggleClass("lit");
      if (clickedLight - 5 >= 0) {
        $(".square")
          .eq(clickedLight - 5)
          .toggleClass("lit");
      }
    }

    // Handling win condition
    if ($(".square:not(.lit)").length === 25) {
      setTimeout(function () {
        gameWin();
      }, 500);
    }

    // Updating the gridlayout as we go
    for (i = 0; i < gridLayout.length; i++) {
      if ($(".square").eq(i).hasClass("lit")) {
        gridLayout[i] = 1;
      } else {
        gridLayout[i] = 0;
      }
    }

    firstRow = gridLayout.slice(0, 5).toString();
    secondRow = gridLayout.slice(5, 10).toString();
    thirdRow = gridLayout.slice(10, 15).toString();
    fourthRow = gridLayout.slice(15, 20).toString();

    if (solving == true) {
      solveGame();
    }
    // Remove marked squares if the solution button is clicked
    if ($(this).hasClass("mark")) {
      $(this).removeClass("mark");
    }
  });

  // New Game button
  $(".reset").on("click", function () {
    reset();
  });
}

// New Game button starts the timer
function startTimer(x) {
  if (x == 1) {
    clearInterval(timer);
    seconds = 0;
    minutes = 0;
    $("#seconds").text("0" + seconds);
    $("#minutes").text(minutes);
  } else {
    timer = setInterval(function () {
      if (seconds < 59) {
        seconds += 1;
        //Keep the zero for single digit
        if (seconds < 10) {
          $("#seconds").text("0" + seconds);
        } else {
          $("#seconds").text(seconds);
        }
      } else {
        seconds = 0;
        minutes += 1;
        $("#minutes").text(minutes);
      }
    }, 1000);
  }
}

// Alert box after winning
function gameWin() {
  clearInterval(timer);
  setTimeout(function () {
    alert(
      "You have won in: " +
        minutes +
        " minutes, " +
        seconds +
        " seconds using " +
        moves +
        " moves!"
    );
  }, 500);
  $(".square").prop("disabled", true);
  $(".solve").prop("disabled", true);
}

// New Game button function
function reset() {
  moves = 0;
  $("#moves").text(moves);
  solvable = false;
  firstClick = false;
  solving = false;
  if ($(".square").hasClass("mark")) {
    $(".square").removeClass("mark");
  }
  firstRow = [];
  secondRow = [];
  thirdRow = [];
  fourthRow = [];
  $(".square").prop("disabled", false);
  $(".solve").prop("disabled", false);
  randomizeLayout();
  lightBoard();
  startTimer(1);
}

$(".solve").on("click", function () {
  if (solving == true) {
    // Remove marked squares upon click
    for (i = 0; i < gridLayout.length; i++) {
      $(".square").eq(i).removeClass("mark");
    }
    solving = false;
  } else {
    solving = true;
    solveGame();
  }
});

// Solver starts chasing the lights
function solveGame() {
  if (firstRow !== emptyRow) {
    for (var i = 0; i < 5; i++) {
      if ($(".square").eq(i).hasClass("lit")) {
        $(".square")
          .eq(i + 5)
          .addClass("mark");
      } else {
        $(".square")
          .eq(i + 5)
          .removeClass("mark");
        $(".square")
          .eq(i + 10)
          .removeClass("mark");
        $(".square")
          .eq(i + 15)
          .removeClass("mark");
      }
    }
  }

  if (firstRow == emptyRow) {
    for (var i = 5; i < 10; i++) {
      if ($(".square").eq(i).hasClass("lit")) {
        $(".square")
          .eq(i + 5)
          .addClass("mark");
      } else {
        $(".square")
          .eq(i + 5)
          .removeClass("mark");
        $(".square")
          .eq(i + 10)
          .removeClass("mark");
        $(".square")
          .eq(i + 15)
          .removeClass("mark");
      }
    }
  }
  if (secondRow == emptyRow && firstRow == emptyRow) {
    for (var i = 10; i < 15; i++) {
      if ($(".square").eq(i).hasClass("lit")) {
        $(".square")
          .eq(i + 5)
          .addClass("mark");
      } else {
        $(".square")
          .eq(i + 5)
          .removeClass("mark");
        $(".square")
          .eq(i + 10)
          .removeClass("mark");
      }
    }
  }
  if (thirdRow == emptyRow && secondRow == emptyRow && firstRow == emptyRow) {
    for (var i = 15; i < 20; i++) {
      if ($(".square").eq(i).hasClass("lit")) {
        $(".square")
          .eq(i + 5)
          .addClass("mark");
      } else {
        $(".square")
          .eq(i + 5)
          .removeClass("mark");
      }
    }
  }
  if (
    firstRow == emptyRow &&
    secondRow == emptyRow &&
    thirdRow == emptyRow &&
    fourthRow == emptyRow
  ) {
    // Answer Patterns
    if ($(".square").eq(20).hasClass("lit")) {
      $(".square").eq(3).addClass("mark");
      $(".square").eq(4).addClass("mark");
    } else if ($(".square").eq(21).hasClass("lit")) {
      $(".square").eq(1).addClass("mark");
      $(".square").eq(4).addClass("mark");
    } else if ($(".square").eq(22).hasClass("lit")) {
      $(".square").eq(3).addClass("mark");
    }
  }
}
