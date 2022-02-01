// generate random ID to be used for tinyURL and userID
const generateRandomString = () => {
  const vals = 'ABCDEFGHIJKLMNOabcdefghijklmnopqrstuvwxyzPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += vals[Math.floor(Math.random() * 62)];
  }
  return out;
};


// returns the user id if user found, else false
const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return false;
};


// returns URLS belonging to a given user
const urlsForUser = (id, database) => {
  const urls = {};
  for (let url in database) {
    if (database[url].userID === id) {
      urls[url] = database[url].longURL;
    }
  }
  return urls;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};
