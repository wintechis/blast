# Philips Hue

A Hue device can only be connected to one central.
Use the app to reset the device to factory setting.

After factory reset, the device will get a new MAC address.
Then, pair the device at the central using the new MAC address.

````
$ bluetoothctl
# trust {MAC}
# pair {MAC}
# disconnect
$
````

## Philips Hue White Ambiance

On/off works.

## Philips Hue Color Ambiance

On/off works.

## Philips Hue Smart Plug

On/off works.

https://github.com/walter5138/hue_ble_python

works!

See also

https://github.com/studioimaginaire/phue/

https://bluetooth.rocks/lightbulb/