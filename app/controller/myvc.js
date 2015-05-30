var VisitorCase = require('../models/VisitorCase');
//var commonUtils = require('../utils/commonUtils')();
var APP_NAME = 'visitorSystem';
var ROOT_URL = '/'+APP_NAME;

// my visitor
exports.fetchVCs = function(req, res){
    VisitorCase.loadByEmp(req.session.user.employeeNo, function(err, lists){
        //console.log('my visitor: ' + JSON.stringify(lists));
        res.render('myVisitor', {visitors: lists});
    });
};

module.exports = exports;