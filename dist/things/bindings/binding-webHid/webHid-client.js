/**
 * @fileoverview WebBluetooth protocol binding for eclipse/thingweb.node-wot
 */
import { getWebHidDevice } from './../../../blast_things.js';
import { decodeReadableStream } from './../binding-helpers.js';
export default class WebHidClient {
    toString() {
        return '[WebHidClient]';
    }
    readResource(form) {
        throw new Error('not implemented');
    }
    writeResource(form, content) {
        const method = form.href.split('//')[1];
        const deviceId = form['wHid:id'];
        switch (method) {
            case 'sendReport':
                return this.sendReport(deviceId, content);
            case 'sendFeatureReport':
                return this.sendFeatureReport(deviceId, content);
            default:
                throw new Error(`[binding-webHid] Invalid href: ${form.href}`);
        }
    }
    invokeResource(form, content) {
        throw new Error('not implemented');
    }
    unlinkResource(form) {
        throw new Error('not implemented');
    }
    subscribeResource(form, next, error, complete) {
        throw new Error('not implemented');
    }
    async start() {
        // do nothing
    }
    async stop() {
        // do nothing
    }
    setSecurity(metadata, credentials) {
        return false;
    }
    async sendReport(deviceId, content) {
        const device = getWebHidDevice(deviceId);
        if (!device.opened) {
            await device.open();
        }
        const { reportId, report } = await decodeReadableStream(content.body);
        console.debug(`[binding-webHid] invoking sendReport, with reportId: ${reportId} and report: ${report}`);
        await device.sendReport(reportId, report);
    }
    async sendFeatureReport(deviceId, content) {
        const device = getWebHidDevice(deviceId);
        if (!device.opened) {
            await device.open();
        }
        const { reportId, report } = await decodeReadableStream(content.body);
        const data = Int8Array.from(report);
        console.log(data);
        console.debug(`[binding-webHid] invoking sendFeatureReport, with reportId: ${reportId} and report: ${report}`);
        await device.sendFeatureReport(reportId, Int8Array.from(data));
    }
}
//# sourceMappingURL=webHid-client.js.map