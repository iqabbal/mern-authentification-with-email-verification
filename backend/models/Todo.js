const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
        name : String,
	password : String,
	dateOfBirth : String,
	email : String,
});

const TodoModel = mongoose.model('ma3lomat',TodoSchema);
module.exports = TodoModel
