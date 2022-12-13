"use strict";

/** Application  Architecture*/

const calcDisplay = document.querySelector(".calc__text");
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
    // check if button pressed is a number
    if (isFinite(inputVal)) {
      // first check value currently in display
      let curVal = calcDisplay.textContent;
      // if zero replace
      if (Number(curVal) === 0) {
        curVal = inputVal;
      } else if (Number(curVal) !== 0) {
        curVal += inputVal;
      }
      calcDisplay.textContent = curVal;
      // set the value in the calcDisplay
    } else {
      // process operator or cmd
    }
  }

  _commandMap(inputVal) {
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
  }
  _clearAll() {}

  _updateDisplayInput() {}
} // end of calculator

const calc = new calculator();
