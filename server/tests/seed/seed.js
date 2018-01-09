const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID;
const userTwoId = new ObjectID;

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 444,
    _creator: userTwoId
}];

const users = [{
    _id: userOneId,
    email: 'test@example.com',
    password: 'letmein',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'test2@example.com',
    password: 'letmein',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const populateTodos = ((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

const populateUsers = ((done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
});

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};