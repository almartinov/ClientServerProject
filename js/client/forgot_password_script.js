import { validate_email } from "../validation.js";
// style="padding-right: 17px; display: block;"
const modalElement = document.getElementById('forgotModal');
const modalLabel = document.getElementById('modalLabel');
const modalText = document.getElementById('modalText');
const emailInput = document.getElementById('inputEmail');
const ressetBtn = document.getElementById('ressetBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

const raiseStatusModal = function(data) {
    modalLabel.innerHTML = data.success === true ? 'Excellent!' : 'Error!';
    modalText.innerHTML = data.success === true ? 'You can see the password in your email!' : 'No such email in the system';
    modalText.style.color = data.success === true ? "green" : "red";
    modalElement.classList.add('show');
    modalElement.style.paddingRight = '17px';
    modalElement.style.display = 'block';
}

const resetPasswordClickEvent = function(e) {
    const emailValue = emailInput.value;
    if (!validate_email(emailValue)){
        modalLabel.innerHTML ='Error';
        modalText.innerHTML = 'Invalid Email';
        modalText.style.color = "red";
        modalElement.classList.add('show');
        modalElement.style.paddingRight = '17px';
        modalElement.style.display = 'block';
        return false;
    }

    fetch(`forgot-password/${emailValue}`)
    .then(data => {
        return data.json();
    })
    .then(post => {
        raiseStatusModal(post);
    });
}

ressetBtn.addEventListener('click', resetPasswordClickEvent);

modalCloseBtn.addEventListener('click', function() {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
})