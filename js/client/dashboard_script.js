import { validate_email, isValidDate } from "../validation.js";
let dataSet = [];
var table;
const newTreatmentInfoInput = document.getElementById('newTreatmentInformation');
const newTreatmentDateInput = document.getElementById('newTreatmentDate');
const newTreatmentEmailInput = document.getElementById('newTreatmentEmail');
const newTreatmentCarInput = document.getElementById('newTreatmentCar');
const addTreatmentBtn = document.getElementById('addTreatmentBtn');

fetch(`/dashboard/get-database`)
    .then(data => {
        return data.json();
    })
    .then(post => {
      for(let i=0;i<post.treatments.length; i++){
        let newElement = Object.values(post.treatments[i]).slice(1, 6);
        newElement[2] = newElement[2].slice(0,10);
        dataSet.push(newElement);
      }

      table = $(document).ready(function () {
        $('#dataTable').DataTable({
            data: dataSet,
            columns: [
                { title: 'Treatment Number' },
                { title: 'Treatment Information' },
                { title: 'Date' },
                { title: 'Worker email' },
                { title: 'Car Number' },
                {
                  title: 'Actions',
                  render: function (data, type, row, meta) {
                      // Return an edit button
                      return '<button class="edit-button btn-primary" data-id="' + row + '">Edit</button> <button class="delete-button btn-primary" data-id="' + row.id + '">Delete</button>';
                  }
              }
            ],
        });

      });
    });


const addTreatmentClickEvent = function(e) {
  const treatmentInfo = newTreatmentInfoInput.value;
  const treatmentDate = newTreatmentDateInput.value;
  const treatmentEmail = newTreatmentEmailInput.value;
  const treatmentCar = newTreatmentCarInput.value;

  if (!validate_email(treatmentEmail)){
    console.log("INVALID EMAIL")
    return;
  } else if (!isValidDate(treatmentDate)) {
    console.log("INVALID DATE")
    return;
  } else if ( treatmentInfo.length <= 0 || treatmentCar.length <= 0){
    console.log("NOT ALL FILLED")
    return;
  }
  console.log(treatmentInfo, treatmentDate, treatmentEmail, treatmentCar)

  var rowData = {
    treatmentInformation : treatmentInfo,
    date : treatmentDate,
    workerEmail : treatmentEmail,
    carNumber : treatmentCar
  };

  let url = `/dashboard/add-treatment/`;
    let options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:JSON.stringify(rowData)
    }
  
    fetch(url, options)
    .then(data => {
      return data.json();
    })
    .then(post => {
      if (post.success === true){
        console.log('GOOD');
      } else {
        console.log('There was something wrong with the server, please refresh');
      }
      location.reload();
    });
}

addTreatmentBtn.addEventListener('click', addTreatmentClickEvent);



// Handle the click event for the edit button
$('#dataTable').on('click', '.edit-button', function () {
  $(this).closest('tr').find('td:not(:first-child)').attr('contenteditable', true);

  // add a save button to the row
  $(this).after('<button class="save-button" style="margin: 5px;">Save</button>');
  $('.edit-button').attr('disabled', true);
  var oldRowData = {
    treatmentNumber : $(this).closest('tr').find('td')['0'].innerHTML,
    treatmentInformation : $(this).closest('tr').find('td')['1'].innerHTML,
    date : $(this).closest('tr').find('td')['2'].innerHTML,
    workerEmail : $(this).closest('tr').find('td')['3'].innerHTML,
    carNumber :$(this).closest('tr').find('td')['4'].innerHTML
  };
  // add an event listener for the save button
  $('.save-button').on('click', function() {
    // disable the inline editor
    $(this).closest('tr').find('td').attr('contenteditable', false);

    // get the updated row data
    var rowData = {
      treatmentNumber : $(this).closest('tr').find('td')['0'].innerHTML,
      treatmentInformation : $(this).closest('tr').find('td')['1'].innerHTML,
      date : $(this).closest('tr').find('td')['2'].innerHTML,
      workerEmail : $(this).closest('tr').find('td')['3'].innerHTML,
      carNumber :$(this).closest('tr').find('td')['4'].innerHTML
    };

    if(!validate_email(rowData.workerEmail) || !isValidDate(rowData.date)){
      $(this).closest('tr').find('td')['1'].innerHTML = oldRowData.treatmentInformation;
      $(this).closest('tr').find('td')['2'].innerHTML = oldRowData.date;
      $(this).closest('tr').find('td')['3'].innerHTML = oldRowData.workerEmail;
      $(this).closest('tr').find('td')['4'].innerHTML = oldRowData.carNumber;
      $(this).remove();
      $('.edit-button').attr('disabled', false);
      return;
    }

    // TODO: SEND TO SERVER TO EDIT THE ROW IN THE DB
    let url = `/dashboard/update-treatment/`;
    let options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body:JSON.stringify(rowData)
    }
  
    fetch(url, options)
    .then(data => {
      return data.json();
    })
    .then(post => {
      if (post.success === true){
        console.log('GOOD');
      } else {
        console.log('There was something wrong with the server, please refresh');
      }
    });

    // remove the save button
    $(this).remove();
    $('.edit-button').attr('disabled', false);
  });

});






// Handle the click event for the delete button
$('#dataTable').on('click', '.delete-button', function () {
  var rowData = {
    treatmentNumber : $(this).closest('tr').find('td')['0'].innerHTML,
  };

  let url = `/dashboard/delete-treatment/`;
    let options = {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body:JSON.stringify(rowData)
    }
  
  fetch(url, options)
    .then(data => {
      return data.json();
    })
    .then(post => {
      if (post.success === true){
        console.log(post.msg);
        $(this).closest('tr').remove();
      } else {
        console.log(post.msg);
      }
    });
});