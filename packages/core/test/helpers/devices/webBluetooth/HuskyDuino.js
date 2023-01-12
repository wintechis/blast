import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from './webBluetoothMock.js';

// HuskyDuino specifications can be found at
// https://github.com/wintechis/huskyduino

export const mockHuskyDuino = function (id = 'husky') {
  const huskyDuino = new DeviceMock(id, [
    '5be35d20-f9b0-11eb-9a03-0242ac130003',
  ]);
  // web-bluetooth-mock doesnt implement device.id so we need to mock it
  huskyDuino.id = id;

  // Add huskyDuino service
  const huskyDuinoService = huskyDuino.getServiceMock(
    '5be35d20-f9b0-11eb-9a03-0242ac130003'
  );

  // Add algorithm characteristic
  huskyDuinoService.getCharacteristicMock(
    '5be35d26-f9b0-11eb-9a03-0242ac130003'
  ).value = new DataView(new Uint8Array([1]).buffer);

  // Add readIDandLocation characteristic
  huskyDuinoService.getCharacteristicMock(
    '5be3628a-f9b0-11eb-9a03-0242ac130003'
  ).value = new DataView(new TextEncoder().encode('1').buffer);

  // Add forgetIDs charaacteristic
  huskyDuinoService.getCharacteristicMock(
    '5be361b8-f9b0-11eb-9a03-0242ac130003'
  ).value = new DataView(new Uint8Array([0]).buffer);

  // Add writeID characteristic
  huskyDuinoService.getCharacteristicMock(
    '5be35eca-f9b0-11eb-9a03-0242ac130003'
  ).value = new DataView(new Uint8Array([0]).buffer);

  addDevice(huskyDuino);
};
