/**
 * @fileoverview implements eddystone-Operations using webBluetooth
 * (https://github.com/google/eddystone/tree/master/configuration-service).
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
  * Eddystone API namespace.
  * @name Blast.Bluetooth.Eddystone
  * @namespace
  * @public
  */
goog.provide('Blast.Bluetooth.Eddystone');
 
goog.require('Blast.Bluetooth');
 
 
/**
  * Eddystone Configuration Service and Characteristic UUIDs.
  */
Blast.Bluetooth.Eddystone.UUIDS = {
  CONFIG_SERVICE: 'a3c87500-8ed3-4bdf-8a39-a01bebede295',
  CAPABILITIES_CHARACTERISTIC: 'a3c87501-8ed3-4bdf-8a39-a01bebede295',
  ACTIVE_SLOT_CHARACTERISTIC: 'a3c87502-8ed3-4bdf-8a39-a01bebede295',
  ADVERTISING_INTERVAL_CHARACTERISTIC: 'a3c87503-8ed3-4bdf-8a39-a01bebede295',
  RADIO_TX_POWER_CHARACTERISTIC: 'a3c87504-8ed3-4bdf-8a39-a01bebede295',
  ADVERTISED_TX_POWER_CHARACTERISTIC: 'a3c87505-8ed3-4bdf-8a39-a01bebede295',
  LOCK_STATE_CHARACTERISTIC: 'a3c87506-8ed3-4bdf-8a39-a01bebede295',
  UNLOCK_STATE_CHARACTERISTIC: 'a3c87507-8ed3-4bdf-8a39-a01bebede295',
  PUBLIC_ECDH_KEY_CHARACTERISTIC: 'a3c87508-8ed3-4bdf-8a39-a01bebede295',
  EID_IDENTITY_KEY_CHARACTERISTIC: 'a3c87509-8ed3-4bdf-8a39-a01bebede295',
  ADV_SLOT_DATA_CHARACTERISTIC: 'a3c8750a-8ed3-4bdf-8a39-a01bebede295',
  FACTORY_RESET_CHARACTERISTIC: 'a3c8750b-8ed3-4bdf-8a39-a01bebede295',
  REMAIN_CONNECTABLE_CHARACTERISTIC: 'a3c8750c-8ed3-4bdf-8a39-a01bebede295',
};
 
// Add Eddystone config service to optionalServices to make it accessible.
Blast.Bluetooth.optionalServices.push(Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE);
 
