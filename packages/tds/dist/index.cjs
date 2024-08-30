"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  BleRgbController: () => BleRgbController_default,
  Blinkstick: () => Blinkstick_default,
  BluetoothGeneric: () => BluetoothGeneric_default,
  EddystoneDevice: () => EddystoneDevice_default,
  GamepadPro: () => GamepadPro_default,
  GoveeLedBulb: () => GoveeLamp_default,
  HuskyDuino: () => HuskyDuino_default,
  JoyCon: () => JoyCon_default,
  Microbit: () => MicroBit_default,
  PhilipsHue: () => PhilipsHue_default,
  RuuviTag: () => RuuviTag_default,
  SpheroMini: () => SpheroMini_default,
  StreamDeckMini: () => StreamDeckMini_default,
  XiaomiFlowerCare: () => XiaomiFlowerCare_default,
  XiaomiThermometer: () => XiaomiThermometer_default
});
module.exports = __toCommonJS(src_exports);

// src/tds/BleRgbController.json
var BleRgbController_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#",
      bdo: "https://freumi.inrupt.net/BinaryDataOntology.ttl#",
      qudt: "https://qudt.org/schema/qudt/",
      qudtUnit: "https://qudt.org/vocab/unit/"
    },
    { "@language": "en" }
  ],
  "@type": "",
  title: "BLE RGB Controller",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  security: ["nosec_sc"],
  "sbo:hasGAPRole": "sbo:Peripheral",
  "sbo:isConnectable": true,
  "sbo:hasAdvertisingIntervall": {
    "qudt:numericValue": 50,
    "qutdUnit:unit": "qudtUnit:MilliSEC"
  },
  properties: {
    colour: {
      title: "colour",
      description: "The colour of the LED light.",
      type: "object",
      observable: false,
      readOnly: false,
      writeOnly: true,
      properties: {
        commandStart: {
          type: "integer",
          const: 126,
          default: 126,
          description: "Command start byte.",
          "ex:bitOffset": 0,
          "ex:bitLength": 8
        },
        commandLength: {
          type: "integer",
          const: 7,
          default: 7,
          description: "Command length.",
          "ex:bitOffset": 8,
          "ex:bitLength": 8
        },
        commandId: {
          type: "integer",
          const: 5,
          default: 5,
          description: "Command type.",
          "ex:bitOffset": 16,
          "ex:bitLength": 8
        },
        commandSubId: {
          type: "integer",
          const: 3,
          default: 3,
          description: "Command sub type.",
          "ex:bitOffset": 24,
          "ex:bitLength": 8
        },
        R: {
          type: "integer",
          minimum: 0,
          maximum: 255,
          description: "Red value.",
          "ex:bitOffset": 32,
          "ex:bitLength": 8
        },
        G: {
          type: "integer",
          minimum: 0,
          maximum: 255,
          description: "Green value.",
          "ex:bitOffset": 40,
          "ex:bitLength": 8
        },
        B: {
          type: "integer",
          minimum: 0,
          maximum: 255,
          description: "Blue value.",
          "ex:bitOffset": 48,
          "ex:bitLength": 8
        },
        unknown: {
          type: "integer",
          const: 0,
          default: 0,
          "ex:bitOffset": 56,
          "ex:bitLength": 8
        },
        commandEnd: {
          type: "integer",
          const: 239,
          default: 239,
          description: "Command end byte.",
          "ex:bitOffset": 64,
          "ex:bitLength": 8
        }
      },
      required: ["R", "G", "B"],
      forms: [
        {
          op: "writeproperty",
          href: "./0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream;length=9;signed=false",
          "sbo:methodName": "sbo:write"
        }
      ]
    },
    power: {
      type: "string",
      format: "hex",
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "The power switch of the controller.",
      "bdo:pattern": "7e0004{is_on}00000000ef",
      "bdo:variables": {
        is_on: {
          type: "integer",
          minimum: 0,
          maximum: 1,
          "bdo:bytelength": 1
        }
      },
      forms: [
        {
          href: "./0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    effect: {
      type: "string",
      format: "hex",
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "The effect of the LED light.",
      "bdo:pattern": "7e0003{effect}03000000ef",
      "bdo:variables": {
        effect: {
          type: "integer",
          minimum: 128,
          maximum: 156,
          "bdo:bytelength": 1
        }
      },
      forms: [
        {
          href: "./0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/Blinkstick.json
var Blinkstick_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      "@language": "en"
    }
  ],
  title: "tulogic Blinkstick",
  description: "the tulogic Blinkstick is a Smart LED controller with integrated USB firmware.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  properties: {
    color: {
      type: "array",
      description: "RGB color value",
      observable: false,
      readOnly: false,
      writeOnly: true,
      forms: [
        {
          href: "hid://sendFeatureReport",
          "hid:path": "{{HIDPATH}}",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/BluetoothGeneric.json
var BluetoothGeneric_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "http://example.org/simple-bluetooth-ontology#",
      bdo: "http://example.org/binary-data-ontology#"
    },
    {
      "@language": "en"
    }
  ],
  "@type": "",
  id: "blast:bluetooth:BluetoothGeneric",
  title: "Genereic Bluetooth device",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A generic Bluetooth device",
  "sbo:isConnectable": true,
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  security: [
    "nosec_sc"
  ],
  actions: {},
  events: {},
  links: [],
  observedProperties: {},
  properties: {
    barometricPressureTrend: {
      title: "Barometric pressure trend",
      description: "The barometric pressure trend in hPa.",
      unit: "hPa",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001802-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    batteryLevel: {
      title: "Battery level",
      description: "Battery level in %.",
      unit: "%",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180f-0000-1000-8000-00805f9b34fb/00002a19-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    deviceName: {
      title: "Device name",
      description: "User defined name of the device",
      type: "string",
      observable: false,
      readOnly: false,
      writeOnly: false,
      forms: [
        {
          href: "./00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          href: "./00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    elevation: {
      title: "Elevation",
      description: "The elevation measured by the device.",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001803-0000-1000-8000-00805f9b34fb/00002a6c-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    firmwareRevision: {
      title: "Firmware revision",
      description: "Revision of the device's firmware",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a26-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    hardwareRevision: {
      title: "Hardware revision",
      description: "Revision of the device's hardware",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a27-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    humidity: {
      title: "Humidity",
      description: "The relative humidity in %",
      unit: "%",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001803-0000-1000-8000-00805f9b34fb/00002a6f-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    irradiance: {
      title: "Irradiance",
      description: "Irradiance measured by the device.",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001803-0000-1000-8000-00805f9b34fb/00002a77-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    intermediateTemperature: {
      title: "Intermediate temperature",
      description: "The intermediate temperature measured by the device.",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001809-0000-1000-8000-00805f9b34fb/00002a1e-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    manufacturerName: {
      title: "Manufacturer name",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a29-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    modelNumber: {
      title: "Model number",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a24-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    movementCounter: {
      title: "Movement counter",
      description: "A counter incremented everytime the device starts moving.",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001809-0000-1000-8000-00805f9b34fb/00002a56-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    pressure: {
      title: "Pressure",
      description: "Barometric pressure in hPa",
      unit: "hPa",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001809-0000-1000-8000-00805f9b34fb/00002a6d-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    serialNumber: {
      title: "Serial number",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a25-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    softwareRevision: {
      title: "Software revision",
      description: "Revision of the device's software",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a28-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    temperature: {
      title: "Temperature",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001809-0000-1000-8000-00805f9b34fb/00002a6e-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    temperatureMeasurement: {
      title: "Temperature measurement",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001809-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    temperatureType: {
      title: "Temperature type",
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001809-0000-1000-8000-00805f9b34fb/00002a1d-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    txPowerLevel: {
      title: "Tx Power Level",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001804-0000-1000-8000-00805f9b34fb/00002a07-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    weight: {
      title: "Weight",
      type: "number",
      observable: false,
      readOnly: true,
      writeOnly: false,
      forms: [
        {
          href: "./00001808-0000-1000-8000-00805f9b34fb/00002a9d-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  },
  subscribedEvents: {}
};

// src/tds/EddystoneDevice.json
var EddystoneDevice_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1"
  ],
  "@type": "",
  id: "blast:bluetooth:EddystoneDevice",
  title: "Eddystone Device",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A Bluetooth device implementing the Eddystone protocol",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  security: "nosec_sc",
  properties: {
    activeSlot: {
      title: "Active Slot",
      description: "The active slot of the Eddystone device",
      type: "integer",
      "bdo:bytelength": 1,
      readOnly: false,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          op: "writeproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87502-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    advertisedTxPower: {
      title: "Advertised Tx Power",
      description: "The advertised TX power of the iBeacon",
      unit: "dBm",
      type: "integer",
      "bdo:bytelength": 1,
      "bdo:signed": true,
      readOnly: false,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          op: "writeproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87505-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    advertisedData: {
      title: "Advertised Data",
      description: "The advertised data of the eddystone device",
      unit: "",
      type: "string",
      format: "hex",
      readOnly: false,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          op: "writeproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c8750a-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    advertisingInterval: {
      title: "Advertising Interval",
      description: "The advertising interval of the eddystone device",
      unit: "ms",
      type: "integer",
      "bdo:byteOrder": "big",
      "bdo:bytelength": 2,
      readOnly: false,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          op: "writeproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87503-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    capabilities: {
      title: "Capabilities",
      description: "The capabilities of the eddystone device",
      type: "string",
      format: "hex",
      readOnly: true,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87501-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    lockState: {
      title: "Lock State",
      description: "The lock state of the eddystone device",
      unit: "",
      type: "string",
      format: "hex",
      readOnly: false,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          op: "writeproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87506-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    publicEcdhKey: {
      title: "Public ECDH Key",
      description: "The public ECDH key of the eddystone device",
      unit: "",
      type: "string",
      format: "hex",
      readOnly: true,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87508-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    radioTxPower: {
      title: "Radio Tx Power",
      description: "The radio TX power of the eddystone device",
      unit: "dBm",
      type: "integer",
      "bdo:bytelength": 1,
      "bdo:signed": true,
      readOnly: false,
      forms: [
        {
          op: "readproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          op: "writeproperty",
          href: "./a3c87500-8ed3-4bdf-8a39-a01bebede295/a3c87504-8ed3-4bdf-8a39-a01bebede295",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/JoyCon.json
var JoyCon_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      "@language": "en"
    }
  ],
  title: "Nintento Switch Joy-Con Controller",
  description: "The Nintendo Switch Joy-Con Controller for the Nintendo Switch console.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  properties: {
    accelerometers: {
      title: "Accelerometers",
      description: "The accelerometers of the Joy-Con.",
      type: "object",
      properties: {
        "1": {
          title: "Accelerometer 1",
          description: "The first accelerometer of the Joy-Con.",
          type: "object",
          properties: {
            x: {
              title: "X-Axis",
              description: "The X-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            },
            y: {
              title: "Y-Axis",
              description: "The Y-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            },
            z: {
              title: "Z-Axis",
              description: "The Z-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            }
          }
        },
        "2": {
          title: "Accelerometer 2",
          description: "The second accelerometer of the Joy-Con.",
          type: "object",
          properties: {
            x: {
              title: "X-Axis",
              description: "The X-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            },
            y: {
              title: "Y-Axis",
              description: "The Y-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            },
            z: {
              title: "Z-Axis",
              description: "The Z-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            }
          }
        },
        "3": {
          title: "Accelerometer 3",
          description: "The third accelerometer of the Joy-Con.",
          type: "object",
          properties: {
            x: {
              title: "X-Axis",
              description: "The X-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            },
            y: {
              title: "Y-Axis",
              description: "The Y-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            },
            z: {
              title: "Z-Axis",
              description: "The Z-Axis of the accelerometer.",
              type: "number",
              unit: "m/s^2"
            }
          }
        }
      }
    },
    actualAccelerometer: {
      title: "Actual Accelerometer",
      description: "The actual accelerometer of the Joy-Con.",
      type: "object",
      properties: {
        x: {
          title: "X-Axis",
          description: "The X-Axis of the accelerometer.",
          type: "number",
          unit: "m/s^2"
        },
        y: {
          title: "Y-Axis",
          description: "The Y-Axis of the accelerometer.",
          type: "number",
          unit: "m/s^2"
        },
        z: {
          title: "Z-Axis",
          description: "The Z-Axis of the accelerometer.",
          type: "number",
          unit: "m/s^2"
        }
      }
    },
    actualGyroscope: {
      title: "Actual Gyroscope",
      description: "The actual gyroscope of the Joy-Con.",
      type: "object",
      properties: {
        rps: {
          type: "object",
          properties: {
            x: {
              title: "X-Axis",
              description: "The X-Axis of the gyroscope.",
              type: "number",
              unit: "rad/s"
            },
            y: {
              title: "Y-Axis",
              description: "The Y-Axis of the gyroscope.",
              type: "number",
              unit: "rad/s"
            },
            z: {
              title: "Z-Axis",
              description: "The Z-Axis of the gyroscope.",
              type: "number",
              unit: "rad/s"
            }
          }
        },
        dps: {
          type: "object",
          properties: {
            x: {
              title: "X-Axis",
              description: "The X-Axis of the gyroscope.",
              type: "number",
              unit: "deg/s"
            },
            y: {
              title: "Y-Axis",
              description: "The Y-Axis of the gyroscope.",
              type: "number",
              unit: "deg/s"
            },
            z: {
              title: "Z-Axis",
              description: "The Z-Axis of the gyroscope.",
              type: "number",
              unit: "deg/s"
            }
          }
        }
      }
    },
    actualOrientation: {
      title: "Actual Orientation",
      description: "The actual orientation of the Joy-Con.",
      type: "object",
      properties: {
        alpha: {
          title: "Alpha",
          description: "The alpha value of the orientation.",
          type: "number",
          unit: "deg"
        },
        beta: {
          title: "Beta",
          description: "The beta value of the orientation.",
          type: "number",
          unit: "deg"
        },
        gamma: {
          title: "Gamma",
          description: "The gamma value of the orientation.",
          type: "number",
          unit: "deg"
        }
      }
    },
    actualOrientationQuaternion: {
      title: "Actual Orientation Quaternion",
      description: "The actual orientation quaternion of the Joy-Con.",
      type: "object",
      properties: {
        alpha: {
          title: "Alpha",
          description: "The alpha value of the orientation.",
          type: "number",
          unit: "deg"
        },
        beta: {
          title: "Beta",
          description: "The beta value of the orientation.",
          type: "number",
          unit: "deg"
        },
        gamma: {
          title: "Gamma",
          description: "The gamma value of the orientation.",
          type: "number",
          unit: "deg"
        }
      }
    },
    gyroscopes: {
      title: "Gyroscopes",
      description: "The gyroscopes of the Joy-Con.",
      type: "object",
      properties: {
        "0": {
          title: "Gyroscope 0",
          description: "The first gyroscope of the Joy-Con.",
          type: "object",
          properties: {
            rps: {
              type: "object",
              properties: {
                x: {
                  title: "X-Axis",
                  description: "The X-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                },
                y: {
                  title: "Y-Axis",
                  description: "The Y-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                },
                z: {
                  title: "Z-Axis",
                  description: "The Z-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                }
              }
            },
            dps: {
              type: "object",
              properties: {
                x: {
                  title: "X-Axis",
                  description: "The X-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                },
                y: {
                  title: "Y-Axis",
                  description: "The Y-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                },
                z: {
                  title: "Z-Axis",
                  description: "The Z-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                }
              }
            }
          }
        },
        "1": {
          title: "Gyroscope 1",
          description: "The second gyroscope of the Joy-Con.",
          type: "object",
          properties: {
            rps: {
              type: "object",
              properties: {
                x: {
                  title: "X-Axis",
                  description: "The X-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                },
                y: {
                  title: "Y-Axis",
                  description: "The Y-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                },
                z: {
                  title: "Z-Axis",
                  description: "The Z-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                }
              }
            },
            dps: {
              type: "object",
              properties: {
                x: {
                  title: "X-Axis",
                  description: "The X-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                },
                y: {
                  title: "Y-Axis",
                  description: "The Y-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                },
                z: {
                  title: "Z-Axis",
                  description: "The Z-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                }
              }
            }
          }
        },
        "2": {
          title: "Gyroscope 2",
          description: "The third gyroscope of the Joy-Con.",
          type: "object",
          properties: {
            rps: {
              type: "object",
              properties: {
                x: {
                  title: "X-Axis",
                  description: "The X-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                },
                y: {
                  title: "Y-Axis",
                  description: "The Y-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                },
                z: {
                  title: "Z-Axis",
                  description: "The Z-Axis of the gyroscope.",
                  type: "number",
                  unit: "rad/s"
                }
              }
            },
            dps: {
              type: "object",
              properties: {
                x: {
                  title: "X-Axis",
                  description: "The X-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                },
                y: {
                  title: "Y-Axis",
                  description: "The Y-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                },
                z: {
                  title: "Z-Axis",
                  description: "The Z-Axis of the gyroscope.",
                  type: "number",
                  unit: "deg/s"
                }
              }
            }
          }
        }
      }
    },
    quaternion: {
      title: "Quaternion",
      description: "The quaternion of the Joy-Con.",
      type: "object",
      properties: {
        w: {
          title: "W",
          description: "The W value of the quaternion.",
          type: "number"
        },
        x: {
          title: "X",
          description: "The X value of the quaternion.",
          type: "number"
        },
        y: {
          title: "Y",
          description: "The Y value of the quaternion.",
          type: "number"
        },
        z: {
          title: "Z",
          description: "The Z value of the quaternion.",
          type: "number"
        }
      }
    }
  },
  events: {
    button: {
      title: "Joy-Con button pressed events",
      description: "This event is emitted when a button on the Joy-Con is pressed.",
      data: {
        type: "array",
        description: "A string array containing all buttons that were pressed."
      }
    }
  }
};

// src/tds/GamepadPro.json
var GamepadPro_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      "@language": "en"
    }
  ],
  title: "Nintento Switch Pro Controller",
  description: "The Nintendo Switch Pro Controller is a gamepad used for the Nintendo Switch console.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  events: {
    button: {
      title: "Gamepad button pressed events",
      description: "This event is emitted when a button on the gamepad is pressed.",
      data: {
        type: "array",
        description: "A string array containing all buttons that were pressed."
      }
    },
    joystick: {
      title: "Gamepad joystick moved events",
      description: "This event is emitted when the left joystick on the gamepad is moved.",
      data: {
        type: "object",
        description: "An object containing the x and y coordinates and the angle of the joystick."
      }
    }
  }
};

// src/tds/GoveeLamp.json
var GoveeLamp_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "http://example.org/simple-bluetooth-ontology#",
      bdo: "http://example.org/binary-data-ontology#"
    },
    {
      "@language": "en"
    }
  ],
  title: "GoveeLamp",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A Govee smart light bulb.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  "sbo:hasGAPRole": "sbo:Peripheral",
  "sbo:isConnectable": true,
  properties: {
    power: {
      title: "power",
      description: "The current power status of the bulb",
      type: "object",
      observable: false,
      readOnly: false,
      writeOnly: true,
      properties: {
        commandId: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 0,
          default: 51
        },
        packetType: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 8,
          default: 1
        },
        power: {
          type: "boolean",
          "ex:bitLength": 1,
          "ex:bitOffset": 23
        },
        checksum: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 152
        }
      },
      required: ["power", "checksum"],
      forms: [
        {
          href: "./00010203-0405-0607-0809-0a0b0c0d1910/00010203-0405-0607-0809-0a0b0c0d2b11",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/octet-stream;length=20;signed=false;byteSeq=LITTLE_ENDIAN"
        }
      ]
    },
    brightness: {
      type: "object",
      properties: {
        commandId: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 0,
          default: 51
        },
        packetType: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 8,
          default: 4
        },
        brightness: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 16
        },
        checksum: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 152
        }
      },
      required: ["brightness", "checksum"],
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "The current brightness value of the bulb",
      forms: [
        {
          href: "./00010203-0405-0607-0809-0a0b0c0d1910/00010203-0405-0607-0809-0a0b0c0d2b11",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/octet-stream;length=20;signed=false;byteSeq=LITTLE_ENDIAN"
        }
      ]
    },
    colour: {
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "The colour of the LED light.",
      type: "object",
      properties: {
        commandId: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 0,
          default: 51
        },
        packetType: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 8,
          default: 5
        },
        packetType2: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 16,
          default: 2
        },
        red: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 24
        },
        green: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 32
        },
        blue: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 40
        },
        checksum: {
          type: "integer",
          "ex:bitLength": 8,
          "ex:bitOffset": 152
        }
      },
      required: ["red", "green", "blue", "checksum"],
      forms: [
        {
          href: "./00010203-0405-0607-0809-0a0b0c0d1910/00010203-0405-0607-0809-0a0b0c0d2b11",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/octet-stream;length=20;signed=false;byteSeq=LITTLE_ENDIAN"
        }
      ]
    }
  }
};

// src/tds/HuskyDuino.json
var HuskyDuino_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "http://example.org/simple-bluetooth-ontology#",
      bdo: "http://example.org/binary-data-ontology#"
    },
    {
      "@language": "en"
    }
  ],
  title: "HuskyDuino",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A HuskyLens interface running on Arduino.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  "sbo:hasGAPRole": "sbo:Peripheral",
  "sbo:isConnectable": true,
  "sbo:hasAdvertisingIntervall": {
    "qudt:numericValue": 200,
    "qutdUnit:unit": "qudtUnit:MilliSEC"
  },
  properties: {
    algorithm: {
      type: "integer",
      observable: false,
      readOnly: false,
      writeOnly: false,
      description: "The currently active algorithm",
      minimum: 1,
      maximum: 7,
      "bdo:bytelength": 1,
      forms: [
        {
          href: "./5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          href: "./5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    id: {
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      description: "The ID of the face or object",
      forms: [
        {
          href: "./5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    location: {
      type: "string",
      observable: false,
      readOnly: true,
      writeOnly: false,
      description: "The location of the face or object",
      forms: [
        {
          href: "./5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  },
  actions: {
    forgetAll: {
      description: "Forget all faces and objects",
      input: {
        type: "string",
        enum: [
          "true"
        ]
      },
      forms: [
        {
          href: "./5be35d20-f9b0-11eb-9a03-0242ac130003/5be361b8-f9b0-11eb-9a03-0242ac130003",
          op: "invokeaction",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    learn: {
      description: "Learn a new face or object.",
      input: {
        type: "integer",
        minimum: 0,
        maximum: 255,
        "bdo:bytelength": 1,
        description: "The ID of the face or object to learn."
      },
      forms: [
        {
          href: "./5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003",
          op: "invokeaction",
          "sbo:methodName": "sbo:write-without-response",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/PhilipsHue.json
var PhilipsHue_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "http://example.org/simple-bluetooth-ontology#",
      bdo: "http://example.org/binary-data-ontology#"
    },
    {
      "@language": "en"
    }
  ],
  title: "PhilipsHue",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A PhilipsHue smart light bulb.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  "sbo:hasGAPRole": "sbo:Peripheral",
  "sbo:isConnectable": true,
  properties: {
    power: {
      type: "integer",
      observable: false,
      readOnly: false,
      writeOnly: false,
      minimum: 0,
      maximum: 1,
      "bdo:bytelength": 1,
      description: "The current power status of the bulb",
      forms: [
        {
          href: "./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0002-47a2-835a-a8d455b859dd",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          href: "./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0002-47a2-835a-a8d455b859dd",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    brightness: {
      type: "integer",
      observable: false,
      readOnly: false,
      writeOnly: false,
      minimum: 1,
      maximum: 255,
      "bdo:bytelength": 1,
      description: "The current brightness value of the bulb",
      forms: [
        {
          href: "./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0003-47a2-835a-a8d455b859dd",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        },
        {
          href: "./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0003-47a2-835a-a8d455b859dd",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    },
    colour: {
      type: "object",
      format: "hex",
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "The colour of the LED light.",
      "bdo:pattern": "0F{red}{blue}{green}",
      "bdo:variables": {
        red: {
          type: "integer",
          "bdo:bytelength": 1,
          minimum: 0,
          maximum: 255,
          description: "Red value."
        },
        green: {
          type: "integer",
          "bdo:bytelength": 1,
          minimum: 0,
          maximum: 255,
          description: "Green value."
        },
        blue: {
          type: "integer",
          "bdo:bytelength": 1,
          minimum: 0,
          maximum: 255,
          description: "Blue value."
        }
      },
      "tst:function": "const scale = 0xff; const adjustedArr = []; for (const chan of [buf[1], buf[2], buf[3]]) {adjustedArr.push(Math.max(1, chan));} const total = adjustedArr.reduce((partialSum, a) => partialSum + a, 0); const adjustedArrFinal = []; for (const chan of [buf[1], buf[2], buf[3]]) {let x = Math.round((chan / total) * scale); adjustedArrFinal.push(Math.max(1, x));} for (let i = 1; i < 4; i++) {buf[i] = adjustedArrFinal[i-1]} return buf;",
      forms: [
        {
          href: "./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0005-47a2-835a-a8d455b859dd",
          op: "writeproperty",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  },
  actions: {
    dim: {
      input: {
        type: "integer",
        observable: false,
        readOnly: false,
        writeOnly: false,
        minimum: 1,
        maximum: 255,
        "bdo:bytelength": 1
      },
      description: "Reduce the brightness value of the bulb",
      forms: [
        {
          href: "./932c32bd-0000-47a2-835a-a8d455b859dd/932c32bd-0003-47a2-835a-a8d455b859dd",
          op: "invokeaction",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/RuuviTag.json
var RuuviTag_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#",
      bdo: "https://freumi.inrupt.net/BinaryDataOntology.ttl#",
      qudt: "https://qudt.org/schema/qudt/",
      qudtUnit: "https://qudt.org/vocab/unit/"
    },
    {
      "@language": "en"
    }
  ],
  "@type": "",
  title: "Ruuvi Tag",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "RuuviTag is a wireless Bluetooth sensor node that measures temperature, air humidity, and movement.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  security: "nosec_sc",
  events: {
    "UART data": {
      title: "Ruuvi Data data",
      description: "The RuuviTag data received over UART, see https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2",
      data: {
        type: "object",
        properties: {
          format: {
            type: "integer",
            "ex:bitOffset": 0,
            "ex:bitLength": 8
          },
          temp: {
            type: "number",
            "ex:bitOffset": 8,
            "ex:bitLength": 16,
            scale: 5e-3,
            unit: "qudtUnit:DEG_C"
          },
          humidity: {
            type: "number",
            "ex:bitOffset": 24,
            "ex:bitLength": 16,
            signed: false,
            scale: 25e-4,
            unit: "qudtUnit:PERCENT"
          },
          pressure: {
            type: "number",
            "ex:bitOffset": 40,
            "ex:bitLength": 16,
            signed: false,
            unit: "qudt:PA"
          },
          "acc-x": {
            type: "integer",
            "ex:bitOffset": 56,
            "ex:bitLength": 16,
            byteOrder: "LITTLE_ENDIAN",
            unit: "qudtUnit:mG"
          },
          "acc-y": {
            type: "integer",
            "ex:bitOffset": 72,
            "ex:bitLength": 16,
            byteOrder: "LITTLE_ENDIAN",
            unit: "qudtUnit:mG"
          },
          "acc-z": {
            type: "integer",
            "ex:bitOffset": 88,
            "ex:bitLength": 16,
            byteOrder: "LITTLE_ENDIAN",
            unit: "qudtUnit:mG"
          },
          "power-info": {
            type: "integer",
            "ex:bitOffset": 104,
            "ex:bitLength": 11,
            signed: false
          },
          "tx-power": {
            type: "integer",
            "ex:bitOffset": 115,
            "ex:bitLength": 5,
            signed: false
          },
          "movement-counter": {
            type: "integer",
            "ex:bitOffset": 120,
            "ex:bitLength": 8,
            signed: false
          },
          "measurement-sequence-number": {
            type: "integer",
            "ex:bitOffset": 128,
            "ex:bitLength": 16,
            signed: false
          }
        }
      },
      forms: [
        {
          href: "./6e400001-b5a3-f393-e0a9-e50e24dcca9e/6e400003-b5a3-f393-e0a9-e50e24dcca9e",
          "sbo:methodName": "sbo:subscribe",
          contentType: "application/octet-stream"
        }
      ]
    },
    GapBroadcast: {
      title: "GapBroadcast",
      description: "The GapBroadcast event is emitted when the device is advertising.",
      data: {
        type: "object",
        properties: {
          format: {
            type: "integer",
            "ex:bitOffset": 0,
            "ex:bitLength": 8
          },
          temp: {
            type: "number",
            "ex:bitOffset": 8,
            "ex:bitLength": 16,
            scale: 5e-3,
            unit: "qudtUnit:DEG_C"
          },
          humidity: {
            type: "number",
            "ex:bitOffset": 24,
            "ex:bitLength": 16,
            signed: false,
            scale: 25e-4,
            unit: "qudtUnit:PERCENT"
          },
          pressure: {
            type: "integer",
            "ex:bitOffset": 40,
            "ex:bitLength": 16,
            signed: false,
            unit: "qudt:PA"
          },
          "acc-x": {
            type: "integer",
            "ex:bitOffset": 56,
            "ex:bitLength": 16,
            byteOrder: "LITTLE_ENDIAN",
            unit: "qudtUnit:mG"
          },
          "acc-y": {
            type: "integer",
            "ex:bitOffset": 72,
            "ex:bitLength": 16,
            byteOrder: "LITTLE_ENDIAN",
            unit: "qudtUnit:mG"
          },
          "acc-z": {
            type: "integer",
            "ex:bitOffset": 88,
            "ex:bitLength": 16,
            byteOrder: "LITTLE_ENDIAN",
            unit: "qudtUnit:mG"
          },
          "power-info": {
            type: "integer",
            "ex:bitOffset": 104,
            "ex:bitLength": 11,
            signed: false
          },
          "tx-power": {
            type: "integer",
            "ex:bitOffset": 115,
            "ex:bitLength": 5,
            signed: false
          },
          "movement-counter": {
            type: "integer",
            "ex:bitOffset": 120,
            "ex:bitLength": 8,
            signed: false
          },
          "measurement-sequence-number": {
            type: "integer",
            "ex:bitOffset": 128,
            "ex:bitLength": 16,
            signed: false
          }
        }
      },
      forms: [
        {
          href: "gap://{{MacOrWebBluetoothId}}/observe",
          "sbo:methodName": "sbo:subscribe",
          contentType: "application/octet-stream"
        }
      ]
    }
  }
};

// src/tds/SpheroMini.json
var SpheroMini_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      "@language": "en"
    }
  ],
  title: "Sphero Mini",
  description: "The Sphero Mini is a small robot ball that can be controlled via Bluetooth.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  actions: {
    roll: {
      input: {
        type: "object",
        properties: {
          speed: {
            type: "number",
            minimum: 0,
            maximum: 255
          },
          heading: {
            type: "number",
            minimum: 0,
            maximum: 359
          }
        }
      }
    }
  }
};

// src/tds/StreamDeckMini.json
var StreamDeckMini_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      "@language": "en"
    }
  ],
  title: "Elgato Stream Deck Mini",
  description: "The Stream Deck Mini is a small device that connects to your computer and lets you control your software with custom buttons. It's the perfect companion for your favorite games, productivity apps, and more.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  properties: {
    brightness: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "The brightness value of the device's display (0-100)",
      forms: [
        {
          href: "hid://sendFeatureReport",
          "hid:path": "{{HIDPATH}}",
          "hid:data": [
            85,
            170,
            209,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "hid:valueIndex": 4,
          "hid:reportId": 5,
          op: "writeproperty",
          contentType: "application/octet-stream"
        }
      ]
    }
  },
  events: {
    inputreport: {
      title: "Stream deck input report",
      description: "The input report event is emitted periodically when the device is in use and contains the current state of the buttons.",
      data: {
        type: "array",
        "bdo:pattern": "{reportid}{button1}{button2}{button3}{button4}{button5}{button6}",
        "bdo:variables": {
          reportid: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 255
          },
          button1: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 1
          },
          button2: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 1
          },
          button3: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 1
          },
          button4: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 1
          },
          button5: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 1
          },
          button6: {
            type: "integer",
            "bdo:bytelength": 1,
            minimum: 0,
            maximum: 1
          }
        }
      },
      forms: [
        {
          href: "hid://receiveInputReport",
          "hid:path": "{{HIDPATH}}",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  },
  actions: {
    sendReport: {
      type: "null",
      description: "Sends an output report to the HID device.",
      input: {
        type: "string",
        format: "hex"
      },
      forms: [
        {
          href: "hid://sendReport",
          "hid:path": "{{HIDPATH}}",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/XiaomiFlowerCare.json
var XiaomiFlowerCare_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#",
      bdo: "https://freumi.inrupt.net/BinaryDataOntology.ttl#",
      qudt: "https://qudt.org/schema/qudt/",
      qudtUnit: "https://qudt.org/vocab/unit/"
    },
    {
      "@language": "en"
    }
  ],
  title: "Flower Care",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "A Xiaomi Flower Care Sensor.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  "@type": "",
  security: [
    "nosec_sc"
  ],
  "sbo:hasGAPRole": "sbo:Peripheral",
  "sbo:isConnectable": true,
  "sbo:hasAdvertisingIntervall": {
    "qudt:numericValue": 2e3,
    "qutdUnit:unit": "qudtUnit:MilliSEC"
  },
  properties: {
    valueString: {
      type: "array",
      observable: false,
      readOnly: true,
      writeOnly: false,
      description: "The Values of the device",
      "bdo:pattern": "{temp}00{brightness}{moisture}{conduct}023c00fb349b",
      "bdo:variables": {
        temp: {
          type: "integer",
          "bdo:bytelength": 2,
          "bdo:scale": 0.1,
          description: "The current temperature value.",
          unit: "qudtUnit:DEG_C"
        },
        brightness: {
          type: "integer",
          "bdo:bytelength": 4,
          description: "The current brightness value.",
          unit: "qudtUnit:LUX"
        },
        moisture: {
          type: "integer",
          "bdo:bytelength": 1,
          description: "The current moisture value.",
          unit: "qudtUnit:PERCENT"
        },
        conduct: {
          type: "integer",
          "bdo:bytelength": 2,
          description: "The current conductivity value.",
          unit: "qudtUnit:S"
        }
      },
      forms: [
        {
          href: "./00001204-0000-1000-8000-00805f9b34fb/00001a01-0000-1000-8000-00805f9b34fb",
          op: "readproperty",
          "sbo:methodName": "sbo:read",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  },
  actions: {
    readMode: {
      type: "string",
      observable: false,
      readOnly: false,
      writeOnly: true,
      description: "Enable write mode",
      input: {
        type: "string",
        format: "hex",
        enum: [
          "A01F"
        ],
        "bdo:bytelength": 2,
        description: 'The command "A01F" enables write mode.'
      },
      forms: [
        {
          href: "./00001204-0000-1000-8000-00805f9b34fb/00001a00-0000-1000-8000-00805f9b34fb",
          op: "invokeaction",
          "sbo:methodName": "sbo:write",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/XiaomiThermometer.json
var XiaomiThermometer_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#",
      bdo: "https://freumi.inrupt.net/BinaryDataOntology.ttl#",
      qudt: "https://qudt.org/schema/qudt/",
      qudtUnit: "https://qudt.org/vocab/unit/"
    },
    {
      "@language": "en"
    }
  ],
  "@type": "",
  id: "blast:Bluetooth:xiamoiThermometer",
  title: "Xiaomi Thermometer",
  base: "gatt://{{MacOrWebBluetoothId}}/",
  description: "The Xiaomi Thermometer is a temperature and humidity sensor with a Bluetooth Low Energy interface.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  security: "nosec_sc",
  events: {
    measurements: {
      title: "Temperature and humidity measurements",
      description: "The temperature and humidity values measured by the thermometer.",
      data: {
        type: "array",
        "bdo:pattern": "{temp}{hum}2011",
        "bdo:variables": {
          temp: {
            type: "number",
            "bdo:bytelength": 2,
            "bdo:scale": 0.01,
            unit: "qudtUnit:DEG_C"
          },
          hum: {
            type: "number",
            "bdo:bytelength": 1,
            unit: "qudtUnit:PERCENT"
          }
        }
      },
      forms: [
        {
          href: "./ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6/ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6",
          "sbo:methodName": "sbo:subscribe",
          contentType: "application/x.binary-data-stream"
        }
      ]
    }
  }
};

// src/tds/MicroBit.json
var MicroBit_default = {
  "@context": [
    "https://www.w3.org/2019/wot/td/v1",
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      sbo: "https://freumi.inrupt.net/SimpleBluetoothOntology.ttl#",
      bdo: "https://freumi.inrupt.net/BinaryDataOntology.ttl#",
      qudt: "https://qudt.org/schema/qudt/",
      qudtUnit: "https://qudt.org/vocab/unit/"
    },
    {
      "@language": "en"
    }
  ],
  title: "BBC micro:bit",
  description: "The BBC micro:bit is a pocket-sized computer that you can code, customise and control to bring your digital ideas, games and apps to life.",
  securityDefinitions: {
    nosec_sc: {
      scheme: "nosec"
    }
  },
  security: [
    "nosec_sc"
  ],
  base: "gatt://{{MacOrWebBluetoothId}}/",
  properties: {
    accelerometerPeriod: {
      type: "string",
      title: "accelerometer period",
      forms: [
        {
          href: "./e95d0753-251d-470a-a062-fa1922dfa9a8/e95dfb24-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "Determines the reporting frequency of accelerometer data in milliseconds. Valid values include 1, 2, 5, 10, 20, 80, 160, and 640."
    },
    temperature: {
      type: "integer",
      title: "temperature",
      forms: [
        {
          href: "./e95d6100-251d-470a-a062-fa1922dfa9a8/e95d9250-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream;signed=true;length=1",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "Provides temperature data as a signed integer 8-bit value in degrees Celsius.",
      unit: "http://qudt.org/vocab/unit/DEG_C"
    },
    firmwareRevisionString: {
      type: "string",
      title: "firmware revision string",
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a26-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "The value of this characteristic is a UTF-8 string representing the firmware revision for the firmware within the device."
    },
    ledMatrixState: {
      title: "LED matrix state",
      forms: [
        {
          href: "./e95dd91d-251d-470a-a062-fa1922dfa9a8/e95d7b77-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream;length=5",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        },
        {
          href: "./e95dd91d-251d-470a-a062-fa1922dfa9a8/e95d7b77-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream;length=5",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response"
        }
      ],
      type: "object",
      properties: {
        row1: {
          type: "object",
          "ex:bitOffset": 0,
          "ex:bitLength": 8,
          properties: {
            led1: {
              type: "boolean",
              title: "LED 1",
              "ex:bitOffset": 3,
              "ex:bitLength": 1
            },
            led2: {
              type: "boolean",
              title: "LED 2",
              "ex:bitOffset": 4,
              "ex:bitLength": 1
            },
            led3: {
              type: "boolean",
              title: "LED 3",
              "ex:bitOffset": 5,
              "ex:bitLength": 1
            },
            led4: {
              type: "boolean",
              title: "LED 4",
              "ex:bitOffset": 6,
              "ex:bitLength": 1
            },
            led5: {
              type: "boolean",
              title: "LED 5",
              "ex:bitOffset": 7,
              "ex:bitLength": 1
            }
          }
        },
        row2: {
          type: "object",
          "ex:bitOffset": 8,
          "ex:bitLength": 8,
          properties: {
            led1: {
              type: "boolean",
              title: "LED 1",
              "ex:bitOffset": 3,
              "ex:bitLength": 1
            },
            led2: {
              type: "boolean",
              title: "LED 2",
              "ex:bitOffset": 4,
              "ex:bitLength": 1
            },
            led3: {
              type: "boolean",
              title: "LED 3",
              "ex:bitOffset": 5,
              "ex:bitLength": 1
            },
            led4: {
              type: "boolean",
              title: "LED 4",
              "ex:bitOffset": 6,
              "ex:bitLength": 1
            },
            led5: {
              type: "boolean",
              title: "LED 5",
              "ex:bitOffset": 7,
              "ex:bitLength": 1
            }
          }
        },
        row3: {
          type: "object",
          "ex:bitOffset": 16,
          "ex:bitLength": 8,
          properties: {
            led1: {
              type: "boolean",
              title: "LED 1",
              "ex:bitOffset": 3,
              "ex:bitLength": 1
            },
            led2: {
              type: "boolean",
              title: "LED 2",
              "ex:bitOffset": 4,
              "ex:bitLength": 1
            },
            led3: {
              type: "boolean",
              title: "LED 3",
              "ex:bitOffset": 5,
              "ex:bitLength": 1
            },
            led4: {
              type: "boolean",
              title: "LED 4",
              "ex:bitOffset": 6,
              "ex:bitLength": 1
            },
            led5: {
              type: "boolean",
              title: "LED 5",
              "ex:bitOffset": 7,
              "ex:bitLength": 1
            }
          }
        },
        row4: {
          type: "object",
          "ex:bitOffset": 24,
          "ex:bitLength": 8,
          properties: {
            led1: {
              type: "boolean",
              title: "LED 1",
              "ex:bitOffset": 3,
              "ex:bitLength": 1
            },
            led2: {
              type: "boolean",
              title: "LED 2",
              "ex:bitOffset": 4,
              "ex:bitLength": 1
            },
            led3: {
              type: "boolean",
              title: "LED 3",
              "ex:bitOffset": 5,
              "ex:bitLength": 1
            },
            led4: {
              type: "boolean",
              title: "LED 4",
              "ex:bitOffset": 6,
              "ex:bitLength": 1
            },
            led5: {
              type: "boolean",
              title: "LED 5",
              "ex:bitOffset": 7,
              "ex:bitLength": 1
            }
          }
        },
        row5: {
          type: "object",
          "ex:bitOffset": 32,
          "ex:bitLength": 8,
          properties: {
            led1: {
              type: "boolean",
              title: "LED 1",
              "ex:bitOffset": 3,
              "ex:bitLength": 1
            },
            led2: {
              type: "boolean",
              title: "LED 2",
              "ex:bitOffset": 4,
              "ex:bitLength": 1
            },
            led3: {
              type: "boolean",
              title: "LED 3",
              "ex:bitOffset": 5,
              "ex:bitLength": 1
            },
            led4: {
              type: "boolean",
              title: "LED 4",
              "ex:bitOffset": 6,
              "ex:bitLength": 1
            },
            led5: {
              type: "boolean",
              title: "LED 5",
              "ex:bitOffset": 7,
              "ex:bitLength": 1
            }
          }
        }
      },
      required: ["row1", "row2", "row3", "row4", "row5"],
      description: "Controls the state of LEDs in a 5x5 grid, with each octet representing a row and bits representing individual LEDs."
    },
    deviceName: {
      type: "string",
      title: "device name",
      forms: [
        {
          href: "./00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      contentEncoding: "binary",
      contentMediaType: "application/octet-stream"
    },
    buttonAState: {
      type: "integer",
      title: "button A state",
      forms: [
        {
          href: "./e95d9882-251d-470a-a062-fa1922dfa9a8/e95dda90-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream;length=1",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "State of Button A may be read on demand by a connected client or the client may subscribe to notifications of state change."
    },
    buttonBState: {
      type: "integer",
      title: "button B state",
      forms: [
        {
          href: "./e95d9882-251d-470a-a062-fa1922dfa9a8/e95dda91-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream;length=1",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "State of Button B may be read on demand by a connected client or the client may subscribe to notifications of state change."
    },
    ledText: {
      type: "string",
      title: "LED text",
      forms: [
        {
          href: "./e95dd91d-251d-470a-a062-fa1922dfa9a8/e95d93ee-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response"
        }
      ],
      description: "Allows short UTF-8 text strings to be sent for display on the LED matrix, with a maximum length of 20 octets."
    },
    serialNumberString: {
      type: "string",
      title: "serial number string",
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a25-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ]
    },
    clientRequirements: {
      type: "string",
      title: "client requirements",
      forms: [
        {
          href: "./e95d93af-251d-470a-a062-fa1922dfa9a8/e95d23c4-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response"
        }
      ],
      description: "A variable length list of event data structures indicating the types of micro:bit events the client wishes to be informed of."
    },
    temperaturePeriod: {
      type: "string",
      title: "temperature period",
      forms: [
        {
          href: "./e95d6100-251d-470a-a062-fa1922dfa9a8/e95d1b25-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "Determines the frequency with which temperature data is updated."
    },
    scrollingDelay: {
      type: "string",
      title: "scrolling delay",
      forms: [
        {
          href: "./e95dd91d-251d-470a-a062-fa1922dfa9a8/e95d0d2d-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response"
        }
      ],
      description: "Defines the delay in milliseconds to wait between showing each character on the LED display."
    },
    peripheralPreferredConnectionParameters: {
      type: "string",
      title: "peripheral preferred connection parameters",
      forms: [
        {
          href: "./00001800-0000-1000-8000-00805f9b34fb/00002a04-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ]
    },
    appearance: {
      type: "string",
      title: "appearance",
      forms: [
        {
          href: "./00001800-0000-1000-8000-00805f9b34fb/00002a01-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ]
    },
    modelNumberString: {
      type: "string",
      title: "model number string",
      forms: [
        {
          href: "./0000180a-0000-1000-8000-00805f9b34fb/00002a24-0000-1000-8000-00805f9b34fb",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      "bdo:bytelength": 1
    },
    clientEvent: {
      type: "string",
      title: "client event",
      forms: [
        {
          href: "./e95d93af-251d-470a-a062-fa1922dfa9a8/e95d5404-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "writeproperty",
          "sbo:methodName": "sbo:write-without-response"
        }
      ],
      description: "Allows the client to write events to inform the micro:bit of occurrences."
    },
    microbitEvent: {
      type: "string",
      title: "microbit event",
      forms: [
        {
          href: "./e95d93af-251d-470a-a062-fa1922dfa9a8/e95d9775-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "Allows notification of events from the micro:bit to the client."
    },
    acceleration: {
      title: "acceleration",
      type: "object",
      properties: {
        x: {
          type: "number",
          "ex:bitOffset": 0,
          "ex:bitLength": 16,
          unit: "http://qudt.org/vocab/unit/G"
        },
        y: {
          type: "number",
          "ex:bitOffset": 16,
          "ex:bitLength": 16,
          unit: "http://qudt.org/vocab/unit/G"
        },
        z: {
          type: "number",
          "ex:bitOffset": 32,
          "ex:bitLength": 16,
          unit: "http://qudt.org/vocab/unit/G"
        }
      },
      description: "Contains accelerometer measurements for X, Y and Z axes as 3 unsigned 16 bit values in that order",
      forms: [
        {
          href: "./e95d0753-251d-470a-a062-fa1922dfa9a8/e95dca4b-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream;length=6",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ]
    },
    microbitRequirements: {
      type: "string",
      title: "microbit requirements",
      forms: [
        {
          href: "./e95d93af-251d-470a-a062-fa1922dfa9a8/e95db84c-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "readproperty",
          "sbo:methodName": "sbo:read"
        }
      ],
      description: "Indicates the types of client events the micro:bit wishes to be informed of."
    }
  },
  actions: {},
  events: {
    microbitRequirements: {
      title: "microbit requirements",
      forms: [
        {
          href: "./e95d93af-251d-470a-a062-fa1922dfa9a8/e95db84c-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "subscribeevent",
          "sbo:methodName": "sbo:notify"
        }
      ],
      description: "Indicates the types of client events the micro:bit wishes to be informed of.",
      data: {
        type: "string"
      }
    },
    buttonBState: {
      title: "button B state",
      forms: [
        {
          href: "./e95d9882-251d-470a-a062-fa1922dfa9a8/e95dda91-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "subscribeevent",
          "sbo:methodName": "sbo:notify"
        }
      ],
      description: "State of Button B may be read on demand by a connected client or the client may subscribe to notifications of state change.",
      data: {
        type: "integer"
      }
    },
    temperature: {
      title: "temperature",
      forms: [
        {
          href: "./e95d6100-251d-470a-a062-fa1922dfa9a8/e95d9250-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "subscribeevent",
          "sbo:methodName": "sbo:notify"
        }
      ],
      description: "Provides temperature data as a signed integer 8-bit value in degrees Celsius.",
      unit: "http://qudt.org/vocab/unit/DEG_C",
      data: {
        type: "integer",
        "bdo:bytelength": 1,
        "bdo:signed": true
      }
    },
    acceleration: {
      title: "acceleration",
      forms: [
        {
          href: "./e95d0753-251d-470a-a062-fa1922dfa9a8/e95dca4b-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "subscribeevent",
          "sbo:methodName": "sbo:notify"
        }
      ],
      description: "Contains accelerometer measurements for X, Y and Z axes as 3 signed 16 bit values in that orderContains accelerometer measurements for X, Y and Z axes as 3 signed 16 bit values in little endian format. Values should be divided by 1000.",
      unit: "http://qudt.org/vocab/unit/G",
      data: {
        type: "object",
        properties: {
          x: {
            type: "number",
            "ex:bitOffset": 0,
            "ex:bitLength": 16,
            unit: "http://qudt.org/vocab/unit/G"
          },
          y: {
            type: "number",
            "ex:bitOffset": 16,
            "ex:bitLength": 16,
            unit: "http://qudt.org/vocab/unit/G"
          },
          z: {
            type: "number",
            "ex:bitOffset": 32,
            "ex:bitLength": 16,
            unit: "http://qudt.org/vocab/unit/G"
          }
        }
      }
    },
    microbitEvent: {
      title: "microbit event",
      forms: [
        {
          href: "./e95d93af-251d-470a-a062-fa1922dfa9a8/e95d9775-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "subscribeevent",
          "sbo:methodName": "sbo:notify"
        }
      ],
      description: "Allows notification of events from the micro:bit to the client.",
      data: {
        type: "string"
      }
    },
    buttonAState: {
      title: "button A state",
      forms: [
        {
          href: "./e95d9882-251d-470a-a062-fa1922dfa9a8/e95dda90-251d-470a-a062-fa1922dfa9a8",
          contentType: "application/octet-stream",
          op: "subscribeevent",
          "sbo:methodName": "sbo:notify"
        }
      ],
      description: "State of Button A may be read on demand by a connected client or the client may subscribe to notifications of state change.",
      data: {
        type: "integer",
        "bdo:bytelength": 1
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BleRgbController,
  Blinkstick,
  BluetoothGeneric,
  EddystoneDevice,
  GamepadPro,
  GoveeLedBulb,
  HuskyDuino,
  JoyCon,
  Microbit,
  PhilipsHue,
  RuuviTag,
  SpheroMini,
  StreamDeckMini,
  XiaomiFlowerCare,
  XiaomiThermometer
});
