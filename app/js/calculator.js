import { pipe, add, sub, div, mul, selector, selectors, arrToStr } from "./helper.js";

//Get all the  Dom Element action and type of button
const decimal = selector("[data-type='decimal']");
const display = selector(".calc__text-current");
const previous = selector(".calc__text-previous");
const reset = selector("[data-reset='reset']");
const del = selector("[data-del='del']");
const equal = selector("[data-compute='equal']");
const operators = selectors("[data-action]");
const buttons = selectors("[data-type='num']");

// get value of text
const value = (elem) => elem.textContent;
const getOperator = (ops) => operatorList[ops];

//store operand
let operand = "";
let temp = "";
let current = [];
let result = "";

//Operators
let operatorList = { add: "+", subtract: "-", multiply: "*", divide: "/" };

//Action
let action = {
  "*": mul,
  "+": add,
  "-": sub,
  "/": div,
};

//Return Boolean
const isOperator = (ops) => Object.values(operatorList).includes(ops);

//Clear display
const clear = () => {
  operand = "";
  current = [];
  temp = "";
  previous.textContent = "";
};

//Concat operand
const concatOperands = (data) => {
  operand += data.toString();
  return operand;
};

/*--------------Display Result------------------*/
const displayResult = (operand) => {
  display.textContent = operand;
};

const displayPrevious = (operand) => {
  previous.textContent = operand;
};

//check to see if second last char is operator
const isLastCharOperator = (data) => isOperator(data.slice(-1).toString());

//
const removeOperatorFromEnd = (data) => (boolean) => {
  return boolean ? data.slice(0, data.length - 1) : data;
};

/*------------------Computation----------------*/
const compute = (data) => {
  //Transition Dom
  display.classList.contains("active") && display.classList.remove("active");

  if (data.length === 0) return "";

  let ops = data.slice(0, 1).toString();

  //Display error if it start with operator "div or mul".
  if (isOperator(ops)) {
    if (ops == "-" || ops == "+") {
      data.unshift("0");
    } else {
      return "error";
    }
  }

  //sanitize Data
  let newData = pipe(isLastCharOperator, removeOperatorFromEnd(data))(data);

  return newData.reduce((acc, prev, idx, value) => {
    if (isOperator(prev)) {
      acc = action[prev](+acc, +value[idx + 1]);
    }
    return acc;
  });
};

//Calculate on top screen
const topScreenComputation = () => {
  let dataSet = [...current, operand];

  result = pipe(isLastCharOperator, removeOperatorFromEnd(dataSet), compute)(dataSet);
  pipe(displayResult)(result);
  return result;
};

/*-----------Operation------------------*/
//Reset keypad
reset.addEventListener("click", () => {
  pipe(clear, displayResult)("");
});

//Del keypad
del.addEventListener("click", () => {
  //delete only when operand is empty
  if (!operand) current.splice(-1, 1);

  //delete last operand
  operand = operand.slice(operand.length);

  //glob result set to zero when length of the current array is 0
  result = current.length === 0 ? 0 : compute(current);

  //Display computation on bottom screen
  pipe(compute, displayResult)(current);

  //Display computation on top screen
  pipe(arrToStr, displayPrevious)(current);
});

//Number keypad
buttons.forEach((keypad) => {
  keypad.addEventListener("click", () => {
    //Display computation on bottom screen
    pipe(value, concatOperands, displayResult)(keypad);

    //Compute all the top screen value on key pressed
    pipe(topScreenComputation)(current);

    //display on top of screen if and only length result > 1
    let val = `${arrToStr(current)}${operand}`;
    val.length > 1 ? pipe(displayPrevious)(val) : "";
  });
});

//decimal keypad
decimal.addEventListener("click", () => {
  //no consecutive decimal is allowed on same operand
  if (operand.includes(value(decimal))) return;
  pipe(value, concatOperands, displayResult)(decimal);
});

//Equal keypad
equal.addEventListener("click", () => {
  //transition
  display.classList.add("active");
  //Reset all the field(s)
  pipe(clear, displayResult)("");
  //Display calculation final result
  pipe(displayResult)(result);
  current = current.concat(result);
});

const operation = (ops) => {
  //operand with decimal should at have length of two
  //eg: 0.2, .2, 2.;
  if (operand.includes(".") && operand.length <= 1) return;

  //prefix 0 before decimal eg : .1 => 0.1
  operand = operand.indexOf(".") === 0 ? operand.replace(".", "0.") : operand;

  //Merge the all the operand and operators
  current = [...current, operand, getOperator(ops)];
  operand = "";

  //remove all empty space
  current = current.filter((val) => val !== "");
  let lastChar = current.slice(-1).toString();
  let secondLastChar = current.slice(current.length - 2, -1).toString();

  if (isOperator(secondLastChar) && isOperator(lastChar)) {
    let val = current.slice(0, current.length - 1);
    val.splice(current.length - 2, 1, lastChar);
    current = val;
  }

  pipe(displayPrevious)(current.join(""));
};

//Operation selectors
operators.forEach((key) => {
  key.addEventListener("click", () => {
    operation(key.dataset.action);
  });
});
