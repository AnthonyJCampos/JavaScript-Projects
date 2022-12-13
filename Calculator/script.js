"use strict";

const calcDisplay = document.querySelector(".calc__text");

const calcPad = document.querySelector(".calc__pad");

calcPad.addEventListener("click", function (event) {
  calcDisplay.textContent = event.target.value;
});

class calculator {
  constructor() {}

  _getCalcPadInput() {}

  _processBtnInput() {}

  _processKeyInput() {}

  _iskeyValid() {}

  _inputDelegatory() {}

  _storeOperator() {}

  _calcInput() {}

  _updateDisplayInput() {}
} // end of calculator
