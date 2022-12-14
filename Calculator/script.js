"use strict";

/** Application  Architecture*/

const calcDisplay = document.querySelector(".calc__text");
const calcDisplayPrev = document.querySelector("calc__prev__text");
const calcPad = document.querySelector(".calc__pad");

class calculator {
  #curInput;
  #curExpression;
  #calcResult;
  #calcHistory = [];
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
    // check if button pressed is a number
    if (isFinite(inputVal) || inputVal === ".") {
      const curVal = calcDisplay.textContent;
      calcDisplay.textContent = this._validateOprend(curVal, inputVal);
      // set the value in the calcDisplay
    } else {
      // process operator or cmd
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

  commandMap(inputVal) {
    const cmdMap = new Map(
      ["clear all", this._clearAll],
      ["clear", this._clear]
    );

    const cmd = cmdMap.get(inputVal);
  }
  _storeOperator() {}

  _calcInput() {}

  _clear() {
    calcDisplay.textContent = 0;
    calcDisplayPrev.textContent = 0;
  }
  _clearAll() {}

  _updateDisplayInput() {}
} // end of calculator

const calc = new calculator();
