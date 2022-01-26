const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');    // make post request data readable
const cookieParser = require('cookie-parser');


app.set('view engine', 'ejs');    // use ejs as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {    // keep track of urls and shortened form
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'ttp://www.google.com'
};


const users = {
  'exampleUserID': {
    id: 'exampleUserID',
    email: 'user@example.com',
    password: 'poop'
  }
};


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


app.get("/", (req, res) => {
  res.send('hello');
});


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


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


app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


app.get('/register', (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']], existingEmail: false, emptyEmail: false, emptyPassword: false };
  res.render('register', templateVars);
});


app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  // handle existing email
  if (lookupUser(email)) {
    return res.status(400).render('register', { user: users[req.cookies['user_id']], existingEmail: true, emptyEmail: false, emptyPassword: false });
  }

  // handle empty email and password
  if (!email && !password) {
    return res.status(400).render('register', { user: users[req.cookies['user_id']], existingEmail: false, emptyEmail: true, emptyPassword: true });
  }

  // handle empty email
  if (!email) {
    return res.status(400).render('register', { user: users[req.cookies['user_id']], existingEmail: false, emptyEmail: true, emptyPassword: false });
  }

  // handle empty password
  if (!password) {
    return res.status(400).render('register', { user: users[req.cookies['user_id']], existingEmail: false, emptyEmail: false, emptyPassword: true });
  }

  // add user to users object
  users[id] = { id, email, password }

  // set cookie and redirect to url page
  res.cookie('user_id', id);
  res.redirect('/urls');
});


app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  console.log(req.cookies);
  res.render('urls_index', templateVars)
});


app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/:${shortURL}`); // fix this
});


app.get('/urls/new', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.cookies.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  res.render('urls_new');
  }

  const templateVars = { user: users[req.cookies['user_id']] };
  res.render('urls_new', templateVars);
});


app.get('/login/:query', (req, res) => {
// app.get('/login/:existingEmail/:wrongPassword/:alert', (req, res) => {
  // const templateVars = { user: users[req.cookies['user_id']], existingEmail: req.params.existingEmail, wrongPassword: req.params.wrongPassword, alert: req.params.alert }
  // res.render('login', templateVars);
  console.log(req.params);
  console.log(req.query);
});


app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL.slice(1), longURL: urlDatabase[req.params.shortURL.slice(1)], user: users[req.cookies['user_id']] };
  res.render('urls_show', templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


// delete a url
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});


// edit existing long url
app.post('/urls/:id', (req, res) => {
  // update url database
  const id = req.params.id;
  const newLongURL = req.body.newLongURL;
  urlDatabase[id] = newLongURL;

  // redirect to urls_show template
  res.redirect(`/urls/:${id}`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
