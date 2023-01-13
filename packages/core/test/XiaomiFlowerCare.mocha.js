import chai from 'chai';
import sinon from 'sinon';
import {XiaomiFlowerCare as td} from '../dist/blast.tds.js';
import {createThing} from '../dist/blast.web.js';
import {getWebBluetoothMock} from './helpers/devices/webBluetooth/webBluetoothMock.js';
import {mockXiaomiFlowerCare} from './helpers/devices/webBluetooth/XiaomiFlowerCare.js';

const {assert, expect} = chai;

describe('Xiaomi FlowerCare', async () => {
  let thing = null;

  before(async () => {
    getWebBluetoothMock();
    mockXiaomiFlowerCare();
    thing = await createThing(td, 'xiaomiFlower');
    sinon.stub(console, 'warn');
  });

  after(async () => {
    console.warn.restore();
  });

  describe('valueString property', async () => {
    it('should be readable', async () => {
      let valueString = await thing.readProperty('valueString');
      valueString = await valueString.value();
      assert.deepEqual(valueString, [23.4, 171, 21, 178]);
    });

    it('should not be writeable', async () => {
      return thing
        .writeProperty('valueString', [1, 2, 3, 4])
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('readMode action', async () => {
    it('should be callable', async () => {
      return thing
        .invokeAction('readMode', 'A01F')
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it('should throw on invalid mode', async () => {
      return thing
        .invokeAction('readMode', 'A01G')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should throw on invalid mode', async () => {
      return thing
        .invokeAction('readMode', 'A01E')
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });
});
