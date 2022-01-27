const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');    // make post request data readable
const cookieParser = require('cookie-parser');


app.set('view engine', 'ejs');    // use ejs as templating engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const login = require('./routes/login');
const logout = require('./routes/logout');
const register = require('./routes/register');
const u = require('./routes/u');
const urls = require('./routes/urls');


app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/u', u);
app.use('/urls', urls);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
