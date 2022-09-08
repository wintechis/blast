#!/usr/bin/expect -f

# a hue device can only be connected to one central
# use the app to reset the device to factory setting
# after factory reset, the device will get a new mac address
# then, pair the device at the central using the new mac address

# ./hue.sh C4:73:3C:9E:FE:CE 0 (off)
# ./hue.sh E0:B0:58:AC:E7:F6 1 (on)
set device [lindex $argv 0];
set on [lindex $argv 1];

set timeout 60

send "$device\n"
send "$on\n"

spawn bluetoothctl
expect "Agent registered"
send -- "scan on\r"
expect "$device"
send -- "scan off\r"
expect "Discovering: no"
send -- "connect $device\r"
expect "Connection successful"
send -- "menu gatt\r"
expect "Hue"
sleep 1
send -- "select-attribute 932c32bd-0002-47a2-835a-a8d455b859dd\r"
expect "Hue"
send -- "write $on\r"
expect "Hue"
sleep 1
send -- "back\r"
expect "Hue"
send -- "disconnect\r"
expect "#"
send -- "exit\r"
expect eof

#connect 
#
#write 0
#back
#disconnect
#exit
