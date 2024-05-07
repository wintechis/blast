import {Form} from '@node-wot/td-tools';

export {default as HidClient} from './Hid-client.js';
export {default as HidClientFactory} from './Hid-client-factory.js';

export class HidForm extends Form {
  public 'hid:path': string;
  public 'hid:reportId'?: number;
  public 'hid:reportLength'?: number;
  public 'hid:data'?: number[];
  public 'hid:valueIndex'?: number;
}