/**
  * Gets the devices Capabilities.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getCapabilities = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone capabilities...', 'Eddystone', webBluetoothId);
  // Get the capabilities.
  let capabilitiesArray = await Blast.Bluetooth.gatt_read(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.CAPABILITIES_CHARACTERISTIC,
  );
  capabilitiesArray = new Int8Array(capabilitiesArray.buffer);
 
  // Parse the capabilities.
  const supportedTxPowerLevels = [];
  for (let i = 6; i < capabilitiesArray.length; i++) {
    // elements have to be in ascending order
    const lastElem = supportedTxPowerLevels[supportedTxPowerLevels.length - 1];
    if (lastElem && lastElem >= capabilitiesArray[i]) {
      break;
    }
    supportedTxPowerLevels.push(capabilitiesArray[i]);
  }
   
  const capabilities = {
    specVersion: capabilitiesArray[0],
    maxSlots: capabilitiesArray[1],
    maxEidPerSlot: capabilitiesArray[2],
    isVarriableAdvIntervalSupported: (capabilitiesArray[3] & 1) !== 0,
    isVariableTxPowerSupported: (capabilitiesArray[3] & 2) !== 0,
    isUIDSupported: (capabilitiesArray[5] & 1) !== 0,
    isURLSupported: (capabilitiesArray[5] & 2) !== 0,
    isTLMSupported: (capabilitiesArray[5] & 4) !== 0,
    isEIDSupported: (capabilitiesArray[5] & 8) !== 0,
    supportedTxPowerLevels: supportedTxPowerLevels,
  };

  Blast.Ui.addToLog(`Eddystone capabilities: <code>${JSON.stringify(capabilities)}</code>`, 'Eddystone', webBluetoothId);

  return capabilities;
};
 
/**
  * Gets the active slot of the Eddystone configuration service.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getActiveSlot = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone active slot...', 'Eddystone', webBluetoothId);
  const activeSlot = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ACTIVE_SLOT_CHARACTERISTIC,
  );
  Blast.Ui.addToLog(`Got Eddystone active slot: <code>${activeSlot}</code>`, 'Eddystone', webBluetoothId);
  return activeSlot;
};
 
/**
  * Sets the active slot of the Eddystone configuration service.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @param {number} slot The slot to set.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.setActiveSlot = async function(webBluetoothId, slot) {
  Blast.Ui.addToLog(`Setting Eddystone active slot to <code>${slot}</code>...`, 'Eddystone', webBluetoothId);
  // check if slot is valid
  const capabilities = await Blast.Bluetooth.Eddystone.getCapabilities(webBluetoothId);
  if (slot < 0 || slot >= capabilities.maxSlots) {
    Blast.Interpreter.throwError(
        `Eddystone slot is not valid.
         On this device the slot must be between 0 and ${capabilities.maxSlots - 1}.`,
    );
  }
 
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ACTIVE_SLOT_CHARACTERISTIC,
      slot.toString(16),
  );

  Blast.Ui.addToLog(`Eddystone active slot set to <code>${slot}</code>`, 'Eddystone', webBluetoothId);
  return;
};
 
/**
  * Gets the advertising interval of the currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getAdvertisingInterval = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone advertising interval...', 'Eddystone', webBluetoothId);
  const interval = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC,
  );
  Blast.Ui.addToLog(`Got Eddystone advertising interval: <code>${interval}</code>`, 'Eddystone', webBluetoothId);
  return interval;
};
 
/**
  * Sets the advertising interval of currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @param {number} interval The advertising interval to set.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.setAdvertisingInterval = async function(webBluetoothId, interval) {
  Blast.Ui.addToLog(`Setting Eddystone advertising interval to <code>${interval}</code>...`, 'Eddystone', webBluetoothId);
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC,
      interval.toString(16),
  );
  Blast.Ui.addToLog(`Eddystone advertising interval set to <code>${interval}</code>`, 'Eddystone', webBluetoothId);
  return;
};
 
/**
  * Gets the TX power level of the currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getTxPowerLevel = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone TX power level...', 'Eddystone', webBluetoothId);
  const txPowerLevel = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.RADIO_TX_POWER_CHARACTERISTIC,
  );
  Blast.Ui.addToLog(`Got Eddystone TX power level: <code>${txPowerLevel}</code>`, 'Eddystone', webBluetoothId);
  return txPowerLevel;
};
 
/**
  * Sets the TX power level of currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @param {number} txPowerLevel The TX power level to set.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.setTxPowerLevel = async function(webBluetoothId, txPowerLevel) {
  Blast.Ui.addToLog(`Setting Eddystone TX power level to <code>${txPowerLevel}</code>...`, 'Eddystone', webBluetoothId);
  // check if txPowerLevel is valid
  const capabilities = await Blast.Bluetooth.Eddystone.getCapabilities(webBluetoothId);
  if (capabilities.supportedTxPowerLevels.indexOf(txPowerLevel) === -1) {
    Blast.Interpreter.throwError(
        `Eddystone TX power level is not valid.
         On this device the TX power level must be one of ${capabilities.supportedTxPowerLevels}.`,
    );
    return;
  }
 
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.RADIO_TX_POWER_CHARACTERISTIC,
      txPowerLevel.toString(16),
  );
  Blast.Ui.addToLog(`Eddystone TX power level set to <code>${txPowerLevel}</code>`, 'Eddystone', webBluetoothId);
  return;
};
 
/**
  * Gets the advertised TX power of the currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getAdvertisedTxPower = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone advertised TX power...', 'Eddystone', webBluetoothId);
  const advertisedTxPower = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC,
  );
  Blast.Ui.addToLog(`Got Eddystone advertised TX power: <code>${advertisedTxPower}</code>`, 'Eddystone', webBluetoothId);
  return advertisedTxPower;
};
 
/**
  * Sets the advertised TX power level of currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @param {number} txPowerLevel The TX power level to set.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.setAdvertisedTxPower = async function(webBluetoothId, txPowerLevel) {
  Blast.Ui.addToLog(`Setting Eddystone advertised TX power to <code>${txPowerLevel}</code>...`, 'Eddystone', webBluetoothId);
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC,
      txPowerLevel.toString(16),
  );
  Blast.Ui.addToLog(`Eddystone advertised TX power set to <code>${txPowerLevel}</code>`, 'Eddystone', webBluetoothId);
  return;
};
 
/**
  * Gets the lock state of the Eddystone configuration service.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getLockState = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone lock state...', 'Eddystone', webBluetoothId);
  const lockState = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.LOCK_STATE_CHARACTERISTIC,
  );
  Blast.Ui.addToLog(`Got Eddystone lock state: <code>${lockState}</code>`, 'Eddystone', webBluetoothId);
  return lockState;
};
 
/**
  * Gets the public ECDH Key of the Eddystone configuration service.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getPublicECDHKey = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone public ECDH key...', 'Eddystone', webBluetoothId);
  const publicECDHKey = await Blast.Bluetooth.gatt_read_hex(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.PUBLIC_ECDH_KEY_CHARACTERISTIC,
  );
  Blast.Ui.addToLog(`Got Eddystone public ECDH key: <code>${publicECDHKey}</code>`, 'Eddystone', webBluetoothId);
  return publicECDHKey;
};
 
/**
  * Gets the advertising data of the currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @return {!Promise} A promise that resolves when the operation is complete.
  */
