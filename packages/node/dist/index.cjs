/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/NodeBluetoothAdapter.ts":
/*!*************************************!*\
  !*** ./src/NodeBluetoothAdapter.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ConcreteBluetoothAdapter)
/* harmony export */ });
/* harmony import */ var _blast_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @blast/core */ "@blast/core");
/* harmony import */ var _blast_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_blast_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ble_host__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ble-host */ "ble-host");
/* harmony import */ var ble_host__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ble_host__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var hci_socket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hci-socket */ "hci-socket");
/* harmony import */ var hci_socket__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hci_socket__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_wot_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @node-wot/core */ "@node-wot/core");
/* harmony import */ var _node_wot_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_wot_core__WEBPACK_IMPORTED_MODULE_3__);




const { debug } = (0,_node_wot_core__WEBPACK_IMPORTED_MODULE_3__.createLoggers)('binding-bluetooth', 'NodeBluetoothAdapter');
const transport = new (hci_socket__WEBPACK_IMPORTED_MODULE_2___default())(); // connects to the first hci device on the computer, for example hci0
const options = {
// optional properties go here
};
class ChangeEvent extends Event {
    target;
    constructor(message, target) {
        super(message);
        this.target = target;
    }
}
class ConcreteBluetoothAdapter extends _blast_core__WEBPACK_IMPORTED_MODULE_0__.BluetoothAdapter {
    bleManager = undefined;
    connectedDevices = new Map();
    async getBleManager() {
        if (this.bleManager === undefined) {
            this.bleManager = await new Promise((resolve, reject) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ble_host__WEBPACK_IMPORTED_MODULE_1__.BleManager.create(transport, options, (err, manager) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(manager);
                    }
                });
            });
        }
        return this.bleManager;
    }
    async getCharacteristic(deviceId, serviceID, characteristicId) {
        debug(`getCharacteristic ${deviceId} ${serviceID} ${characteristicId}`);
        const manager = await this.getBleManager();
        // add : to mac address
        if (deviceId.length === 12) {
            deviceId = deviceId
                .match(/.{1,2}/g)
                .join(':')
                .toUpperCase();
        }
        // upper case uuids
        serviceID = serviceID.toUpperCase();
        characteristicId = characteristicId.toUpperCase();
        debug(`Connecting to ${deviceId}`);
        const connection = this.connectedDevices.get(deviceId) ??
            (await new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 4000);
                manager.connect('public', deviceId, {
                /* options */
                }, (conn) => {
                    this.connectedDevices.set(deviceId, conn);
                    conn.on('disconnect', () => {
                        this.connectedDevices.delete(deviceId);
                    });
                    resolve(conn);
                });
                manager.connect('random', deviceId, {
                /* options */
                }, (conn) => {
                    this.connectedDevices.set(deviceId, conn);
                    conn.on('disconnect', () => {
                        this.connectedDevices.delete(deviceId);
                    });
                    resolve(conn);
                });
            }));
        debug(`Connected to ${deviceId}`);
        const service = await new Promise((resolve, reject) => {
            connection.gatt.discoverAllPrimaryServices(services => {
                const service = services.find(s => s.uuid === serviceID);
                if (service === undefined) {
                    reject(new Error(`Service ${serviceID} not found on device ${deviceId}`));
                }
                else {
                    resolve(service);
                }
            });
        });
        const characteristic = await new Promise((resolve, reject) => {
            service.discoverCharacteristics(characteristics => {
                const characteristic = characteristics.find(c => c.uuid === characteristicId);
                if (characteristic) {
                    debug(`Found characteristic ${characteristicId}`);
                    resolve(characteristic);
                }
                else {
                    reject(new Error(`Characteristic ${characteristicId} not found on service ${serviceID}`));
                }
            });
        });
        return this.wrap(characteristic);
    }
    async observeGAP(deviceId, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler) {
        const manager = await this.getBleManager();
        const scanner = manager.startScan({});
        if (deviceId.length === 12) {
            deviceId = deviceId
                .match(/.{1,2}/g)
                .join(':')
                .toUpperCase();
        }
        scanner.on('report', eventData => {
            if (eventData.address === deviceId) {
                const evt = {
                    target: {
                        address: eventData.address,
                        rssi: eventData.rssi,
                        txPower: eventData.parsedDataItems.txPowerLevel,
                        manufacturerData: eventData.parsedDataItems.manufacturerSpecificData,
                        serviceData: eventData.parsedDataItems.serviceData,
                        serviceUuids: eventData.parsedDataItems.serviceUuids,
                    },
                };
                handler(evt);
            }
        });
    }
    wrap(characteristic) {
        const char = {
            service: {},
            uuid: characteristic.uuid,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties: characteristic.properties,
            value: undefined,
            readValue: () => {
                return new Promise((resolve, reject) => {
                    debug('readValue');
                    characteristic.read((err, value) => {
                        if (err || value === undefined) {
                            reject(err);
                        }
                        else {
                            debug('readValue done', value);
                            const arrayBuffer = new Uint8Array(value).buffer;
                            resolve(new DataView(arrayBuffer));
                        }
                    });
                });
            },
            writeValue: async (value) => {
                return new Promise((resolve, reject) => {
                    debug('writeValue', value);
                    characteristic.write(Buffer.from(value), (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            },
            writeValueWithoutResponse: async (value) => {
                return new Promise((resolve, reject) => {
                    debug('writeValueWithoutResponse', value);
                    characteristic.writeWithoutResponse(Buffer.from(value), undefined, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            },
            writeValueWithResponse: async (value) => {
                return new Promise((resolve, reject) => {
                    debug('writeValueWithResponse', value);
                    characteristic.write(Buffer.from(value), (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            debug('writeValueWithResponse done');
                            resolve();
                        }
                    });
                });
            },
            startNotifications: () => {
                return new Promise((resolve, reject) => {
                    characteristic.writeCCCD(true, false, err => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(char);
                        }
                    });
                });
            },
            stopNotifications: () => {
                return new Promise((resolve, reject) => {
                    characteristic.writeCCCD(false, false, err => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(char);
                        }
                    });
                });
            },
            addEventListener: (type, listener, options) => {
                characteristic.on('change', (value, isIndication, callback) => {
                    if (listener) {
                        debug('characteristicvaluechanged event received with value ', value);
                        const arrayBuffer = new Uint8Array(value).buffer;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        char.value = new DataView(arrayBuffer);
                        debug('calling listener with value ', char.value);
                        listener(new ChangeEvent('characteristicvaluechanged', char));
                    }
                });
            },
            removeEventListener: (type, listener, options) => {
                characteristic.removeEventListener('change', listener);
            },
        };
        return char;
    }
}


/***/ }),

