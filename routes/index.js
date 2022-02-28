var express = require('express'),
    app = express(),
    bidController = require('../controllers/bidController'),
    stepService = require('../services/stepsService');

app.use(express.json());

app.get('/initiate/:user', bidController.initiate);
app.get('/test-step', stepService.testStep);

module.exports = app;
