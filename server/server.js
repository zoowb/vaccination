const express = require('express');
const indexRouter = require('./routes/index');
const sign = require('./routes/sign');
const reservation = require('./routes/reservation');
const mypage = require('./routes/mypage');
const home = require('./routes/home');
const search = require('./routes/search');
const vaccine = require('./routes/vaccine');

const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;
app.listen(port, () => console.log(`${port}`));

app.use('/', indexRouter);
app.use('/sign', sign);
app.use('/reservation', reservation);
app.use('/mypage', mypage);
app.use('/home', home);
app.use('/search', search);
app.use('/vaccine', vaccine);