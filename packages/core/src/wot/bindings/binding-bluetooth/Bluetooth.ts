import {Form} from '@node-wot/td-tools';

export {default as BluetoothClient} from './Bluetooth-client';
export {default as BluetoothClientFactory} from './Bluetooth-client-factory';

export class BluetoothForm extends Form {
  public 'wbt:id': string;
  public 'sbo:methodName': string;
}
