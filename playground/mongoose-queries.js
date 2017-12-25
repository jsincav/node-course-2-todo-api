const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var todoID = '5a3c3f47fc4355c019f60389';

if(!ObjectID.isValid(todoID)) {
    console.log('ID not valid');
}

Todo.find({
    _id: todoID
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: todoID
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(todoID).then((todo) => {
    if(!todo) {
        return console.log('Id not found');
    }
    console.log('Todo by ID', todo);
}).catch((e) => {
    console.log(e);
});

var userID = '5a3b07fcd359fe1c0b0252f5';

if(!ObjectID.isValid(userID)) {
    console.log('User ID is not valid');
};

User.findById(userID).then((user) => {
    if(!user) {
        return console.log('Unable to find user');
    }
    console.log('User by ID', user);
}).catch((e) => {
   console.log(e);
});


