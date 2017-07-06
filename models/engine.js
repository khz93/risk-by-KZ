var mongoose = require('mongoose');

var engineSchema = new mongoose.Schema({
    name: String,
    turn: Number,
});

var Engine = mongoose.model('Engine', engineSchema);
module.exports = Engine;