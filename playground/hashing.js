const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

//compare hashed password to actual password
var hashedPassword = '$2a$10$tyuMY1mXbfPnAjqrm8Ix/OnlNyV12E4e/TlmW9mDCeqB487ue7wfq';

//true
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

//false
bcrypt.compare(password, 'notcorrecthashpassword', (err, res) => {
    console.log(res);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, "123abc");
// console.log(`token: ${token}`);

// var decoded = jwt.verify(token, '123abc2');
// console.log(`decoded ${decoded}`);
// var message = "I am user number 3";
// var hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }

