const { assert } = require('chai');
const { getUserByEmail } = require('../constants/helperFunctions');
//const { users, urlDatabase } = require('../constants/data');


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