Blast.Bluetooth.Eddystone.getAdvertisingData = async function(webBluetoothId) {
  Blast.Ui.addToLog('Reading Eddystone advertising data...', 'Eddystone', webBluetoothId);
  const decodeEddystoneUid = function(advData) {
    // TX Power is the second byte of the advertised data.
    const txPower = parseInt(advData.substring(2, 4), 16);
 
    // Namespace is the next 10 bytes.
    const namespace = advData.substring(4, 24);
 
    // Instance is the next 6 bytes.
    const instance = advData.substring(25, 37);
 
    return {
      frameType: 'UID',
      txPower: txPower,
      namespace: namespace,
      instance: instance,
    };
  };
 
  const decodeEddystoneUrl = function(advData) {
    // TX Power is the second byte of the advertising data.
    const txPower = parseInt(advData.substring(2, 4), 16);
 
    // URL Scheme is the third byte of the advertising data.
    const urlScheme = advData.substring(4, 6);
    let urlPrefix = '';
    switch (urlScheme) {
      case '00':
        urlPrefix = 'http://www.';
        break;
      case '01':
        urlPrefix = 'https://www.';
        break;
      case '02':
        urlPrefix = 'http://';
        break;
      case '03':
        urlPrefix = 'https://';
        break;
      default:
        Blast.Interpreter.throwError('Eddystone URL scheme is not valid.');
        return;
    }
     
    const suffixes = [
      '.com/',
      '.org/',
      '.edu/',
      '.net/',
      '.info/',
      '.biz/',
      '.gov/',
      '.com',
      '.org',
      '.edu',
      '.net',
      '.info',
      '.biz',
      '.gov',
    ];
 
    // Encoded URL is the remaining bytes of the advertising data.
    const encodedUrl = advData.substring(6, advData.length);
    let url = urlPrefix;
    for (let i = 0; i < encodedUrl.length; i += 2) {
      const charCode = parseInt(encodedUrl.substring(i, i + 2), 16);
      if (charCode < suffixes.length) {
        url += suffixes[charCode];
      } else {
        url += String.fromCharCode(charCode);
      }
    }
         
 
    return {
      frameType: 'URL',
      txPower: txPower,
      url: url,
    };
  };
 
  const decodeEddystoneTlm = function(advData) {
    // Byte 0 is the frame type, byte 1 is the version.
    // 2nd and 3rd bytes are the Barrery Voltage, 1mV/bit.
    const batteryVoltage = parseInt(advData.substring(4, 8), 16);
 
    // 4th and 5th bytes are the beacon temperature.
    const beaconTemperature = parseInt(advData.substring(8, 10), 16) +
                                 parseInt(advData.substring(10, 12), 16) / 100;
 
    // 6th to 9th bytes are the Advertising PDU count.
    const pduCount = parseInt(advData.substring(12, 20), 16);
 
    // 10th to 13th bytes are the time since the Beacon last rebooted.
    const timeSinceReboot = parseInt(advData.substring(20, 28), 16);
 
    return {
      frameType: 'TLM',
      batteryVoltage: batteryVoltage,
      beaconTemperature: beaconTemperature,
      pduCount: pduCount,
      timeSinceReboot: timeSinceReboot,
    };
  };
 
  const advertisingData = await Blast.Bluetooth.gatt_read_hex(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADV_SLOT_DATA_CHARACTERISTIC,
  );

  Blast.Ui.addToLog(`Got Eddystone advertising data: <code>${advertisingData}</code>`, 'Eddystone', webBluetoothId);
 
  // Frame type is the first byte of the advertising data.
  const frameType = advertisingData.substring(0, 2);
  let data;
 
  switch (frameType) {
    case '00':
      data = decodeEddystoneUid(advertisingData);
      return data.namespace + data.instance;
    case '10':
      data = decodeEddystoneUrl(advertisingData);
      return data.url;
    case '20':
      data = decodeEddystoneTlm(advertisingData);
      return data.beaconTemperature;
    case '30':
      Blast.Interpreter.throwError('EID frame type is not supported by blast.');
      return;
    default:
      Blast.Interpreter.throwError('Eddystone frame type is not valid.');
      return;
  }
};
 
