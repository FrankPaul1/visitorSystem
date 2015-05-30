var VisitorCase = require('../models/VisitorCase');
//var commonUtils = require('../utils/commonUtils')();
var APP_NAME = 'visitorSystem';
var ROOT_URL = '/'+APP_NAME;

// update status
exports.updateStatus = function(req, res){
    var _id = req.body['visitorCase._id'];
    VisitorCase.findById(_id, function(err, vc){
        if(vc){
            switch (vc.status) {
                case 1:
                    vc.status = +vc.status+1;
                    break;
                case 2:
                    // when status=2 , can not change status any more
                    res.json({success: false});
                    break;
                case 0:
                default :
                    vc.status = 1;
            }
            vc.save();
            res.json({success: true, status: vc.status});
        }else{
            res.json({success: false});
        }
    });
};

// list
exports.fetchVCs = function(req, res){
    VisitorCase.findByDate(new Date(), function(err, lists){
        console.log('list: ' + JSON.stringify(lists));
        res.render('list', {visitors: lists});
    });
};
module.exports = exports;