/***/ "./src/NodeHidAdapter.ts":
/*!*******************************!*\
  !*** ./src/NodeHidAdapter.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ConcreteHidAdapter)
/* harmony export */ });
/* harmony import */ var _blast_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @blast/core */ "@blast/core");
/* harmony import */ var _blast_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_blast_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_hid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node-hid */ "node-hid");
/* harmony import */ var node_hid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_hid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_wot_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @node-wot/core */ "@node-wot/core");
/* harmony import */ var _node_wot_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_wot_core__WEBPACK_IMPORTED_MODULE_2__);
/* eslint-disable @typescript-eslint/no-unused-vars */



const { debug } = (0,_node_wot_core__WEBPACK_IMPORTED_MODULE_2__.createLoggers)('binding-hid', 'WebHidAdapter');
class ConcreteHidAdapter extends _blast_core__WEBPACK_IMPORTED_MODULE_0__.HidAdapter {
    devices = new Map();
    async getDevice(path) {
        debug(`Getting device at path ${path}`);
        if (this.devices.has(path)) {
            return this.devices.get(path);
        }
        const hidDevices = (0,node_hid__WEBPACK_IMPORTED_MODULE_1__.devices)();
        const device = hidDevices.find(device => device.path === path);
        if (!device) {
            throw new Error(`Device with id ${path} not found`);
        }
        const hidDevice = ConcreteHidAdapter.wrap(device, new node_hid__WEBPACK_IMPORTED_MODULE_1__.HID(device.path));
        this.devices.set(path, hidDevice);
        return hidDevice;
    }
    // Wrap node-hid to implement HIDDevice interface.
    static wrap(device, hid) {
        const hidDevice = {
            open: async () => {
                new node_hid__WEBPACK_IMPORTED_MODULE_1__.HID(device.path);
            },
            close: async () => {
                hid.close();
            },
            forget: async () => {
                hid.close();
            },
            sendReport: async (reportId, data) => {
                // create Buffer with reportId as first byte
                const buffer = Buffer.concat([
                    Buffer.from([reportId]),
                    Buffer.from(data),
                ]);
                hid.write(buffer);
            },
            sendFeatureReport: async (reportId, data) => {
                hid.sendFeatureReport(data);
            },
            receiveFeatureReport: async (reportId) => {
                // node-hid needs to know the report length, return empty DataView
                return new DataView(new ArrayBuffer(0));
            },
            opened: true,
            vendorId: device.vendorId,
            productId: device.productId,
            productName: device.product ?? '',
            collections: [],
            oninputreport: null,
            addEventListener: (type, listener, options) => {
                // Not implemented in node-hid
            },
            removeEventListener: (type, listener) => {
                // Not implemented in node-hid
                // will be overwritten after creating the HIDDevice,
                // because it needs a reference to the HIDDevice.
            },
            dispatchEvent: (event) => {
                // Not implemented in node-hid
                return true;
            },
        };
        hidDevice.addEventListener = (type, listener) => {
            if (type === 'inputreport') {
                hid.on('data', (data) => {
                    // convert to HIDInputReportEvent
                    const event = {
                        type: 'inputreport',
                        device: hidDevice,
                        reportId: data[0],
                        data: new DataView(data.buffer, 1),
                        // Hid-client needs data only, so below properties are not implemented
                        bubbles: false,
                        cancelBubble: false,
                        cancelable: false,
                        composed: false,
                        currentTarget: null,
                        defaultPrevented: false,
                        eventPhase: 0,
                        isTrusted: false,
                        returnValue: false,
                        srcElement: null,
                        target: null,
                        timeStamp: 0,
                        composedPath: function () {
                            throw new Error('Function not implemented.');
                        },
                        initEvent: function (type, bubbles, cancelable) {
                            throw new Error('Function not implemented.');
                        },
                        preventDefault: function () {
                            throw new Error('Function not implemented.');
                        },
                        stopImmediatePropagation: function () {
                            throw new Error('Function not implemented.');
                        },
                        stopPropagation: function () {
                            throw new Error('Function not implemented.');
                        },
                        AT_TARGET: 2,
                        BUBBLING_PHASE: 3,
                        CAPTURING_PHASE: 1,
                        NONE: 0,
                    };
                    listener(event);
                });
            }
        };
        return hidDevice;
    }
}


