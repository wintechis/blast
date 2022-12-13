import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from '../webBluetoothMock.js';

export const mockEddystoneDevice = function (id = 'eddy') {
  const eddystoneDevice = new DeviceMock(id, [
    'a3c87500-8ed3-4bdf-8a39-a01bebede295',
  ]);
  // web-bluetooth-mock doesnt implement device.id so we need to mock it
  eddystoneDevice.id = 'eddy';

  // Add eddystone service
  const configService = eddystoneDevice.getServiceMock(
    'a3c87500-8ed3-4bdf-8a39-a01bebede295'
  );
  // Add eddystone capabilities characteristic
  configService.getCharacteristicMock(
    'a3c87501-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(
    new Uint8Array([0, 4, 1, 3, 0, 15, -30, -20, -16, -12, -8, -4, 0, 4]).buffer
  );
  addDevice(eddystoneDevice);
};
