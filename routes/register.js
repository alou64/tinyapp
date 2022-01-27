const router = require('express').Router();
const { urlDatabase, users } = require('../constants/data');
const { generateRandomString, lookupUser, urlsForUser } = require('../constants/helperFunctions');


// render register page
router.get('/', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const templateVars = { user: users[req.cookies['user_id']], alert: false };
    return res.render('register', templateVars);
  }

  // handle redirect
  const alert = req.query.alert;
  const templateVars = { alert, user: users[req.cookies['user_id']] };
  res.status(400).render('register', templateVars);
});


// register account
router.post('/', (req, res) => {
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


module.exports = router;
