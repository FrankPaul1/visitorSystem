/**
 * Created by frankubuntu on 15-4-6.
 */
var should = require('should');
var commonUtils = require('.././commonUtils')();
var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/vc';
mongoose.connect(dbUrl);
var Role = require('.././Role');
var User = require('.././User');

describe('<Unit Test', function () {
    describe('Common Utils Test:', function () {
        describe('test commonUtils', function () {
            it('format should be all right', function (done) {
                //console.log(commonUtils.format(1002, 'E0000000'));
                commonUtils.format(1002, 'E0000000').should.equal('E0001002');
                done();
            });
        });

    });
    describe('Roles Function Test:', function () {
        describe('test checkIfExists', function () {
            it('result will be true', function (done) {
                //this.timeout(15000);
                Role.checkIfExists({employeeNo: 'E000003', roleType: 'ROLE_ADMIN'}, function(err, exists){
                    console.log('exists is ' + exists);
                    exists.should.equal(true);
                    done();
                });
            });
            it('result will be false', function (done) {
                Role.checkIfExists({employeeNo: 'E000003', roleType: 'ROLE_REC'}, function(err, exists){
                    console.log('exists is ' + exists);
                    exists.should.equal(false);
                    done();
                });
            });
        });
        describe('test findAllByEmployeeNo', function () {
            it('result will be true', function (done) {
                Role.findAllByEmployeeNo('E000003', function(err, roles){
                    console.log('roles is ' + JSON.stringify(roles));
                    roles.length.should.greaterThan(1);
                    done();
                });
            });
        });
    });
});
