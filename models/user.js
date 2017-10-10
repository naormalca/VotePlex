var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
var bcrypt   = require("bcrypt-nodejs");


var UserSchema = mongoose.Schema({
    local       :{
        email: String,
        password: String,
        fullname: String,
        vote:{
            poll_voted:[String],
        }
    },
    facebook    :{
        id      : String,
        token   : String,
        email   : String,
        name    : String
    }
});
// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);