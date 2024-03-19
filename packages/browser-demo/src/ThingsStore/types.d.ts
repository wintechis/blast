export type thingType =
  | 'audiooutput'
  | 'bluetooth'
  | 'hid'
  | 'gamepad'
  | 'videoinput'
  | 'consumedDevice';

interface GamepadFilter {
  index?: number;
  id?: string;
  connected?: boolean;
  mapping?: string;
  timestamp?: number;
  axes?: number[];
  buttons?: {length: number};
}

export interface implementedThing {
  id: string;
  name: string;
  type: thingType;
  blocks: {type: string; category: string; XML?: string}[];
  filters?: BluetoothLEScanFilter[] | HIDDeviceFilter[] | GamepadFilter[];
  optionalServices?: string[];
  infoUrl?: string;
  connected?: boolean;
}

interface HIDAdapter extends HID {
  requestDeviceAndAddId: (
    options: HIDDeviceRequestOptions
  ) => Promise<HIDAdapterDevice[]>;
}

export interface HIDAdapterDevice extends HIDDevice {
  id: string;
}
