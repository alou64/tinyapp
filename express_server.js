const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');    // make post request data readable
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');    // use ejs as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {    // keep track of urls and shortened form
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  const vals = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += vals[Math.floor(Math.random() * 62)];
  }
  return out;
};

app.get("/", (req, res) => {
  res.send('hello');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies['username'] };
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
  const templateVars = { username: req.cookies['username'] };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL.slice(1), longURL: urlDatabase[req.params.shortURL.slice(1)], id: req.params.shortURL.slice(1), username: req.cookies['username'] };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.newLongURL;
  urlDatabase[id] = newLongURL;
  const templateVars = { shortURL: id, longURL: newLongURL, id: id, username: req.cookies['username'] };
  res.render('urls_show', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
