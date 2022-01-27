const { urlDatabase, users } = require('./data');


// generate random ID to be used for tinyURL and userID
const generateRandomString = () => {
  const vals = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += vals[Math.floor(Math.random() * 62)];
  }
  return out;
};


// search for a user given a key and value
// returns the user id if user found, else false
const lookupUser = inputEmail => {
  for (let user in users) {
    if (users[user].email === inputEmail) {
      return users[user].id;
    }
  }
  return false;
};


// returns URLS belonging to a given user
const urlsForUser = id => {
  let urls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url].longURL;
    }
  }
  return urls;
};


module.exports = {
  generateRandomString,
  lookupUser,
  urlsForUser
};
