import {connectWebHidDevice} from './hidDevices';
import {requestDevice} from './webBluetoothDevices';
import {connectGamepad} from './gamepadDevices';
import {implementedThing} from '../types';
import {connectConsumedDevice} from './consumedDevices';

export const connectDevice = async function (thing: implementedThing) {
  switch (thing.type) {
    case 'hid':
      return connectWebHidDevice(thing);
    case 'bluetooth':
      return requestDevice(thing);
    case 'gamepad':
      return connectGamepad(thing);
    case 'consumedDevice':
      return connectConsumedDevice(thing);
  }
};
