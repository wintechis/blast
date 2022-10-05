/**
 * @fileoverview implements eddystone-Operations using webBluetooth
 * (https://github.com/google/eddystone/tree/master/configuration-service).
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {read} from './blast_webBluetooth.js';
import {readHex} from './blast_webBluetooth.js';
import {readNumber} from './blast_webBluetooth.js';
import {writeWithResponse} from './blast_webBluetooth.js';
import {getThingsLog} from './blast_things.js';
import {optionalServices} from './blast_webBluetooth.js';
import {throwError} from './blast_interpreter.js';

/**
 * Eddystone Configuration Service and Characteristic UUIDs.
 */
const UUIDS = {
  ACTIVE_SLOT_CHARACTERISTIC: 'a3c87502-8ed3-4bdf-8a39-a01bebede295',
  ADVERTISED_TX_POWER_CHARACTERISTIC: 'a3c87505-8ed3-4bdf-8a39-a01bebede295',
  ADVERTISING_INTERVAL_CHARACTERISTIC: 'a3c87503-8ed3-4bdf-8a39-a01bebede295',
  ADV_SLOT_DATA_CHARACTERISTIC: 'a3c8750a-8ed3-4bdf-8a39-a01bebede295',
  CAPABILITIES_CHARACTERISTIC: 'a3c87501-8ed3-4bdf-8a39-a01bebede295',
  CONFIG_SERVICE: 'a3c87500-8ed3-4bdf-8a39-a01bebede295',
  EID_IDENTITY_KEY_CHARACTERISTIC: 'a3c87509-8ed3-4bdf-8a39-a01bebede295',
  FACTORY_RESET_CHARACTERISTIC: 'a3c8750b-8ed3-4bdf-8a39-a01bebede295',
  LOCK_STATE_CHARACTERISTIC: 'a3c87506-8ed3-4bdf-8a39-a01bebede295',
  PUBLIC_ECDH_KEY_CHARACTERISTIC: 'a3c87508-8ed3-4bdf-8a39-a01bebede295',
  RADIO_TX_POWER_CHARACTERISTIC: 'a3c87504-8ed3-4bdf-8a39-a01bebede295',
  REMAIN_CONNECTABLE_CHARACTERISTIC: 'a3c8750c-8ed3-4bdf-8a39-a01bebede295',
  UNLOCK_STATE_CHARACTERISTIC: 'a3c87507-8ed3-4bdf-8a39-a01bebede295',
};

export const eddystoneProperties = new Map();
eddystoneProperties.set(UUIDS.ACTIVE_SLOT_CHARACTERISTIC, 'activeSlot');
eddystoneProperties.set(
  UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC,
  'advertisedTxPower'
);
eddystoneProperties.set(UUIDS.ADV_SLOT_DATA_CHARACTERISTIC, 'advertisedData');
eddystoneProperties.set(
  UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC,
  'advertisingInterval'
);
eddystoneProperties.set(UUIDS.CAPABILITIES_CHARACTERISTIC, 'capabilities');
eddystoneProperties.set(UUIDS.LOCK_STATE_CHARACTERISTIC, 'lockState');
eddystoneProperties.set(UUIDS.PUBLIC_ECDH_KEY_CHARACTERISTIC, 'publicEcdhKey');
eddystoneProperties.set(UUIDS.RADIO_TX_POWER_CHARACTERISTIC, 'radioTxPower');

// Add Eddystone config service to optionalServices to make it accessible.
optionalServices.push(UUIDS.CONFIG_SERVICE);

/**
 * Gets the devices Capabilities.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export const getCapabilities = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog('Reading Eddystone capabilities...', 'Eddystone', webBluetoothId);
  // Get the capabilities.
  const capabilitiesArray = await read(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.CAPABILITIES_CHARACTERISTIC
  );
  if (!capabilitiesArray) {
    return;
  }
  const capabilities = parseCapabilities(capabilitiesArray);

  thingsLog(
    `Eddystone capabilities: <code>${JSON.stringify(capabilities)}</code>`,
    'Eddystone',
    webBluetoothId
  );

  return capabilities;
};

/**
 * Parses dataView for the Eddystone Capabilities.
 * @param {DataView} dataView A DataView of the data received from the device.
 * @returns {Array<boolean | number>} An array of the parsed data.
 */
