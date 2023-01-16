import chai from 'chai';
import sinon from 'sinon';
import {createThing} from '../../dist/blast.web.js';
import {BleRgbController as td} from '../../dist/blast.tds.js';
import {getWebBluetoothMock} from '../helpers/devices/webBluetooth/webBluetoothMock.js';
import {mockBleRgbController} from '../helpers/devices/webBluetooth/BleRgbController.js';

const {assert} = chai;

describe('BleLedController', async () => {
  let thing = null;

  before(async () => {
    getWebBluetoothMock();
    mockBleRgbController();
    thing = await createThing(td, 'bleRgb');
    sinon.stub(console, 'warn');
  });

  after(async () => {
    console.warn.restore();
  });

  describe('colour property', async () => {
    it('should not be readable', async () => {
      return thing
        .readProperty('colour')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should be writable', async () => {
      return thing
        .writeProperty('colour', {R: 255, G: 0, B: 0})
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it("throws on 'R' value greater than 255", async () => {
      return thing
        .writeProperty('colour', {R: 256, G: 0, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on 'G' value greater than 255", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: 9999, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on 'B' value greater than 255", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: 0, B: 256})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on negative 'R' value", async () => {
      return thing
        .writeProperty('colour', {R: -1, G: 0, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on negative 'G' value", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: -1, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on negative 'B' value", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: 0, B: -10000})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('power property', async () => {
    it('should not be readable', async () => {
      return thing
        .readProperty('power')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should be writeable', async () => {
      return thing
        .writeProperty('power', {is_on: 1})
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it('throws for values greater than 1', async () => {
      return thing
        .writeProperty('power', {is_on: 2})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('throws for negative values', async () => {
      return thing
        .writeProperty('power', {is_on: -1})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('effect property', async () => {
    it('should not be readable', async () => {
      return thing
        .readProperty('effect')
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should be writeable', async () => {
      return thing
        .writeProperty('effect', {type: 128})
        .then(() => assert(true))
        .catch(() => assert(false));
    });

    it('should throw for values smaller than 128', async () => {
      return thing
        .writeProperty('effect', {type: 127})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('should throw for values greater than 156', async () => {
      return thing
        .writeProperty('effect', {type: 157})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });
});
