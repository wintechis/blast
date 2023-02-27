import {Device} from 'node-hid';

export interface HidAdapter {
  getDevices(): Promise<Device[]>;
}
