const createError = require('http-errors');
const express = require('express');
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const indexRouter = require('./router');
const propertyRouter = require('./components/property/router');
const loginRouter = require("./components/login/router");
const profileRouter = require('./components/profile/router');
const apiRouter = require('./api/apiRouter');
const sessionMiddleware = require("./middlewares/session.mdw");

app.use(sessionMiddleware);
app.use(express.static(__dirname + '/public'));
app.set("view engine", "hbs");

app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, "components")]);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', loginRouter);
app.use('/home', indexRouter);
app.use('/property', propertyRouter);
app.use('/profile', profileRouter);
app.use('/api', apiRouter);


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
  res.json({
    message: err.message,
    error: err,
  });
  res.render('error');
});

module.exports = app;
