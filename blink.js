var fs = require('fs');
var exec = require('child_process').exec;
var http = require('http');

var soundOrderRandom = true;

var pauseId;

function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    // console.log("  command: ", command);
    // console.log("  error: ", error);
    // console.log("  stdout: ", stdout);
    // console.log("  stderr: ", stderr);
    callback(stdout, stderr);
  });
}

function randomFromInterval(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

var lastFileNameIndex = 0;

function getSoundFileName(random, callback) {
  console.log('getSoundFileName(); random=', random);

  // read dir each time for better robustness
  fs.readdir('sounds', function(err, list) {
    if (err) return done(err);

    var index = 0;
    if (random) {
      index = randomFromInterval(0, list.length - 1);
    } else {
      index = lastFileNameIndex;

      lastFileNameIndex++;

      // loop
      if (lastFileNameIndex == list.length) {
        lastFileNameIndex = 0;
      }
    }

    var fileName = list[index];
    console.log('index=', index);
    console.log('fileName=', fileName);
    callback(fileName);
  });
};

var playSound = function(callback) {
  // var soundFileName = 'Evil_laugh_Male_9-Himan-1598312646.mp3';

  getSoundFileName(soundOrderRandom, function(soundFileName) {
    var command = 'omxplayer sounds/' + soundFileName;
    execute(command, function(out, err) {
      if (err) {
        console.error(err);
      } else {
        console.log('played:', soundFileName);
      }
      callback();
    });
  });
};

var lightUp = function(seconds) {
  var options = {
    host: 'http://192.168.2.115:3000',
    path: '/api/light/' + seconds
  };

  var callback = function(response) {
    var str = '';

    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      console.log(str);
    });
  }

  http.request(options, callback).end();
};

var scareThem = function(pause) {
  lightUp(10);
  playSound(function() {
    if (pause !== "undefined" && pause != null) {
      console.log('starting indefinite play with', pause, 'delay');
      pauseId = setTimeout(function() {
        scareThem(pause);
      }, pause);
    }
  });
};

var stopPeriodicScare = function() {
  clearTimeout(pauseId);
};

exports.init = init;
exports.scareThem = scareThem;
exports.stopPeriodicScare = stopPeriodicScare;
exports.exitGracefully = exitGracefully;