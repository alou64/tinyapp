const router = require('express').Router();
const { urlDatabase, users } = require('../constants/data');
const { generateRandomString, urlsForUser } = require('../constants/helperFunctions');


// render urls_index page
router.get('/', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.session.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  const user = req.session.user_id;
  const urls = urlsForUser(user, urlDatabase);

  const templateVars = { urls, user: users[user] };
  res.render('urls_index', templateVars)
});


// create new url
router.post('/', (req, res) => {
  const userID = req.session.user_id;

  // check if user logged in
  // redirect to login page if not logged in
  if (!userID) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  const shortURL = generateRandomString();
  let longURL = req.body.longURL;

  // check for empty input
  if (!longURL) {
    return res.redirect('/urls/new?alert=empty');
  }

  // check if longURL contains http
  if (!longURL.includes('http:\//', 0)) {
    longURL = 'https:\//' + longURL;
  }

  // Update database and redirect to urls_show page
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});


// render urls_new page
router.get('/new', (req, res) => {
  const user = users[req.session.user_id];

  if (Object.keys(req.query).length === 0) {
    const templateVars = { user, alert: false };
    return res.render('urls_new', templateVars);
  }

  // handle redirect
  const templateVars = { user, alert: req.query.alert };
  res.status(400).render('urls_new', templateVars);
});


// render urls_show page
router.get('/:shortURL/', (req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;

  if (Object.keys(req.query).length === 0) {
    const templateVars = { shortURL, user, longURL: urlDatabase[shortURL].longURL, alert: false };
    return res.render('urls_show', templateVars);
  }

  // handle redirect
  const templateVars = { shortURL, user, longURL: urlDatabase[shortURL].longURL, alert: req.query.alert };
  res.status(403).render('urls_show', templateVars);
});


// delete a url
router.post('/:shortURL/delete', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.session.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  const shortURL = req.params.shortURL;
  const user_id = req.session.user_id;

  // ensure that user owns the url to be edited
  if (!Object.keys(urlsForUser(user_id, urlDatabase)).includes(shortURL)) {
    return res.redirect(403, '/urls');
  }

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});


// edit existing long url
router.post('/:id', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.session.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  const user_id = req.session.user_id;
  const id = req.params.id;
  let newLongURL = req.body.newLongURL;

  // ensure that user owns the url to be edited
  if (!Object.keys(urlsForUser(user_id, urlDatabase)).includes(id)) {
    return res.redirect(`/urls/${id}/?shortURL=${id}&alert=notOwner`);
  }

  // check if newlongURL contains http
  if (!newLongURL.includes('http:\//', 0)) {
    newLongURL = 'https:\//' + newLongURL;
  }

  // update database
  urlDatabase[id].longURL = newLongURL;

  // redirect to urls_show template
  res.redirect(`/urls/${id}`);
});


module.exports = router;
