import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from './webBluetoothMock.js';

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
  // Add Active Slot characteristic
  configService.getCharacteristicMock(
    'a3c87502-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(new Uint8Array([0]).buffer);
  // Add Advertising Interval characteristic
  configService.getCharacteristicMock(
    'a3c87503-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(new Uint8Array([0, 100]).buffer);
  // Add Radio Tx Power characteristic
  configService.getCharacteristicMock(
    'a3c87504-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(new Int8Array([-4]).buffer);
  // Add (Advanced) Advertised Tx Power characteristic
  configService.getCharacteristicMock(
    'a3c87505-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(new Int8Array([-20]).buffer);
  // Add Lock State characteristic
  configService.getCharacteristicMock(
    'a3c87506-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(new Uint8Array([2]).buffer);
  // Add Public ECDH Key characteristic
  configService.getCharacteristicMock(
    'a3c87508-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).buffer
  );
  // Add ADV Slot Data
  configService.getCharacteristicMock(
    'a3c8750a-8ed3-4bdf-8a39-a01bebede295'
  ).value = new DataView(
    new Uint8Array([16, 16, 2, 101, 120, 97, 109, 112, 108, 101, 7]).buffer
  );

  addDevice(eddystoneDevice);
};
