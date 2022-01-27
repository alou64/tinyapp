const { assert } = require('chai');
const { getUserByEmail, urlsForUser } = require('../constants/helperFunctions');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


const testURLs = {
  'b2xVn2': {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'userRandomID'
  },
  '9sm5xK': {
    longURL: 'http://www.google.com',
    userID: 'userRandomID'
  }
};


describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
});


describe('getUserByEmail', () => {
  it('should return false when passed an email not in the database', () => {
    const user = getUserByEmail("user5@example.com", testUsers)
    assert.isFalse(user);
  });
});


describe('urlsForUser', () => {
  it('should return an object of urls owned by the user', () => {
    const urls = urlsForUser('userRandomID', testURLs);
    const expected = { 'b2xVn2': 'http://www.lighthouselabs.ca', '9sm5xK': 'http://www.google.com' };
    assert.deepEqual(urls, expected);
  });
});


describe('urlsForUser', () => {
  it('should return an empty object when passed an id that does not own any urls', () => {
    const urls = urlsForUser('userRandomID5', testURLs);
    const expected = {};
    assert.deepEqual(urls, expected);
  });
});
