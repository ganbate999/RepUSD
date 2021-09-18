"use strict"

require("./config/config")

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const routePath = './routes/';
const app = express();
const path = require('path');
var http = require('http').createServer(app);
const cors = require('cors');


var port = process.env.PORT || 3000;

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({origin: 'https://localhost:3000'}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './build/static')));
app.use('/', express.static(path.join(__dirname, './build')));
app.use((req, res, next) => {
    next();
});

// Load Routes Dynamically
fs
  .readdirSync(routePath).forEach(function (file) {
    try {
      var routeFile = require(routePath + file);
      app.use('/api', routeFile);
    } catch (ex) {
      console.log(file, "----err", ex);
    }
  });

app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './build/index.html'));
});

http.listen(port, '0.0.0.0', function () {
  console.log("The server is listening at http://" + 'localhost' + ":" + port)
});

