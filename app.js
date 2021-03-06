var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var passport = require('passport');
const cors=require('cors')

//db connection
const url = config.mongoUrl;
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
const connect = mongoose.connect(url,{ useNewUrlParser: true ,useUnifiedTopology:true});

connect.then(() => {
    console.log("\n\n"+"                                                                            "+"Connected correctly to server");
}, (err) => { console.log(err); });
var app = express();
//passport code 
app.use(passport.initialize());
app.use(passport.session());
//Route files
var index = require('./routes/index');
var users = require('./routes/users');
var shopRouter=require('./routes/shopRouter');
var labourRouter=require('./routes/labourRouter');
var contractorRouter=require('./routes/contractorRouter');
var customerRouter=require('./routes/customerRouter');
var interiorDesignerRouter=require('./routes/interiorDesigner');
var reviewRouter=require('./routes/reviewRouter');
var paymentRouter=require('./routes/paymentRouter');
var searchRouter=require('./routes/searchRouter');
var findRouter=require('./routes/FindByNameContracts');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes to use
app.use('/', index);
app.use('/users', users);
app.use('/shops', shopRouter);
app.use('/labours', labourRouter);
app.use('/contractors', contractorRouter);
app.use('/customers', customerRouter);
app.use('/interiorDesigner', interiorDesignerRouter);
app.use('/reviews', reviewRouter);
app.use('/payment', paymentRouter);
app.use('/search', searchRouter);
app.use('/searchbyname', findRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
