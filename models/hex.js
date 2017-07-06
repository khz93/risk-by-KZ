var mongoose = require('mongoose');

var hexSchema = new mongoose.Schema({
    _id: Number,
    coords: Array,
    color: String,
    nghbrs: Array
});

var Hex = mongoose.model('Hex', hexSchema);
module.exports = Hex;