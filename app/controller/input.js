var VisitorCase = require('../models/VisitorCase');
var commonUtils = require('../utils/commonUtils')();
var APP_NAME = 'visitorSystem';
var ROOT_URL = '/'+APP_NAME;
var async = require('async');
var User = require('../models/User');
var _ = require('underscore');

exports.show = function(req, res){
    res.render('input', {});
};

// load visitor case
exports.loadVC = function(req, res){
    var _id = req.params.id;
    VisitorCase.findById(_id, function(err, visitorCase){
        if(visitorCase){
            res.render('updateVC', {visitorCase: visitorCase});
        }else{
            res.redirect(ROOT_URL + 'myVisitor');
        }
    });

};

// add visitor case
exports.addVC = function(req, res){
    //console.log('this is submit params : ' + JSON.stringify(req.body));
    var _id = req.body['visitorCase._id'];
    var recps = [];
    //recps.push(req.body.applicant.employeeNo);
    if(commonUtils.isString(req.body['recp.employeeNo'])){
        // string means only one recp
        recps.push(req.body['recp.employeeNo']);
    }else{
        // if more than one recp
        for(var i=0;i<req.body['recp.employeeNo'].length;i++){
            recps.push(req.body['recp.employeeNo'][i]);
        }

    }
    var _applicant = req.session.user;
    var _visitorInfo = [];
    if(commonUtils.isString(req.body['visitor.name'])) {
        _visitorInfo.push({
            name: req.body['visitor.name'],
            sex: req.body['visitor.sex']
        });
    }else{
        for(var i=0; i<req.body['visitor.name'].length; i++){
            _visitorInfo.push({
                name: req.body['visitor.name'][i],
                sex: req.body['visitor.sex'][i]
            });
        }
    }
    console.log('recps is : ' + JSON.stringify(recps));
    async.map(recps,function(empNo, callback){
        User.findOne({employeeNo: empNo}, function(err, user){
            if(user){
                callback(null,user);
            }
        });
    }, function(err, results){
        console.log('results : ' + JSON.stringify(results));

        if(!err){

            var params = {
                appEmpNo: req.session.user.employeeNo,
                applicant: _applicant,
                recp: results,
                visitorCount: req.body.visitorCount,
                visitorCompany: req.body.visitorCompany,
                visitorInfo: _visitorInfo,
                carNumber: req.body.carNumber,
                isCallApp: req.body.isCallApp,
                visitorTime: new Date(req.body.visitorTime)
            };
            var visitorCase;
            if(_id){
                VisitorCase.findById(_id, function(err, vc){
                    visitorCase = _.extend(vc, params);
                    visitorCase.save(function (err,vc) {
                        if (err) {
                            console.log(err);
                        };

                        res.redirect(ROOT_URL + '/myVisitor');
                    });
                })

            } else {
                visitorCase = new VisitorCase(params);
                visitorCase.save(function (err,vc) {
                    if (err) {
                        console.log(err);
                    };

                    res.redirect(ROOT_URL + '/myVisitor');
                });
            }

            console.log('visitor case is : ' + JSON.stringify(visitorCase));

        }else{
            console.error(err);
            res.redirect(ROOT_URL + '/myVisitor');
        }
    });


};

// delete visitorCase
exports.deleteVC = function(req, res){
    var _id = req.body['visitorCase._id'];
    VisitorCase.findById(_id, function(err, vc){
        if(vc){
            //console.log(JSON.stringify(vc));
            vc.remove();
            res.json({success: true});
        }else{
            res.json({success: false});
        }
    });
};
module.exports = exports;