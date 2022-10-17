import {Form} from '@node-wot/td-tools';

export {default as WebBluetoothClientNew} from './webBluetooth-client.js';
export {default as WebBluetoothClientFactoryNew} from './webBluetooth-client-factory.js';

export class WebBluetoothForm extends Form {
  public 'wbt:id': string;
}
