const form = document.querySelector(".form");
const formInput = form.querySelectorAll(".form__input");
const cardNumber = document.querySelector(".card__number");
const cardPerson = document.querySelector(".card__person");
const cardMonth = document.querySelector(".card__date--month");
const cardYear = document.querySelector(".card__date--year");
const cardPin = document.querySelector(".card__pin");
const resetButton = document.querySelector(".reset");
const inputName = document.querySelector("#name");
const inputNumber = document.querySelector("#number");
const inputMonth = document.querySelector("input[name='date_month']");
const inputYear = document.querySelector("input[name='date_year']"); // Selecionar ano individualmente
const inputPin = document.querySelector("#pin");

const btnSubmit = document.querySelector(".btn-submit");
const btnBack = document.querySelector(".btn-back");
const formWrapper = document.querySelector(".wrapper");
const completeState = document.querySelector(".complete");

inputMonth.addEventListener("input", checkDate);
inputYear.addEventListener("input", checkDate);

function checkName() {
  // initial value as false because there is no value
  let valid = false;

  const name = inputName.value;
  if (!name) {
    showError(inputName, "Can't be blank.");
    cardPerson.innerHTML = "Leonardo Machado";
  } else if (!isAlphabet(name)) {
    showError(inputName, "Wrong format");
  } else {
    showSuccess(inputName);
    cardPerson.innerHTML = name;
    valid = true;
  }
  return valid;
}

function checkNumber() {
  let valid = false;

  const number = inputNumber.value;
  if (!number) {
    showError(inputNumber, "Can't be blank.");
    cardNumber.innerHTML = "0000 0000 0000 0000";
  } else if (!isNumber(number)) {
    showError(inputNumber, "Wrong format, numbers only.");
  } else {
    showSuccess(inputNumber);
    cardNumber.innerHTML = formatNumber(number, 16);
    valid = true;
  }
  return valid;
}

function checkDate() {
  let valid = false;

  const monthValue = parseInt(inputMonth.value, 10); // Converte o valor da string em um número

  if (isNaN(monthValue) || monthValue < 1 || monthValue > 12) {
    showError(inputMonth, "Only 12 months in a year");
  } else if (!monthValue && !inputYear.value) {
    showError(inputMonth, "Can't be blank.");
    showError(inputYear, "Can't be blank.");
    cardMonth.innerHTML = "00";
    cardYear.innerHTML = "00";
  } else if (monthValue && !inputYear.value) {
    showError(inputYear, "Can't be blank.");
    cardMonth.innerHTML = formatNumber(monthValue, 2);
    cardYear.innerHTML = "00";
  } else if (!monthValue && inputYear.value) {
    showError(inputMonth, "Can't be blank.");
    cardYear.innerHTML = formatNumber(inputYear.value, 2);
    cardMonth.innerHTML = "00";
  } else if (!isNumber(inputMonth.value) && isNumber(inputYear.value)) {
   showSuccess(inputYear);
   showError(inputMonth.value, "Wrong format, numbers only.");
  } else if (isNumber(inputMonth.value) && !isNumber(inputYear.value)) {
    showSuccess(inputMonth);
    showError(inputYear, "Wrong format, numbers only.");
  } else if (!isNumber(inputMonth.value) && !isNumber(inputYear.value)) {
    showError(inputMonth, "Wrong format, numbers only.");
    showError(inputYear, "Wrong format, numbers only.");
  } else {
    showSuccess(inputMonth);
    showSuccess(inputYear);
    cardMonth.innerHTML = inputMonth.value;
    cardYear.innerHTML = inputYear.value;
    cardMonth.innerHTML = formatNumber(monthValue, 2);
    cardYear.innerHTML = formatNumber(inputYear.value, 2);
    valid = true;
  }
  return valid;
}

function checkPin() {
  let valid = false;

  const pin = inputPin.value;
  if (!pin) {
    showError(inputPin, "Can't be blank.");
    cardPin.innerHTML = "000";
  } else if (!isNumber(pin)) {
    showError(inputPin, "Wrong format, numbers only.");
  } else {
    showSuccess(inputPin);
    cardPin.innerHTML = formatNumber(pin, 3);
    valid = true;
  }
  return valid;
}

//Show error when input is invalid
function showError(input, message) {
  const invalid = input.closest(".form__item").querySelector(".invalid");
  ////// Doesn't work with classList because of pseudoclass /////
  // input.classList.remove('success')
  // input.classList.add('error')
  input.style.border = "1px solid red";
  invalid.innerHTML = message;
}

