var express = require('express'),
    app = express(),
    bidController = require('../controllers/bidController');

app.use(express.json());

app.get('/initiate/:user', bidController.initiate);

module.exports = app;
