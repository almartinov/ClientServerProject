const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const { stringify } = require('querystring');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
const User = require('./models/user');
const Treatment = require('./models/treatment');
const dbURI = 'mongodb+srv://webLabUser:webLabUser@webprojectcluster.j7jmi3d.mongodb.net/carSystemDB?retryWrites=true&w=majority';
const encryptKey= "1234";
var myCipher = crypto.createCipher('aes-128-cbc', encryptKey);
var myDecipher = crypto.createDecipher('aes-128-cbc', encryptKey);

app.use(express.static(__dirname));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(cookieParser());
app.use(express.json());

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(port))
.catch((err) => console.log(err));

//////////////////////////// Send Email Function /////////////////////////////
function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
           .then(() => true)
           .catch(() => false)
}



//////////////////////////// Send Email Function /////////////////////////////
async function sendEmail(receiver, subject, body) {
  // Create a new transporter object
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: 'false',
    auth: {
      user: 'email4gool@gmail.com',
      pass: 'qkqyydoxodrkivke'
    }
  });

  // Define the email options
  let mailOptions = {
    from: '"Client Server Lab" <email4gool@gmail.com>',
    to: receiver,
    subject: subject,
    text: body
  };

  // Send the email
  let info = await transporter.sendMail(mailOptions);

  console.log(`Email sent: ${info.messageId}`);
}

