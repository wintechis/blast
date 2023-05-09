// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/GoveeLamp.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('GoveeLamp Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('power', () => {
      const power = thing?.properties.power;
      expect(power).toBeDefined();
      expect(power.readOnly).toBeFalsy();
      expect(power.writeOnly).toBeTruthy();
      expect(power.observable).toBeFalsy();
      expect(power.type).toEqual('string');
      expect(power.format).toEqual('hex');
      expect(power.minimum).toEqual(0);
      expect(power.maximum).toEqual(1);
      expect(power['bdo:pattern']).toEqual(
        '3301{state}00000000000000000000000000000000'
      );
      expect(power['bdo:variables'].state.type).toEqual('integer');
      expect(power['bdo:variables'].state['bdo:bytelength']).toEqual(1);
      expect(power['bdo:variables'].state.minimum).toEqual(0);
      expect(power['bdo:variables'].state.maximum).toEqual(1);
      expect(power['tst:function']).toEqual(
        'let checksum = 0; for (let i = 0; i < buf.length; i++) {checksum = checksum ^ buf[i];} let finBuf = Buffer.concat([buf, Buffer.from([checksum])]); return finBuf;'
      );
      expect(power.forms).toHaveLength(1);
      expect(power.forms[0].op).toEqual('writeproperty');
      expect(power.forms[0]['sbo:methodName']).toEqual('sbo:write');
      expect(power.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
});
