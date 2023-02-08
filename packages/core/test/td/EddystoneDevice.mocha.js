import chai from 'chai';
import sinon from 'sinon';
import {EddystoneDevice as td} from '../../dist/blast.tds.js';
import {createThing} from '../../dist/blast.web.js';
import {getWebBluetoothMock} from '../helpers/devices/webBluetooth/webBluetoothMock.js';
import {mockEddystoneDevice} from '../helpers/devices/webBluetooth/EddystoneDevice.js';

const {assert} = chai;

describe('EddystoneDevice', async () => {
  let thing = null;

  before(async () => {
    getWebBluetoothMock();
    mockEddystoneDevice();
    thing = await createThing(td, 'eddy');
    sinon.stub(console, 'warn');
  });

  after(async () => {
    console.warn.restore();
  });

  describe('Capabilities property', async () => {
    it('should be readable', async () => {
      let capabilities = await thing.readProperty('capabilities');
      capabilities = await capabilities.value();
      assert.equal(capabilities, '00040103000fe2ecf0f4f8fc0004');
    });

    it('should not be writable', async () => {
      return thing
        .writeProperty('capabilities', '00040103000fe2ecf0f4f8fc0004')
        .then(() => assert(false))
        .catch(() => assert(true));
    });
  });

  describe('Active Slot property', async () => {
    it('should be readable', async () => {
      let activeSlot = await thing.readProperty('activeSlot');
      activeSlot = await activeSlot.value();
      assert.equal(activeSlot, 0);
    });

    it('should be writable', async () => {
      await thing.writeProperty('activeSlot', 1);
      let activeSlot = await thing.readProperty('activeSlot');
      activeSlot = await activeSlot.value();
      assert.equal(activeSlot, 1);
    });
  });

  describe('Advertising Interval property', async () => {
    it('should be readable', async () => {
      let advertisingInterval = await thing.readProperty('advertisingInterval');
      advertisingInterval = await advertisingInterval.value();
      assert.equal(advertisingInterval, 100);
    });

    it('should be writable', async () => {
      await thing.writeProperty('advertisingInterval', 200);
      let advertisingInterval = await thing.readProperty('advertisingInterval');
      advertisingInterval = await advertisingInterval.value();
      assert.equal(advertisingInterval, 200);
    });
  });

  describe('Radio Tx Power property', async () => {
    it('should be readable', async () => {
      let radioTxPower = await thing.readProperty('radioTxPower');
      radioTxPower = await radioTxPower.value();
      assert.equal(radioTxPower, -4);
    });

    it('should be writable', async () => {
      await thing.writeProperty('radioTxPower', 4);
      let radioTxPower = await thing.readProperty('radioTxPower');
      radioTxPower = await radioTxPower.value();
      assert.equal(radioTxPower, 4);
    });
  });

  describe('(Advanced) Advertised Tx Power property', async () => {
    it('should be readable', async () => {
      let advertisedTxPower = await thing.readProperty('advertisedTxPower');
      advertisedTxPower = await advertisedTxPower.value();
      assert.equal(advertisedTxPower, -20);
    });

    it('should be writable', async () => {
      await thing.writeProperty('advertisedTxPower', -40);
      let advertisedTxPower = await thing.readProperty('advertisedTxPower');
      advertisedTxPower = await advertisedTxPower.value();
      assert.equal(advertisedTxPower, -40);
    });
  });

  describe('Lock State property', async () => {
    it('should be readable', async () => {
      let lockState = await thing.readProperty('lockState');
      lockState = await lockState.value();
      assert.equal(lockState, '02');
    });

    it('should be writeable', async () => {
      await thing.writeProperty('lockState', '01');
      let lockState = await thing.readProperty('lockState');
      lockState = await lockState.value();
      assert.equal(lockState, '01');
    });
  });

  describe('Public ECDH Key property', async () => {
    it('should be readable', async () => {
      let publicEcdhKey = await thing.readProperty('publicEcdhKey');
      publicEcdhKey = await publicEcdhKey.value();
      assert.equal(publicEcdhKey, '00000000000000000000000000000000');
    });
  });

  describe('Advertised Data property', async () => {
    it('should be readable', async () => {
      let advertisedData = await thing.readProperty('advertisedData');
      advertisedData = await advertisedData.value();
      assert.equal(advertisedData, '1010026578616d706c6507');
    });

    it('should be writable', async () => {
      await thing.writeProperty('advertisedData', '10eb036578616d706c6507');
      let advertisedData = await thing.readProperty('advertisedData');
      advertisedData = await advertisedData.value();
      assert.equal(advertisedData, '10eb036578616d706c6507');
    });
  });
});
