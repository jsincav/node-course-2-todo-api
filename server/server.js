var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
}); 

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

//GET /todos/123123 
app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    //valid id using isValid
    if(!ObjectID.isValid(id)) {
        //404 - send back empty body
        return res.status(404).send();
    }
    
    //findById
    Todo.findById(id).then((todo) => {
         //sucess
            //if todo - send it back
            if(todo) {
                res.send({todo});
            }else {
                //if no todo - send back a 404 with an empty body
                res.status(404).send();
            }
        //error
    }).catch((e) => {
        //400 - send back empty body
        res.status(400).send();
    });
       
});

app.delete('/todos/:id', (req, res) => {
    //get the id
    var id = req.params.id;

    //validate the id -> not valid? return 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send(todo);

    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};

