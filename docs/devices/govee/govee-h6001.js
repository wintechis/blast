/**
 * 
 */
const Noble = require("noble");
// const Noble = require("noble-winrt"); // If you use windows, use this library
const BluetoothLED = require('govee-led-client');

var Client = new BluetoothLED('A4:C1:38:FB:B0:AD', Noble)


Client.on('connected', () => {
  console.log('Connected');

  Client.setState(true); // Turn on the LED
  Client.setState(false); // Turn off the LED

  Client.setColor('red'); // Use Color Strings
  Client.setColor('#ff0000'); // Use Hex colors
  Client.setColor('rgb(123, 234, 45)'); // Use Color Definitions

  Client.setBrightness(0); // Set the brightness at 0%
  Client.setBrightness(100); // Set the brightness at 100%

  Client.disconnect(); // Disconnect from the device

});

// The device is disconnected and will NOT attempt to reconnect
Client.on('disconnect', () => console.log('Disconnected')); 
// If this was not client initiated, the device will attempt to reconnect
Client.on('ble:disconnect', () => console.log('Disconnected')); 
// The client successfully reconnected
Client.on('reconnected', () => console.log('Reconnected'))
