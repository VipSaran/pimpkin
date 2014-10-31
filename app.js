var express = require('express');
var bodyParser = require('body-parser');

var blink = require('./blink');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/'));

app.get('/scare', function(req, res) {
  console.log('/scare');

  blink.scareThem();
  res.status(200).send(true);
});

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});

app.listen(3030);
console.log('App Server running at port 3030');