const router = require('express').Router();
const { users, urlDatabase } = require('../constants/data');
const { getUserByEmail } = require('../constants/helperFunctions');
const bcrypt = require('bcryptjs');


// render login page
router.get('/', (req, res) => {
  const user = users[req.session.user_id];

  if (Object.keys(req.query).length === 0) {
    const templateVars = { user, alert: false };
    return res.render('login', templateVars);
  }

  // handle redirect
  const alert = req.query.alert;
  const templateVars = { alert, user };
  res.status(403).render('login', templateVars);
});


// login to app
router.post('/', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = getUserByEmail(email, users);

  // handle email not in database
  if (!id) {
    return res.redirect('/login/?alert=nonexistentEmail');
  }

  // handle wrong password and empty password
  if (!bcrypt.compareSync(password, users[id].password)) {
    return res.redirect('/login/?alert=wrongPassword');
  }

  // set cookie and redirect to url page
  req.session.user_id = id;
  res.redirect('/urls');
});


module.exports = router;
