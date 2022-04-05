import WebHidClient from './webHid-client.js';
export default class WebBluetoothClientFactory {
    constructor() {
        this.scheme = 'hid';
        this.init = () => true;
        this.destroy = () => true;
    }
    getClient() {
        console.debug('[binding-webHid]', `WebHidClientFactory creating client for ${this.scheme}`);
        return new WebHidClient();
    }
}
//# sourceMappingURL=webHid-client-factory.js.map