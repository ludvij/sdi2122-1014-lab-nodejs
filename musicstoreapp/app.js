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
const userSessionRouter = require('./routes/userSessionRouter')
const userAudiosRouter = require('./routes/userAudiosRouter')

let songsRepository = require('./repositories/songsRepository.js');
let usersRepository = require('./repositories/usersRepository.js');
let commentsRepository = require('./repositories/commentsRepository.js')

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

app.use('/songs/add',userSessionRouter)
app.use('/songs/edit',userSessionRouter)
app.use('/publications',userSessionRouter)
app.use('/songs/buy', userSessionRouter)
app.use('/purchases', userSessionRouter)
app.use('/audios/',userAudiosRouter)
app.use('/shop/',userSessionRouter)
app.use('/comments/', userSessionRouter)
app.use('/favorites', userSessionRouter)
app.use('/favorites/**', userSessionRouter)
const userAuthorRouter = require('./routes/userAuthorRouter')
app.use("/songs/edit",userAuthorRouter)
app.use("/songs/delete",userAuthorRouter)

songsRepository.init(app, MongoClient);
usersRepository.init(app, MongoClient);
commentsRepository.init(app, MongoClient)

require('./routes/songs.js')(app, songsRepository, commentsRepository)
require('./routes/comments.js')(app, commentsRepository)
require('./routes/favorites')(app, songsRepository)
require('./routes/users.js')(app, usersRepository);
require('./routes/authors.js')(app)


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
