import {Form} from '@node-wot/td-tools';

export {default as WebHidClient} from './webHid-client.js';
export {default as WebHidClientFactory} from './webHid-client-factory.js';

export class webHidForm extends Form {
  public 'wHid:id': string;
  public 'wHid:reportId': number;
}
