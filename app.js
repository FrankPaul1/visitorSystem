var express = require('express');
var app = express();
var moment = require('moment');
app.locals.moment = moment;
var path = require('path');
var PORT = process.env.PORT || 8117;
var bodyParser = require('body-parser');
//var config = require('./.config');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbUrl = 'mongodb://localhost/vc';
var async = require('async');

mongoose.connect(dbUrl);

var User = require('./app/models/User');
var Role = require('./app/models/Role');
var VisitorCase = require('./app/models/VisitorCase');

app.set('views', './app/view/pages');
app.set('view engine', 'jade');
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extend: true
}));
app.use(session({
    secret: 'imooc',
    store: new MongoStore({
        db: 'imooc'
    })
}));

if ('development' === app.get('env')) {
    app.set('showStackError', true);
    // app.use(express.logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
};

app.use(function(req, res, next){
    var _user = req.session.user;
    if(_user) {
        app.locals.user = _user;
    } else {
        delete app.locals.user;
    }
    next();
});

app.listen(PORT);
require('./config/routes')(app);

console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
console.log('Start Visitor System : ' + PORT);



