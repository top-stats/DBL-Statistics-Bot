var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var interactionsRouter = require('./routes/interactions');

var app = express();

var options = {
    inflate: true,
    limit: '100kb',
    type: 'application/octet-stream'
  };

app.use(logger('dev'));

app.use('/', interactionsRouter);

module.exports = app;
