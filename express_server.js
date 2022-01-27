const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');    // make post request data readable
const cookieParser = require('cookie-parser');


app.set('view engine', 'ejs');    // use ejs as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// keep track of urls and shortened form
const urlDatabase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'exampleUserID'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'exampleUserID'
  }
};


// store registered users
const users = {
  'exampleUserID': {
    id: 'exampleUserID',
    email: 'user@example.com',
    password: 'poop'
  }
};


// generate random ID to be used for tinyURL and userID
const generateRandomString = () => {
  const vals = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += vals[Math.floor(Math.random() * 62)];
  }
  return out;
};


// search for a user given a key and value
// returns the user id if user found, else false
const lookupUser = inputEmail => {
  for (let user in users) {
    if (users[user].email === inputEmail) {
      return users[user].id;
    }
  }
  return false;
};


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


// render login page
app.get('/login', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const templateVars = { user: users[req.cookies['user_id']], alert: false };
    return res.render('login', templateVars);
  }

  // handle redirect
  const templateVars = req.query;
  templateVars.user = users[req.cookies['user_id']];
  res.status(403).render('login', templateVars);
});


// login to app
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = lookupUser(email);

  // handle email not in database
  if (!id) {
    return res.redirect('/login/?alert=nonexistentEmail');
  }

  // handle wrong password and empty password
  // maybe change emptypassword to wrongpassword idk
  if (password !== users[id].password) {
    return res.redirect('/login/?alert=wrongPassword');
  }

  // set cookie and redirect to url page
  res.cookie('user_id', id);
  res.redirect('/urls');
});


// logout of app
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


// render register page
app.get('/register', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const templateVars = { user: users[req.cookies['user_id']], alert: false };
    return res.render('register', templateVars);
  }

  // handle redirect
  const templateVars = req.query;
  templateVars.user = users[req.cookies['user_id']];
  res.status(400).render('register', templateVars);
});


// register account
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  // handle existing email
  if (lookupUser(email)) {
    return res.redirect('/register/?alert=existingEmail');
  }

  // handle empty email and password
  if (!email && !password) {
    return res.redirect('/register/?alert=empty');
  }

  // handle empty email
  if (!email) {
    return res.redirect('/register/?alert=emptyEmail');
  }

  // handle empty password
  if (!password) {
    return res.redirect('/register/?alert=emptyPassword');
  }

  // add user to users object
  users[id] = { id, email, password }

  // set cookie and redirect to url page
  res.cookie('user_id', id);
  res.redirect('/urls');
});


// render urls_index page
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  console.log(req.cookies);
  res.render('urls_index', templateVars)
});


// create new url
app.post('/urls', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.cookies.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  const shortURL = generateRandomString();
  let longURL = req.body.longURL;

  // check if longURL contains https
  if (!longURL.includes('https:\//', 0)) {
    longURL = 'https:\//' + longURL;
  }

  // Update database and redirect to urls_show page
  const userID = req.cookies['user_id']
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});


// render urls_new page
app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render('urls_new', templateVars);
});


// render urls_show page
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, user: users[req.cookies['user_id']] };
  res.render('urls_show', templateVars);
});


// redirect to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// delete a url
app.post('/urls/:shortURL/delete', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.cookies.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});


// edit existing long url
app.post('/urls/:id', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.cookies.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  // update url database
  const id = req.params.id;
  let newLongURL = req.body.newLongURL;

  // check if newlongURL contains https
  if (!newLongURL.includes('https:\//', 0)) {
    newLongURL = 'https:\//' + newLongURL;
  }

  // update database
  urlDatabase[id].longURL = newLongURL;

  // redirect to urls_show template
  res.redirect(`/urls/${id}`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
