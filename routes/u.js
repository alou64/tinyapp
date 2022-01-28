const router = require('express').Router();
const { urlDatabase } = require('../constants/database');


// redirect to longURL
router.get('/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


module.exports = router;
