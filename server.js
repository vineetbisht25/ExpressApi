'use strict'
const express = require('express');
const cors = require('cors');
const env = require('./env');
var bodyParser=require('body-parser');
const userRoute = require('./app/routes/userRoute');

const app = express();
let port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(requestDump);
app.use('/api/v1', userRoute);


app.listen(port).on('listening', () => {
    console.log(`server are live on ${port}`);
  });

module.exports = app;