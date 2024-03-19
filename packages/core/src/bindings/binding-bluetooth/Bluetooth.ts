import {Form} from '@node-wot/td-tools';

export {default as BluetoothClient} from './gatt-client';
export {default as GattClientFactory} from './gatt-client-factory';
export {default as GapClientFactory} from './gap-client-factory';

export class BluetoothForm extends Form {
  public 'wbt:id'?: string;
  public 'sbo:methodName': string;
}