const parseCapabilities = function (dataView) {
  const capabilitiesArray = new Int8Array(dataView.buffer);

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

  return {
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
};

/**
 * Gets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export const getActiveSlot = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog('Reading Eddystone active slot...', 'Eddystone', webBluetoothId);
  const activeSlot = await readNumber(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ACTIVE_SLOT_CHARACTERISTIC
  );
  thingsLog(
    `Got Eddystone active slot: <code>${activeSlot}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return activeSlot;
};

/**
 * Sets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
export const setActiveSlot = async function (webBluetoothId, slot) {
  const thingsLog = getThingsLog();
  thingsLog(
    `Setting Eddystone active slot to <code>${slot}</code>...`,
    'Eddystone',
    webBluetoothId
  );
  // check if slot is valid
  const capabilities = await getCapabilities(webBluetoothId);
  if (slot < 0 || slot >= capabilities.maxSlots) {
    throwError(
      `Eddystone slot is not valid.
         On this device the slot must be between 0 and ${
           capabilities.maxSlots - 1
         }.`
    );
  }

  await writeWithResponse(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ACTIVE_SLOT_CHARACTERISTIC,
    slot.toString(16)
  );

  thingsLog(
    `Eddystone active slot set to <code>${slot}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return;
};

/**
 * Gets the advertising interval of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const getAdvertisingInterval = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog(
    'Reading Eddystone advertising interval...',
    'Eddystone',
    webBluetoothId
  );
  const interval = await readNumber(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC
  );
  thingsLog(
    `Got Eddystone advertising interval: <code>${interval}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return interval;
};

/**
 * Sets the advertising interval of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} interval The advertising interval to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const setAdvertisingInterval = async function (webBluetoothId, interval) {
  const thingsLog = getThingsLog();
  thingsLog(
    `Setting Eddystone advertising interval to <code>${interval}</code>...`,
    'Eddystone',
    webBluetoothId
  );
  await writeWithResponse(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC,
    interval.toString(16)
  );
  thingsLog(
    `Eddystone advertising interval set to <code>${interval}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return;
};

/**
 * Gets the TX power level of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const getTxPowerLevel = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog('Reading Eddystone TX power level...', 'Eddystone', webBluetoothId);
  const txPowerLevel = await readNumber(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.RADIO_TX_POWER_CHARACTERISTIC
  );
  thingsLog(
    `Got Eddystone TX power level: <code>${txPowerLevel}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return txPowerLevel;
};

/**
 * Sets the TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const setTxPowerLevel = async function (webBluetoothId, txPowerLevel) {
  const thingsLog = getThingsLog();
  thingsLog(
    `Setting Eddystone TX power level to <code>${txPowerLevel}</code>...`,
    'Eddystone',
    webBluetoothId
  );
  // check if txPowerLevel is valid
  const capabilities = await getCapabilities(webBluetoothId);
  if (capabilities.supportedTxPowerLevels.indexOf(txPowerLevel) === -1) {
    throwError(
      `Eddystone TX power level is not valid.
         On this device the TX power level must be one of ${capabilities.supportedTxPowerLevels}.`
    );
    return;
  }

  await writeWithResponse(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.RADIO_TX_POWER_CHARACTERISTIC,
    txPowerLevel.toString(16)
  );
  thingsLog(
    `Eddystone TX power level set to <code>${txPowerLevel}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return;
};

/**
 * Gets the advertised TX power of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const getAdvertisedTxPower = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog(
    'Reading Eddystone advertised TX power...',
    'Eddystone',
    webBluetoothId
  );
  const advertisedTxPower = await readNumber(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC
  );
  thingsLog(
    `Got Eddystone advertised TX power: <code>${advertisedTxPower}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return advertisedTxPower;
};

/**
 * Sets the advertised TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const setAdvertisedTxPower = async function (webBluetoothId, txPowerLevel) {
  const thingsLog = getThingsLog();
  thingsLog(
    `Setting Eddystone advertised TX power to <code>${txPowerLevel}</code>...`,
    'Eddystone',
    webBluetoothId
  );
  await writeWithResponse(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC,
    txPowerLevel.toString(16)
  );
  thingsLog(
    `Eddystone advertised TX power set to <code>${txPowerLevel}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return;
};

/**
 * Gets the lock state of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const getLockState = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog('Reading Eddystone lock state...', 'Eddystone', webBluetoothId);
  const lockState = await readNumber(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.LOCK_STATE_CHARACTERISTIC
  );
  thingsLog(
    `Got Eddystone lock state: <code>${lockState}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return lockState;
};

/**
 * Gets the public ECDH Key of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const getPublicECDHKey = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog(
    'Reading Eddystone public ECDH key...',
    'Eddystone',
    webBluetoothId
  );
  const publicECDHKey = await readHex(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.PUBLIC_ECDH_KEY_CHARACTERISTIC
  );
  thingsLog(
    `Got Eddystone public ECDH key: <code>${publicECDHKey}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return publicECDHKey;
};

/**
 * Gets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
const getAdvertisingData = async function (webBluetoothId) {
  const thingsLog = getThingsLog();
  thingsLog(
    'Reading Eddystone advertising data...',
    'Eddystone',
    webBluetoothId
  );
  const decodeEddystoneUid = function (advData) {
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

  const decodeEddystoneUrl = function (advData) {
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
        throwError('Eddystone URL scheme is not valid.');
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

  const decodeEddystoneTlm = function (advData) {
    // Byte 0 is the frame type, byte 1 is the version.
    // 2nd and 3rd bytes are the Barrery Voltage, 1mV/bit.
    const batteryVoltage = parseInt(advData.substring(4, 8), 16);

    // 4th and 5th bytes are the beacon temperature.
    const beaconTemperature =
      parseInt(advData.substring(8, 10), 16) +
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

  const advertisingData = await readHex(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ADV_SLOT_DATA_CHARACTERISTIC
  );

  thingsLog(
    `Got Eddystone advertising data: <code>${advertisingData}</code>`,
    'Eddystone',
    webBluetoothId
  );

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
      throwError('EID frame type is not supported by blast.');
      return;
    default:
      throwError('Eddystone frame type is not valid.');
      return;
  }
};

/**
 * Sets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} data The data to set.
 */
const setAdvertisingData = async function (webBluetoothId, data) {
  const thingsLog = getThingsLog();
  thingsLog('Set Eddystone advertising data...', 'Eddystone', webBluetoothId);
  const encodeEddystoneUrl = function (url) {
    const URL_SCHEMES = ['http://www.', 'https://www.', 'http://', 'https://'];

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
      throwError('URL is too long.');
      return;
    }

    // prefix the frame type
    encodedUrl.splice(0, 0, 0x10);
    return new Uint8Array(encodedUrl);
  };

  let encodedData;
  let frameType = data.substring(0, 2);

  switch (frameType) {
    case '00':
      frameType = 'UID';
      break;
    case '10':
      frameType = 'URL';
      break;
    case '20':
      throwError('TLM frame type is not writable.');
      return;
    case '30':
      throwError('EID frame type is not writable.');
      return;
    default:
      throwError('Invalid frame type.');
      return;
  }

  if (frameType === 'URL') {
    encodedData = encodeEddystoneUrl(data);
  } else if (frameType === 'UID') {
    // Checks if the UID is 32 hex chars.
    if (!/^[0-9A-Fa-f]{32}$/.test(data)) {
      throwError('Eddystone UID must be 32 hexadecimal characters.');
      return;
    }

    // prefix the frame type
    encodedData = '0x00' + data;
  }

  const response = await writeWithResponse(
    webBluetoothId,
    UUIDS.CONFIG_SERVICE,
    UUIDS.ADV_SLOT_DATA_CHARACTERISTIC,
    encodedData
  );
  thingsLog(
    `Eddystone advertising data set to <code>${data}</code>`,
    'Eddystone',
    webBluetoothId
  );
  return response;
};

