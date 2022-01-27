// keep track of urls and shortened form
const urlDatabase = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'exampleUserID'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'exampleUserID'
  }
};


// store registered users
const users = {
  'exampleUserID': {
    id: 'exampleUserID',
    email: 'user@example.com',
    password: 'poop'
  }
};


module.exports = {
  users,
  urlDatabase
};
