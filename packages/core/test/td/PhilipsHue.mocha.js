import chai from 'chai';
import sinon from 'sinon';
import {PhilipsHue as td} from '../../dist/blast.tds.js';
import {createThing} from '../../dist/blast.web.js';
import {getWebBluetoothMock} from '../helpers/devices/webBluetooth/webBluetoothMock.js';
import {mockPhilipsHue} from '../helpers/devices/webBluetooth/PhilipsHue.js';

const {assert} = chai;

describe('Philips Hue', async () => {
  let thing = null;

  before(async () => {
    getWebBluetoothMock();
    mockPhilipsHue();
    thing = await createThing(td, 'phil');
    sinon.stub(console, 'warn');
  });

  after(async () => {
    console.warn.restore();
  });

  describe('Power property', async () => {
    it('should be readable', async () => {
      let power = await thing.readProperty('power');
      power = await power.value();
      assert.equal(power, 1);
    });

    it('should be writeable', async () => {
      await thing.writeProperty('power', 0);
      let power = await thing.readProperty('power');
      power = await power.value();
      assert.equal(power, 0);
    });

    it('throws on writing values larger than 1', async () => {
      return thing
        .writeProperty('power', 2)
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('throws on writing negative values', async () => {
      return thing
        .writeProperty('power', -1)
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('Brightness property', async () => {
    it('should be readable', async () => {
      let brightness = await thing.readProperty('brightness');
      brightness = await brightness.value();
      assert.equal(brightness, 255);
    });

    it('should be writeable', async () => {
      await thing.writeProperty('brightness', 1);
      let brightness = await thing.readProperty('brightness');
      brightness = await brightness.value();
      assert.equal(brightness, 1);
    });

    it('throws on writing values larger than 255', async () => {
      return thing
        .writeProperty('brightness', 256)
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it('throws on writing negative values', async () => {
      return thing
        .writeProperty('brightness', -1)
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('Colour property', async () => {
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

    it("throws on writing an 'R' value greater than 255", async () => {
      return thing
        .writeProperty('colour', {R: 256, G: 0, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on writing an 'R' value less than 0", async () => {
      return thing
        .writeProperty('colour', {R: -1, G: 0, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on writing a 'G' value greater than 254", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: 256, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on writing a 'G' value less than 0", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: -1, B: 0})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on writing a 'B' value greater than 254", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: 0, B: 256})
        .then(() => assert(false))
        .catch(() => assert(true));
    });

    it("throws on writing a 'B' value less than 0", async () => {
      return thing
        .writeProperty('colour', {R: 0, G: 0, B: -1})
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });
});
