'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Anthony Campos',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-11-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Mike Manza',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Marissa Campos',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// current user that is displayed in the app
let currentAccount;
let timer;

// day/month/year

/** create user names */

function createUsernames(accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(text => text.charAt(0))
      .join('');
  });
} // end createUsernames

function createBalances(accounts) {
  accounts.forEach(acc => calcBalance(acc));
} // end createBalances

function calcBalance(account) {
  account.balance = account.movements.reduce(
    (prevVal, curVal) => prevVal + curVal,
    0
  );
} // end calcBalance

createUsernames(accounts);
createBalances(accounts);

function formatDate(date) {
  const option = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat(currentAccount.locale, option).format(date);
} // formatDate
/** EVENT HANDLERS  */

btnLogin.addEventListener('click', function (event, targetAcc) {
  // Prevent form from submitting
  event.preventDefault();
  currentAccount = processUserLoginInput();
  resetLoginFields();

  if (currentAccount !== undefined) {
    inputLoginPin.blur();

    if (timer) {
      clearInterval(timer);
    } // end if

    timer = startLogOutTimer();
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    // As of time in the app

    labelDate.textContent = formatDate(new Date());
    calcBalance(currentAccount);
    updateDisplay(currentAccount);
  } // end if
}); // end login button event

function processUserLoginInput() {
  const result = findUser(accounts, inputLoginUsername.value);

  if (result !== undefined && checkPin(result, inputLoginPin.value)) {
    // see if pin matches
    return result;
  } else {
    return undefined;
  } // end if
} // end processUserInput

function findUser(accounts, input) {
  return accounts.find(acc => acc.username === input);
} // end findUser

function checkPin(account, input) {
  return account.pin === Number(input);
} // end checkPin

function resetLoginFields() {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
} // end resetLoginFields

function startLogOutTimer() {
  function tick() {
    // in each call, print the remaining time to the UI
    labelTimer.textContent = timeConvert(time);

    // when 0 secs, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    } // end if

    // decrease 1s
    time--;
  }

  // set time to 5 mins
  let time = 300;
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
} // end startLogOutTimer

function timeConvert(num) {
  const min = Math.floor(num / 60);
  const sec = num % 60;
  return `${min}:${String(sec).padStart(2, 0)}`;
} // end time_convert

/** TRANSFER METHODS */

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);

  if (amount > 0 && currentAccount.balance >= amount) {
    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    if (
      receiverAcc !== undefined &&
      receiverAcc.username !== currentAccount.username
    ) {
      // do transfer
      receiverAcc.movements.push(amount);
      currentAccount.movements.push(amount * -1);

      // add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // update balance and UI
      calcBalance(currentAccount);
      updateDisplay(currentAccount);

      // reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    } // end if
  } // end if
  resetTransferFields();
});

function resetTransferFields() {
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
} // end resetTransferFields

/** REQUEST LOAN METHODS */

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0) {
    const flag = currentAccount.movements.some(mov => mov > amount * 1.1);
    // if true take out loan
    if (flag) {
      setTimeout(function () {
        // add movement
        currentAccount.movements.push(amount);

        // add loan date
        currentAccount.movementsDates.push(new Date().toISOString());

        // update UI
        calcBalance(currentAccount);
        updateDisplay(currentAccount);
        // reset timer
        clearInterval(timer);
        timer = startLogOutTimer();
      }, 2500);
    } // end if
  } // end if

  // reset field
  inputLoanAmount.value = '';
});

/** CLOSE ACCOUNT METHODS */

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // confirm username and pin
  const givenUsername = inputCloseUsername.value;
  const givenPin = inputClosePin.value;

  if (
    currentAccount.username === givenUsername &&
    currentAccount.pin === Number(givenPin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    if (index !== -1) {
      accounts.splice(index, 1);
      // Hide UI
      containerApp.style.opacity = 0;
    } // end if
  } // end if

  resetCloseAccountFields();
});

function resetCloseAccountFields() {
  inputCloseUsername.value = '';
  inputClosePin.value = '';
} // end resetCloseAccountFields

/** SORT MOVEMENTS METHODS */

// sorted state
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount, containerMovements, !sorted);
  sorted = !sorted;
});

/** OTHER FUNCTIONS */

function updateDisplay(currentAccount) {
  // Display movements
  displayMovements(currentAccount, containerMovements);
  // Display Balance
  updateBalanceElement(currentAccount, labelBalance);
  // Display summary
  updateDisplaySummary(
    currentAccount,
    labelSumIn,
    labelSumOut,
    labelSumInterest
  );
} // end updateDisplay

function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  let result;
  if (daysPassed === 0) {
    result = 'Today';
  } else if (daysPassed === 1) {
    result = 'Yesterday';
  } else if (daysPassed <= 7) {
    result = `${daysPassed} days ago`;
  } else {
    result = new Intl.DateTimeFormat(locale).format(date);
  } // end if

  return result;
} // end formatMovementDate

function formatMovementCurrency(num, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  return new Intl.NumberFormat(locale, options).format(num);
} // end formatMovementCurrency

function displayMovements(account, containerMovements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, index) {
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date, account.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const num = formatMovementCurrency(mov, account.locale, account.currency);

    const html = `<div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}
       </div>
           <div class="movements__date">${displayDate}</div>
           <div class="movements__value">${num}</div>
         </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
} // end displayMovements

function updateBalanceElement(account, element) {
  element.textContent = formatMovementCurrency(
    account.balance,
    account.locale,
    account.currency
  );
} // end updateBalance

function updateDisplaySummary(account, elementIn, elementOut, elementInterest) {
  const accLocale = account.locale;
  const accCurrency = account.currency;

  elementIn.textContent = formatMovementCurrency(
    calcSummaryIn(account.movements),
    accLocale,
    accCurrency
  );
  elementOut.textContent = formatMovementCurrency(
    calcSummaryIn(account.movements),
    accLocale,
    accCurrency
  );
  elementInterest.textContent = formatMovementCurrency(
    calcSummaryInterest(account.movements, account.interestRate),
    accLocale,
    accCurrency
  );
} // end updateDisplaySummary

function calcSummaryIn(movements) {
  return movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);
} // end calcDisplaySummary

function calcSummaryOut(movements) {
  return Math.abs(
    movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  ).toFixed(2);
} // end calcSummaryOut

function calcSummaryInterest(movements, rate) {
  return movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * rate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0)
    .toFixed(2);
} // end calcSummaryInterest
