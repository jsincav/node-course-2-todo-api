const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//remove all todos
// Todo.remove({}).then((resut) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: '5a40505dc5b92e1004361ef0'}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5a40505dc5b92e1004361ef0').then((todo) => {
    console.log(todo);
});

