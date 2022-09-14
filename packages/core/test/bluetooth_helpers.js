import {WebBluetoothMock, DeviceMock} from 'web-bluetooth-mock';

const devices = [];
const eddystoneDevice = new DeviceMock('eddy', [
  'a3c87500-8ed3-4bdf-8a39-a01bebede295',
]);
// web-bluetooth-mock doesnt implement device.id so we need to mock it
eddystoneDevice.id = 'eddy';

export const mockBluetooth = function () {
  const configService = eddystoneDevice.getServiceMock(
    'a3c87500-8ed3-4bdf-8a39-a01bebede295'
  );
  configService.getCharacteristicMock(
    'a3c87501-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(
    new Uint8Array([0, 4, 1, 3, 0, 15, -30, -20, -16, -12, -8, -4, 0, 4]).buffer
  );
  devices.push(eddystoneDevice);

  const webBluetoothMock = new WebBluetoothMock(devices);

  // web-bluetooth-mock doesnt implement getDevices so we need to mock it
  const getDevices = async function () {
    return Promise.resolve(devices);
  };
  global.navigator = global.navigator || {};
  global.navigator.bluetooth = webBluetoothMock;
  global.navigator.bluetooth.getDevices = getDevices;
};