/***/ }),

/***/ "./src/hidHelpers/deviceSelector.ts":
/*!******************************************!*\
  !*** ./src/hidHelpers/deviceSelector.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeviceSelector)
/* harmony export */ });
/* harmony import */ var node_hid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-hid */ "node-hid");
/* harmony import */ var node_hid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_hid__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inquirer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inquirer */ "inquirer");
/* harmony import */ var inquirer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inquirer__WEBPACK_IMPORTED_MODULE_1__);


class DeviceSelector {
    device = null;
    async showSelector() {
        node_hid__WEBPACK_IMPORTED_MODULE_0___default().setDriverType('libusb');
        const devices = node_hid__WEBPACK_IMPORTED_MODULE_0___default().devices();
        // delete devices without manufacturer and product
        const uniqueDevices = devices.filter(device => {
            return device.manufacturer && device.product;
        });
        const choices = uniqueDevices.map(device => {
            return {
                name: `${device.manufacturer} ${device.product}`,
                value: device,
            };
        });
        const questions = [
            {
                type: 'list',
                name: 'device',
                message: 'Select a device',
                choices: choices,
            },
        ];
        const answers = await inquirer__WEBPACK_IMPORTED_MODULE_1___default().prompt(questions);
        this.device = answers.device;
    }
}


/***/ }),

/***/ "./src/hidHelpers/index.ts":
/*!*********************************!*\
  !*** ./src/hidHelpers/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HidHelpers: () => (/* binding */ HidHelpers)
/* harmony export */ });
/* harmony import */ var _deviceSelector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deviceSelector */ "./src/hidHelpers/deviceSelector.ts");

async function selectDevice() {
    const deviceSelector = new _deviceSelector__WEBPACK_IMPORTED_MODULE_0__["default"]();
    await deviceSelector.showSelector();
    return deviceSelector.device;
}
const HidHelpers = {
    selectDevice,
};


/***/ }),

/***/ "@blast/core":
/*!******************************!*\
  !*** external "@blast/core" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@blast/core");

/***/ }),

/***/ "@node-wot/core":
/*!*********************************!*\
  !*** external "@node-wot/core" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@node-wot/core");

/***/ }),

/***/ "ble-host":
/*!***************************!*\
  !*** external "ble-host" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("ble-host");

/***/ }),

/***/ "hci-socket":
/*!*****************************!*\
  !*** external "hci-socket" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("hci-socket");

/***/ }),

/***/ "inquirer":
/*!***************************!*\
  !*** external "inquirer" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("inquirer");

/***/ }),

/***/ "node-hid":
/*!***************************!*\
  !*** external "node-hid" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("node-hid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HidHelpers: () => (/* reexport safe */ _hidHelpers__WEBPACK_IMPORTED_MODULE_3__.HidHelpers),
/* harmony export */   createExposedThing: () => (/* binding */ createExposedThing),
/* harmony export */   createThing: () => (/* binding */ createThing),
/* harmony export */   createThingWithHandlers: () => (/* binding */ createThingWithHandlers),
/* harmony export */   getWot: () => (/* binding */ getWot),
/* harmony export */   resetServient: () => (/* binding */ resetServient)
/* harmony export */ });
/* harmony import */ var _blast_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @blast/core */ "@blast/core");
/* harmony import */ var _blast_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_blast_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _NodeBluetoothAdapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NodeBluetoothAdapter */ "./src/NodeBluetoothAdapter.ts");
/* harmony import */ var _NodeHidAdapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NodeHidAdapter */ "./src/NodeHidAdapter.ts");
/* harmony import */ var _hidHelpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hidHelpers */ "./src/hidHelpers/index.ts");




const blast = new (_blast_core__WEBPACK_IMPORTED_MODULE_0___default())(_NodeBluetoothAdapter__WEBPACK_IMPORTED_MODULE_1__["default"], _NodeHidAdapter__WEBPACK_IMPORTED_MODULE_2__["default"]);
const getWot = async () => blast.getWot();
const resetServient = async () => blast.resetServient();
const createExposedThing = async (td, id) => blast.createExposedThing(td, id);
const createThing = async (td, id) => blast.createThing(td, id);
const createThingWithHandlers = async (td, id, addHandlers) => blast.createThingWithHandlers(td, id, addHandlers);


})();

