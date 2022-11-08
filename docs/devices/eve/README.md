# Eve Smart Home Devices

See https://gist.github.com/simont77/3f4d4330fa55b83f8ca96388d9004e7d

## Eve Weather

With the TPlink USB Bluetooth dongle I can connect/pair but after showing the services and characteristics I get a org.bluez.Error.AuthenticationCanceled exception.

Log of btmon in weather-btmon.log and weather-btmon.snoop.

````
[bluetooth]# pair D2:2F:E8:B9:5D:76
Attempting to pair with D2:2F:E8:B9:5D:76
[CHG] Device D2:2F:E8:B9:5D:76 Connected: yes
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000a
	00001801-0000-1000-8000-00805f9b34fb
	Generic Attribute Profile
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b
	0000003e-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char000c
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char000e
	00000014-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char000e/desc0010
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0011
	00000020-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0011/desc0013
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0014
	00000021-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0014/desc0016
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0017
	00000023-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0017/desc0019
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char001a
	00000030-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char001a/desc001c
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char001d
	00000052-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char001d/desc001f
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0020
	00000053-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0020/desc0022
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0023
	34ab8811-ac7f-4340-bac3-fd6a85f9943b
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0023/desc0025
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0026
	00000220-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service000b/char0026/desc0028
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0029
	000000a2-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0029/char002a
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0029/char002c
	000000a5-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0029/char002c/desc002e
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0029/char002f
	00000037-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0029/char002f/desc0031
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032
	00000055-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char0033
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char0035
	0000004c-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char0035/desc0037
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char0038
	0000004e-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char0038/desc003a
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char003b
	0000004f-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char003b/desc003d
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char003e
	00000050-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0032/char003e/desc0040
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041
	00000701-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0042
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0044
	00000702-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0044/desc0046
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0047
	00000703-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0047/desc0049
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0047/desc004a
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char004b
	00000704-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char004b/desc004d
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char004e
	00000706-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char004e/desc0050
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0051
	000000a5-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0051/desc0053
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0054
	0000022b-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0041/char0054/desc0056
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057
	e863f007-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0058
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char005a
	000000a5-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char005a/desc005c
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char005d
	e863f131-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char005d/desc005f
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0060
	e863f11d-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0060/desc0062
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0063
	e863f158-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0063/desc0065
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0066
	e863f116-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0066/desc0068
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0069
	e863f117-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0069/desc006b
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char006c
	e863f11c-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char006c/desc006e
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char006f
	e863f121-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char006f/desc0071
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0072
	e863f112-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0072/desc0074
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0075
	e863f11e-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0057/char0075/desc0077
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078
	00000239-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char0079
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char007b
	000000a5-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char007b/desc007d
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char007e
	0000023a-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char007e/desc0080
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char0081
	0000023c-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char0081/desc0083
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char0084
	0000024a-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char0084/desc0086
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0078/char0084/desc0087
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088
	00000096-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0089
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char008b
	000000a5-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char008b/desc008d
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char008e
	00000068-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char008e/desc0090
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char008e/desc0091
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0092
	00000079-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0092/desc0094
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0092/desc0095
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0096
	00000023-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0096/desc0098
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0099
	0000008f-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0099/desc009b
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service0088/char0099/desc009c
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d
	e863f00a-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char009e
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a0
	00000023-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a0/desc00a2
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a3
	e863f10f-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a3/desc00a5
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a6
	e863f130-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a6/desc00a8
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00a6/desc00a9
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00aa
	e863f136-079e-48ff-8f27-9c2605a29f52
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00aa/desc00ac
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service009d/char00aa/desc00ad
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae
	0000008a-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00af
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b1
	00000011-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b1/desc00b3
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b1/desc00b4
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b5
	00000023-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b5/desc00b7
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b8
	00000036-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b8/desc00ba
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00b8/desc00bb
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00bc
	000000a5-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00ae/char00bc/desc00be
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Primary Service (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf
	00000082-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf/char00c0
	e604e95d-a759-4817-87d3-aa005083a0d1
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf/char00c2
	00000010-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf/char00c2/desc00c4
	00002902-0000-1000-8000-00805f9b34fb
	Client Characteristic Configuration
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf/char00c2/desc00c5
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[NEW] Characteristic (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf/char00c6
	00000023-0000-1000-8000-0026bb765291
	Vendor specific
[NEW] Descriptor (Handle 0x0000)
	/org/bluez/hci0/dev_D2_2F_E8_B9_5D_76/service00bf/char00c6/desc00c8
	dc46f0fe-81d2-4616-b5d9-6abdd796939a
	Vendor specific
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 0000003e-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00000055-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00000082-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 0000008a-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00000096-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 000000a2-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00000239-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00000701-0000-1000-8000-0026bb765291
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00001800-0000-1000-8000-00805f9b34fb
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: 00001801-0000-1000-8000-00805f9b34fb
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: e863f007-079e-48ff-8f27-9c2605a29f52
[CHG] Device D2:2F:E8:B9:5D:76 UUIDs: e863f00a-079e-48ff-8f27-9c2605a29f52
[CHG] Device D2:2F:E8:B9:5D:76 ServicesResolved: yes
[CHG] Device D2:2F:E8:B9:5D:76 ServicesResolved: no
[CHG] Device D2:2F:E8:B9:5D:76 Connected: no
Failed to pair: org.bluez.Error.AuthenticationCanceled
````

When trying to connect to an Aputure MC light, I cannot even connect:

````
[bluetooth]# pair DC:2C:26:C7:D7:04
Attempting to pair with DC:2C:26:C7:D7:04
[CHG] Device DC:2C:26:C7:D7:04 Connected: yes
Failed to pair: org.bluez.Error.AuthenticationFailed
[CHG] Device DC:2C:26:C7:D7:04 Connected: no
````

## Eve Flare

The connection for the Eve Flare simply drops:

```
[Eve Flare]# select-attribute e863f007-079e-48ff-8f27-9c2605a29f52
[Eve Flare:/service0064]# read
Unable to read attribute /org/bluez/hci0/dev_FE_6E_56_8E_23_F9/service0064
[CHG] Device FE:6E:56:8E:23:F9 ServicesResolved: no
[CHG] Device FE:6E:56:8E:23:F9 Connected: no
[bluetooth]# 
```

## HomeAssistant

Looks like some Eve devices work on the HomeAssistant, see https://github.com/home-assistant/core/issues/76380.	