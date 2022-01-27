const router = require('express').Router();


// logout of app
router.post('/', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


module.exports = router;
