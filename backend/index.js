const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const userRouter = require('./user'); // Corrected import

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/login');

app.use('/user', userRouter); // Corrected usage

app.listen(3001, () => {
    console.log("Server is running ...");
});

