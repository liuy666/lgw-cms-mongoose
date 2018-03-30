let mongoose = require("mongoose");

let userSchema = require("../schemas/users");

let userModel = mongoose.model("users",userSchema);

module.exports = userModel;