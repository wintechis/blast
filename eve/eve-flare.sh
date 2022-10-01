#!/usr/bin/expect -f

# see https://gist.github.com/simont77/3f4d4330fa55b83f8ca96388d9004e7d

# ./eve-flare.sh FE:6E:56:8E:23:F9 0 (off)
# ./eve-flare.sh FE:6E:56:8E:23:F9 1 (on)

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
expect "Eve"
sleep 1
send -- "select-attribute 932c32bd-0002-47a2-835a-a8d455b859dd\r"
expect "service"
send -- "write $on\r"
expect "Eve"
sleep 1
send -- "back\r"
expect "Eve"
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
