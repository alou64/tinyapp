const router = require('express').Router();
const { urlDatabase, users } = require('../constants/data');
const { generateRandomString, lookupUser, urlsForUser } = require('../constants/helperFunctions');


// render login page
router.get('/', (req, res) => {
  console.log(req.cookies);
  if (Object.keys(req.query).length === 0) {
    const templateVars = { user: users[req.cookies['user_id']], alert: false };
    return res.render('login', templateVars);
  }

  // handle redirect
  const alert = req.query.alert;
  const templateVars = { alert, user: users[req.cookies['user_id']] };
  // templateVars.user = users[req.cookies['user_id']];
  res.status(403).render('login', templateVars);
});


// login to app
router.post('/', (req, res) => {
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


module.exports = router;
