"use strict"
import { ERROR_PASSWORD_MSG, validate_email, validate_password } from "../validation.js";
let recaptcha;
const modalElement = document.getElementById('loginModal');
const modalLabel = document.getElementById('modalLabel');
const modalText = document.getElementById('modalText');
const emailInput = document.getElementById('inputEmail');
const passwordInput = document.getElementById('inputPassword');
const loginBtn = document.getElementById('loginBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const rememberMe = document.getElementById("customCheck");

export const raiseErrorModal = function(label, text, color) {
    modalLabel.innerHTML = label;
    modalText.innerHTML = text;
    modalText.style.color = color;
    modalElement.classList.add('show');
    modalElement.style.paddingRight = '17px';
    modalElement.style.display = 'block';
  }

const loginClickEvent = function(e) {
    console.log(document.querySelector('#g-recaptcha-response').value)
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    if (!validate_email(emailValue) || !validate_password(passwordValue)){
        modalLabel.innerHTML ='Error';
        modalText.innerHTML = ERROR_PASSWORD_MSG;
        modalText.style.color = "red";
        modalElement.classList.add('show');
        modalElement.style.paddingRight = '17px';
        modalElement.style.display = 'block';
        return;
    }


    

    let url = '/login-user';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
        email: emailValue,
        password: passwordValue,
        rememberMe: rememberMe.checked
        })
    }

    fetch(url, options)
    .then(data => {
        return data.json();
    })
    .then(post => {
        if (post.success !== true){
            raiseErrorModal('Error', post.msg, 'red');
        }else{
            window.location.href = "/dashboard";
        }
    });
}

loginBtn.addEventListener('click', loginClickEvent);

modalCloseBtn.addEventListener('click', function() {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
})