const router = require('express').Router();


// handle redirect on index page
router.get('/', (req, res) => {
  // check if user logged in
  // redirect to login page if not logged in
  if (!req.session.user_id) {
    return res.redirect('/login/?alert=notLoggedIn');
  }

  // redirect to /urls
  res.redirect('/urls');
});


module.exports = router;
