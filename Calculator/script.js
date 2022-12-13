"use strict";

const calcDisplay = document.querySelector(".calc__text");

const calcPad = document.querySelector(".calc__pad");

class calculator {
  #curInput;
  #calcResult;
  #calcHistory = [];
  constructor() {
    this._getInput();
  }

  _getInput() {
    // process input from calc pad
    calcPad.addEventListener("click", function (event) {
      // guard clause
      if (event.target.classList === "calc__pad") {
        return;
      } // end if
    });

    // process input from user's keyboard
    addEventListener("keydown", this._iskeyValid);
  }

  _processBtnInput(event) {}

  _processKeyInput() {}

  _iskeyValid(event) {
    console.log(`hi`);
  }

  _inputDelegatory() {}

  _storeOperator() {}

  _calcInput() {}

  _updateDisplayInput() {}
} // end of calculator

const calc = new calculator();
