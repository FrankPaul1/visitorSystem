var User = require('../models/User');
var Role = require('../models/Role');
// admin page
exports.admin = function(req, res){
    Role.fetch(function(err, roles){
        res.render('admin', {
            roles: roles
        });
    })

};

// add new role
exports.addRole = function(req, res){
    var _role = req.body.role;
    var _empNo = _role.emp.employeeNo;
    var _roleType = _role.roleType;
    var _currentUser = req.session.user;
    Role.checkIfExists({employeeNo: _empNo, roleType: _roleType}, function(err, exists){
        console.log('is it exists? ' + exists);
        if(exists){
            res.redirect(ROOT_URL + '/admin');
        }else{
            User.findOne({employeeNo: _empNo}, function(err, emp){
                //console.log("emp is " + emp.toString());
                if(emp){
                    // save role
                    var role = new Role(_role);
                    role.emp = emp;
                    role.updateBy = _currentUser;
                    role.save();
                    res.redirect(ROOT_URL + '/admin');
                }else{
                    res.redirect(ROOT_URL + '/admin');
                }
            });

        }
    })
};

// add new role
exports.newRole = function(req, res){
    var _employeeNo = req.body.emp.employeeNo;
    var _roleType = req.body.roleType;
    var _updateBy = req.session.user;
    //console.log(' add new role ' + JSON.stringify(req.body) + ' : ' + req.toString() + ' = ');
    var role = new Role({updateBy: _updateBy, roleType: _roleType});
    User.findOne({employeeNo: _employeeNo}, function(err, user){
        if(user){
            role.emp = user;
            role.save();
            res.json({success: true, emp: role.emp, _id: role._id});
        }else{
            res.json({success: false});
        }
    });
    //var role = new Role(req.params.role);
};

// delete role
exports.deleteRole = function(req, res){
    var _id = req.params.id;
    Role.findById(_id, function(err, role){
        if(role){
            role.remove();
            res.json({success: true});
        }else{
            res.json({success: false});
        }
    });
};

// get all role
exports.fetchRoles = function(req, res){
    Role.fetch(function(err, roles){
        res.json(roles);
    })
};

// get roles by employeeNo
exports.loadRoleByEmp = function(req, res){
    var _employeeNo = req.params.employeeNo;
    Role.findAllByEmployeeNo( _employeeNo, function(err, roles){
        res.json(roles);
    })
};

// check role if exists
exports.checkIfExists = function(req, res){
    var _employeeNo = req.params.employeeNo;
    var _roleType = req.params.roleType;
    Role.checkIfExists({employeeNo: _employeeNo, roleType: _roleType}, function(err, exists){
        res.json(exists);
    })
};
module.exports = exports;