/**
 * @fileoverview implements Bluetooth-Operations of the
 * sc-ble-adapter (github.com/wintechis/sc-ble-adapter) in
 * JavaScript for use with Blast.
 * TODO change to prototype methods from bluetooth.js
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
  * Bluetooth API namespace.
  * @name Blast.Bluetooth
  * @namespace
  * @public
  */
Blast.Bluetooth = {};

Blast.Bluetooth.identifiers = 'handle';

/**
 * Common headers for communicating with the sc-ble-adapter.
*/
Blast.Bluetooth.headers = new Headers({
  'Content-Type': 'application/json',
});

/**
 * Sends a connect command,
 * afterwards wait for sleep miliseconds.
 * @param {string} mac mac address for the host to connect to.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.connect = async function(mac, sleep = 1000) {
  const data = {
    type: 'ble:Connect',
  };
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/instruction`, {
    method: 'PUT',
    headers: Blast.Bluetooth.headers,
    body: JSON.stringify(data),
  });
  response = Blast.handleFetchErrors(
      response,
      `Error connecting to ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};

/**
 * Sends a disconnect command,
 * afterwards wait for sleep miliseconds.
 * @param {string} mac mac address for the host to disconnect from.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.disconnect = async function(mac, sleep = 1000) {
  const data = {
    type: 'ble:Disconnect',
  };
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/instruction`, {
    method: 'PUT',
    headers: Blast.Bluetooth.headers,
    body: JSON.stringify(data),
  });
  response = Blast.handleFetchErrors(
      response,
      `Error disconnecting from ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};

/**
 * Writes data from Bluetooth device using the gatt protocol.
 * @param {string} mac mac address of the device.
 * @param {string} handle characteristic handle.
 * @param {string} type datatype of value to write.
 * @param {string} value value to write.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.gatt_writeWithoutResponse = async function(mac, handle, type, value, sleep = 0) {
  const data = {
    type: 'ble:Write',
    handle: handle,
    data: {
      '@value': value,
      '@type': type,
    },
  };
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/gatt/instruction`, {
    method: 'PUT',
    headers: Blast.Bluetooth.headers,
    body: JSON.stringify(data),
  });
  response = Blast.handleFetchErrors(
      response,
      `Error executing gatt-write on ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};

/**
 * Reads data from Bluetooth device using the gatt protocol.
 * @param {string} mac mac address of the device.
 * @param {string} handle characteristic handle.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.gatt_read = async function(mac, handle, sleep = 0) {
  const data = {
    type: 'ble:Read',
    handle: handle,
  };
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/gatt/instruction`, {
    method: 'PUT',
    headers: Blast.Bluetooth.headers,
    body: JSON.stringify(data),
  });
  response = Blast.handleFetchErrors(
      response,
      `Error executing gatt-read on ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};

/**
 * Subscribes to characteristic of Bluetooth device using the gatt protocol.
 * @param {string} mac mac address of the device.
 * @param {string} handle characteristic handle.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.gatt_subscribe = async function(mac, handle, sleep = 0) {
  const data = {
    type: 'ble:Subscribe',
    handle: handle,
  };
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/gatt/instruction`, {
    method: 'PUT',
    headers: Blast.Bluetooth.headers,
    body: JSON.stringify(data),
  });
  response = Blast.handleFetchErrors(
      response,
      `Error executing gatt-subscribe on ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};

/**
 * Unsubscribes from characteristic of Bluetooth device using the gatt protocol.
 * @param {string} mac mac address of the device.
 * @param {string} handle characteristic handle.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.gatt_unsubscribe = async function(mac, handle, sleep = 0) {
  const data = {
    type: 'ble:UnSubscribe',
    handle: handle,
  };
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/gatt/instruction`, {
    method: 'PUT',
    headers: Blast.Bluetooth.headers,
    body: JSON.stringify(data),
  });
  response = Blast.handleFetchErrors(
      response,
      `Error executing gatt-unsubscribe on ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};

/**
 * Reads current value of a subscribed handle.
 * @param {string} mac mac address of the device.
 * @param {number} sleep time in ms to wait after command, defaults to 0.
 * @return {Object} representation of the complete request with response.
 */
Blast.Bluetooth.gatt_get_current = async function(mac, sleep = 0) {
  let response = await fetch(`${Blast.config.hostAddress}devices/${mac}/gatt/current`, {
    method: 'GET',
    headers: Blast.Bluetooth.headers,
  });
  response = Blast.handleFetchErrors(
      response,
      `Error executing gatt-get-current on ${mac}, see console for details.`,
  );

  await new Promise((resolve) => setTimeout(resolve, sleep));
  return response;
};
