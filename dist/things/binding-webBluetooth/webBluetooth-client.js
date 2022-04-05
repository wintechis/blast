import { Readable } from 'stream';
import { readHex, readNumber, readText, writeWithoutResponse, writeWithResponse, } from '../../blast_webBluetooth.js';
/**
 * @fileoverview WebBluetooth protocol binding for ecluse/thingweb.node-wot
 */
export default class WebBluetoothClient {
    toString() {
        return '[WebBluetoothClient]';
    }
    readResource(form) {
        const path = form.href.split('//')[1];
        const deviceId = form['wbt:id'];
        const deconstructedPath = this.deconstructPath(path);
        const { serviceId, characteristicId, operation } = deconstructedPath;
        return this.read(deviceId, serviceId, characteristicId, operation);
    }
    writeResource(form, content) {
        const path = form.href.split('//')[1];
        const deviceId = form['wbt:id'];
        const deconstructedPath = this.deconstructPath(path);
        const { serviceId, characteristicId, operation } = deconstructedPath;
        return this.write(deviceId, serviceId, characteristicId, operation, content);
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
    deconstructPath(path) {
        // path can either be device/service/characteristic/operation or device/service/operation or device/operation
        let serviceId, characteristicId, operation;
        const pathArray = path.split('/');
        if (pathArray.length === 3) {
            // path is device/service/characteristic?{parameter1, parameter2}
            [serviceId, characteristicId, operation] = pathArray;
            return {
                serviceId,
                characteristicId,
                operation,
            };
        }
        else {
            // path is invalid
            console.warn(`[binding-webBluetooth] invalid path ${path}`);
            throw new Error('href is not valid');
        }
    }
    async read(deviceId, serviceId, characteristicId, operation = 'readText') {
        const readable = new Readable();
        switch (operation) {
            case 'readText':
                readable.push(await readText(deviceId, serviceId, characteristicId));
                break;
            case 'readNumber':
                readable.push(await readNumber(deviceId, serviceId, characteristicId));
                break;
            case 'readHex':
                readable.push(await readHex(deviceId, serviceId, characteristicId));
                break;
            default: {
                throw new Error(`[binding-webBluetooth] unknown return format ${operation}`);
            }
        }
        return {
            type: 'text/plain',
            body: readable,
        };
    }
    async write(deviceId, serviceId, characteristicId, operation, content) {
        const { value } = await this.deconstructContent(content);
        switch (operation) {
            case 'writeWithResponse':
                console.debug('[binding-webBluetooth]', `invoking writeWithResponse with value ${value}`);
                await writeWithResponse(deviceId, serviceId, characteristicId, value);
                break;
            case 'writeWithoutResponse':
                console.debug('[binding-webBluetooth]', `invoking writeWithoutResponse with value ${value}`);
                await writeWithoutResponse(deviceId, serviceId, characteristicId, value);
                break;
            default: {
                throw new Error(`[binding-webBluetooth] unknown operation ${operation}`);
            }
        }
    }
    async deconstructContent(content) {
        const body = content.body;
        const chunks = [];
        for await (const chunk of body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        const str = new TextDecoder().decode(buffer);
        return JSON.parse(str);
    }
}
//# sourceMappingURL=webBluetooth-client.js.map