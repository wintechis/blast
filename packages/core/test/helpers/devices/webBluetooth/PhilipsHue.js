import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from './webBluetoothMock.js';

export const mockPhilipsHue = function (id = 'phil') {
  const philipsHue = new DeviceMock(id, [
    '932c32bd-0000-47a2-835a-a8d455b859dd',
  ]);
  // web-bluetooth-mock doesnt implement device.id so we need to mock it
  philipsHue.id = id;

  // Add philips hue service
  const hueService = philipsHue.getServiceMock(
    '932c32bd-0000-47a2-835a-a8d455b859dd'
  );

  // Add power characteristic
  hueService.getCharacteristicMock(
    '932c32bd-0002-47a2-835a-a8d455b859dd'
  ).value = new DataView(new Uint8Array([1]).buffer);

  // Add brightness characteristic
  hueService.getCharacteristicMock(
    '932c32bd-0003-47a2-835a-a8d455b859dd'
  ).value = new DataView(new Uint8Array([255]).buffer);

  // Add colour characteristic
  hueService.getCharacteristicMock(
    '932c32bd-0005-47a2-835a-a8d455b859dd'
  ).value = new DataView(new Uint8Array([1, 254, 1, 1]).buffer);

  addDevice(philipsHue);
};
