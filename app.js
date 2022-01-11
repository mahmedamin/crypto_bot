const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(router);

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port);
