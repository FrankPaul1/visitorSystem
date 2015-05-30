var mongoose = require('mongoose');
var UserSchema = require('../schemas/User');
var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
