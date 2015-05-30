/**
 * Created by frankubuntu on 15-5-2.
 */
var mongoose = require('mongoose');
var VisitorCaseSchema = require('../schemas/VisitorCase');
var VisitorCaseModel = mongoose.model('VisitorCase', VisitorCaseSchema);

VisitorCaseModel.loadByEmp = function(employeeNo, cb){

    if(employeeNo){
        this
            .find({appEmpNo: employeeNo})
            .populate({
                path: 'applicant',
                //match: { employeeNo: employeeNo },
                //model: 'User',
                select: 'employeeNo name'
            })
            .populate('recp','employeeNo name')
            .sort('meta.updateAt')
            .exec(function(err, lists){
                console.log(employeeNo + ' is exists');
                cb(err, lists);
            });
    }else{
        cb(null, null);
    };
};

module.exports = VisitorCaseModel;