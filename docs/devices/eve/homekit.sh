#!/usr/bin/expect -f

# read some HomeKit characteristics
#
# see https://gist.github.com/simont77/3f4d4330fa55b83f8ca96388d9004e7d
#
# ./homekit.sh D2:2F:E8:B9:5D:76 (weather)
# ./homekit.sh FE:6E:56:8E:23:F9 (flare)

set device [lindex $argv 0];

set timeout 60

set hkname "00000023-0000-1000-8000-0026BB765291"
set hkmanufacturer "00000020-0000-1000-8000-0026BB765291"
set hkmodel "00000021-0000-1000-8000-0026BB765291"
set hkserial "00000030-0000-1000-8000-0026BB765291"
set hkpower "00000025-0000-1000-8000-0026BB765291"

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
expect "Eve"
sleep 2
send -- "select-attribute $hkname\r"
sleep 4
expect "service"
send -- "read\r"
sleep 4
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
