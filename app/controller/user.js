var User = require('../models/User');
var commonUtils = require('../utils/commonUtils')();
var APP_NAME = 'visitorSystem';
var ROOT_URL = '/'+APP_NAME;

// signup

exports.userRequest = function(req, res, next){
    console.log('userRequest running! ' + req.session.user);
    if(!req.session.user){
        res.redirect(ROOT_URL);
    }else{
        next();
    }
};

exports.signUp = function(req, res){
    var _user = req.body.user;
    var _refererUrl = req.header('referer');

    if (_user) {
        User.findOne({name: _user.name}, function(err, user){
            if(user){
                console.log('user : ' + user.name + ' is exists');
                return res.redirect(_refererUrl);
            }else{
                var user = new User(_user);

                if(!user.employeeNo){
                    console.log(user.toString());
                    User.count(function(err, count){
                        if(err){
                            //next(err);
                            console.error(err);
                        }else{
                            user.employeeNo = commonUtils.format(++count, 'E000000')
                            console.log(count + ' -- ' + commonUtils.format(count, 'E000000'));
                            user.save(function(err, user){
                                if(err){
                                    console.log(err);
                                }
                                return res.redirect(_refererUrl);
                            });
                        }
                    });
                }else{
                    return res.redirect(_refererUrl);
                }
            }

        });
    }else{
        return res.redirect(_refererUrl);
    }
};

exports.signIn = function(req, res) {
    var _user = req.body.user;
    var _refererUrl = req.header('referer');
    //console.log('refererUrl : ' + _refererUrl);
    if(commonUtils.endWith(_refererUrl,ROOT_URL)) _refererUrl=ROOT_URL + '/myVisitor';
    if(_user){
        User.findOne({name: _user.name}, function(err, user){
            if(user){
                console.log('login user is  : ' +user);
                user.comparePassword(_user.password, function(err, isMatch){
                    if(isMatch){
                        req.session.user = user;
                    }else{
                        console.log('Password is not match!');
                    }
                    return res.redirect(_refererUrl);
                });
            }else{
                return res.redirect(_refererUrl);
            }
        });
    }else{
        return res.redirect(_refererUrl);
    }
};

exports.logout = function(req, res) {
    var _refererUrl = req.header('referer');
    delete req.session.user;
    return res.redirect(_refererUrl);
};

// get user
exports.loadUser =  function(req, res){
    var _employeeNo = req.params.employeeNo;
    User.findOne({employeeNo: _employeeNo}, function(err, user){
        if(user){
            res.json(user);
        }else{
            res.json(null);
        }
    });
};

module.exports = exports;