//////////////////////////// Get Requests - Start /////////////////////////////
app.get('/logout', function (req, res) {
  const file_path = '/html/login.html';
  res.clearCookie('user')
  if (checkFileExists(file_path)) {
    res.sendFile(path.join(__dirname + file_path));
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/sign-in', function (req, res) {
  const file_path = '/html/login.html';
  if (checkFileExists(file_path)) {
    if (req.cookies.user) {
      res.redirect('/dashboard');
    } else {
      res.sendFile(path.join(__dirname + file_path));
    }
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/', function (req, res) {
  const file_path = '/html/login.html';
  if (checkFileExists(file_path)) {
    if (req.cookies.user) {
      res.redirect('/dashboard');
    } else {
      res.sendFile(path.join(__dirname + file_path));
    }
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/forgot-password', function (req, res) {
  const file_path = '/html/forgot-password.html';
  if (checkFileExists(file_path)) {
    res.sendFile(path.join(__dirname + file_path));
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/sign-up', function (req, res) {
  const file_path = '/html/signup.html';
  if (checkFileExists(file_path)) {
    res.sendFile(path.join(__dirname + file_path));
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/dashboard', function (req, res) {
  const file_path = '/html/dashboard.html';

  if (checkFileExists(file_path)) {
    if (req.cookies.user) {
      res.sendFile(path.join(__dirname + file_path));
    } else {
      res.redirect('/sign-in');
    }
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/about-us', function (req, res) {
  const file_path = '/html/about-us.html';

  if (checkFileExists(file_path)) {
    if (req.cookies.user) {
      res.sendFile(path.join(__dirname + file_path));
    } else {
      res.redirect('/sign-in');
    }
  } else {
    res.sendFile(path.join(__dirname + '/html/404.html'));
  }
})

app.get('/dashboard/get-database', function (req, res) {
  Treatment.find()
  .then((treatments) => {
      res.send(JSON.stringify({treatments: treatments}));
  })
  .catch((err) => {
    console.log(err);
  });
});

app.get('/forgot-password/:email', function(req, res) {
  let userEmail = req.params.email;
  
  User.find()
  .then((users) => {
    let user = users.find(curr => curr.email === userEmail);
    if (user === undefined) {
      res.send(JSON.stringify({
        success: false,
        msg:"No such email"
      }));
      return;
    }
    let decryptedPassword = myDecipher.update(user.password,'hex','utf8');
    decryptedPassword +=myDecipher.final('utf-8');
    sendEmail(user.email, 'Your Password', decryptedPassword);
    res.send(JSON.stringify({
      success: true,
      msg:"Enjoy your password"
    }));

  })
  .catch((err) => {
    console.log(err);
  });
});

//////////////////////////// Get Requests - End /////////////////////////////

//////////////////////////// Post Requests - Start /////////////////////////////
app.post('/register-user', async (req, res) => {
   let newPassword = myCipher.update(req.body.password,'utf8','hex');
   newPassword+=myCipher.final('hex');
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: newPassword
  });

  User.find()
    .then((users) => {
      let user = users.find(curr => curr.email === newUser.email);
      if (user) {
        res.send(JSON.stringify({
          success: false,
          msg:"This email already belong to a user"
        }));
        return;
      }
      newUser.save()
      .then((result) => {
        // TODO: ON DEPLOYMENT - SWITCH THE RECEIVER TO userEmail
        sendEmail('email4gool@gmail.com', 'Congratulations!', `Enjoy your new user
        Username: ${newUser.email}
        Password: ${newUser.password}`);
        res.send(JSON.stringify({
          success: true,
          msg:"Enjoy your user"
        }));
      })
      .catch((err) => {
        console.log(err);
      })
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/login-user', (req, res) => {
  let loginUser = req.body;
  let inputPassword = myCipher.update(req.body.password,'utf8','hex');
  inputPassword+=myCipher.final('hex');
  User.find()
    .then((users) => {
      let user = users.find(curr => curr.email === loginUser.email && inputPassword === curr.password);
      if (user) {
        if (loginUser.rememberMe) {
          const expires = new Date();
          res.cookie('user', loginUser.email, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
          })
        } else {
          res.cookie('user', loginUser.email, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
          })
        }
        res.send(JSON.stringify({
          success: true,
          msg:"Enjoy"
        }));
        return;
      }
      res.send(JSON.stringify({
        success: false,
        msg:"Incorrect Email or Password"
      }));
      return;
    })
    .catch((err) => {
      console.log(err);
    });
});


app.post('/dashboard/add-treatment', async (req, res) => {
  let treatmentNumber = 0;
  await Treatment.find()
    .then((treatments) => {
      if (treatments.length !== 0){
        for(let i=0; i<treatments.length; i++){
          if (treatmentNumber < treatments[i].treatmentNumber){
            treatmentNumber = treatments[i].treatmentNumber;
          }
        }
      }
    });
    treatmentNumber++;
  const newTreatment = new Treatment({
    treatmentNumber: treatmentNumber,
    treatmentInformation: req.body['treatmentInformation'],
    date: req.body['date'],
    workerEmail: req.body['workerEmail'],
    carNumber: req.body['carNumber']
  });
  newTreatment.save()
  .then((result) => {
    res.send(JSON.stringify({
      success: true,
      msg:"Treatment Added"
    }));
  })
  .catch((err) => {
    console.log(err);
  })
});


app.post('/verify-captcha', async (req, res) => {
    if (!req.body.captcha)
      return res.json({ success: false, msg: 'Please select captcha' });
  
    // Secret key
    const secretKey = '6LeA15kjAAAAAJ6wK8YNHBjSNtdC7AGvyg3d36NG';
  
    // Verify URL
    const query = stringify({
      secret: secretKey,
      response: req.body.captcha,
      remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
  
    // Make a request to verifyURL
    const body = await fetch(verifyURL).then(res => res.json());
  
    // If not successful
    if (body.success !== undefined && !body.success)
      return res.json({ success: false, msg: 'Failed captcha verification' });
  
    // If successful
    return res.json({ success: true, msg: 'Captcha passed' });
  });


app.post('/dashboard/update-treatment', async function(req, res) {
  const treatmentNumber = req.body['treatmentNumber']
  
  let doc = await Treatment.findOneAndUpdate(treatmentNumber, req.body);

  if (doc === null) {
    res.send(JSON.stringify({
      success: false,
      msg:"No such treatment number"
    }));
    return;
  }
  res.send(JSON.stringify({
    success: true,
    msg:"treatment updated"
  }));
  return;
});

//////////////////////////// Post Requests - End /////////////////////////////

//////////////////////////// Delete Requests - Start /////////////////////////////
app.delete('/dashboard/delete-treatment', async function(req, res) {
  const treatmentNumber = req.body['treatmentNumber']
  
  let doc = await Treatment.deleteOne({treatmentNumber: treatmentNumber});

  if (doc === null) {
    res.send(JSON.stringify({
      success: false,
      msg:"No such treatment number"
    }));
    return;
  }
  res.send(JSON.stringify({
    success: true,
    msg:"treatment updated"
  }));
  return;
});
//////////////////////////// Delete Requests - End /////////////////////////////

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/404.html'));
});


console.log('Server started! At http://localhost:' + port);
