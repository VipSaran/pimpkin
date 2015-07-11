<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Pimpkin](#pimpkin)
  - [Getting started](#getting-started)
    - [Get the code](#get-the-code)
    - [Things to configure (in `blink.js`)](#things-to-configure-in-blinkjs)
    - [Volume on Pi](#volume-on-pi)
    - [All configured now?](#all-configured-now)
    - [Need more details!](#need-more-details)
  - [Resources used](#resources-used)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Pimpkin

Node.js app (along with some suplementary sound files) to control few LEDs and play said sound files.
Primary application: to make a Halloween pumpkin scarier! >:>

[![ScreenShot](screenshot.png?raw=true)](http://youtu.be/_lgX4hxKVRc)

## Getting started

### Get the code

Clone the repo:

    git clone https://github.com/VipSaran/pimpkin.git
    cd pimpkin


### Things to configure (in `blink.js`)

GPIO pins used to control the LEDS:

    var gpioPin1 = 18; // header pin 18 = GPIO port 24
    var gpioPin2 = 22; // header pin 22 = GPIO port 25

Various timings:

    var interval = 100; // blinking interval (in ms)
    var pause = 5000; // delay (in ms) between consecutive scareThem (after the sound has finished)
    var duration = 300000; // duration of the "show" (in ms)

Want to randomly play the sound files? Change the default:

    var soundOrderRandom = false;

### Volume on Pi

My Pi had a really low audio output volume when I started testing the sound files. This is how you can easily configure it in shell:

    alsamixer

### All configured now?

Run the app:

    node blink.js

### Need more details!

Sorry. The code should speak for itself (and it should be a short speech).


## Resources used

* [Rasberry Pi | GPIO Examples 1 - A single LED | Gordons Projects][1]

* [Raspberry Pi Command Line Audio | Raspberry Pi Spy][2]

* [Halloween Sounds | Free Sound Effects | Halloween Sound Clips | Sound Bites][3]

  [1]: https://projects.drogon.net/raspberry-pi/gpio-examples/tux-crossing/gpio-examples-1-a-single-led/
  [2]: http://www.raspberrypi-spy.co.uk/2013/06/raspberry-pi-command-line-audio/
  [3]: http://soundbible.com/tags-halloween.html
