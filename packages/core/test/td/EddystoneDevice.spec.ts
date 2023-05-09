// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/EddystoneDevice.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('EddystoneDevice Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('activeSlot', () => {
      const activeSlot = thing?.properties.activeSlot;
      expect(activeSlot).toBeDefined();
      expect(activeSlot.readOnly).toBeFalsy();
      expect(activeSlot.writeOnly).toBeFalsy();
      expect(activeSlot.observable).toBeFalsy();
      expect(activeSlot.type).toEqual('integer');
      expect(activeSlot['bdo:bytelength']).toEqual(1);
      expect(activeSlot.forms).toHaveLength(2);
      expect(activeSlot.forms[0].op).toEqual('readproperty');
      expect(activeSlot.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(activeSlot.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(activeSlot.forms[1].op).toEqual('writeproperty');
      expect(activeSlot.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(activeSlot.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
    });
    test('advertisedTxPower', () => {
      const advertisedTxPower = thing?.properties.advertisedTxPower;
      expect(advertisedTxPower).toBeDefined();
      expect(advertisedTxPower.readOnly).toBeFalsy();
      expect(advertisedTxPower.writeOnly).toBeFalsy();
      expect(advertisedTxPower.observable).toBeFalsy();
      expect(advertisedTxPower.type).toEqual('integer');
      expect(advertisedTxPower['bdo:bytelength']).toEqual(1);
      expect(advertisedTxPower['bdo:signed']).toBeTruthy();
      expect(advertisedTxPower.forms).toHaveLength(2);
      expect(advertisedTxPower.forms[0].op).toEqual('readproperty');
      expect(advertisedTxPower.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(advertisedTxPower.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(advertisedTxPower.forms[1].op).toEqual('writeproperty');
      expect(advertisedTxPower.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(advertisedTxPower.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
    });
    test('advertisedData', () => {
      const advertisedData = thing?.properties.advertisedData;
      expect(advertisedData).toBeDefined();
      expect(advertisedData.readOnly).toBeFalsy();
      expect(advertisedData.writeOnly).toBeFalsy();
      expect(advertisedData.observable).toBeFalsy();
      expect(advertisedData.type).toEqual('string');
      expect(advertisedData.format).toEqual('hex');
      expect(advertisedData.forms).toHaveLength(2);
      expect(advertisedData.forms[0].op).toEqual('readproperty');
      expect(advertisedData.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(advertisedData.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(advertisedData.forms[1].op).toEqual('writeproperty');
      expect(advertisedData.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(advertisedData.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
    });
    test('advertisingInterval', () => {
      const advertisingInterval = thing?.properties.advertisingInterval;
      expect(advertisingInterval).toBeDefined();
      expect(advertisingInterval.readOnly).toBeFalsy();
      expect(advertisingInterval.writeOnly).toBeFalsy();
      expect(advertisingInterval.observable).toBeFalsy();
      expect(advertisingInterval.type).toEqual('integer');
      expect(advertisingInterval['bdo:byteOrder']).toEqual('big');
      expect(advertisingInterval['bdo:bytelength']).toEqual(2);
      expect(advertisingInterval.forms).toHaveLength(2);
      expect(advertisingInterval.forms[0].op).toEqual('readproperty');
      expect(advertisingInterval.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(advertisingInterval.forms[0]['sbo:methodName']).toEqual(
        'sbo:read'
      );
      expect(advertisingInterval.forms[1].op).toEqual('writeproperty');
      expect(advertisingInterval.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(advertisingInterval.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
    });
    test('capabilities', () => {
      const capabilities = thing?.properties.capabilities;
      expect(capabilities).toBeDefined();
      expect(capabilities.readOnly).toBeTruthy();
      expect(capabilities.writeOnly).toBeFalsy();
      expect(capabilities.observable).toBeFalsy();
      expect(capabilities.type).toEqual('string');
      expect(capabilities.format).toEqual('hex');
      expect(capabilities.forms).toHaveLength(1);
      expect(capabilities.forms[0].op).toEqual('readproperty');
      expect(capabilities.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(capabilities.forms[0]['sbo:methodName']).toEqual('sbo:read');
    });
    test('lockState', () => {
      const lockState = thing?.properties.lockState;
      expect(lockState).toBeDefined();
      expect(lockState.readOnly).toBeFalsy();
      expect(lockState.writeOnly).toBeFalsy();
      expect(lockState.observable).toBeFalsy();
      expect(lockState.type).toEqual('string');
      expect(lockState.format).toEqual('hex');
      expect(lockState.forms).toHaveLength(2);
      expect(lockState.forms[0].op).toEqual('readproperty');
      expect(lockState.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(lockState.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(lockState.forms[1].op).toEqual('writeproperty');
      expect(lockState.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(lockState.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
    });
    test('publicEcdhKey', () => {
      const publicEcdhKey = thing?.properties.publicEcdhKey;
      expect(publicEcdhKey).toBeDefined();
      expect(publicEcdhKey.readOnly).toBeTruthy();
      expect(publicEcdhKey.writeOnly).toBeFalsy();
      expect(publicEcdhKey.observable).toBeFalsy();
      expect(publicEcdhKey.type).toEqual('string');
      expect(publicEcdhKey.format).toEqual('hex');
      expect(publicEcdhKey.forms).toHaveLength(1);
      expect(publicEcdhKey.forms[0].op).toEqual('readproperty');
      expect(publicEcdhKey.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(publicEcdhKey.forms[0]['sbo:methodName']).toEqual('sbo:read');
    });
    test('radioTxPower', () => {
      const radioTxPower = thing?.properties.radioTxPower;
      expect(radioTxPower).toBeDefined();
      expect(radioTxPower.readOnly).toBeFalsy();
      expect(radioTxPower.writeOnly).toBeFalsy();
      expect(radioTxPower.observable).toBeFalsy();
      expect(radioTxPower.type).toEqual('integer');
      expect(radioTxPower['bdo:bytelength']).toEqual(1);
      expect(radioTxPower['bdo:signed']).toBeTruthy();
      expect(radioTxPower.forms).toHaveLength(2);
      expect(radioTxPower.forms[0].op).toEqual('readproperty');
      expect(radioTxPower.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(radioTxPower.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(radioTxPower.forms[1].op).toEqual('writeproperty');
      expect(radioTxPower.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(radioTxPower.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
    });
  });
});
