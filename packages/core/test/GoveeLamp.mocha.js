import chai from 'chai';
import sinon from 'sinon';
import {GoveeLamp as td} from '../dist/blast.tds.js';
import {createThing} from '../dist/blast.web.js';
import {getWebBluetoothMock} from './helpers/devices/webBluetooth/webBluetoothMock.js';
import {mockGoveeLamp} from './helpers/devices/webBluetooth/GoveeLamp.js';

const {assert, expect} = chai;

describe('GoveeLamp', async () => {
  let thing = null;

  before(async () => {
    getWebBluetoothMock();
    mockGoveeLamp();
    thing = await createThing(td, 'goveeLamp');
    sinon.stub(console, 'warn');
  });

  after(async () => {
    console.warn.restore();
  });

  describe('power property', async () => {
    it('should not be readable', async () => {
      return thing
        .readProperty('power')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should be writable', async () => {
      return thing.writeProperty('power', {state: 1})
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it('should throw on invalid value', async () => {
      return thing.writeProperty('power', {state: 2})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('brightness property', async () => {
    it('should not be readable', async () => {
      return thing
        .readProperty('brightness')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should be writable', async () => {
      return thing.writeProperty('brightness', {value: 50})
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it('should throw on invalid value', async () => {
      return thing.writeProperty('brightness', {value: 256})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('colour property', async () => {
    it('should not be readable', async () => {
      return thing
        .readProperty('colour')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should be writable', async () => {
      return thing.writeProperty('colour', {R: 0, G: 0, B: 0})
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it("should throw on invalid 'R' value", async () => {
      return thing.writeProperty('colour', {R: 256, G: 0, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("should throw on invalid 'G' value", async () => {
      return thing.writeProperty('colour', {R: 0, G: 256, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("should throw on invalid 'B' value", async () => {
      return thing.writeProperty('colour', {R: 0, G: 0, B: 256})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });
});