exports.HidHelpers = __webpack_exports__.HidHelpers;
exports.createExposedThing = __webpack_exports__.createExposedThing;
exports.createThing = __webpack_exports__.createThing;
exports.createThingWithHandlers = __webpack_exports__.createThingWithHandlers;
exports.getWot = __webpack_exports__.getWot;
exports.resetServient = __webpack_exports__.resetServient;
Object.defineProperty(exports, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1JBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BibGFzdC9ub2RlLy4vc3JjL05vZGVCbHVldG9vdGhBZGFwdGVyLnRzIiwid2VicGFjazovL0BibGFzdC9ub2RlLy4vc3JjL05vZGVIaWRBZGFwdGVyLnRzIiwid2VicGFjazovL0BibGFzdC9ub2RlLy4vc3JjL2hpZEhlbHBlcnMvZGV2aWNlU2VsZWN0b3IudHMiLCJ3ZWJwYWNrOi8vQGJsYXN0L25vZGUvLi9zcmMvaGlkSGVscGVycy9pbmRleC50cyIsIndlYnBhY2s6Ly9AYmxhc3Qvbm9kZS9leHRlcm5hbCBjb21tb25qcyBcIkBibGFzdC9jb3JlXCIiLCJ3ZWJwYWNrOi8vQGJsYXN0L25vZGUvZXh0ZXJuYWwgY29tbW9uanMgXCJAbm9kZS13b3QvY29yZVwiIiwid2VicGFjazovL0BibGFzdC9ub2RlL2V4dGVybmFsIGNvbW1vbmpzIFwiYmxlLWhvc3RcIiIsIndlYnBhY2s6Ly9AYmxhc3Qvbm9kZS9leHRlcm5hbCBjb21tb25qcyBcImhjaS1zb2NrZXRcIiIsIndlYnBhY2s6Ly9AYmxhc3Qvbm9kZS9leHRlcm5hbCBjb21tb25qcyBcImlucXVpcmVyXCIiLCJ3ZWJwYWNrOi8vQGJsYXN0L25vZGUvZXh0ZXJuYWwgY29tbW9uanMgXCJub2RlLWhpZFwiIiwid2VicGFjazovL0BibGFzdC9ub2RlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BibGFzdC9ub2RlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL0BibGFzdC9ub2RlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9AYmxhc3Qvbm9kZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BibGFzdC9ub2RlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQGJsYXN0L25vZGUvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmx1ZXRvb3RoQWRhcHRlciB9IGZyb20gJ0BibGFzdC9jb3JlJztcbmltcG9ydCB7IEJsZU1hbmFnZXIsIH0gZnJvbSAnYmxlLWhvc3QnO1xuaW1wb3J0IEhjaVNvY2tldCBmcm9tICdoY2ktc29ja2V0JztcbmltcG9ydCB7IGNyZWF0ZUxvZ2dlcnMgfSBmcm9tICdAbm9kZS13b3QvY29yZSc7XG5jb25zdCB7IGRlYnVnIH0gPSBjcmVhdGVMb2dnZXJzKCdiaW5kaW5nLWJsdWV0b290aCcsICdOb2RlQmx1ZXRvb3RoQWRhcHRlcicpO1xuY29uc3QgdHJhbnNwb3J0ID0gbmV3IEhjaVNvY2tldCgpOyAvLyBjb25uZWN0cyB0byB0aGUgZmlyc3QgaGNpIGRldmljZSBvbiB0aGUgY29tcHV0ZXIsIGZvciBleGFtcGxlIGhjaTBcbmNvbnN0IG9wdGlvbnMgPSB7XG4vLyBvcHRpb25hbCBwcm9wZXJ0aWVzIGdvIGhlcmVcbn07XG5jbGFzcyBDaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgICB0YXJnZXQ7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgdGFyZ2V0KSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jcmV0ZUJsdWV0b290aEFkYXB0ZXIgZXh0ZW5kcyBCbHVldG9vdGhBZGFwdGVyIHtcbiAgICBibGVNYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgIGNvbm5lY3RlZERldmljZXMgPSBuZXcgTWFwKCk7XG4gICAgYXN5bmMgZ2V0QmxlTWFuYWdlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuYmxlTWFuYWdlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmJsZU1hbmFnZXIgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgICAgICBCbGVNYW5hZ2VyLmNyZWF0ZSh0cmFuc3BvcnQsIG9wdGlvbnMsIChlcnIsIG1hbmFnZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG1hbmFnZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ibGVNYW5hZ2VyO1xuICAgIH1cbiAgICBhc3luYyBnZXRDaGFyYWN0ZXJpc3RpYyhkZXZpY2VJZCwgc2VydmljZUlELCBjaGFyYWN0ZXJpc3RpY0lkKSB7XG4gICAgICAgIGRlYnVnKGBnZXRDaGFyYWN0ZXJpc3RpYyAke2RldmljZUlkfSAke3NlcnZpY2VJRH0gJHtjaGFyYWN0ZXJpc3RpY0lkfWApO1xuICAgICAgICBjb25zdCBtYW5hZ2VyID0gYXdhaXQgdGhpcy5nZXRCbGVNYW5hZ2VyKCk7XG4gICAgICAgIC8vIGFkZCA6IHRvIG1hYyBhZGRyZXNzXG4gICAgICAgIGlmIChkZXZpY2VJZC5sZW5ndGggPT09IDEyKSB7XG4gICAgICAgICAgICBkZXZpY2VJZCA9IGRldmljZUlkXG4gICAgICAgICAgICAgICAgLm1hdGNoKC8uezEsMn0vZylcbiAgICAgICAgICAgICAgICAuam9pbignOicpXG4gICAgICAgICAgICAgICAgLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdXBwZXIgY2FzZSB1dWlkc1xuICAgICAgICBzZXJ2aWNlSUQgPSBzZXJ2aWNlSUQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgY2hhcmFjdGVyaXN0aWNJZCA9IGNoYXJhY3RlcmlzdGljSWQudG9VcHBlckNhc2UoKTtcbiAgICAgICAgZGVidWcoYENvbm5lY3RpbmcgdG8gJHtkZXZpY2VJZH1gKTtcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdGVkRGV2aWNlcy5nZXQoZGV2aWNlSWQpID8/XG4gICAgICAgICAgICAoYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdDb25uZWN0aW9uIHRpbWVvdXQnKSk7XG4gICAgICAgICAgICAgICAgfSwgNDAwMCk7XG4gICAgICAgICAgICAgICAgbWFuYWdlci5jb25uZWN0KCdwdWJsaWMnLCBkZXZpY2VJZCwge1xuICAgICAgICAgICAgICAgIC8qIG9wdGlvbnMgKi9cbiAgICAgICAgICAgICAgICB9LCAoY29ubikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RlZERldmljZXMuc2V0KGRldmljZUlkLCBjb25uKTtcbiAgICAgICAgICAgICAgICAgICAgY29ubi5vbignZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkRGV2aWNlcy5kZWxldGUoZGV2aWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb25uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtYW5hZ2VyLmNvbm5lY3QoJ3JhbmRvbScsIGRldmljZUlkLCB7XG4gICAgICAgICAgICAgICAgLyogb3B0aW9ucyAqL1xuICAgICAgICAgICAgICAgIH0sIChjb25uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkRGV2aWNlcy5zZXQoZGV2aWNlSWQsIGNvbm4pO1xuICAgICAgICAgICAgICAgICAgICBjb25uLm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0ZWREZXZpY2VzLmRlbGV0ZShkZXZpY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbm4pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICBkZWJ1ZyhgQ29ubmVjdGVkIHRvICR7ZGV2aWNlSWR9YCk7XG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25uZWN0aW9uLmdhdHQuZGlzY292ZXJBbGxQcmltYXJ5U2VydmljZXMoc2VydmljZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBzZXJ2aWNlcy5maW5kKHMgPT4gcy51dWlkID09PSBzZXJ2aWNlSUQpO1xuICAgICAgICAgICAgICAgIGlmIChzZXJ2aWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgU2VydmljZSAke3NlcnZpY2VJRH0gbm90IGZvdW5kIG9uIGRldmljZSAke2RldmljZUlkfWApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc2VydmljZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJpc3RpYyA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNlcnZpY2UuZGlzY292ZXJDaGFyYWN0ZXJpc3RpY3MoY2hhcmFjdGVyaXN0aWNzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFyYWN0ZXJpc3RpYyA9IGNoYXJhY3RlcmlzdGljcy5maW5kKGMgPT4gYy51dWlkID09PSBjaGFyYWN0ZXJpc3RpY0lkKTtcbiAgICAgICAgICAgICAgICBpZiAoY2hhcmFjdGVyaXN0aWMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoYEZvdW5kIGNoYXJhY3RlcmlzdGljICR7Y2hhcmFjdGVyaXN0aWNJZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjaGFyYWN0ZXJpc3RpYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBDaGFyYWN0ZXJpc3RpYyAke2NoYXJhY3RlcmlzdGljSWR9IG5vdCBmb3VuZCBvbiBzZXJ2aWNlICR7c2VydmljZUlEfWApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLndyYXAoY2hhcmFjdGVyaXN0aWMpO1xuICAgIH1cbiAgICBhc3luYyBvYnNlcnZlR0FQKGRldmljZUlkLCBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgbWFuYWdlciA9IGF3YWl0IHRoaXMuZ2V0QmxlTWFuYWdlcigpO1xuICAgICAgICBjb25zdCBzY2FubmVyID0gbWFuYWdlci5zdGFydFNjYW4oe30pO1xuICAgICAgICBpZiAoZGV2aWNlSWQubGVuZ3RoID09PSAxMikge1xuICAgICAgICAgICAgZGV2aWNlSWQgPSBkZXZpY2VJZFxuICAgICAgICAgICAgICAgIC5tYXRjaCgvLnsxLDJ9L2cpXG4gICAgICAgICAgICAgICAgLmpvaW4oJzonKVxuICAgICAgICAgICAgICAgIC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHNjYW5uZXIub24oJ3JlcG9ydCcsIGV2ZW50RGF0YSA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnREYXRhLmFkZHJlc3MgPT09IGRldmljZUlkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZ0ID0ge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGV2ZW50RGF0YS5hZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcnNzaTogZXZlbnREYXRhLnJzc2ksXG4gICAgICAgICAgICAgICAgICAgICAgICB0eFBvd2VyOiBldmVudERhdGEucGFyc2VkRGF0YUl0ZW1zLnR4UG93ZXJMZXZlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hbnVmYWN0dXJlckRhdGE6IGV2ZW50RGF0YS5wYXJzZWREYXRhSXRlbXMubWFudWZhY3R1cmVyU3BlY2lmaWNEYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZURhdGE6IGV2ZW50RGF0YS5wYXJzZWREYXRhSXRlbXMuc2VydmljZURhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlVXVpZHM6IGV2ZW50RGF0YS5wYXJzZWREYXRhSXRlbXMuc2VydmljZVV1aWRzLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaGFuZGxlcihldnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgd3JhcChjaGFyYWN0ZXJpc3RpYykge1xuICAgICAgICBjb25zdCBjaGFyID0ge1xuICAgICAgICAgICAgc2VydmljZToge30sXG4gICAgICAgICAgICB1dWlkOiBjaGFyYWN0ZXJpc3RpYy51dWlkLFxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IGNoYXJhY3RlcmlzdGljLnByb3BlcnRpZXMsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcmVhZFZhbHVlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ3JlYWRWYWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy5yZWFkKChlcnIsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCdyZWFkVmFsdWUgZG9uZScsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHZhbHVlKS5idWZmZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGVWYWx1ZTogYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ3dyaXRlVmFsdWUnLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLndyaXRlKEJ1ZmZlci5mcm9tKHZhbHVlKSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0ZVZhbHVlV2l0aG91dFJlc3BvbnNlOiBhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1Zygnd3JpdGVWYWx1ZVdpdGhvdXRSZXNwb25zZScsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMud3JpdGVXaXRob3V0UmVzcG9uc2UoQnVmZmVyLmZyb20odmFsdWUpLCB1bmRlZmluZWQsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGVWYWx1ZVdpdGhSZXNwb25zZTogYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ3dyaXRlVmFsdWVXaXRoUmVzcG9uc2UnLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljLndyaXRlKEJ1ZmZlci5mcm9tKHZhbHVlKSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVidWcoJ3dyaXRlVmFsdWVXaXRoUmVzcG9uc2UgZG9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhcnROb3RpZmljYXRpb25zOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMud3JpdGVDQ0NEKHRydWUsIGZhbHNlLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjaGFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcE5vdGlmaWNhdGlvbnM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpYy53cml0ZUNDQ0QoZmFsc2UsIGZhbHNlLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjaGFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcjogKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMub24oJ2NoYW5nZScsICh2YWx1ZSwgaXNJbmRpY2F0aW9uLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCBldmVudCByZWNlaXZlZCB3aXRoIHZhbHVlICcsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLmJ1ZmZlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFyLnZhbHVlID0gbmV3IERhdGFWaWV3KGFycmF5QnVmZmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCdjYWxsaW5nIGxpc3RlbmVyIHdpdGggdmFsdWUgJywgY2hhci52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcihuZXcgQ2hhbmdlRXZlbnQoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJywgY2hhcikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNoYXI7XG4gICAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG5pbXBvcnQgeyBIaWRBZGFwdGVyIH0gZnJvbSAnQGJsYXN0L2NvcmUnO1xuaW1wb3J0IHsgZGV2aWNlcywgSElEIH0gZnJvbSAnbm9kZS1oaWQnO1xuaW1wb3J0IHsgY3JlYXRlTG9nZ2VycyB9IGZyb20gJ0Bub2RlLXdvdC9jb3JlJztcbmNvbnN0IHsgZGVidWcgfSA9IGNyZWF0ZUxvZ2dlcnMoJ2JpbmRpbmctaGlkJywgJ1dlYkhpZEFkYXB0ZXInKTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNyZXRlSGlkQWRhcHRlciBleHRlbmRzIEhpZEFkYXB0ZXIge1xuICAgIGRldmljZXMgPSBuZXcgTWFwKCk7XG4gICAgYXN5bmMgZ2V0RGV2aWNlKHBhdGgpIHtcbiAgICAgICAgZGVidWcoYEdldHRpbmcgZGV2aWNlIGF0IHBhdGggJHtwYXRofWApO1xuICAgICAgICBpZiAodGhpcy5kZXZpY2VzLmhhcyhwYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGV2aWNlcy5nZXQocGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGlkRGV2aWNlcyA9IGRldmljZXMoKTtcbiAgICAgICAgY29uc3QgZGV2aWNlID0gaGlkRGV2aWNlcy5maW5kKGRldmljZSA9PiBkZXZpY2UucGF0aCA9PT0gcGF0aCk7XG4gICAgICAgIGlmICghZGV2aWNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERldmljZSB3aXRoIGlkICR7cGF0aH0gbm90IGZvdW5kYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGlkRGV2aWNlID0gQ29uY3JldGVIaWRBZGFwdGVyLndyYXAoZGV2aWNlLCBuZXcgSElEKGRldmljZS5wYXRoKSk7XG4gICAgICAgIHRoaXMuZGV2aWNlcy5zZXQocGF0aCwgaGlkRGV2aWNlKTtcbiAgICAgICAgcmV0dXJuIGhpZERldmljZTtcbiAgICB9XG4gICAgLy8gV3JhcCBub2RlLWhpZCB0byBpbXBsZW1lbnQgSElERGV2aWNlIGludGVyZmFjZS5cbiAgICBzdGF0aWMgd3JhcChkZXZpY2UsIGhpZCkge1xuICAgICAgICBjb25zdCBoaWREZXZpY2UgPSB7XG4gICAgICAgICAgICBvcGVuOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEhJRChkZXZpY2UucGF0aCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2U6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBoaWQuY2xvc2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JnZXQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBoaWQuY2xvc2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZW5kUmVwb3J0OiBhc3luYyAocmVwb3J0SWQsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgQnVmZmVyIHdpdGggcmVwb3J0SWQgYXMgZmlyc3QgYnl0ZVxuICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbShbcmVwb3J0SWRdKSxcbiAgICAgICAgICAgICAgICAgICAgQnVmZmVyLmZyb20oZGF0YSksXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgaGlkLndyaXRlKGJ1ZmZlcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VuZEZlYXR1cmVSZXBvcnQ6IGFzeW5jIChyZXBvcnRJZCwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGhpZC5zZW5kRmVhdHVyZVJlcG9ydChkYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWNlaXZlRmVhdHVyZVJlcG9ydDogYXN5bmMgKHJlcG9ydElkKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbm9kZS1oaWQgbmVlZHMgdG8ga25vdyB0aGUgcmVwb3J0IGxlbmd0aCwgcmV0dXJuIGVtcHR5IERhdGFWaWV3XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wZW5lZDogdHJ1ZSxcbiAgICAgICAgICAgIHZlbmRvcklkOiBkZXZpY2UudmVuZG9ySWQsXG4gICAgICAgICAgICBwcm9kdWN0SWQ6IGRldmljZS5wcm9kdWN0SWQsXG4gICAgICAgICAgICBwcm9kdWN0TmFtZTogZGV2aWNlLnByb2R1Y3QgPz8gJycsXG4gICAgICAgICAgICBjb2xsZWN0aW9uczogW10sXG4gICAgICAgICAgICBvbmlucHV0cmVwb3J0OiBudWxsLFxuICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcjogKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTm90IGltcGxlbWVudGVkIGluIG5vZGUtaGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogKHR5cGUsIGxpc3RlbmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTm90IGltcGxlbWVudGVkIGluIG5vZGUtaGlkXG4gICAgICAgICAgICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBhZnRlciBjcmVhdGluZyB0aGUgSElERGV2aWNlLFxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgaXQgbmVlZHMgYSByZWZlcmVuY2UgdG8gdGhlIEhJRERldmljZS5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaXNwYXRjaEV2ZW50OiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBOb3QgaW1wbGVtZW50ZWQgaW4gbm9kZS1oaWRcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGhpZERldmljZS5hZGRFdmVudExpc3RlbmVyID0gKHR5cGUsIGxpc3RlbmVyKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2lucHV0cmVwb3J0Jykge1xuICAgICAgICAgICAgICAgIGhpZC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gSElESW5wdXRSZXBvcnRFdmVudFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBldmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnB1dHJlcG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2U6IGhpZERldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG9ydElkOiBkYXRhWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbmV3IERhdGFWaWV3KGRhdGEuYnVmZmVyLCAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhpZC1jbGllbnQgbmVlZHMgZGF0YSBvbmx5LCBzbyBiZWxvdyBwcm9wZXJ0aWVzIGFyZSBub3QgaW1wbGVtZW50ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQnViYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRhcmdldDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRQcmV2ZW50ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRQaGFzZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVHJ1c3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNFbGVtZW50OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZVN0YW1wOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9zZWRQYXRoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdEV2ZW50OiBmdW5jdGlvbiAodHlwZSwgYnViYmxlcywgY2FuY2VsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24gbm90IGltcGxlbWVudGVkLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgQVRfVEFSR0VUOiAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgQlVCQkxJTkdfUEhBU0U6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBDQVBUVVJJTkdfUEhBU0U6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBOT05FOiAwLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcihldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBoaWREZXZpY2U7XG4gICAgfVxufVxuIiwiaW1wb3J0IEhJRCBmcm9tICdub2RlLWhpZCc7XG5pbXBvcnQgaW5xdWlyZXIgZnJvbSAnaW5xdWlyZXInO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGV2aWNlU2VsZWN0b3Ige1xuICAgIGRldmljZSA9IG51bGw7XG4gICAgYXN5bmMgc2hvd1NlbGVjdG9yKCkge1xuICAgICAgICBISUQuc2V0RHJpdmVyVHlwZSgnbGlidXNiJyk7XG4gICAgICAgIGNvbnN0IGRldmljZXMgPSBISUQuZGV2aWNlcygpO1xuICAgICAgICAvLyBkZWxldGUgZGV2aWNlcyB3aXRob3V0IG1hbnVmYWN0dXJlciBhbmQgcHJvZHVjdFxuICAgICAgICBjb25zdCB1bmlxdWVEZXZpY2VzID0gZGV2aWNlcy5maWx0ZXIoZGV2aWNlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkZXZpY2UubWFudWZhY3R1cmVyICYmIGRldmljZS5wcm9kdWN0O1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2hvaWNlcyA9IHVuaXF1ZURldmljZXMubWFwKGRldmljZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IGAke2RldmljZS5tYW51ZmFjdHVyZXJ9ICR7ZGV2aWNlLnByb2R1Y3R9YCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZGV2aWNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHF1ZXN0aW9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgICAgICAgbmFtZTogJ2RldmljZScsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1NlbGVjdCBhIGRldmljZScsXG4gICAgICAgICAgICAgICAgY2hvaWNlczogY2hvaWNlcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IGFuc3dlcnMgPSBhd2FpdCBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb25zKTtcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBhbnN3ZXJzLmRldmljZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgRGV2aWNlU2VsZWN0b3IgZnJvbSAnLi9kZXZpY2VTZWxlY3Rvcic7XG5hc3luYyBmdW5jdGlvbiBzZWxlY3REZXZpY2UoKSB7XG4gICAgY29uc3QgZGV2aWNlU2VsZWN0b3IgPSBuZXcgRGV2aWNlU2VsZWN0b3IoKTtcbiAgICBhd2FpdCBkZXZpY2VTZWxlY3Rvci5zaG93U2VsZWN0b3IoKTtcbiAgICByZXR1cm4gZGV2aWNlU2VsZWN0b3IuZGV2aWNlO1xufVxuZXhwb3J0IGNvbnN0IEhpZEhlbHBlcnMgPSB7XG4gICAgc2VsZWN0RGV2aWNlLFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBibGFzdC9jb3JlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBub2RlLXdvdC9jb3JlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJsZS1ob3N0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhjaS1zb2NrZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaW5xdWlyZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1oaWRcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBCbGFzdCBmcm9tICdAYmxhc3QvY29yZSc7XG5pbXBvcnQgQ29uY3JldGVCbHVldG9vdGhBZGFwdGVyIGZyb20gJy4vTm9kZUJsdWV0b290aEFkYXB0ZXInO1xuaW1wb3J0IENvbmNyZXRlSGlkQWRhcHRlciBmcm9tICcuL05vZGVIaWRBZGFwdGVyJztcbmV4cG9ydCB7IEhpZEhlbHBlcnMgfSBmcm9tICcuL2hpZEhlbHBlcnMnO1xuY29uc3QgYmxhc3QgPSBuZXcgQmxhc3QoQ29uY3JldGVCbHVldG9vdGhBZGFwdGVyLCBDb25jcmV0ZUhpZEFkYXB0ZXIpO1xuY29uc3QgZ2V0V290ID0gYXN5bmMgKCkgPT4gYmxhc3QuZ2V0V290KCk7XG5jb25zdCByZXNldFNlcnZpZW50ID0gYXN5bmMgKCkgPT4gYmxhc3QucmVzZXRTZXJ2aWVudCgpO1xuY29uc3QgY3JlYXRlRXhwb3NlZFRoaW5nID0gYXN5bmMgKHRkLCBpZCkgPT4gYmxhc3QuY3JlYXRlRXhwb3NlZFRoaW5nKHRkLCBpZCk7XG5jb25zdCBjcmVhdGVUaGluZyA9IGFzeW5jICh0ZCwgaWQpID0+IGJsYXN0LmNyZWF0ZVRoaW5nKHRkLCBpZCk7XG5jb25zdCBjcmVhdGVUaGluZ1dpdGhIYW5kbGVycyA9IGFzeW5jICh0ZCwgaWQsIGFkZEhhbmRsZXJzKSA9PiBibGFzdC5jcmVhdGVUaGluZ1dpdGhIYW5kbGVycyh0ZCwgaWQsIGFkZEhhbmRsZXJzKTtcbmV4cG9ydCB7IGdldFdvdCwgcmVzZXRTZXJ2aWVudCwgY3JlYXRlRXhwb3NlZFRoaW5nLCBjcmVhdGVUaGluZywgY3JlYXRlVGhpbmdXaXRoSGFuZGxlcnMsIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=