/**
 * Created by frankubuntu on 15-5-2.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var VisitorCaseSchema = new mongoose.Schema({
    appEmpNo: String,
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    recp: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }],
    visitorCount: {
        type: Number,
        default: 0
    },
    visitorCompany: {
        type: String,
        require: true
    },
    visitorInfo: [{
        //name: String,
        //sex: {
        //    type: String,
        //    enum: ['男','女']
        //},
        //require: true
    }],
    carNumber: String,
    isCallApp: {
        type: String,
        enum: ['Y', 'N']
    },
    visitorTime: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 0
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

VisitorCaseSchema.pre('save', function (next) {
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();
});

VisitorCaseSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .populate('applicant','employeeNo name')
            .populate('recp','employeeNo name')
            .sort('meta.updateAt')
            .exec(cb);
    },
    findByDate: function (date, cb) {
        var _today = moment(date).format('YYYY-MM-DD');
        var _tomorrow = moment(date).add('days',1).format('YYYY-MM-DD');
        //console.log('today is : ' + _today + ' == ' + _tomorrow);
        return this
            .find({visitorTime: {
                '$gte': new Date(_today + ' 00:00:00'),
                '$lt': new Date(_tomorrow + ' 00:00:00')
            }})
            .populate('applicant','employeeNo name')
            .populate('recp','employeeNo name')
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb){
        return this
            .findOne({_id: id})
            .populate('applicant','employeeNo name')
            .populate('recp','employeeNo name')
            .exec(cb);
    }

};

module.exports = VisitorCaseSchema;