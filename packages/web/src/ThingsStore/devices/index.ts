import {connectWebHidDevice} from './hidDevices';
import {requestDevice} from './webBluetoothDevices';
import {connectGamepad} from './gamepadDevices';
import {implementedThing} from '../types';

export const connectDevice = async function (thing: implementedThing) {
  switch (thing.type) {
    case 'hid':
      return connectWebHidDevice(thing);
    case 'bluetooth':
      return requestDevice(thing);
    case 'gamepad':
      return connectGamepad(thing);
  }
};
