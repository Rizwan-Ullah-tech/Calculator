const display = document.getElementById("showvalue");
const buttons = document.querySelectorAll(".btn, .red-btn");
const operators = ["+", "-", "*", "÷"];
let lastInput = "";
let resetNext = false;

function sanitizeInput(input) {
  // Replace unicode division with JS division
  return input.replace(/÷/g, "/");
}

function updateDisplay(value) {
  display.value = value || "0";
}

function isOperator(char) {
  return operators.includes(char);
}

function handleInput(value) {
  if (resetNext && !isOperator(value)) {
    display.value = "";
    resetNext = false;
  }
  let current = display.value === "0" ? "" : display.value;

  // Allow operator replacement
  if (isOperator(value)) {
    if (!current) return;
    if (isOperator(current.slice(-1))) {
      // Replace last operator with new one
      display.value = current.slice(0, -1) + value;
      return;
    }
  }

  // Prevent multiple decimals in a number
  if (value === ".") {
    let parts = current.split(/[\+\-\*÷]/);
    if (parts[parts.length - 1].includes(".")) return;
  }

  // Prevent leading zeros
  if (value === "0" && (!current || /[\+\-\*÷]0$/.test(current))) return;

  display.value = current + value;
}

function handleDelete() {
  if (resetNext) {
    updateDisplay("");
    resetNext = false;
    return;
  }
  display.value = display.value.slice(0, -1) || "0";
}

function handleClear() {
  updateDisplay("");
  resetNext = false;
}

function handleEvaluate() {
  let expr = sanitizeInput(display.value);
  if (!expr || isOperator(expr.slice(-1))) return;
  try {
    let result = eval(expr);
    updateDisplay(result);
    resetNext = true;
  } catch {
    updateDisplay("Error");
    resetNext = true;
  }
}

// Button click events
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const val = e.target.value;
    if (val === "AC") handleClear();
    else if (val === "DEL") handleDelete();
    else if (val === "=") handleEvaluate();
    else handleInput(val);
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  // Block function keys and most browser shortcuts
  if (
    e.ctrlKey ||
    e.altKey ||
    e.metaKey ||
    (e.key.length > 1 &&
      !["Backspace", "Enter", "=", "Delete", "Escape"].includes(e.key))
  ) {
    return;
  }
  let key = e.key;
  if (/\d/.test(key)) handleInput(key);
  else if (["+", "-", "*", "/"].includes(key))
    handleInput(key === "/" ? "÷" : key);
  else if (key === ".") handleInput(".");
  else if (key === "Enter" || key === "=") handleEvaluate();
  else if (key === "Backspace" || key === "Delete") handleDelete();
  else if (key.toLowerCase() === "c" || key === "Escape") handleClear(); // Esc for AC
});
