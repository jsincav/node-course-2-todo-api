const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {

    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        // make sure you get 404 back
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

    it('should return a 404 for non-object ids', (done) => {
        // /todos/123
        var id = '123'
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

});

describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if object id is invalid', (done) => {
        var id = '123'
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)
    });

});

describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var text = "first updated text";
        var completed = true;
        //update text, set completed true
        request(app)
            .patch(`/todos/${id}`)
            .send({text,completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(completed);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeA('number');
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        //grab id of the second item
        var id = todos[1]._id.toHexString();
        var text = "second updated text"
        var completed = false;
        //udate text, set completed to false
        request(app)
        .patch(`/todos/${id}`)
        .send({text,completed})
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.findById(id).then((todo) => {
                expect(todo.text).toBe(text);
                expect(todo.completed).toBe(completed);
                expect(todo.completedAt).toNotExist();
                done();
            }).catch((e) => done(e));
        });
      
    });

});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users',() => {

    it('should create a user', (done) => {
        var email = 'test3@example.com';
        var password = 'letmein'

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'test.com';
        var password = 'let';
        //bad email
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400);
        //bad password
        email = 'test5@example.com'
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = 'letmein';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth', 
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: "not correct password"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('DELETE /users/me/token', () => {

    it('Should remove auth token on logout', (done) => {

        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });

});


