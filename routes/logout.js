const router = require('express').Router();


// logout of app
router.post('/', (req, res) => {
  req.session = null;
  res.redirect('/login');
});


module.exports = router;
