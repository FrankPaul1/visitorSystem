var User = require('../app/controller/user');
var Admin = require('../app/controller/admin');
var Input = require('../app/controller/input');
var List = require('../app/controller/list');
var MyVC = require('../app/controller/myvc');
var APP_NAME = 'visitorSystem';
var ROOT_URL = '/'+APP_NAME;

module.exports = function (app) {

    app.get(ROOT_URL, function(req, res){
        res.render('index', {});
    });

    app.post(ROOT_URL + '/user/signup', User.signUp);

    app.post(ROOT_URL + '/user/signin', User.signIn);

    app.get(ROOT_URL + '/user/logout', User.logout);

    // get user
    app.get(ROOT_URL + '/user/:employeeNo', User.loadUser);

    // admin page
    app.get(ROOT_URL + '/admin', User.userRequest, Admin.admin);

    // add new role
    app.post(ROOT_URL + '/admin/newRole', User.userRequest, Admin.addRole);

    // add new role
    app.post(ROOT_URL + '/admin/role', User.userRequest, Admin.newRole);

    // delete role
    app.delete(ROOT_URL + '/admin/role/:id', User.userRequest, Admin.deleteRole);

    // get all role
    app.get(ROOT_URL + '/admin/roles', User.userRequest, Admin.fetchRoles);

    // get roles by employeeNo
    app.get(ROOT_URL + '/admin/rolesByEmployeeNo/:employeeNo', User.userRequest, Admin.loadRoleByEmp);

    // check role if exists
    app.get(ROOT_URL + '/admin/checkRoleExists?employeeNo=:employeeNo&roleType=:roleType', User.userRequest, Admin.checkIfExists);

    app.get(ROOT_URL + '/input', User.userRequest, Input.show);

    // add visitor case
    app.post(ROOT_URL + '/visitorCase', User.userRequest, Input.addVC);

    // get visitor case
    app.get(ROOT_URL + '/visitorCase/:id', User.userRequest, Input.loadVC);

    // delete visitorCase
    app.delete(ROOT_URL + '/visitorCase', User.userRequest, Input.deleteVC);

    // update status
    app.put(ROOT_URL + '/visitorCase/changeStatus', User.userRequest, List.updateStatus);

    // my visitor
    app.get(ROOT_URL + '/myVisitor', User.userRequest, MyVC.fetchVCs);

    // list
    app.get(ROOT_URL + '/list', User.userRequest, List.fetchVCs);
}