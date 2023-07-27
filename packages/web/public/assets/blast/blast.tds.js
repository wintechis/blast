var e,t,a={},r={};function o(e){var t=r[e];if(void 0!==t)return t.exports;var i=r[e]={exports:{}};return a[e](i,i.exports,o),i.exports}t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,o.t=function(a,r){if(1&r&&(a=this(a)),8&r)return a;if("object"==typeof a&&a){if(4&r&&a.__esModule)return a;if(16&r&&"function"==typeof a.then)return a}var i=Object.create(null);o.r(i);var n={};e=e||[null,t({}),t([]),t(t)];for(var s=2&r&&a;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach((e=>n[e]=()=>a[e]));return n.default=()=>a,o.d(i,n),i},o.d=(e,t)=>{for(var a in t)o.o(t,a)&&!o.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};o.d(i,{QT:()=>s,u2:()=>d,ZM:()=>l,h:()=>m,ur:()=>f,nr:()=>h,eA:()=>w,BM:()=>x,Rt:()=>O,_H:()=>B,ab:()=>D,SR:()=>q,OP:()=>A});const n=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#","bdo":"https://freumi.inrupt.net/BinaryDataOntology.ttl#","qudt":"https://qudt.org/schema/qudt/","qudtUnit":"https://qudt.org/vocab/unit/"},{"@language":"en"}],"@type":"","title":"BLE RGB Controller","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":["nosec_sc"],"sbo:hasGAPRole":"sbo:Peripheral","sbo:isConnectable":true,"sbo:hasAdvertisingIntervall":{"qudt:numericValue":50,"qutdUnit:unit":"qudtUnit:MilliSEC"},"properties":{"colour":{"title":"colour","description":"The colour of the LED light.","unit":"","type":"string","format":"hex","observable":false,"readOnly":false,"writeOnly":true,"bdo:pattern":"7e000503{R}{G}{B}00ef","bdo:variables":{"R":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Red value."},"G":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Green value."},"B":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Blue value."}},"forms":[{"op":"writeproperty","href":"./0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb","contentType":"application/x.binary-data-stream","sbo:methodName":"sbo:write-without-response"}]},"power":{"type":"string","format":"hex","observable":false,"readOnly":false,"writeOnly":true,"description":"The power switch of the controller.","bdo:pattern":"7e0004{is_on}00000000ef","bdo:variables":{"is_on":{"type":"integer","minimum":0,"maximum":1,"bdo:bytelength":1}},"forms":[{"href":"./0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]},"effect":{"type":"string","format":"hex","observable":false,"readOnly":false,"writeOnly":true,"description":"The effect of the LED light.","bdo:pattern":"7e0003{effect}03000000ef","bdo:variables":{"effect":{"type":"integer","minimum":128,"maximum":156,"bdo:bytelength":1}},"forms":[{"href":"./0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]}}}');var s=o.t(n,2);const b=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"@language":"en"}],"title":"tulogic Blinkstick","description":"the tulogic Blinkstick is a Smart LED controller with integrated USB firmware.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"properties":{"color":{"type":"array","description":"RGB color value","observable":false,"readOnly":false,"writeOnly":true,"forms":[{"href":"hid://sendFeatureReport","hid:path":"{{HIDPATH}}","contentType":"application/x.binary-data-stream","hid:reportId":5}]}}}');var d=o.t(b,2);const p=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"http://example.org/simple-bluetooth-ontology#","bdo":"http://example.org/binary-data-ontology#"},{"@language":"en"}],"@type":"","id":"blast:bluetooth:BluetoothGeneric","title":"Genereic Bluetooth device","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A generic Bluetooth device","sbo:isConnectable":true,"securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":["nosec_sc"],"actions":{},"events":{},"links":[],"observedProperties":{},"properties":{"barometricPressureTrend":{"title":"Barometric pressure trend","description":"The barometric pressure trend in hPa.","unit":"hPa","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001802-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"batteryLevel":{"title":"Battery level","description":"Battery level in %.","unit":"%","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180f-0000-1000-8000-00805f9b34fb/00002a19-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"deviceName":{"title":"Device name","description":"User defined name of the device","type":"string","observable":false,"readOnly":false,"writeOnly":false,"forms":[{"href":"./00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"href":"./00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb","op":"writeproperty","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"elevation":{"title":"Elevation","description":"The elevation measured by the device.","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001803-0000-1000-8000-00805f9b34fb/00002a6c-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"firmwareRevision":{"title":"Firmware revision","description":"Revision of the device\'s firmware","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180a-0000-1000-8000-00805f9b34fb/00002a26-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"hardwareRevision":{"title":"Hardware revision","description":"Revision of the device\'s hardware","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180a-0000-1000-8000-00805f9b34fb/00002a27-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"humidity":{"title":"Humidity","description":"The relative humidity in %","unit":"%","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001803-0000-1000-8000-00805f9b34fb/00002a6f-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"irradiance":{"title":"Irradiance","description":"Irradiance measured by the device.","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001803-0000-1000-8000-00805f9b34fb/00002a77-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"intermediateTemperature":{"title":"Intermediate temperature","description":"The intermediate temperature measured by the device.","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001809-0000-1000-8000-00805f9b34fb/00002a1e-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"manufacturerName":{"title":"Manufacturer name","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180a-0000-1000-8000-00805f9b34fb/00002a29-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"modelNumber":{"title":"Model number","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180a-0000-1000-8000-00805f9b34fb/00002a24-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"movementCounter":{"title":"Movement counter","description":"A counter incremented everytime the device starts moving.","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001809-0000-1000-8000-00805f9b34fb/00002a56-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"pressure":{"title":"Pressure","description":"Barometric pressure in hPa","unit":"hPa","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001809-0000-1000-8000-00805f9b34fb/00002a6d-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"serialNumber":{"title":"Serial number","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180a-0000-1000-8000-00805f9b34fb/00002a25-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"softwareRevision":{"title":"Software revision","description":"Revision of the device\'s software","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./0000180a-0000-1000-8000-00805f9b34fb/00002a28-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"temperature":{"title":"Temperature","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001809-0000-1000-8000-00805f9b34fb/00002a6e-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"temperatureMeasurement":{"title":"Temperature measurement","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001809-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"temperatureType":{"title":"Temperature type","type":"string","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001809-0000-1000-8000-00805f9b34fb/00002a1d-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"txPowerLevel":{"title":"Tx Power Level","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001804-0000-1000-8000-00805f9b34fb/00002a07-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"weight":{"title":"Weight","type":"number","observable":false,"readOnly":true,"writeOnly":false,"forms":[{"href":"./00001808-0000-1000-8000-00805f9b34fb/00002a9d-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]}},"subscribedEvents":{}}');var l=o.t(p,2);const c=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1"],"@type":"","id":"blast:bluetooth:EddystoneDevice","title":"Eddystone Device","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A Bluetooth device implementing the Eddystone protocol","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":"nosec_sc","properties":{"activeSlot":{"title":"Active Slot","description":"The active slot of the Eddystone device","type":"integer","bdo:bytelength":1,"readOnly":false,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"op":"writeproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"advertisedTxPower":{"title":"Advertised Tx Power","description":"The advertised TX power of the iBeacon","unit":"dBm","type":"integer","bdo:bytelength":1,"bdo:signed":true,"readOnly":false,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"op":"writeproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"advertisedData":{"title":"Advertised Data","description":"The advertised data of the eddystone device","unit":"","type":"string","format":"hex","readOnly":false,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"op":"writeproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"advertisingInterval":{"title":"Advertising Interval","description":"The advertising interval of the eddystone device","unit":"ms","type":"integer","bdo:byteOrder":"big","bdo:bytelength":2,"readOnly":false,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"op":"writeproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"capabilities":{"title":"Capabilities","description":"The capabilities of the eddystone device","type":"string","format":"hex","readOnly":true,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87501-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"lockState":{"title":"Lock State","description":"The lock state of the eddystone device","unit":"","type":"string","format":"hex","readOnly":false,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"op":"writeproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"publicEcdhKey":{"title":"Public ECDH Key","description":"The public ECDH key of the eddystone device","unit":"","type":"string","format":"hex","readOnly":true,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87508-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"radioTxPower":{"title":"Radio Tx Power","description":"The radio TX power of the eddystone device","unit":"dBm","type":"integer","bdo:bytelength":1,"bdo:signed":true,"readOnly":false,"forms":[{"op":"readproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"op":"writeproperty","href":"./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]}}}');var m=o.t(c,2);const u=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"@language":"en"}],"title":"Nintento Switch Pro Controller","description":"The Nintendo Switch Pro Controller is a gamepad used for the Nintendo Switch console.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"events":{"button":{"title":"Gamepad button pressed events","description":"This event is emitted when a button on the gamepad is pressed.","data":{"type":"array","description":"A string array containing all buttons that were pressed."}},"joystick":{"title":"Gamepad joystick moved events","description":"This event is emitted when the left joystick on the gamepad is moved.","data":{"type":"object","description":"An object containing the x and y coordinates and the angle of the joystick."}}}}');var f=o.t(u,2);const y=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"http://example.org/simple-bluetooth-ontology#","bdo":"http://example.org/binary-data-ontology#"},{"@language":"en"}],"title":"GoveeLamp","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A Govee smart light bulb.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"sbo:hasGAPRole":"sbo:Peripheral","sbo:isConnectable":true,"properties":{"power":{"type":"string","format":"hex","observable":false,"readOnly":false,"writeOnly":true,"minimum":0,"maximum":1,"description":"The current power status of the bulb","bdo:pattern":"3301{state}00000000000000000000000000000000","bdo:variables":{"state":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1,"description":"The current power state"}},"tst:function":"let checksum = 0; for (let i = 0; i < buf.length; i++) {checksum = checksum ^ buf[i];} let finBuf = Buffer.concat([buf, Buffer.from([checksum])]); return finBuf;","forms":[{"href":"./00010203-0405-0607-0809-0a0b0c0d1910/00010203-0405-0607-0809-0a0b0c0d2b11","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]},"brightness":{"type":"string","format":"hex","bdo:pattern":"3304{value}000000000000000000000000000000000","bdo:variables":{"value":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Brightness value"}},"observable":false,"readOnly":false,"writeOnly":true,"description":"The current brightness value of the bulb","tst:function":"let checksum = 0; for (let i = 0; i < buf.length; i++) {checksum = checksum ^ buf[i];} let finBuf = Buffer.concat([buf, Buffer.from([checksum])]); return finBuf;","forms":[{"href":"./00010203-0405-0607-0809-0a0b0c0d1910/00010203-0405-0607-0809-0a0b0c0d2b11","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]},"colour":{"type":"string","format":"hex","observable":false,"readOnly":false,"writeOnly":true,"description":"The colour of the LED light.","bdo:pattern":"330502{red}{green}{blue}00000000000000000000000000","bdo:variables":{"red":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Red value."},"green":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Green value."},"blue":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Blue value."}},"tst:function":"let checksum = 0; for (let i = 0; i < buf.length; i++) {checksum = checksum ^ buf[i];} let finBuf = Buffer.concat([buf, Buffer.from([checksum])]); return finBuf;","forms":[{"href":"./00010203-0405-0607-0809-0a0b0c0d1910/00010203-0405-0607-0809-0a0b0c0d2b11","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]}}}');var h=o.t(y,2);const g=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"http://example.org/simple-bluetooth-ontology#","bdo":"http://example.org/binary-data-ontology#"},{"@language":"en"}],"title":"HuskyDuino","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A HuskyLens interface running on Arduino.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"sbo:hasGAPRole":"sbo:Peripheral","sbo:isConnectable":true,"sbo:hasAdvertisingIntervall":{"qudt:numericValue":200,"qutdUnit:unit":"qudtUnit:MilliSEC"},"properties":{"algorithm":{"type":"integer","observable":false,"readOnly":false,"writeOnly":false,"description":"The currently active algorithm","minimum":1,"maximum":7,"bdo:bytelength":1,"forms":[{"href":"./5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"href":"./5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003","op":"writeproperty","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"id":{"type":"string","observable":false,"readOnly":true,"writeOnly":false,"description":"The ID of the face or object","forms":[{"href":"./5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]},"location":{"type":"string","observable":false,"readOnly":true,"writeOnly":false,"description":"The location of the face or object","forms":[{"href":"./5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]}},"actions":{"forgetAll":{"description":"Forget all faces and objects","input":{"type":"string","enum":["true"]},"forms":[{"href":"./5be35d20-f9b0-11eb-9a03-0242ac130003/5be361b8-f9b0-11eb-9a03-0242ac130003","op":"invokeaction","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]},"learn":{"description":"Learn a new face or object.","input":{"type":"integer","minimum":0,"maximum":255,"bdo:bytelength":1,"description":"The ID of the face or object to learn."},"forms":[{"href":"./5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003","op":"invokeaction","sbo:methodName":"sbo:write-without-response","contentType":"application/x.binary-data-stream"}]}}}');var w=o.t(g,2);const v=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"http://example.org/simple-bluetooth-ontology#","bdo":"http://example.org/binary-data-ontology#"},{"@language":"en"}],"title":"PhilipsHue","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A PhilipsHue smart light bulb.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"sbo:hasGAPRole":"sbo:Peripheral","sbo:isConnectable":true,"properties":{"power":{"type":"integer","observable":false,"readOnly":false,"writeOnly":false,"minimum":0,"maximum":1,"bdo:bytelength":1,"description":"The current power status of the bulb","forms":[{"href":"./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0002-47a2-835a-a8d455b859dd","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"href":"./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0002-47a2-835a-a8d455b859dd","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]},"brightness":{"type":"integer","observable":false,"readOnly":true,"writeOnly":false,"minimum":1,"maximum":255,"bdo:bytelength":1,"description":"The current brightness value of the bulb","forms":[{"href":"./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0003-47a2-835a-a8d455b859dd","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"},{"href":"./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0003-47a2-835a-a8d455b859dd","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]},"colour":{"type":"object","format":"hex","observable":false,"readOnly":false,"writeOnly":true,"description":"The colour of the LED light.","bdo:pattern":"0F{red}{blue}{green}","bdo:variables":{"red":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Red value."},"green":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Green value."},"blue":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255,"description":"Blue value."}},"tst:function":"const scale = 0xff; const adjustedArr = []; for (const chan of [buf[1], buf[2], buf[3]]) {adjustedArr.push(Math.max(1, chan));} const total = adjustedArr.reduce((partialSum, a) => partialSum + a, 0); const adjustedArrFinal = []; for (const chan of [buf[1], buf[2], buf[3]]) {let x = Math.round((chan / total) * scale); adjustedArrFinal.push(Math.max(1, x));} for (let i = 1; i < 4; i++) {buf[i] = adjustedArrFinal[i-1]} return buf;","forms":[{"href":"./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0005-47a2-835a-a8d455b859dd","op":"writeproperty","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]}},"actions":{"dim":{"input":{"type":"integer","observable":false,"readOnly":false,"writeOnly":false,"minimum":1,"maximum":255,"bdo:bytelength":1},"description":"Reduce the brightness value of the bulb","forms":[{"href":"./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0003-47a2-835a-a8d455b859dd","op":"invokeaction","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]}}}');var x=o.t(v,2);const T=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#","bdo":"https://freumi.inrupt.net/BinaryDataOntology.ttl#","qudt":"https://qudt.org/schema/qudt/","qudtUnit":"https://qudt.org/vocab/unit/"},{"@language":"en"}],"@type":"","id":"blast:Bluetooth:RuuviTag","title":"Ruuvi Tag","base":"gatt://{{MacOrWebBluetoothId}}/","description":"RuuviTag is a wireless Bluetooth sensor node that measures temperature, air humidity, and movement.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":"nosec_sc","events":{"UART data":{"title":"Ruuvi Data data","description":"The RuuviTag data received over UART, see https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2","data":{"type":"array","bdo:pattern":"{format}{temp}{humidity}{pressure}{acc-x}{acc-y}{acc-z}{power-info}{movement-counter}{measurement-sequence-number}","bdo:variables":{"format":{"type":"number","bdo:bytelength":1},"temp":{"type":"number","bdo:bytelength":2,"bdo:signed":true,"bdo:byteOrder":"big","bdo:scale":0.005,"unit":"qudtUnit:DEG_C"},"humidity":{"type":"number","bdo:bytelength":2,"bdo:byteOrder":"big","bdo:scale":0.0025,"unit":"qudtUnit:PERCENT"},"pressure":{"type":"number","bdo:bytelength":2,"bdo:byteOrder":"big","unit":"qudt:PA"},"acc-x":{"type":"number","bdo:bytelength":2,"bdo:signed":true,"bdo:byteOrder":"big","bdo:scale":0.001,"unit":"qudtUnit:G"},"acc-y":{"type":"number","bdo:bytelength":2,"bdo:signed":true,"bdo:byteOrder":"big","bdo:scale":0.001,"unit":"qudtUnit:mG"},"acc-z":{"type":"number","bdo:bytelength":2,"bdo:signed":true,"bdo:byteOrder":"big","bdo:scale":0.001,"unit":"qudtUnit:mG"},"power-info":{"type":"number","bdo:bytelength":2},"movement-counter":{"type":"number","bdo:bytelength":1,"bdo:byteOrder":"big"},"measurement-sequence-number":{"type":"number","bdo:bytelength":2,"bdo:byteOrder":"big"}}},"forms":[{"href":"./6e400001-b5a3-f393-e0a9-e50e24dcca9e/6e400003-b5a3-f393-e0a9-e50e24dcca9e","sbo:methodName":"subscribe","contentType":"application/x.binary-data-stream"}]}}}');var O=o.t(T,2);const N=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"@language":"en"}],"title":"Sphero Mini","description":"The Sphero Mini is a small robot ball that can be controlled via Bluetooth.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"actions":{"roll":{"input":{"type":"object","properties":{"speed":{"type":"number","minimum":0,"maximum":255},"heading":{"type":"number","minimum":0,"maximum":359}}}}}}');var B=o.t(N,2);const S=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"@language":"en"}],"title":"Elgato Stream Deck Mini","description":"The Stream Deck Mini is a small device that connects to your computer and lets you control your software with custom buttons. It\'s the perfect companion for your favorite games, productivity apps, and more.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"properties":{"brightness":{"type":"integer","minimum":0,"maximum":100,"observable":false,"readOnly":false,"writeOnly":true,"description":"The brightness value of the device\'s display (0-100)","forms":[{"href":"hid://sendFeatureReport","hid:path":"{{HIDPATH}}","hid:data":[5,85,170,209,1,0,0,0,0,0,0,0,0,0,0,0,0],"hid:valueIndex":5,"op":"writeproperty","contentType":"application/octet-stream"}]}},"events":{"inputreport":{"title":"Stream deck input report","description":"The input report event is emitted periodically when the device is in use and contains the current state of the buttons.","data":{"type":"array","bdo:pattern":"{reportid}{button1}{button2}{button3}{button4}{button5}{button6}","bdo:variables":{"reportid":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":255},"button1":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1},"button2":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1},"button3":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1},"button4":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1},"button5":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1},"button6":{"type":"integer","bdo:bytelength":1,"minimum":0,"maximum":1}}},"forms":[{"href":"hid://receiveInputReport","hid:path":"{{HIDPATH}}","contentType":"application/x.binary-data-stream"}]}},"actions":{"sendReport":{"type":"null","description":"Sends an output report to the HID device.","input":{"type":"string","format":"hex"},"forms":[{"href":"hid://sendReport","hid:path":"{{HIDPATH}}","contentType":"application/x.binary-data-stream"}]}}}');var D=o.t(S,2);const P=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#","bdo":"https://freumi.inrupt.net/BinaryDataOntology.ttl#","qudt":"https://qudt.org/schema/qudt/","qudtUnit":"https://qudt.org/vocab/unit/"},{"@language":"en"}],"title":"Flower Care","base":"gatt://{{MacOrWebBluetoothId}}/","description":"A Xiaomi Flower Care Sensor.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"@type":"","security":["nosec_sc"],"sbo:hasGAPRole":"sbo:Peripheral","sbo:isConnectable":true,"sbo:hasAdvertisingIntervall":{"qudt:numericValue":2000,"qutdUnit:unit":"qudtUnit:MilliSEC"},"properties":{"valueString":{"type":"array","observable":false,"readOnly":true,"writeOnly":false,"description":"The Values of the device","bdo:pattern":"{temp}00{brightness}{moisture}{conduct}023c00fb349b","bdo:variables":{"temp":{"type":"integer","bdo:bytelength":2,"bdo:scale":0.1,"description":"The current temperature value.","unit":"qudtUnit:DEG_C"},"brightness":{"type":"integer","bdo:bytelength":4,"description":"The current brightness value.","unit":"qudtUnit:LUX"},"moisture":{"type":"integer","bdo:bytelength":1,"description":"The current moisture value.","unit":"qudtUnit:PERCENT"},"conduct":{"type":"integer","bdo:bytelength":2,"description":"The current conductivity value.","unit":"qudtUnit:S"}},"forms":[{"href":"./00001204-0000-1000-8000-00805f9b34fb/00001a01-0000-1000-8000-00805f9b34fb","op":"readproperty","sbo:methodName":"sbo:read","contentType":"application/x.binary-data-stream"}]}},"actions":{"readMode":{"type":"string","observable":false,"readOnly":false,"writeOnly":true,"description":"Enable write mode","input":{"type":"string","format":"hex","enum":["A01F"],"bdo:bytelength":2,"description":"The command \\"A01F\\" enables write mode."},"forms":[{"href":"./00001204-0000-1000-8000-00805f9b34fb/00001a00-0000-1000-8000-00805f9b34fb","op":"invokeaction","sbo:methodName":"sbo:write","contentType":"application/x.binary-data-stream"}]}}}');var q=o.t(P,2);const R=JSON.parse('{"@context":["https://www.w3.org/2019/wot/td/v1","https://www.w3.org/2022/wot/td/v1.1",{"sbo":"https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#","bdo":"https://freumi.inrupt.net/BinaryDataOntology.ttl#","qudt":"https://qudt.org/schema/qudt/","qudtUnit":"https://qudt.org/vocab/unit/"},{"@language":"en"}],"@type":"","id":"blast:Bluetooth:xiamoiThermometer","title":"Xiaomi Thermometer","base":"gatt://{{MacOrWebBluetoothId}}/","description":"The Xiaomi Thermometer is a temperature and humidity sensor with a Bluetooth Low Energy interface.","securityDefinitions":{"nosec_sc":{"scheme":"nosec"}},"security":"nosec_sc","events":{"measurements":{"title":"Temperature and humidity measurements","description":"The temperature and humidity values measured by the thermometer.","data":{"type":"array","bdo:pattern":"{temp}{hum}2011","bdo:variables":{"temp":{"type":"number","bdo:bytelength":2,"bdo:scale":0.01,"unit":"qudtUnit:DEG_C"},"hum":{"type":"number","bdo:bytelength":1,"unit":"qudtUnit:PERCENT"}}},"forms":[{"href":"./ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6/ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6","sbo:methodName":"subscribe","contentType":"application/x.binary-data-stream"}]}}}');var A=o.t(R,2),_=i.QT,k=i.u2,E=i.ZM,M=i.h,j=i.ur,G=i.nr,I=i.eA,C=i.BM,U=i.Rt,H=i._H,L=i.ab,F=i.SR,J=i.OP;export{_ as BleRgbController,k as Blinkstick,E as BluetoothGeneric,M as EddystoneDevice,j as GamepadPro,G as GoveeLamp,I as HuskyDuino,C as PhilipsHue,U as RuuviTag,H as SpheroMini,L as StreamDeckMini,F as XiaomiFlowerCare,J as XiaomiThermometer};
//# sourceMappingURL=blast.tds.js.map