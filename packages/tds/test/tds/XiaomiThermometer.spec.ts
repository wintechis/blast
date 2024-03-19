// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/XiaomiThermometer.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('Xiaomi Thermometer Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('events', () => {
    test('measurements', () => {
      const measurements = thing?.events.measurements;
      expect(measurements).toBeDefined();
      expect(measurements.data.type).toEqual('array');
      expect(measurements.data['bdo:pattern']).toEqual('{temp}{hum}2011');
      expect(Object.keys(measurements.data['bdo:variables'])).toHaveLength(2);
      expect(measurements.data['bdo:variables'].temp.type).toEqual('number');
      expect(measurements.data['bdo:variables'].temp['bdo:bytelength']).toEqual(
        2
      );
      expect(measurements.data['bdo:variables'].temp['bdo:scale']).toEqual(
        0.01
      );
      expect(measurements.data['bdo:variables'].hum.type).toEqual('number');
      expect(measurements.data['bdo:variables'].hum['bdo:bytelength']).toEqual(
        1
      );
      expect(measurements.forms).toHaveLength(1);
      expect(measurements.forms[0]['sbo:methodName']).toEqual('sbo:subscribe');
      expect(measurements.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
});
