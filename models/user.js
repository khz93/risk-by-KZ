var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    color: String,
});

var User = mongoose.model('User', userSchema);
module.exports = User;

