/home/aharth/.local/bin/brother_ql -p usb://0x04f9:0x209d -b pyusb -m QL-820NWB print 240px-QR_code_for_mobile_English_Wikipedia.svg.png -l 29

https://github.com/pklaus/brother_ql

pip install --upgrade https://github.com/pklaus/brother_ql/archive/master.zip

sometimes ettikettentyp falsch meldung am display

sometimes resource busy

# lsusb

cat /etc/udev-rules.d/20-brother

````
SUBSYSTEMS=="usb", ATTRS{idVendor}=="04f9", ATTRS{idProduct}=="209d", MODE="0666"
````