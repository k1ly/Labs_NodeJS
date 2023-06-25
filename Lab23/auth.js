import users from './users.json' assert {type: 'json'};

const findByUsername = username => users.find(user => user.username === username);

const verifyPassword = (password, user) => password === user.password;

export {findByUsername, verifyPassword}