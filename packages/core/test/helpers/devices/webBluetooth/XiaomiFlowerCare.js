import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from './webBluetoothMock.js';

export const mockXiaomiFlowerCare = function (id = 'xiaomiFlower') {
  const xiaomiFlowerCare = new DeviceMock(id, [
    '00001204-0000-1000-8000-00805f9b34fb',
  ]);
  // web-bluetooth-mock doesnt implement device.id so we need to mock it
  xiaomiFlowerCare.id = id;

  // Add xiaomi flower care service
  const flowerCareService = xiaomiFlowerCare.getServiceMock(
    '00001204-0000-1000-8000-00805f9b34fb'
  );

  // Add valueString characteristic
  flowerCareService.getCharacteristicMock(
    '00001a01-0000-1000-8000-00805f9b34fb'
  ).value = new DataView(
    new Uint8Array([234, 0, 0, 171, 0, 0, 0, 21, 178, 0]).buffer
  );

  // Add readMode characteristic
  flowerCareService.getCharacteristicMock(
    '00001a00-0000-1000-8000-00805f9b34fb'
  );

  addDevice(xiaomiFlowerCare);
};
