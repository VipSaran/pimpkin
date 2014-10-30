var express = require('express');
var blink = require('./blink');

var app = express();

app.configure(function() {
  app.use(express.favicon());
  app.use(express['static'](__dirname + '/'));
});

app.get('/scare', function(req, res) {
  console.log('/scare');

  blink.scareThem();
  res.send(true);
});

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.send('Unrecognised API call', 404);
});

// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.send(500, 'Oops, Something went wrong!');
  } else {
    next(err);
  }
});

app.listen(3030);
console.log('App Server running at port 3030');
