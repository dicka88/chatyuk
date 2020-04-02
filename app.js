const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const session = require('express-session')
const router = express.Router()
const models = require('./models')
require('dotenv').config()

// route file
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1)

app.use(session({
    secret: 'iamsecretbanget',
    resave: true,
    saveUninitialized: true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(router.use('/', indexRouter))
app.use(router.use('/api', apiRouter))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

//migrate database if not exist
models.sequelize.sync({ force: false })
    .then(() => console.log("database migrate"))
    .catch(() => console.error("something error happen"))

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