"use strict";

/** Application  Architecture*/

const calcDisplay = document.querySelector(".calc__text");
const calcDisplayExpress = document.querySelector(".calc__prev__text");
const calcPad = document.querySelector(".calc__pad");

class calculator {
  #curInput;
  #curExpression = ["0"];
  #curExpPos = 0;
  #calcResult;
  #calcHistory = [];
  #cmdMap = new Map([
    ["clear", this._clear],
    ["clear entry", this._clearEntry],
    ["=", this._calcInput],
  ]);

  constructor() {
    this._getInput();
  }

  _getInput() {
    // process input from calc pad
    calcPad.addEventListener("click", this._processBtnInput.bind(this));

    // process input from user's keyboard
    addEventListener("keydown", this._iskeyValid.bind(this));
  }

  _processBtnInput(event) {
    if (event.target.classList === "calc__pad") {
      return;
    } // end if

    const inputVal = event.target.value;
    this._inputDelegatory(inputVal);
  }

  _processKeyInput() {}

  _iskeyValid(event) {
    console.log(`hi`);
  }

  _inputDelegatory(inputVal) {
    const operators = ["/", "*", "-", "+"];
    // check if button pressed is a number or decimal
    if (isFinite(inputVal) || inputVal === ".") {
      const curVal = this.#curExpression[this.#curExpPos];
      this.#curExpression[this.#curExpPos] = this._validateOprend(
        curVal,
        inputVal
      );
      calcDisplay.textContent = this.#curExpression[this.#curExpPos];
      // set the value in the calcDisplay
    }

    if (operators.includes(inputVal)) {
      // so if operator is 1st or 2nd input and is not already in expression

      if (
        !this._hasOperator(operators, inputVal) &&
        this.#curExpression.length <= 2
      ) {
        let curPos = this.#curExpPos;
        this.#curExpression[++curPos] = inputVal;
        calcDisplayExpress.textContent = this.#curExpression.join(" ");
        curPos++;
        this.#curExpression[curPos] = "0";
        this.#curExpPos = curPos;
        console.log(this.#curExpression);
        // update current expression display
      }
      // if operator is 4th input process expression
      if (this.#curExpression.length === 3) {
        // we solve the expression using the command
        // save the result as the first value, and add the operator to the expression
      }
      // if prev el is operator ignore
    }

    // we can just run the commmand at the end for now
    this._commandMap(inputVal);
  }

  _hasOperator(operators, inputVal) {
    this.#curExpression.forEach((el) => {
      if (operators.findIndex((op) => op === el) > -1) {
        return true;
      }
    });
    return false;
  } // end _hasOperator

  _validateOprend(val, inputVal) {
    if (val === "0" && inputVal !== ".") {
      return (val = inputVal);
    }

    if (inputVal === "." && !val.includes(".")) {
      return (val += inputVal);
    }

    if (inputVal !== ".") {
      return (val += inputVal);
    }

    return val;
  } // end

  _commandMap(inputVal) {
    const cmd = this.#cmdMap.get(inputVal)?.bind(this);
    if (!cmd) {
      return;
    }
    cmd();
  }
  _storeOperator() {}

  _calcInput() {
    const opMap = new Map([
      ["+", bigDecimal.add],
      ["-", bigDecimal.subtract],
      ["*", bigDecimal.multiply],
      ["/", bigDecimal.divide],
    ]);
    // index 1 should always be the operator
    let expression = this.#curExpression;
    const [oprendL, operator, oprendR] = expression;
    const result = opMap.get(operator)(oprendL, oprendR);
    calcDisplay.textContent = result;
    calcDisplayExpress.textContent = expression.join(" ") + "=";
    expression = [String(result)];
    this.#curExpression = expression;
    // will need to look into this
    // The MS calc will continue using the result unless you enter a number

    // possible solution don't store the first num right away
    // until we get an operator
    this.#curExpPos = 0;
    console.log(this.#curExpression);

    // will need to update for when the user just hits equal with
    // no operator
    //return opMap.get(operator)(oprendL, oprendR);
  }

  _clear() {
    this.#curExpression = ["0"];
    calcDisplay.textContent = this.#curExpression[0];
    calcDisplayExpress.textContent = "";
  }
  _clearEntry() {
    this.#curExpression[this.#curExpPos] = "0";
    calcDisplay.textContent = 0;
  }

  _updateDisplayInput() {}
} // end of calculator

const calc = new calculator();
