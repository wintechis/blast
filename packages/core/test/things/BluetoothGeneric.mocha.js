/* eslint-disable node/no-unpublished-import */
import Blockly from 'blockly';
import chai from 'chai';
import BluetoothGeneric from '../../dist/things/BluetoothGeneric.js';
import sinon from 'sinon';

import '../../dist/thingBlocks/bluetooth/blocks.js';
import '../../dist/thingBlocks/bluetooth/generators.js';
import '../../dist/blocks/numbers.js';
import '../../dist/generators/numbers.js';

const {expect} = chai;

suite('Bluetooth Generic', function () {
  this.thing = null;

  suiteSetup(async () => {
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.workspace = new Blockly.Workspace();
    this.thing = await new BluetoothGeneric().init('deadbeef');
  });

  teardown(function () {
    this.thing = null;
  });

  test('Thing description', async function () {
    const actualTd = await this.thing.getThingDescription();
    const expectedTd = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        {
          '@language': 'en',
        },
      ],
      '@type': ['Thing'],
      id: 'blast:bluetooth:BluetoothGeneric',
      title: 'Genereic Bluetooth device',
      description: 'A generic Bluetooth device',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: ['nosec_sc'],
      actions: {},
      events: {},
      links: [],
      observedProperties: {},
      subscribedEvents: {},
      properties: {
        barometricPressureTrend: {
          description: 'The barometric pressure trend in hPa.',
          forms: [
            {
              href: 'gatt://00001802-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Barometric pressure trend',
          type: 'number',
          unit: 'hPa',
          writeOnly: false,
        },
        batteryLevel: {
          description: 'Battery level in %.',
          forms: [
            {
              href: 'gatt://0000180f-0000-1000-8000-00805f9b34fb/00002a19-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Battery level',
          type: 'number',
          unit: '%',
          writeOnly: false,
        },
        deviceName: {
          description: 'User defined name of the device',
          forms: [
            {
              href: 'gatt://00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb/writeWithoutResponse',
              op: 'writeproperty',
              'wbt:id': 'deadbeef',
            },
            {
              href: 'gatt://00001800-0000-1000-8000-00805f9b34fb/00002a00-0000-1000-8000-00805f9b34fb/readText',
              op: 'readproperty',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: false,
          title: 'Device name',
          type: 'string',
          writeOnly: false,
        },
        elevation: {
          description: 'The elevation measured by the device.',
          forms: [
            {
              href: 'gatt://00001803-0000-1000-8000-00805f9b34fb/00002a6c-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Elevation',
          type: 'number',
          writeOnly: false,
        },
        firmwareRevision: {
          description: "Revision of the device's firmware",
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a26-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Firmware revision',
          type: 'string',
          writeOnly: false,
        },
        hardwareRevision: {
          description: "Revision of the device's hardware",
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a27-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Hardware revision',
          type: 'string',
          writeOnly: false,
        },
        humidity: {
          description: 'The relative humidity in %',
          forms: [
            {
              href: 'gatt://00001803-0000-1000-8000-00805f9b34fb/00002a6f-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Humidity',
          type: 'number',
          unit: '%',
          writeOnly: false,
        },
        intermediateTemperature: {
          description: 'The intermediate temperature measured by the device.',
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a1e-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Intermediate temperature',
          type: 'number',
          writeOnly: false,
        },
        irradiance: {
          description: 'Irradiance measured by the device.',
          forms: [
            {
              href: 'gatt://00001803-0000-1000-8000-00805f9b34fb/00002a77-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Irradiance',
          type: 'number',
          writeOnly: false,
        },
        manufacturerName: {
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a29-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Manufacturer name',
          type: 'string',
          writeOnly: false,
        },
        modelNumber: {
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a24-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Model number',
          type: 'number',
          writeOnly: false,
        },
        movementCounter: {
          description:
            'A counter incremented everytime the device starts moving.',
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a56-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Movement counter',
          type: 'number',
          writeOnly: false,
        },
        pressure: {
          description: 'Barometric pressure in hPa',
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a6d-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Pressure',
          type: 'number',
          unit: 'hPa',
          writeOnly: false,
        },
        serialNumber: {
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a25-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Serial number',
          type: 'string',
          writeOnly: false,
        },
        softwareRevision: {
          description: "Revision of the device's software",
          forms: [
            {
              href: 'gatt://0000180a-0000-1000-8000-00805f9b34fb/00002a28-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Software revision',
          type: 'string',
          writeOnly: false,
        },
        temperature: {
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a6e-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Temperature',
          type: 'number',
          writeOnly: false,
        },
        temperatureMeasurement: {
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a1c-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Temperature measurement',
          type: 'number',
          writeOnly: false,
        },
        temperatureType: {
          forms: [
            {
              href: 'gatt://00001809-0000-1000-8000-00805f9b34fb/00002a1d-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Temperature type',
          type: 'string',
          writeOnly: false,
        },
        txPowerLevel: {
          forms: [
            {
              href: 'gatt://00001804-0000-1000-8000-00805f9b34fb/00002a07-0000-1000-8000-00805f9b34fb/readText',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          title: 'Tx Power Level',
          type: 'number',
          writeOnly: false,
        },
        weight: {
          title: 'Weight',
          type: 'number',
          forms: [
            {
              href: 'gatt://00001808-0000-1000-8000-00805f9b34fb/00002a9d-0000-1000-8000-00805f9b34fb/readNumber',
              'wbt:id': 'deadbeef',
            },
          ],
          observable: false,
          readOnly: true,
          writeOnly: false,
        },
      },
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });
});
