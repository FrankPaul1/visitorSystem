/**
 * Created by frankubuntu on 15-4-5.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new mongoose.Schema({
    emp: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    roleType: {
        type: String,
        enum: ['ROLE_ADMIN', 'ROLE_REC', 'ROLE_GUARD']
    },
    updateBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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

RoleSchema.pre('save', function(next) {

    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next();

});


RoleSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .populate('emp updateBy')
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb){
        return this.findOne({_id: id}).exec(cb);
    }
    //count: function(cb){
    //    return this.count(cb);
    //}
};

module.exports = RoleSchema;


