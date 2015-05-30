/**
 * Created by frankubuntu on 15-4-5.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//var numberFormat = require('../utils/numberFormat')();

var UserSchema = new mongoose.Schema({
    employeeNo: {
        require: true,
        unique: true,
        type: String
    },
    name: {
        type: String,
        require: true
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }

            cb(null, isMatch);
        })
    }
};

UserSchema.pre('save', function(next) {
    //var user = this;

    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();

});
UserSchema.pre('save', function(next){
    var user = this;

    bcrypt.genSalt(10, function(err, salt){
        if(err){
           next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err){
               next(err);
            }

            user.password = hash;
            next();
        });

    });
});


UserSchema.statics = {
    findById: function(id, cb){
        return this.findOne({_id: id}).exec(cb);
    }
    //count: function(cb){
    //    return this.count(cb);
    //}
};

module.exports = UserSchema;


