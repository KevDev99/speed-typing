const _text = document.getElementById("text");
const _userInput = document.getElementById("userInput");
const _startButton = document.getElementById("startButton");
const _game = document.getElementById("game");
const _timer = document.getElementById("timer");
const _gameFinished = document.getElementById("gameFinished");
const _resultHeader = document.getElementById("resultHeader");
const _userReply = document.getElementById("userReply");

let userInput = "";
let textToType = "";

// timer in seconds
let timerSeconds = 60;
let elapsedTimer = 0;

// game state (open, finished, expired)
type GameState = "open" | "finished" | "expired";
let gameState: GameState = "open";

const init = async () => {
  const res = await fetch(
    "http://hipsum.co/api/?type=hipster-centric&sentences=3"
  );
  const res_body: [string] = await res.json();

  if (res_body.length > 0 && _text) {
    const text = res_body[0];
    textToType = text;
    _text.innerHTML = text;
  }

  console.log(textToType.split(' ').length );

  // calculate how much time is regulary needed
  timerSeconds = textToType.split(' ').length + 15;

  _userInput?.addEventListener("input", onInput);
  _startButton?.addEventListener("click", startGame);
};

const startGame = () => {
  _game?.classList.remove("hidden");

  if (_timer) {
    _timer.innerHTML = `Timer: ${timerSeconds} seconds`;
  }

  activateTimer();

  _userInput?.focus();
};

const activateTimer = async () => {
  let currentTimer = timerSeconds;

  while (currentTimer > 0) {
    await wait(1000);
    currentTimer -= 1;
    elapsedTimer++;

    if (gameState === "finished") {
      break;
    }

    if (_timer) {
      _timer.innerHTML = `Timer: ${currentTimer.toString()} seconds`;

      if (currentTimer <= currentTimer / 3) {
        _timer.classList.add("nearlyExpired");
      }

      if (currentTimer < 5) {
        _timer.classList.add("expired");
      }

      if (currentTimer < 1) {
        setGameState("expired");
      }
    }
  }

  setTimeout(() => {
    // TODO: finish game
  }, timerSeconds * 1000);
};

const onInput = (e: Event) => {
  if (e && e.target) {
    const current_input = (e.target as HTMLInputElement).value;

    const curr_input_chars = Array.from(current_input);
    const text_to_type_chars = Array.from(textToType);

    curr_input_chars.map((char, index) => {
      let markclass = "false";
      if (curr_input_chars[index] === text_to_type_chars[index]) {
        markclass = "success";
      }

      text_to_type_chars[index] =
        `<mark class='${markclass}'>` + text_to_type_chars[index] + "</mark>";
    });

    if (_text) {
      _text.innerHTML = text_to_type_chars.join("");
    }

    if (current_input === textToType) {
      gameState === "finished";

      if (_gameFinished) {
        setGameState("finished");
      }
    }
  }
};

const setGameState = (newGameState: GameState) => {
  gameState = newGameState;

  if (_resultHeader) {
    _resultHeader.innerHTML = newGameState;
    _resultHeader.classList.add(newGameState);
    _gameFinished?.classList.remove("hidden");
    _userInput?.setAttribute("disabled", "true");
  }

  const input = (_userInput as HTMLInputElement).value.trim();
  const wordsWritten = input.split(" ").length - 1;
  const wordsFromText = textToType.split(" ").length - 1;

  if (_userReply) {
    _userReply.innerHTML = `You have typed <b>${wordsWritten}</b> Words from ${wordsFromText} in <b>${elapsedTimer} seconds</b>`;
  }
};

function wait(milisec: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, milisec);
  });
}

init();
