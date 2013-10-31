var fs = require('fs');
var exec = require('child_process').exec;
var gpio = require("pi-gpio");

var gpioPin1 = 18; // header pin 18 = GPIO port 24
var gpioPin2 = 22; // header pin 22 = GPIO port 25

var numBlinks = 15;
var interval = 100; // blinking interval (in ms)
var intervalId;
var pause = 5000; // delay (in ms) between consecutive scareThem (after the sound has finished)
var pauseId;
var duration = 300000; // duration of the "show" (in ms)
var durationId;

function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    // console.log("  command: ", command);
    // console.log("  error: ", error);
    // console.log("  stdout: ", stdout);
    // console.log("  stderr: ", stderr);
    callback(stdout, stderr);
  });
}

function exitGracefully() {
  // turn off pin 11
  gpio.write(gpioPin1, 0, function() {
    gpio.close(gpioPin1);
    console.log('Closed the GPIO pin ' + gpioPin1);
    gpio.write(gpioPin2, 0, function() {
      gpio.close(gpioPin2);
      console.log('Closed the GPIO pin ' + gpioPin2);
      process.exit(0); // and terminate the program
    });
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

  getSoundFileName(false, function(soundFileName) {
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

gpio.close(gpioPin1);
gpio.close(gpioPin2);

var nextValue = 0;
var blinkCounter = 0;

gpio.open(gpioPin1, "output", function(err) {
  console.log('Opened the GPIO pin ' + gpioPin1);
  gpio.open(gpioPin2, "output", function(err) {
    console.log('Opened the GPIO pin ' + gpioPin2);
    scareThem();
  });
});

var scareThem = function() {
  startBlinker();
  playSound(function() {
    stopBlinker();
    pauseId = setTimeout(scareThem, pause);
  });
};

var startBlinker = function() {
  intervalId = setInterval(function() {
    nextValue = (nextValue + 1) % 2;
    // console.log('nextValue=', nextValue);

    gpio.write(gpioPin1, nextValue, function(err) {
      if (err) throw err;
    });
    gpio.write(gpioPin2, nextValue, function(err) {
      if (err) throw err;
    });
  }, interval);
};

var stopBlinker = function() {
  clearInterval(intervalId);

  gpio.write(gpioPin1, 0, function(err) {
    if (err) throw err;
  });
  gpio.write(gpioPin2, 0, function(err) {
    if (err) throw err;
  });
};

durationId = setTimeout(function() {
  clearInterval(intervalId);
  clearTimeout(pauseId);
  clearTimeout(durationId);

  exitGracefully();
}, duration);

process.on('SIGINT', function() {
  console.log('About to exit.');
  exitGracefully();
});