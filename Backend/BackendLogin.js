const express = require('express');
const crypto = require('crypto');
const { json } = require('express');
const { request } = require('http');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let passwordDerivative;
let user = {};
let users = [];
let username;

//Endpunkt POST / post
app.post('/post', function (req, res) {
  console.log(req.body);
  res.json(req.body.testdata);
});

//Endpunkt POST / register
app.post('/register', function (req, res) {
  username = req.body.username;
  password = req.body.password;
  if (typeof req.body.username == "string" && typeof req.body.password == "string" && req.body.username.length > 0 && req.body.password.length > 0) {
    user = {
      "username": req.body.username,
      "passwordDerivative": crypto.pbkdf2Sync(
        req.body.password,
        'myCodeForEncryption',
        100000,
        64,
        'sha512'
      ).toString('hex')
    };
    users.push(user);
    res.status(201).json({
      created: "Your user account has been created."
    })
  } else {
    res.status(400).json({
      error: "Bad Request: Your username or password weren't defined or aren't declared in a valid way."
    });
  }
});s

//Endpunkt POST / login
app.post('/login', function (req, res) {
  let username = req.body.username;
  let passwordForLogin = crypto.pbkdf2Sync(
    req.body.password,
    'myCodeForEncryption',
    100000,
    64,
    'sha512'
  ).toString('hex');

  if (typeof username == "string" && typeof passwordForLogin == "string" && req.body.username.length > 0 && req.body.password.length > 0) {
    let counter = 0;
    while (counter < users.length) {
      if (username === users[counter].username && passwordForLogin === users[counter].passwordDerivative) {
        res.status(200).json({
          OK: "You have been logged in succesfully."
        })
      } else if (counter == users.length - 1) {
        res.status(401).json({
          unauthorized: "Your username or password is incorrect."
        })
      }
      counter++;
    }
  } else {
    res.status(400).json({
      error: "Bad Request: Your username or password weren't defined or aren't declared in a valid way."
    });
  }
});
//-----End of own Code-----
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})