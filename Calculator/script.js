"use strict";

/** Application  Architecture*/

const calcDisplay = document.querySelector(".calc__text");
const calcDisplayExpress = document.querySelector(".calc__prev__text");
const calcPad = document.querySelector(".calc__pad");

class calculator {
  #curExpression = ["0"];
  #curExpPos = 0;
  #calcResult;
  #leftOprendStack = [];
  #rightOprendStack = [];
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
      console.log(this.#calcResult);
      // if calcResult is defined, reset
      if (this.#calcResult) {
        this.#calcResult = undefined;
        if (this.#curExpression.length < 2) {
          this.#curExpression[0] = "0";
        }
      }

      const curVal = this.#curExpression[this.#curExpPos];
      this.#curExpression[this.#curExpPos] = this._validateOprend(
        curVal,
        inputVal
      );
      console.log(curVal);
      this._updateDisplayInput(this.#curExpression[this.#curExpPos]);
      // set the value in the calcDisplay
    }

    if (operators.includes(inputVal)) {
      // if calcResult has not been reset insert into left oprend

      if (this.#calcResult) {
        this.#curExpression[0] = this.#calcResult;
      } // end if

      // if operator is 4th input process expression
      if (this.#curExpression.length === 3) {
        // we solve the expression using the command
        this._commandMap("=");
        // save the result as the first value, and add the operator to the expression
        this.#curExpression[0] = this.#calcResult;
        this._processOprend(inputVal);
      } // end if

      // if operator is 1st or 2nd input and is not already in expression
      if (
        !this._hasOperator(operators, inputVal) &&
        this.#curExpression.length <= 2
      ) {
        this._processOprend(inputVal);
      } // end if

      // if prev el is operator ignore
    } // end if

    const specialOps = ["sqrt", "sqr", "inverse"];
    if (specialOps.includes(inputVal)) {
      const result = this._performSpecialOp(inputVal);
      this.#calcResult = result;
      this._updateDisplayInput(result);
      this._output();
    }

    // maybe update display here

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
    this._output();
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

    // handle special cases
    const [oprendL, operator, oprendR] = this._determineExpression();
    if (operator === "/" && oprendR === "0") {
      // display error message
      calcDisplay.textContent = "Cannot divide by zero";
      this._updateDisplayExpress("");
    } else if (this.#curExpression.length === 1) {
      this.#calcResult = this.#curExpression[0];
    } else {
      // compute results
      this.#calcResult = opMap.get(operator)(oprendL, oprendR);
      // update result display field
      this._updateDisplayInput(this.#calcResult);

      this._output();
    }

    // reset position, expression and stacks
    this.#curExpPos = 0;
    this.#curExpression = ["0"];
    this.#leftOprendStack = [];
    this.#rightOprendStack = [];
    // after getting results store in history
  }

  _determineExpression() {
    let [oprendL, operator, oprendR] = this.#curExpression;
    if (!this._leftStackIsEmpty()) {
      oprendL = this._computeSpecialOp(this.#leftOprendStack);
    }

    if (!this._rightStackIsEmpty()) {
      oprendR = this._computeSpecialOp(this.#rightOprendStack);
    }

    return [oprendL, operator, oprendR];
  }

  _performSpecialOp(inputVal) {
    let result;
    if (this.#curExpPos === 0) {
      this.#leftOprendStack.push(inputVal);
      result = this._computeSpecialOp(this.#leftOprendStack);
    } // end if

    if (this.#curExpPos === 2) {
      this.#rightOprendStack.push(inputVal);
      result = this._computeSpecialOp(this.#rightOprendStack);
    } // end if

    return result;
  }

  _computeSpecialOp(stack) {
    let result = this.#curExpression[this.#curExpPos];
    stack.forEach((action) => {
      if (action === "inverse") {
        result = Math.pow(result, -1);
      }
      if (action === "sqrt") {
        result = Math.sqrt(result);
      }
      if (action === "sqr") {
        result = Math.pow(result, 2);
      }
    });
    return result;
  }

  _clear() {
    this.#curExpression = ["0"];
    this.#leftOprendStack = [];
    this.#rightOprendStack = [];
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

  _output() {
    let output = "";
    if (!this._leftStackIsEmpty()) {
      output = this._buildSpecialExpress(
        this.#leftOprendStack,
        this.#curExpression[0]
      );
    } else {
      output = this.#curExpression[0];
    }

    if (this.#curExpression.length >= 2) {
      output += ` ${this.#curExpression[1]} `;
    }

    if (this.#curExpression.length === 3) {
      if (!this._rightStackIsEmpty()) {
        output += this._buildSpecialExpress(
          this.#leftOprendStack,
          this.#curExpression[0]
        );
      } else {
        output += this.#curExpression[2];
      } // end if
    } // end if
    this._updateDisplayExpress(output);
  }

  _buildSpecialExpress(stack, oprend) {
    stack.forEach((action) => {
      oprend = `${action !== "inverse" ? action : "1/"}(${oprend})`;
    });
    return oprend;
  }

  _addToHistry() {}

  _leftStackIsEmpty() {
    if (this.#leftOprendStack.length === 0) {
      return true;
    }
    return false;
  }

  _rightStackIsEmpty() {
    if (this.#rightOprendStack.length === 0) {
      return true;
    }
    return false;
  }
} // end of calculator

const calc = new calculator();
