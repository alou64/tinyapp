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
    id: 'exampleUserId',
    email: 'user@example.com',
    password: 'poop'
  }
}

const generateRandomString = () => {
  const vals = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += vals[Math.floor(Math.random() * 62)];
  }
  return out;
};

// search for a user given a key and value
const lookupUser = (key, val) => {
  for (let user in users) {
    if (users[user][key] === val) {
      return true;
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

// app.post('/login', (req, res) => {
//   const user_id = req.body.user_id;
//   res.cookie('user_id', user_id);
//   res.redirect('/urls');
// });

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']], existingEmail: true, emptyEmail: false, emptyPassword: false };
  res.render('login', templateVars);
});

app.post('/login', (req, res) => {

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
  if (lookupUser('email', email)) {
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
  res.redirect(`/urls/:${shortURL}`);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render('urls_new', templateVars);
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
