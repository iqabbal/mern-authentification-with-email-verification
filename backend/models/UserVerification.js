const mongoose = require('mongoose')

const UserVerificationSchema = new mongoose.Schema({
    userId : String,
    uniqueString : String,
    createdAt : Date,
    expireAt : Date,
});

const UserVerification = mongoose.model('auth',UserVerificationSchema);
module.exports = UserVerification
