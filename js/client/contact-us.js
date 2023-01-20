import { validate_email} from "../validation.js";

const modalElement = document.getElementById('loginModal');
const modalLabel = document.getElementById('modalLabel');
const modalText = document.getElementById('modalText');
const modalCloseBtn = document.getElementById('modalCloseBtn');

const submit_click_event = function() {
    const email_adderess = document.getElementById('inputEmail').value;
    const name = document.getElementById('inputName').value;
    const subject = document.getElementById('dropdownList').value;
    const message = document.getElementById('formMessage').value;
    console.log(subject)
    if (!validate_email(email_adderess) || name.length === 0 || subject === null || message.length === 0){
        raiseErrorModal("Error", "Please fill all the fields, and enter a valid e-mail address","red")
        return;
    }
    var subjectText = ""
    switch(subject) {
        case 1:
            subjectText = "Billing details";
          break;
        case 2:
            subjectText = "Account management";
          break;
        case 3:
            subjectText = "Technical difficulties";
          break;
        default:
      }
      let url = '/send-contact-email';
      let options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({
          email: email_adderess,
          name: name,
          subject: subjectText,
          message: message
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
            raiseErrorModal("Success","Message has been sent!","green")
          }
      });
}

const raiseErrorModal = function(label, text, color) {
    modalLabel.innerHTML = label;
    modalText.innerHTML = text;
    modalText.style.color = color;
    modalElement.classList.add('show');
    modalElement.style.paddingRight = '17px';
    modalElement.style.display = 'block';
  }

document.getElementById('submit_btn').addEventListener('click', submit_click_event);

modalCloseBtn.addEventListener('click', function() {
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
})
