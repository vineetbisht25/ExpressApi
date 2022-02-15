const express = require('express');
const cors = require('cors');
const env = require('./env');
var bodyParser=require('body-parser');
// const userRoute = require('./app/routes/userRoute');
const {
    createUser,
    siginUser,
  } = require('./app/controller/userController');

const {verifyAuth} = require('./app/middleware/verifyAuth');
const {requestDump} = require('./app/middleware/apiRequest');

// console.log(userRoute);

const app = express();
let port = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/api/v1', userRoute);
app.post('/api/v1/Registration',createUser);
app.post('/api/v1/login',siginUser);

app.listen(port).on('listening', () => {
    console.log(`server are live on ${port}`);
  });

module.exports = app;