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

const mongoDB = require('./config/connect-to-mongodb');
mongoDB.connect().catch((err) => {console.log(err)});

app.use(express.static(__dirname + '/public'));
app.set("view engine", "hbs");

const hbs = exphbs.create({
  layoutsDir: __dirname + "/views",
  extname: "hbs",
  defaultLayout: "layout",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  partialsDir: __dirname + "/views/partials/",
});

app.engine('hbs', hbs.engine);
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, "components")]);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/property', propertyRouter);

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
