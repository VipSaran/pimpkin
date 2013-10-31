var gpio = require("pi-gpio");

var gpioPin1 = 18; // header pin 18 = GPIO port 24
var gpioPin2 = 22; // header pin 22 = GPIO port 25


var interval = 150; // interval in ms
var intervalId;
var duration = 200000; // duration in ms
var durationId;

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

gpio.close(gpioPin1);
gpio.close(gpioPin2);

var next = 0;
var counter = 0;

// open pin for output
gpio.open(gpioPin1, "output", function(err) {
  gpio.open(gpioPin2, "output", function(err) {

    intervalId = setInterval(function() {
      counter++;
      console.log('counter=', counter);
      if (counter < 20) {
        next = (next + 1) % 2;
        gpio.write(gpioPin1, next, function(err) {
          if (err) throw err;
          // console.log('gpioPin1=', next);
        });
        gpio.write(gpioPin2, next, function(err) {
          if (err) throw err;
          // console.log('gpioPin2=', next);
        });
      } else if (counter > 100) {
        counter = 0;
      } else {
        gpio.write(gpioPin1, 0, function(err) {
          if (err) throw err;
          // console.log('gpioPin1=', next);
        });
        gpio.write(gpioPin2, 0, function(err) {
          if (err) throw err;
          // console.log('gpioPin2=', next);
        });
      }
    }, interval);
  });
});


durationId = setTimeout(function() {
  clearInterval(intervalId);
  clearTimeout(durationId);

  exitGracefully();
}, duration);

process.on('SIGINT', function() {
  console.log('About to exit.');
  exitGracefully();
});