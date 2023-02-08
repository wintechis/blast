import {DeviceMock} from 'web-bluetooth-mock';
import {addDevice} from './webBluetoothMock.js';

export const mockBleRgbController = function (id = 'bleRgb') {
  const ledController = new DeviceMock(id, [
    '0000fff0-0000-1000-8000-00805f9b34fb',
  ]);
  // web-bluetooth-mock doesnt implement device.id so we need to mock it
  ledController.id = id;

  // Add led controller service
  const ledService = ledController.getServiceMock(
    '0000fff0-0000-1000-8000-00805f9b34fb'
  );

  // Add led characteristic
  ledService.getCharacteristicMock('0000fff3-0000-1000-8000-00805f9b34fb');

  addDevice(ledController);
};
