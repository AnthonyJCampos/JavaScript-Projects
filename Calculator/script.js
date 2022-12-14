"use strict";

/** Application  Architecture*/

const calcDisplay = document.querySelector(".calc__text");
const calcDisplayPrev = document.querySelector(".calc__prev__text");
const calcPad = document.querySelector(".calc__pad");

class calculator {
  #curInput;
  #curExpression;
  #calcResult;
  #calcHistory = [];
  #cmdMap = new Map([
    ["clear", this._clear],
    ["clear entry", this._clearEntry],
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
      const curVal = calcDisplay.textContent;
      calcDisplay.textContent = this._validateOprend(curVal, inputVal);
      // set the value in the calcDisplay
    } else {
      this._commandMap(inputVal);
    }
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
    this.#cmdMap.get(inputVal)();
  }
  _storeOperator() {}

  _calcInput() {}

  _clear() {
    calcDisplay.textContent = 0;
    calcDisplayPrev.textContent = "";
  }
  _clearEntry() {
    calcDisplay.textContent = 0;
  }

  _updateDisplayInput() {}
} // end of calculator

const calc = new calculator();
