let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
	name : String,
	pwd : String,
	email : String
});

module.exports = userSchema;