// Show/Remain active state when the input is valid
function showSuccess(input) {
  const invalid = input.closest(".form__item").querySelector(".invalid");

  input.style.background = `linear-gradient(#fff, #fff) padding-box,
    linear-gradient(to right,rgb(100, 72, 254), rgb(96, 5, 148)) border-box`;
  input.style.border = "1px solid transparent";
  invalid.innerHTML = "";
}

// To check name input
function isAlphabet(str) {
  let char = str.split("");

  if (
    char.some(
      (c) =>
        c.charCodeAt() < 65 &&
        c.charCodeAt() != 32 &&
        c.charCodeAt() != 39 &&
        c.charCodeAt() != 47
    )
  ) {
    return false;
  } else if (
    char.some(
      (c) => c.charCodeAt() > 90 && c.charCodeAt() < 97 && c.charCodeAt() > 122
    )
  ) {
    return false;
  }
  return true;
}

//To check cardNumber, date & pin input
function isNumber(str) {
  let char = str.split("");

  if (char.some((c) => c.charCodeAt() < 48 || c.charCodeAt() > 57))
    return false;
  return true;
}

// Number shown in the card
function formatNumber(str, len) {
  str = str + "0".repeat(len - str.length);
  let arr = [];
  for (let i = 0; i <= str.length; i += 4) {
    arr.push(str.slice(i, i + 4));
  }
  return arr.join(" ");
}

form.addEventListener("input", (e) => {
  switch (e.target.id) {
    case "name":
      checkName();
      break;
    case "number":
      checkNumber();
      break;
    case "date":
      checkDate();
      break;
    case "pin":
      checkPin();
      break;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let validName = checkName(),
    validNumber = checkNumber(),
    validDate = checkDate(),
    validPin = checkPin();

  if (validName && validNumber && validDate && validPin) {
    formWrapper.classList.add("hidden");
    completeState.classList.remove("hidden");
    btnBack.classList.remove("hidden");
    btnSubmit.classList.add("hidden")
  }
});

// Adicione um ouvinte de evento ao botão de redefinição.
resetButton.addEventListener("click", function (event) {
  // Evite que o formulário seja enviado quando o botão de redefinição é clicado.
  event.preventDefault();

  // Use o método reset() para limpar o formulário.
  form.reset();

  resetCardData();
});

// Ouvinte de evento para o campo de mês
inputMonth.addEventListener("input", updateCardExpiration);

// Ouvinte de evento para o campo de ano
inputYear.addEventListener("input", updateCardExpiration);

// Função para atualizar a parte de expiração do cartão
function updateCardExpiration() {
  const month = inputMonth.value || "MM";
  const year = inputYear.value || "YY";
  const cvc = inputPin.value || "000"; // Obtém o valor do campo CVC ou usa "000" como padrão

  cardMonth.textContent = `${month}`;
  cardYear.textContent = `${year}`;
  cardPin.textContent = `${cvc}`; // Define o valor do CVC
}

function resetCardData() {
  cardNumber.innerHTML = "0000 0000 0000 0000";
  cardPerson.innerHTML = "Leonardo Machado";
  cardMonth.innerHTML = "00";
  cardYear.innerHTML = "00";
  cardPin.innerHTML = "000";
}

// Ouvinte de evento para o botão "Back"
btnBack.addEventListener("click", function () {
  // Volte para o início da tela ou realize qualquer ação desejada.
  // Por exemplo, você pode redefinir o formulário aqui.
  formWrapper.classList.remove("hidden");
  completeState.classList.add("hidden");
  btnSubmit.classList.remove("hidden");
  btnBack.classList.add("hidden");
  resetButton.classList.remove("hidden");

  resetCardData();

  form.reset();
});

// Ouvinte de evento para o botão "Confirm"
btnSubmit.addEventListener("click", function (e) {
  e.preventDefault(); // Evite o envio do formulário

  let validName = checkName(),
    validNumber = checkNumber(),
    validDate = checkDate(),
    validPin = checkPin();

  if (validName && validNumber && validDate && validPin) {
    formWrapper.classList.add("hidden");
    completeState.classList.remove("hidden");
    btnBack.classList.remove("hidden");
    btnSubmit.classList.add("hidden");
    resetButton.classList.add('hidden');
    form.reset();
  }
});
