import chai from 'chai';
import sinon from 'sinon';
import {HuskyDuino as td} from '../dist/blast.tds.js';
import {createThing} from '../dist/blast.web.js';
import {getWebBluetoothMock} from './helpers/devices/webBluetooth/webBluetoothMock.js';
import {mockHuskyDuino} from './helpers/devices/webBluetooth/HuskyDuino.js';

const {assert, expect} = chai;

describe('HuskyDuino', async () => {
  let thing = null;

  before(async () => {
    getWebBluetoothMock();
    mockHuskyDuino();
    thing = await createThing(td, 'husky');
    sinon.stub(console, 'warn');
  });

  after(async () => {
    console.warn.restore();
  });

  describe('algorithm property', async () => {
    it('should be readable', async () => {
      let algorithm = await thing.readProperty('algorithm');
      algorithm = await algorithm.value();
      assert.equal(algorithm, 1);
    });

    it('should be writable', async () => {
      await thing.writeProperty('algorithm', 2);
      let algorithm = await thing.readProperty('algorithm');
      algorithm = await algorithm.value();
      assert.equal(algorithm, 2);
    });

    it('throws on writing values smaller than 1', async () => {
      return thing
        .writeProperty('algorithm', 0)
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('throws on writing values larger than 7', async () => {
      return thing
        .writeProperty('algorithm', 8)
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('id property', async () => {
    it('should be readable', async () => {
      let id = await thing.readProperty('id');
      id = await id.value();
      assert.equal(id, '1');
    });

    it('should not be writable', async () => {
      return thing
        .writeProperty('id', '2')
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('location property', async () => {
    it('should be readable', async () => {
      let location = await thing.readProperty('location');
      location = await location.value();
      assert.equal(location, 1);
    });

    it('should not be writable', async () => {
      return thing
        .writeProperty('location', 2)
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('forgetAll action', async () => {
    it('should be callable', async () => {
      return thing
        .invokeAction('forgetAll', 'true')
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it("throws on values other than 'true'", async () => {
      return thing
        .invokeAction('forgetAll', 'false')
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('learn action', async () => {
    it('should be callable', async () => {
      return thing
        .invokeAction('learn', 3)
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it('throws on values larger than 255', async () => {
      return thing
        .invokeAction('learn', 256)
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });
});
