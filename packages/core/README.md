# BLAST core
`@blast/core` is a library enabling usage of Web of Things ([WoT](https://www.w3.org/TR/wot-architecture/)) Thing Descriptions ([TDs](https://www.w3.org/2019/wot/td)) for Bluetooth devices in [Node.js](https://nodejs.org/).

[Building](#install--build) this library produces 3 files inside the `dist` directory:
  * `blast.tds.js` contains pre-defined [Thing Descriptions](https://www.w3.org/2019/wot/td) of Bluetooth devices
  * `blast.node.js` enables [WoT interactions](https://www.w3.org/TR/wot-architecture/#sec-interaction-model) for Bluetooth devices in [Node.js](https://nodejs.org/), by extending [@node-wot/core](https://github.com/eclipse/thingweb.node-wot) with [node-ble](https://github.com/chrvadala/node-ble).
  * `blast.browser.js` enables [WoT interactions](https://www.w3.org/TR/wot-architecture/#sec-interaction-model) for Bluetooth devices in the web, by extending [@node-wot/core](https://github.com/eclipse/thingweb.node-wot) with [Web Bluetooth](https://webbluetoothcg.github.io/web-bluetooth/).

## Install & build
To install and build `@blast/core`, open a terminal and execute the following commands from withing this directory.
  1. install the dependencies `yarn install`
  2. run the build script `yarn build`

Alternatively you could run `yarn build:tds`, `yarn build:node`, or `yarn build:browser` to only build the respective file.

> :warning: You might have to set yarn version using `yarn set version berry` before installing

## Usage
This section describes using the pre-defined [TDs](https://www.w3.org/2019/wot/td) (of `dist/blast.tds.cjs`) with [Node.js](https://nodejs.org/) using `dist/blast.node.cjs`. For an example on how to use `blast.browser.js` see [`packages/web/`](../web/). If you don't have a `dist` folder make sure to [install & build](#install--build) first.

### Example
```JavaScript
import {createThing} from './dist/blast.node.cjs';
import {BleRgbController} from './dist/blast.tds.cjs';

const mac = 'BE5860018744';

const thing = await createThing(BleRgbController, mac);

await thing.writeProperty('colour', {R: 255, G: 0, B: 0});
```

### API
#### createThing
##### Syntax
```JavaScript
await createThing(td, id)
```

##### Definition
Creates a [`consumedThing`](https://www.w3.org/TR/wot-scripting-api/#dom-consumedthing) from the provided **Thing description** and **id**

##### Parameters
| Parameter | Description |
| --- | ---|
| td | Thing description of the thing to expose |
| id | The things identifier, as a string containing its mac address or the [`BluetoothDevice.id`](https://webbluetoothcg.github.io/web-bluetooth/#dom-bluetoothdevice-id)

##### Import

```JavaScript
import {createThing} from 'blast.node.js'`
```

#### EddystoneHelpers
Object containg helper methods for interacting with [Eddystone](https://github.com/google/eddystone) devices.

##### Import
```JavaScript
import {EddystoneHelpers} from 'blast.node.js'`
```

##### Properties
| Identifier | Description |
| --- | --- |
|`EDDYSTONE_CONFIG_SERVICE` | The [`BluetoothServiceUUID`](https://webbluetoothcg.github.io/web-bluetooth/#typedefdef-bluetoothserviceuuid) of the [Eddystone Configuration GATT Service]([Eddystone Configuration GATT Service](https://github.com/google/eddystone/tree/master/configuration-service)) |
|`EDDYSTONE_CHARACTERISTICS` | Maps [`BluetoothCharacteristicUUID`](https://webbluetoothcg.github.io/web-bluetooth/#typedefdef-bluetoothcharacteristicuuid)s to their respective Characteristic
| `parseCapabilities` | Parses the response of a `readProperty` operation on the capabilities property and returns an object with human-readable values. e.g `parseCapabilities(00040103000fe2ecf0f4f8fc0004)` returns <pre>{<br>&nbsp;&nbsp;specVersion: 0,<br>&nbsp;&nbsp;maxSlots: 4,<br>&nbsp;&nbsp;maxEidPerSlot: 1,<br>&nbsp;&nbsp;isVarriableAdvIntervalSupported: true,<br>&nbsp;&nbsp;isVariableTxPowerSupported: true,<br>&nbsp;&nbsp;isUidSupported: true,<br>&nbsp;&nbsp;isUrlSupported: true,<br>&nbsp;&nbsp;isTlmSupported: true,<br>&nbsp;&nbsp;isEidSupported: true,<br>&nbsp;&nbsp;supportedTxPowerLevels: [<br>&nbsp;&nbsp;&nbsp;&nbsp;-30, -20, -16, -12,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-8,&nbsp; -4,&nbsp;&nbsp; 0, &nbsp;&nbsp;4<br>&nbsp;&nbsp;]<br>}</pre> |
| decodeAdvertisingData | Decodes the response of a `readProperty` operation on the `AdvertisingData` property and returns a human-readable string.
| encodeAdvertisingData | Encodes a string using the [Eddystone protocol specification](https://github.com/google/eddystone/blob/master/protocol-specification.md) for writing it to the `AdvertisingData` property.

#### BluetoothWrapper
Wrapper for communicating with Bluetooth devices via [node-ble](https://github.com/chrvadala/node-ble) and [webBluetooth](https://github.com/WebBluetoothCG/web-bluetooth#web-bluetooth.

The Wrapper provides a `getCharacteristic` method returning a [`BluetoothRemoveGattCharacteristic`](https://webbluetoothcg.github.io/web-bluetooth/#bluetoothgattcharacteristic-interface), which can be used to interact with the device via for example `readValue`, `writeValue`, `startNotifications`, `stopNotifications`, etc. See [here](https://webbluetoothcg.github.io/web-bluetooth/#bluetoothgattcharacteristic-interface) for the interface description.

##### Import
```JavaScript
import {BluetoothWrapper} from 'blast.node.js'`
```

##### Interface
```Typescript
public async getCharacteristic(
  deviceId: string,
  serviceId: BluetoothServiceUUID,
  characteristicId: BluetoothCharacteristicUUID
): Promise<BluetoothRemoteGATTCharacteristic>
```
