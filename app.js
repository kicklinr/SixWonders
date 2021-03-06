var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg-query');

// Twilio Credentials 
var accountSid = 'AC36a5b1edc49a8f0542cdd602ab925a83'; 
var authToken = '62eafd50007bdc5cd48ba1ee4547a200';   // TODO: Don't expose in production :)

// Require the Twilio module and create a REST client 
var twilio = require('twilio')(accountSid, authToken); 

pg.connectionParameters = "postgres://iltnencxwnrati:69VlHFO9ejuhDno8X21odCthhZ@ec2-107-21-105-116.compute-1.amazonaws.com:5432/d3vatqm4sct45j?ssl=true";

var routes = require('./routes/index');
var search = require('./routes/search');
var feedback = require('./routes/feedback');
var checkin = require('./routes/checkin');
var analytics = require('./routes/analytics');
var comsvc = require('./routes/comsvc');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
	req.pgQuery = pg;
	next();
});
app.use(function(req,res,next){
  req.twilio = twilio;
  next();
});

app.use('/', routes);
app.use('/citations', routes);
app.use('/search', search);
app.use('/feedback', feedback);
app.use('/checkin', checkin);
app.use('/analytics',analytics);
app.use('/comsvc', comsvc);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
