require('dotenv').config();
var express = require('express');
var todoRouter = require('./routes/todo');
const cors = require('cors');

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use('/todo/', todoRouter);

exports.todoapp = app;
