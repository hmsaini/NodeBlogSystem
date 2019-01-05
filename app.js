var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon=require('serve-favicon');
var logger = require('morgan');
var expressValidator=require('express-validator');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var bodyParser=require('body-parser');
var mongo=require('mongodb');
var db=require('monk')('localhost/nodeblog');    // database
var multer=require('multer');
var flash=require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var posts=require('./routes/posts');
var categories=require('./routes/categories');

var app = express();

app.locals.moment=require('moment');

app.locals.truncateText=function(text,length){
	var truncatedText=text.substring(0,length);
	return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Handle file uploads and Multipart data
// app.use(multer({dest:'./public/images/uploads'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

// Express Validator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(express.static(path.join(__dirname, 'public')));

// Connect flash
app.use(flash());
// Globals
app.use(function (req, res, next) {
	// res.locals.messages=require('express-messages')(req,res);
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Make our db accessible to our router
app.use(function(req,res,next){
req.db=db;
next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts',posts);
app.use('/categories',categories);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
