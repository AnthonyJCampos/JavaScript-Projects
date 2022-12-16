"use strict";

/** Application  Architecture*/

const calcDisplay = document.querySelector(".calc__text");
const calcDisplayExpress = document.querySelector(".calc__prev__text");
const calcPad = document.querySelector(".calc__pad");

class calculator {
  #curExpression = ["0"];
  #curExpPos = 0;
  #calcResult;
  #calcHistory = [];
  #cmdMap = new Map([
    ["clear", this._clear],
    ["clear entry", this._clearEntry],
    ["=", this._calcInput],
    ["sqrt", this._calcSqrt],
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
      // if calcResult is defined, reset
      this.#calcResult = undefined;

      const curVal = this.#curExpression[this.#curExpPos];
      this.#curExpression[this.#curExpPos] = this._validateOprend(
        curVal,
        inputVal
      );
      this._updateDisplayInput(this.#curExpression[this.#curExpPos]);
      // set the value in the calcDisplay
    }

    if (operators.includes(inputVal)) {
      // if calcResult has not been reset insert into left oprend
      if (this.#calcResult) {
        this.#curExpression[0] = this.#calcResult;
      } // end if
      // if operator is 1st or 2nd input and is not already in expression
      if (
        !this._hasOperator(operators, inputVal) &&
        this.#curExpression.length <= 2
      ) {
        this._processOprend(inputVal);
      } // end if
      // if operator is 4th input process expression
      if (this.#curExpression.length === 3) {
        // we solve the expression using the command
        this._commandMap("=");
        // save the result as the first value, and add the operator to the expression
        this.#curExpression[0] = this.#calcResult;
        this._processOprend(inputVal);
      } // end if

      // if prev el is operator ignore
    } // end if

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

  _processOprend(inputVal) {
    this.#curExpression[++this.#curExpPos] = inputVal;
    // update current expression display
    this._updateDisplayExpress(this.#curExpression.join(" "));
    this.#curExpPos++;
    this.#curExpression[this.#curExpPos] = "0";
    this.#curExpPos = this.#curExpPos;
  }

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
    const [oprendL, operator, oprendR] = this.#curExpression;
    this.#calcResult = opMap.get(operator)(oprendL, oprendR);
    this._updateDisplayInput(this.#calcResult);
    this._updateDisplayExpress(this.#curExpression.join(" ") + " =");
    this.#curExpPos = 0;
    this.#curExpression = ["0"];
    // after getting results store in history
  }

  _calcSqrt() {
    const result = Math.sqrt(this.#curExpression[this.#curExpPos]);
    this._updateDisplayInput(result);
  }

  _clear() {
    this.#curExpression = ["0"];
    this._updateDisplayInput(this.#curExpression[0]);
    this._updateDisplayExpress("");
  }
  _clearEntry() {
    this.#curExpression[this.#curExpPos] = "0";
    this._updateDisplayInput("0");
  }

  _updateDisplayInput(input) {
    calcDisplay.textContent = bigDecimal.getPrettyValue(input);
  }

  _updateDisplayExpress(input) {
    calcDisplayExpress.textContent = input;
  }

  _addToHistry() {}
} // end of calculator

const calc = new calculator();
