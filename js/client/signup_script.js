import { validate_email, onlyLetters,  validate_password_confirmation, ERROR_PASSWORD_MSG, ERROR_EMAIL_MSG, ERROR_EMPTY_FILEDS} from "../validation.js";

const emailInput = document.getElementById('inputEmail');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const inputPassword = document.getElementById('inputPassword');
const repeatPassword = document.getElementById('repeatPassword');
const registerBtn = document.getElementById('registerBtn');
const modalElement = document.getElementById('signupModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');

const raiseErrorModal = function(label, text, color) {
  modalLabel.innerHTML = label;
  modalText.innerHTML = text;
  modalText.style.color = color;
  modalElement.classList.add('show');
  modalElement.style.paddingRight = '17px';
  modalElement.style.display = 'block';
}

const registerClickEvent = function(e) {
  const emailValue = emailInput.value;
  const firstNameValue = firstName.value;
  const lastNameValue = lastName.value;
  const inputPasswordValue = inputPassword.value;
  const repeatPasswordValue = repeatPassword.value;

  if (!validate_email(emailValue)){
    raiseErrorModal('Error', ERROR_EMAIL_MSG, "red");
    return false;
  } else if (!validate_password_confirmation(inputPasswordValue, repeatPasswordValue)) {
    raiseErrorModal('Error', ERROR_PASSWORD_MSG, "red");
    return false;
  } else if (firstNameValue.length < 1 || lastNameValue.length < 1) {
    raiseErrorModal('Error', ERROR_EMPTY_FILEDS, "red");
    return false;
  } else if (!onlyLetters(firstNameValue) || !onlyLetters(lastNameValue)) {
    raiseErrorModal('Error', ERROR_ONLY_LETTERS, "red");
    return false;
  };

  let url = 'http://localhost:8080/register-user';
  let options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      firstName: firstNameValue,
      lastName: lastNameValue,
      email: emailValue,
      password: inputPasswordValue
    })
  }

  fetch(url, options)
  .then(data => {
    return data.json();
  })
  .then(post => {
    if (post.success === true){
      raiseErrorModal('Congratulations!', 'You are part of our community now :)', "green");
    } else {
      raiseErrorModal('Error', 'Failed to create user', "red");
    }
  });
  
}

registerBtn.addEventListener('click', registerClickEvent);

modalCloseBtn.addEventListener('click', function() {
  modalElement.classList.remove('show');
  modalElement.style.display = 'none';
})