let mongoose = require("mongoose");

let positionSchema = mongoose.Schema({
	img : String,
	position : String,
	company : String,
	exp : Number,
	type : String,
	address : String,
	pay : Number
});

module.exports = positionSchema;