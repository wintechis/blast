import chai from 'chai';
import sinon from 'sinon';

const {expect} = chai;

import {
  eddystoneProperties,
  getCapabilities,
  getActiveSlot,
} from '../dist/blast_eddystone.js';
import {optionalServices} from '../dist/blast_webBluetooth.js';
import {mockBluetooth} from './bluetooth_helpers.js';
import {
  getStatus,
  getStdError,
  setStdError,
  setStdInfo,
  statusValues,
} from '../dist/blast_interpreter.js';

suite('blast_eddystone configs', () => {
  test('eddystoneProperties', () => {
    expect(eddystoneProperties).to.be.a('map');
    expect(eddystoneProperties.size).to.equal(8);
    expect(
      eddystoneProperties.get('a3c87502-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('activeSlot');
    expect(
      eddystoneProperties.get('a3c87505-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('advertisedTxPower');
    expect(
      eddystoneProperties.get('a3c8750a-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('advertisedData');
    expect(
      eddystoneProperties.get('a3c87503-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('advertisingInterval');
    expect(
      eddystoneProperties.get('a3c87501-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('capabilities');
    expect(
      eddystoneProperties.get('a3c87506-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('lockState');
    expect(
      eddystoneProperties.get('a3c87506-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('lockState');
    expect(
      eddystoneProperties.get('a3c87508-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('publicEcdhKey');
    expect(
      eddystoneProperties.get('a3c87504-8ed3-4bdf-8a39-a01bebede295')
    ).to.equal('radioTxPower');
  });

  test('Config is in optionalServices', () => {
    expect(optionalServices).to.include('a3c87500-8ed3-4bdf-8a39-a01bebede295');
  });
});

suite('blast_eddystone functions', () => {
  let prevLog;

  suiteSetup(async () => {
    sinon.stub(console, 'log');
    sinon.stub(console, 'info');
    prevLog = getStdError();
  });

  suiteTeardown(() => {
    sinon.restore();
    setStdError(prevLog);
  });

  setup(() => {
    mockBluetooth();
  });

  suite('getCapabilities function', () => {
    test('returns correct capabilites object', async () => {
      const capabilities = await getCapabilities('eddy');
      expect(capabilities).to.be.an('object');
      expect(capabilities).to.deep.equal({
        specVersion: 0,
        maxSlots: 4,
        maxEidPerSlot: 1,
        isVarriableAdvIntervalSupported: true,
        isVariableTxPowerSupported: true,
        isUIDSupported: true,
        isURLSupported: true,
        isTLMSupported: true,
        isEIDSupported: true,
        supportedTxPowerLevels: [-30, -20, -16, -12, -8, -4, 0, 4],
      });
    });

    test('errors, if device is not paired', async () => {
      const errStub = sinon.stub();
      setStdError(errStub);
      const infoStub = sinon.stub();
      setStdInfo(infoStub);

      await getCapabilities('none');

      expect(
        errStub.calledWith(
          "Bluetooth device none wasn't found in paired devices."
        )
      );
      expect(infoStub.calledWith('Execution stopped.'));
      expect(getStatus()).to.equal(statusValues.ERROR);
    });
  });

  suite('getActiveSlot function', () => {
    test('returns correct active slot', async () => {
      const activeSlot = await getActiveSlot('eddy');
      expect(activeSlot).to.equal(0);
    });

    test('errors, if device is not paired', async () => {
      const errStub = sinon.stub();
      setStdError(errStub);
      const infoStub = sinon.stub();
      setStdInfo(infoStub);

      await getActiveSlot('none');

      expect(
        errStub.calledWith(
          "Bluetooth device none wasn't found in paired devices."
        )
      );
      expect(infoStub.calledWith('Execution stopped.'));
      expect(getStatus()).to.equal(statusValues.ERROR);
    });
  });
});
