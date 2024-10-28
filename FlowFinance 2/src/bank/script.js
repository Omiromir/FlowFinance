"use strict";

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: "Omir Sondai",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const containerForm = document.querySelector('.login')

const btnLogin = document.querySelector(".login__btn");
const btnLogout = document.querySelector(".logout__btn")
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const ctrlAll = document.querySelector(".control__all");
const ctrlDep = document.querySelector(".control__deposit");
const ctrlWtd = document.querySelector(".control__withdrawal")

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false, deposit = false, withdrawal = false) {
  containerMovements.innerHTML = "";

  let movs;

  switch (true) {
    case sort && deposit:
      movs = acc.movements.filter(mov => mov > 0).slice().sort((a, b) => a - b);
      break;
    case sort && withdrawal:
      movs = acc.movements.filter(mov => mov < 0).slice().sort((a, b) => a - b);
      break;
    case deposit:
      movs = acc.movements.filter(mov => mov > 0);
      break;
    case withdrawal:
      movs = acc.movements.filter(mov => mov < 0);
      break;
    default:
      movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
      break;
  }

  

    
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value movements__value--${type}">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc, sorted, deposit, withdrawal);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const logoutUser = function () {
  localStorage.removeItem("loggedInUser");
  
  labelWelcome.textContent = "Log in to get started";
  containerApp.style.opacity = 0;
  containerForm.style.display = "flex"
  btnLogout.style.display = "none"

  if (timer) clearInterval(timer);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      logoutUser()
    }

    time--;
  };

  let time = 1500;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

btnLogout.addEventListener('click', logoutUser)



function displayGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `${displayGreeting()}, ${
      currentAccount.owner.split(" ")[0]
    }👋`;
    containerApp.style.opacity = 100;
    containerForm.style.display = "none"
    btnLogout.style.display = "block"

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ username: currentAccount.username })
    );

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);


    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
  inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
});


btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();

    saveAccounts()
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();

      saveAccounts()
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    logoutUser()
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
let deposit = false;
let withdrawal = false;

const saveFilterSettings = () => {
  localStorage.setItem(
    "filterSettings",
    JSON.stringify({ sorted, deposit, withdrawal })
  );
};

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted, deposit, withdrawal);
  saveFilterSettings()
});

ctrlAll.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = false;
  deposit = false;
  withdrawal = false;
  displayMovements(currentAccount)
  saveFilterSettings()
});

ctrlDep.addEventListener("click", function (e) {
  e.preventDefault();
  deposit = !deposit;
  withdrawal = false;  
  displayMovements(currentAccount, sorted, deposit, withdrawal);
  saveFilterSettings()
});

ctrlWtd.addEventListener("click", function (e) {
  e.preventDefault();
  withdrawal = !withdrawal;
  deposit = false;  
  displayMovements(currentAccount, sorted, deposit, withdrawal);
  saveFilterSettings()
});

const saveAccounts = () => {
  localStorage.setItem("accounts", JSON.stringify(accounts));
};


/////////////////////
//Dark & Light toggle
const toggleBtn = document.querySelector('.dark_light__btn');

// Function to apply the saved theme from localStorage
const applySavedTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('night');
    containerMovements.classList.add('night');
  }
};

// Function to toggle the theme and save preference
const darkLgCheck = () => {
  const isNight = document.body.classList.toggle('night');
  containerMovements.classList.toggle('night', isNight); 
  localStorage.setItem('theme', isNight ? 'dark' : 'light'); 
};

toggleBtn.addEventListener('click', darkLgCheck);

window.onload = function () {
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const savedFilters = JSON.parse(localStorage.getItem("filterSettings"));
  const storedAccounts = JSON.parse(localStorage.getItem("accounts"));

  if (storedAccounts) {
    storedAccounts.forEach((storedAcc, i) => {
      // Update the account objects in the `accounts` array with saved data
      accounts[i].movements = storedAcc.movements;
      accounts[i].movementsDates = storedAcc.movementsDates;
    });
  }

  if (storedUser) {
    currentAccount = accounts.find(acc => acc.username === storedUser.username);

    if (currentAccount) {
      labelWelcome.textContent = `${displayGreeting()}, ${currentAccount.owner.split(' ')[0]} 👋`;
      timer = startLogOutTimer();
      containerApp.style.opacity = 100;
      containerForm.style.display = "none";
      btnLogout.style.display = "block";

      if (savedFilters) {
        sorted = savedFilters.sorted;
        deposit = savedFilters.deposit;
        withdrawal = savedFilters.withdrawal;
      }

      updateUI(currentAccount);
      displayMovements(currentAccount, sorted, deposit, withdrawal);
    }
  }
  applySavedTheme();
};

