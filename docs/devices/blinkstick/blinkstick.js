var blinkstick = require('blinkstick');

var led = blinkstick.findFirst();

led.setColor('red', function() {
  led.pulse('blue');
});
