const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const {EventListener} = require('libs');
const cors = require('cors');
const rootApi = require('./controllers');
const app = express();
require('dotenv').config();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', rootApi);

// =========set nunjuck engine template =======
nunjucks.configure('views', {
  autoescape: false,
  express: app,
  cache: true
});
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

EventListener();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.httpCode = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.httpCode || err.status || 500);
  let error = {
    message: err.message,
    httpCode: err.httpCode || err.status || err.code,
    name: err.name || ''
  };
  if (err.failures) {
    error.failures = err.failures;
  }

  // if (err.httpCode !== 404 || err.status !== 404) { // we dont need log 404 error
  //   logs.error({...error});
  // }

  res.json({ error: error });
});

module.exports = app;