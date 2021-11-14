var express = require('express');
var indexRouter = require('./routes/index');
var sign = require('./routes/sign');
var reservation = require('./routes/reservation');

var cors = require("cors");
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json());

var port = 5000;
app.listen(port, () => console.log(`${port}`));

app.use('/', indexRouter);
app.use('/sign', sign);
app.use('/reservation', reservation);