/**
 * Reads an Eddystone property from a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The property to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
export const readEddystoneProperty = async function (webBluetoothId, property) {
  // read the property
  let value = null;
  switch (property) {
    case 'advertisedTxPower':
      value = await getAdvertisedTxPower(webBluetoothId);
      break;
    case 'advertisedData':
      value = await getAdvertisingData(webBluetoothId);
      break;
    case 'advertisingInterval':
      value = await getAdvertisingInterval(webBluetoothId);
      break;
    case 'lockState':
      value = await getLockState(webBluetoothId);
      break;
    case 'publicECDHKey':
      value = await getPublicECDHKey(webBluetoothId);
      break;
    case 'radioTxPower':
      value = await getTxPowerLevel(webBluetoothId);
      break;
    default:
      throwError(`Eddystone property ${property} is not impleneted.`);
  }

  return value;
};

/**
 * Writes an Eddystone property to a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {String} property The property to write.
 * @param {String} value The value to write.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
export const writeEddystoneProperty = async function (
  webBluetoothId,
  property,
  value
) {
  switch (property) {
    case 'activeSlot':
      await setActiveSlot(webBluetoothId, value);
      break;
    case 'advertisedTxPower':
      await setAdvertisedTxPower(webBluetoothId, value);
      break;
    case 'advertisementData':
      await setAdvertisingData(webBluetoothId, value);
      break;
    case 'advertisingInterval':
      await setAdvertisingInterval(webBluetoothId, value);
      break;
    case 'radioTxPower':
      await setTxPowerLevel(webBluetoothId, value);
      break;
  }
};
