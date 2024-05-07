import {Form} from '@node-wot/td-tools';

export {default as BluetoothClient} from './gatt-client.js';
export {default as GattClientFactory} from './gatt-client-factory.js';
export {default as GapClientFactory} from './gap-client-factory.js';

export class BluetoothForm extends Form {
  public 'wbt:id'?: string;
  public 'sbo:methodName': string;
}
