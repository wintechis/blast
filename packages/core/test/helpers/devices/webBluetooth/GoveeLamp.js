import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from './webBluetoothMock.js';

export const mockGoveeLamp = function (id = 'goveeLamp') {
  const goveeLamp = new DeviceMock(id, [
    '00010203-0405-0607-0809-0a0b0c0d1910'
  ]);
  // web-bluetooth-mock doesnt implement device.id so we need to mock it
  goveeLamp.id = id;

  // Add govee lamp service
  const goveeLampService = goveeLamp.getServiceMock(
    '00010203-0405-0607-0809-0a0b0c0d1910'
  );

  // Add config characteristic
  goveeLampService.getCharacteristicMock(
    '00010203-0405-0607-0809-0a0b0c0d2b11'
  ).value = new DataView(
    new Uint8Array([51, 4, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).buffer
  );

  addDevice(goveeLamp);
};
