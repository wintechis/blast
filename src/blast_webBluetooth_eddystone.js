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
Blast.Bluetooth.Eddystone.getActiveSlot = async function(webBluetoothId) {
  const activeSlot = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ACTIVE_SLOT_CHARACTERISTIC,
  );
  return activeSlot;
};

/**
 * Sets the active slot of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.setActiveSlot = async function(webBluetoothId, slot) {
  // check if slot is valid
  const capabilities = await Blast.Bluetooth.Eddystone.getCapabilities(webBluetoothId);
  if (slot < 0 || slot >= capabilities.maxSlots) {
    Blast.throwError(
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
  return;
};

/**
 * Gets the advertising interval of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.getAdvertisingInterval = async function(webBluetoothId) {
  const interval = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC,
  );
  return interval;
};

/**
 * Sets the advertising interval of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} interval The advertising interval to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.setAdvertisingInterval = async function(webBluetoothId, interval) {
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISING_INTERVAL_CHARACTERISTIC,
      interval.toString(16),
  );
  return;
};

/**
 * Gets the TX power level of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.getTxPowerLevel = async function(webBluetoothId) {
  const txPowerLevel = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.RADIO_TX_POWER_CHARACTERISTIC,
  );
  return txPowerLevel;
};

/**
 * Sets the TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.setTxPowerLevel = async function(webBluetoothId, txPowerLevel) {
  // check if txPowerLevel is valid
  const capabilities = await Blast.Bluetooth.Eddystone.getCapabilities(webBluetoothId);
  if (capabilities.supportedTxPowerLevels.indexOf(txPowerLevel) === -1) {
    Blast.throwError(
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
  return;
};

/**
 * Gets the advertised TX power of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.getAdvertisedTxPower = async function(webBluetoothId) {
  const advertisedTxPower = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC,
  );
  return advertisedTxPower;
};

/**
 * Sets the advertised TX power level of currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} txPowerLevel The TX power level to set.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.setAdvertisedTxPower = async function(webBluetoothId, txPowerLevel) {
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADVERTISED_TX_POWER_CHARACTERISTIC,
      txPowerLevel.toString(16),
  );
  return;
};

/**
 * Gets the lock state of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.getLockState = async function(webBluetoothId) {
  const lockState = await Blast.Bluetooth.gatt_read_number(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.LOCK_STATE_CHARACTERISTIC,
  );
  return lockState;
};

/**
 * Gets the public ECDH Key of the Eddystone configuration service.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.getPublicECDHKey = async function(webBluetoothId) {
  const publicECDHKey = await Blast.Bluetooth.gatt_read_hex(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.PUBLIC_ECDH_KEY_CHARACTERISTIC,
  );
  return publicECDHKey;
};

/**
 * Gets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @return {!Promise} A promise that resolves when the operation is complete.
 */
Blast.Bluetooth.Eddystone.getAdvertisingData = async function(webBluetoothId) {
  const decodeEddystoneUrl = function(data) {
    // TX Power is the second byte of the advertising data.
    const txPower = parseInt(data.substring(2, 4));

    // URL Scheme is the third byte of the advertising data.
    const urlScheme = data.substring(4, 6);
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
        Blast.throwError('Eddystone URL scheme is not valid.');
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
    const encodedUrl = data.substring(6, data.length);
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

  const advertisingData = await Blast.Bluetooth.gatt_read_hex(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADV_SLOT_DATA_CHARACTERISTIC,
  );

  // Frame type is the first byte of the advertising data.
  const frameType = advertisingData.substring(0, 2);

  if (frameType !== '10') {
    Blast.throwError('Currently Blast only supports the Eddystone URL frame type.');
    return;
  }

  return decodeEddystoneUrl(advertisingData).url;
};

/**
 * Sets the advertising data of the currently active slot.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {string} url The URL to set.
 */
Blast.Bluetooth.Eddystone.setAdvertisingData = async function(
    webBluetoothId, url) {
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
      Blast.throwError('URL is too long.');
      return;
    }
    
    // prefix the frame type
    encodedUrl.splice(0, 0, 0x10);
    return new Uint8Array(encodedUrl);
  };
    
  const encodedUrl = encodeEddystoneUrl(url);
    
  await Blast.Bluetooth.gatt_writeWithResponse(
      webBluetoothId,
      Blast.Bluetooth.Eddystone.UUIDS.CONFIG_SERVICE,
      Blast.Bluetooth.Eddystone.UUIDS.ADV_SLOT_DATA_CHARACTERISTIC,
      encodedUrl,
  );
};
