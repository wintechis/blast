import {WebBluetoothMock, DeviceMock} from 'web-bluetooth-mock';

const devices = [];

export const addDevice = function (device) {
  devices.push(device);
};

let webBluetoothMock = null;

export const getWebBluetoothMock = function () {
  if (webBluetoothMock) {
    return webBluetoothMock;
  }

  webBluetoothMock = new WebBluetoothMock(devices);

  // web-bluetooth-mock doesnt implement getDevices so we need to mock it
  const getDevices = async function () {
    return Promise.resolve(devices);
  };
  global.navigator = global.navigator || {};
  global.navigator.bluetooth = webBluetoothMock;
  global.navigator.bluetooth.getDevices = getDevices;

  return webBluetoothMock;
};