/**
  * Sets the advertising data of the currently active slot.
  * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
  * @param {string} frameType The frame type of the data to set.
  * @param {string} data The data to set.
  */
Blast.Bluetooth.Eddystone.setAdvertisingData = async function(webBluetoothId, frameType, data) {
  Blast.Ui.addToLog('Set Eddystone advertising data...', 'Eddystone', webBluetoothId);
  const encodeEddystoneUrl = function(url) {
    const URL_SCHEMES = [
      'http://www.',
      'https://www.',
      'http://',
      'https://',
    ];
 
    const URL_CODES = [
      '.com/',
      '.org/',
      '.edu/',
      '.net/',
      '.info/',
      '.biz/',
      '.gov/',
      '.com',
      '.org',
      '.edu',
      '.net',
      '.info',
      '.biz',
      '.gov',
    ];
 
    const encodedUrl = [];
    let position = 0;
    const encoder = new TextEncoder('utf-8');
 
    for (let i = 0; i < URL_SCHEMES.length; i++) {
      if (url.startsWith(URL_SCHEMES[i])) {
        encodedUrl.push(i);
        position = URL_SCHEMES[i].length;
        break;
      }
    }
 
    while (position < url.length) {
      const initialPosition = position;
      for (let i = 0; i < URL_CODES.length; i++) {
        if (url.startsWith(URL_CODES[i], position)) {
          encodedUrl.push(i);
          position += URL_CODES[i].length;
          break;
        }
      }
      if (initialPosition === position) {
        encodedUrl.push(encoder.encode(url[position])[0]);
        position++;
      }
    }
 
    if (encodedUrl.length > 18) {
      Blast.Interpreter.throwError('URL is too long.');
      return;
    }
     
    // prefix the frame type
    encodedUrl.splice(0, 0, 0x10);
    return new Uint8Array(encodedUrl);
  };
  
  let encodedData;
  if (frameType === 'URL') {
    encodedData = encodeEddystoneUrl(data);
  } else if (frameType === 'UID') {
    // Checks if the UID is 32 hex chars.
    if (!/^[0-9A-Fa-f]{32}$/.test(data)) {
      Blast.Interpreter.throwError('Eddystone UID must be 32 hexadecimal characters.');
      return;
    }
    
    // prefix the frame type
    encodedData = '0x00' + data;
  }
     
  const response = await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADV_SLOT_DATA_CHARACTERISTIC,
      encodedData,
  );
  Blast.Ui.addToLog(`Eddystone advertising data set to <code>${data}</code>`, 'Eddystone', webBluetoothId);
  return response;
};
