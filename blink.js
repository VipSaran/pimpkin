var gpio = require("pi-gpio");

var gpioPin1 = 18; // header pin 18 = GPIO port 24
var gpioPin2 = 22; // header pin 22 = GPIO port 25

var numBlinks = 15;
var interval = 100; // interval in ms
var intervalId;
var pause = 10000;
var pauseId;
var duration = 30000; // duration in ms
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

var nextValue = 0;
var blinkCounter = 0;

gpio.open(gpioPin1, "output", function(err) {
  console.log('Opened the GPIO pin ' + gpioPin1);
  gpio.open(gpioPin2, "output", function(err) {
    console.log('Opened the GPIO pin ' + gpioPin2);
    blinker();
    pauseId = setInterval(blinker, pause);
  });
});

var blinker = function() {
  intervalId = setInterval(function() {
    blinkCounter++;
    // console.log('blinkCounter=', blinkCounter);
    if (blinkCounter < numBlinks) {
      nextValue = (nextValue + 1) % 2;
      // console.log('nextValue=', nextValue);

      gpio.write(gpioPin1, nextValue, function(err) {
        if (err) throw err;
      });
      gpio.write(gpioPin2, nextValue, function(err) {
        if (err) throw err;
      });
    } else {
      console.log(numBlinks + 'x fired LED. Waiting for ' + pause/1000 + 's.');
      clearInterval(intervalId);

      blinkCounter = 0;
      
      gpio.write(gpioPin1, 0, function(err) {
        if (err) throw err;
      });
      gpio.write(gpioPin2, 0, function(err) {
        if (err) throw err;
      });      
    }
  }, interval);
};

durationId = setTimeout(function() {
  clearInterval(intervalId);
  clearInterval(pauseId);
  clearTimeout(durationId);

  exitGracefully();
}, duration);

process.on('SIGINT', function() {
  console.log('About to exit.');
  exitGracefully();
});