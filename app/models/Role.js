/**
 * Created by frankubuntu on 15-4-6.
 */
var mongoose = require('mongoose');
var RoleSchema = require('../schemas/Role');
var RoleModel = mongoose.model('Role', RoleSchema);

RoleModel.checkIfExists = function(obj, cb){
    if(obj && obj.employeeNo && obj.roleType){
        console.log("obj is " + JSON.stringify(obj));
        var _employeeNo = obj.employeeNo;
        var _roleType = obj.roleType;
        this
            .find({roleType: _roleType})
            .populate({
                path: 'emp',
                match: { employeeNo:  _employeeNo }
                //,select: 'employeeNo'
            })
            .exec(function(err, roles){
                if(err){
                    console.log(err);
                }
                console.log('user is : ' + JSON.stringify(roles));
                if(roles && ''!=roles){
                    //console.log(_employeeNo + ' is exists');
                    cb(err, true);
                }else{
                    cb(err, false);
                }
            });
    }else{
        cb(null, false);
    }
};

RoleModel.findAllByEmployeeNo = function(employeeNo, cb){
    if(employeeNo){
        this
            .find({})
            .populate({
                path: 'emp',
                match: { employeeNo: employeeNo }
                //,select: 'employeeNo'
            })
            .exec(function(err, user){
                console.log(employeeNo + ' is exists');
                cb(err, user);
            });
    }else{
        cb(null, null);
    }
};

module.exports = RoleModel;