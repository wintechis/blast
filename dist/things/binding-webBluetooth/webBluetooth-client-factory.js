import WebBluetoothClient from './webBluetooth-client.js';
export default class WebBluetoothClientFactory {
    constructor() {
        this.scheme = 'bluetooth';
        this.init = () => true;
        this.destroy = () => true;
    }
    getClient() {
        console.debug('[binding-webBluetooth]', `WebBluetoothClientFactory creating client for ${this.scheme}`);
        return new WebBluetoothClient();
    }
}
//# sourceMappingURL=webBluetooth-client-factory.js.map