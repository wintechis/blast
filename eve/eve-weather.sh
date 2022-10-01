#!/usr/bin/expect -f

# read characteristic with weather data
#
# see https://gist.github.com/simont77/3f4d4330fa55b83f8ca96388d9004e7d
# 
# Eve Weather (16 bytes in total)
#
# temperature * 100 on bytes 11-12
# humidity * 100 on bytes 13-14
# pressure * 10 on bytes 15-16
#
# ./eve-weather.sh D2:2F:E8:B9:5D:76

set device [lindex $argv 0];

set timeout 60

send "$device\n"

spawn bluetoothctl
expect "Agent registered"
send -- "scan on\r"
expect "$device"
send -- "scan off\r"
expect "Discovering: no"
send -- "connect $device\r"
expect "Connection successful"
send -- "menu gatt\r"
sleep 2
expect "Eve"
send -- "select-attribute e863f007-079e-48ff-8f27-9c2605a29f52\r"
sleep 2
expect "service"
send -- "read\r"
sleep 1
expect "Eve"
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
