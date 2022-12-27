"use strict";

class calculator {
  #curExpression = ["0"];
  #curExpPos = 0;
  #calcResult;
  #solvedFlag = false;
  #leftOprendStack = [];
  #rightOprendStack = [];
  #cmdMap = new Map([
    ["clear", this._clear],
    ["clear entry", this._clearEntry],
    ["=", this._calcInput],
    ["back", this._back],
    ["+/-", this._negate],
    ["%", this._percent],
  ]);

  constructor() {
    this._getInput();
  }

  _getInput() {
    // process input from calc pad

    // process input from user's keyboard
    addEventListener("keydown", this._iskeyValid.bind(this));

    this._initElements();
  }

  _processBtnInput(event) {
    if (!event.target.closest(".btn")) {
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
      if (this.#calcResult && this.#getPositionInExpression() === 2) {
        this._resetData();
      }

      // if calcResult is defined, reset
      if (this.#calcResult) {
        this.#calcResult = undefined;
        if (this.#curExpression.length < 2) {
          this.#curExpression[0] = "0";
        }
      }

      // check if currently at operator
      if (this.#getPositionInExpression() === 1) {
        this.#incremenetPosition();
        this.#setCurrentPosValue("0");
        //this.#curExpression[this.#curExpPos] = "0";
      }

      // const curVal = this.#curExpression[this.#curExpPos];
      this.#setCurrentPosValue(
        this._validateOprend(this.#getCurrentPosValue(), inputVal)
      );

      this._updateDisplayInput(this.#getCurrentPosValue());
      // set the value in the calcDisplay
    }

    if (operators.includes(inputVal)) {
      /** Refactored Code */
      // so if expression is full & there is a result
      // or if operator is 4th input process expression
      if (this.#getPositionInExpression() === 2) {
        // if operator is 4th input process expression
        !this.#calcResult && this._commandMap("=");
        // save the result as the first value, and add the operator to the expression
        this.#resetExpression();
        this.#setCurrentPosition(0);
        this.#setCurrentPosValue(this.#calcResult);
        this._processOprend(inputVal);
      }
      // if operator is 1st or 2nd input and is not already in expression
      if (
        !this._hasOperator(operators, inputVal) &&
        // this.#curExpression.length < 2
        this.#getPositionInExpression() === 0
      ) {
        this._processOprend(inputVal);
      } // end if

      // if prev el is operator ignore
    } // end if

    const specialOps = ["sqrt", "sqr", "inverse"];
    if (specialOps.includes(inputVal)) {
      // if currently positioned on a operator,
      // take first left oprend and use it
      if (this.#curExpPos === 1) {
        if (!this._leftStackIsEmpty()) {
          this.#curExpression.push(this.#calcResult);
        } else {
          this.#curExpression.push(this.#curExpression[0]);
        }
        this.#curExpPos++;
      }

      let output = " ";
      let result;
      if (
        inputVal === "inverse" &&
        this.#curExpression[this.#curExpPos] === "0"
      ) {
        this._resetData();
        output = "1/(0)";
        result = "Cannot divide by zero";
      } else {
        result = this._performSpecialOp(inputVal);
        output = this._output();
        this.#calcResult = result;
      }
      this._updateDisplayInput(result);
      this._updateDisplayExpress(output);
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

  _processOprend(inputVal) {
    this.#curExpression[++this.#curExpPos] = inputVal;
    // update current expression display
    const output = this._output();
    this._updateDisplayExpress(output);
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
    const [displayInput, displayExpression] = cmd();
    console.log(displayInput, displayExpression);
    displayInput && this._updateDisplayInput(displayInput);
    displayExpression && this._updateDisplayExpress(displayExpression);

    // update displays with results
  }
  _storeOperator() {}

  _calcInput() {
    const expression = this.#curExpression;
    const opMap = new Map([
      ["+", bigDecimal.add],
      ["-", bigDecimal.subtract],
      ["*", bigDecimal.multiply],
      ["/", bigDecimal.divide],
    ]);

    let result;
    // its a special event when the user tries to compute already solved special operator
    let specialEvent = false;
    // index 1 should always be the operator
    if (expression.length === 1) {
      // if there is only a single oprend, then return itself

      if (this._leftStackIsEmpty()) {
        result = expression[0];
      } else {
        result = this._computeSpecialOp(this.#leftOprendStack, 0);
        // we set it to true, as this special case has occured
        specialEvent = true;
      }
    }

    if (expression.length === 2) {
      // if there is only one oprend then make this oprend the 2nd one as well
      //expression.push(expression[0]);
      this.#copyLeftOprendToRight();
    }

    let error = false;
    if (expression.length === 3) {
      const [oprendL, operator, oprendR] = this._determineExpression();

      if (operator === "/" && oprendR === "0") {
        // display error message
        error = true;
        result = "Cannot divide by zero";
      }

      if (!error) {
        // compute results
        result = opMap.get(operator)(oprendL, oprendR);
      }
    }

    let output = " ";
    if (!error) {
      output = this._output() + " =";
      this.#calcResult = result;
      // after getting results store in history
      this._addToHistry();
      this._updateSolvedState(true);
    } else {
      this._updateSolvedState(false);
      this._resetData();
    }

    // update result display field
    //this._updateDisplayInput(result);
    //this._updateDisplayExpress(output);

    // take care of special event
    if (specialEvent) {
      // set left oprend to result
      expression[0] = result;
      // and clear any special operations
      this.#leftOprendStack = [];
    } // end if

    // update result display field
    return [result, output];
  }

  _determineExpression() {
    let [oprendL, operator, oprendR] = this.#curExpression;
    if (!this._leftStackIsEmpty()) {
      oprendL = this._computeSpecialOp(this.#leftOprendStack, 0);
    }

    if (!this._rightStackIsEmpty()) {
      oprendR = this._computeSpecialOp(this.#rightOprendStack, 2);
    }

    return [oprendL, operator, oprendR];
  }

  _performSpecialOp(inputVal) {
    let result;
    if (this.#curExpPos === 0) {
      this.#leftOprendStack.push(inputVal);
      result = this._computeSpecialOp(this.#leftOprendStack, 0);
    } // end if

    if (this.#curExpPos === 2) {
      this.#rightOprendStack.push(inputVal);
      result = this._computeSpecialOp(this.#rightOprendStack, 2);
    } // end if

    return result;
  }

  _computeSpecialOp(stack, pos) {
    let result = this.#curExpression[pos];
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

  _percent() {
    // if position 0 set to zero
    const pos = this.#getPositionInExpression();
    if (pos === 0) {
      this.#setCurrentPosValue("0");
      return ["0", this.#getCurrentPosValue()];
    }

    // if POS 1, copy left oprend to right oprend
    if (pos === 1) {
      this.#incremenetPosition();
      this.#copyLeftOprendToRight();
    }
    // account for special operations
    const [leftOp, , rightOp] = this._determineExpression();

    // (POS1 * POS2 / 100), Then set POS2 to result
    const result = bigDecimal.divide(
      bigDecimal.multiply(leftOp, rightOp),
      "100",
      2
    );
    this.#setCurrentPosValue(result);
    // if right position has special operators, clear
    this.#rightOprendStack = [];
    return [result, this._output()];
  }

  _negate() {
    // if current position is 1, do nothing
    if (this.#curExpPos === 1) {
      return [];
    }

    this.#curExpression[this.#curExpPos] = bigDecimal.negate(
      this.#curExpression[this.#curExpPos]
    );

    //this._updateDisplayInput(this.#curExpression[this.#curExpPos]);
    return [this.#getCurrentPosValue()];
  }

  _back() {
    // if current position is 1 do nothing
    if (this.#curExpPos === 1) {
      return [];
    }

    // if full expression solved
    // e.i the display contains a '=' sign
    // clear special stacks, and display
    if (this._getSolvedState()) {
      this._updateSolvedState(false);
      this.#leftOprendStack = [];
      this.#rightOprendStack = [];
      //this._updateDisplayExpress("");
      return [, " "];
    }

    // this is for special operations
    if (this.#calcResult) {
      return [];
    }

    // get current position value and remove a single char
    let curVal = this.#curExpression[this.#curExpPos];
    // if there is only a single char, turn it to 0
    if (curVal.length === 1) {
      curVal = "0";
    } else {
      // else remove last char
      curVal = curVal.slice(0, -1);
    }

    // update the current expression
    this.#curExpression[this.#curExpPos] = curVal;
    //updated display Input
    //this._updateDisplayInput(curVal);
    return [this.#getCurrentPosValue()];
  }

  _clear() {
    this._resetData();
    //this._updateDisplayInput(this.#curExpression[0]);
    //this._updateDisplayExpress("");
    // return input and expression
    return [this.#getCurrentPosValue(), " "];
  }

  _resetData() {
    // reset position, expression and stacks
    this.#curExpPos = 0;
    this.#curExpression = ["0"];
    this.#leftOprendStack = [];
    this.#rightOprendStack = [];
    this.#calcResult = undefined;
    this._updateSolvedState(false);
  }
  _clearEntry() {
    // if the current state is solved, clear all
    if (this._getSolvedState()) {
      //this._clear();
      return this._clear();
    }
    // don't clear operators
    if (this.#curExpPos !== 1) {
      this.#curExpression[this.#curExpPos] = "0";
    }

    //this._updateDisplayInput("0");
    return [this.#getCurrentPosValue()];
  }

  _output() {
    let output = " ";
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
          this.#rightOprendStack,
          this.#curExpression[2]
        );
      } else {
        output += this.#curExpression[2];
      } // end if
    } // end if

    return output;
  }

  _buildSpecialExpress(stack, oprend) {
    stack.forEach((action) => {
      oprend = `${action !== "inverse" ? action : "1/"}(${oprend})`;
    });
    return oprend;
  }

  _updateDisplayInput(input) {
    const calcDisplay = document.querySelector(".calc__text");

    console.log(calcDisplay.clientWidth);
    if (isFinite(input)) {
      calcDisplay.textContent = bigDecimal.getPrettyValue(input);
    } else {
      calcDisplay.textContent = input;
    }
  }

  _updateDisplayExpress(input) {
    const calcDisplayExpress = document.querySelector(".calc__prev__text");
    calcDisplayExpress.textContent = input;
  }

  _updateSolvedState(bool) {
    this.#solvedFlag = bool;
  }

  _getSolvedState() {
    return this.#solvedFlag;
  }

  #setCurrentPosValue(value) {
    this.#curExpression[this.#getPositionInExpression()] = value;
  } // end setCurrentPosValue

  #copyLeftOprendToRight() {
    // copy left oprend to right oprend
    this.#curExpression[2] = this.#curExpression[0];
    // copy left oprend special operator stack to right stack
    this.#rightOprendStack = [...this.#leftOprendStack];
  } // end copyLeftOprendToRight
  #getCurrentPosValue() {
    return this.#curExpression[this.#getPositionInExpression()];
  } // end #getCurrentPosValue
  #getCurrentExpression() {
    return this.#curExpression;
  } // end getCurrentExpression

  #resetExpression() {
    this.#curExpression = [];
  } // end #resetExpression
  #setCurrentPosition(position) {
    this.#curExpPos = position;
  }
  #getPositionInExpression() {
    return this.#curExpPos;
  } // end getCurrentPosition
  #incremenetPosition() {
    this.#curExpPos++;
  } // end incremenetPosition

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

  _addToHistry() {
    const historyList = document.querySelector(".history__list");

    // need to build expression in event of special operations
    // can use the ouput method for this
    const expression = this._output();

    const html = `<il class="history__item">
    <div class="history__item--expression">${expression} =</div>
    <div class="history__item--result">${this.#calcResult}</div></il>`;

    historyList.insertAdjacentHTML("afterbegin", html);
  }

  _clearHistory() {
    const historyList = document.querySelector(".history__list");
    while (historyList.firstChild) {
      historyList.removeChild(historyList.firstChild);
    }
  }

  _initElements() {
    this._initHistory();
    this._initCalcPad();
  }

  _initCalcPad() {
    // get the current button set for the calculator
    const calcPad = document.querySelector(".calc__pad");
    // set the click event for these buttons
    calcPad.addEventListener("click", this._processBtnInput.bind(this));

    // set the visual effects for the calculator buttons
    calcPad.addEventListener("mouseover", function (event) {
      if (!event.target.closest(".btn")) {
        return;
      }

      event.target.style.color = "white";
      event.target.style.backgroundColor = "gray";

      if (event.target.childNodes[1]) {
        event.target.childNodes[1].style.color = "white";
        event.target.childNodes[1].style.backgroundColor = "gray";
      }

      if (event.target.value !== "back") {
        if (event.target.classList.value !== "expo") {
          event.target.style.fontSize = "50px";
        } else {
          event.target.parentNode.style.color = "white";
          event.target.parentNode.style.backgroundColor = "gray";
          event.target.parentNode.style.fontSize = "50px";
          event.target.style.fontSize = "50%";
        }
      } else {
        event.target.style.fontSize = "32px";
      }
    });
    calcPad.addEventListener("mouseout", function (event) {
      if (!event.target.closest(".btn")) {
        return;
      }

      if (event.target.classList.value !== "expo") {
        event.target.style.color = "gray";
        event.target.style.backgroundColor = "white";
        event.target.style.fontSize = "20px";
      }

      if (event.target.childNodes[1]) {
        event.target.childNodes[1].style.color = "gray";
        event.target.childNodes[1].style.backgroundColor = "white";
        event.target.childNodes[1].style.fontSize = "50%";
      }
    });
  }

  _initHistory() {
    const clearHistoryBtn = document.querySelector(".btn__history");
    clearHistoryBtn.addEventListener("click", this._clearHistory.bind(this));

    clearHistoryBtn.addEventListener("mouseover", function (event) {
      clearHistoryBtn.style.backgroundColor = "gray";
      const [svgGray, svgWhite] = clearHistoryBtn.children;
      svgGray.classList.add("hidden");
      svgWhite.classList.remove("hidden");
    });

    clearHistoryBtn.addEventListener("mouseout", function (event) {
      clearHistoryBtn.style.backgroundColor = "white";
      const [svgGray, svgWhite] = clearHistoryBtn.children;
      svgGray.classList.remove("hidden");
      svgWhite.classList.add("hidden");
    });
  }
} // end of calculator

const calc = new calculator();
