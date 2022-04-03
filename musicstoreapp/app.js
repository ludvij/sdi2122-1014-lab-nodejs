const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const {MongoClient} = require('mongodb')
const crypto = require('crypto')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')

const indexRouter = require('./routes/index');

const app = express();

app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}))

app.use(fileUpload({
  limits: {fileSize: 50 * 1024 * 1024},
  createParentPath: true
}))
app.set('uploadPath', __dirname)
app.set('clave', 'abcdefg')
app.set('crypto', crypto)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use('/', indexRouter);

const url = 'mongodb+srv://admin:elAdminDelMongo@tiendamusica.og0dc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
app.set('connectionStrings', url)

let songsRepository = require("./repositories/songsRepository.js");
songsRepository.init(app, MongoClient);
require("./routes/songs.js")(app, songsRepository)

const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, MongoClient);
require("./routes/users.js")(app, usersRepository);

require("./routes/authors.js")(app)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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
