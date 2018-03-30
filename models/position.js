let mongoose = require("mongoose");

let positionSchema = require("../schemas/position");

let positionModel = mongoose.model("positons",positionSchema);

module.exports = positionModel;