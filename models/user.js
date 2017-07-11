var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: Number,
    username: String,
    loginname: String,
    color: String,
    lastthrow: Date
});

var User = mongoose.model('User', userSchema);
module.exports = User;

