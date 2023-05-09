// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/XiaomiFlowerCare.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('Xiaomi Flower Care Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('valueString', () => {
      const valueString = thing?.properties.valueString;
      expect(valueString).toBeDefined();
      expect(valueString.readOnly).toBeTruthy();
      expect(valueString.writeOnly).toBeFalsy();
      expect(valueString.observable).toBeFalsy();
      expect(valueString.type).toEqual('array');
      expect(valueString['bdo:pattern']).toEqual(
        '{temp}00{brightness}{moisture}{conduct}023c00fb349b'
      );
      expect(Object.keys(valueString['bdo:variables'])).toHaveLength(4);
      expect(valueString['bdo:variables'].temp.type).toEqual('integer');
      expect(valueString['bdo:variables'].temp['bdo:bytelength']).toEqual(2);
      expect(valueString['bdo:variables'].temp['bdo:scale']).toEqual(0.1);
      expect(valueString['bdo:variables'].brightness.type).toEqual('integer');
      expect(valueString['bdo:variables'].brightness['bdo:bytelength']).toEqual(
        4
      );
      expect(valueString['bdo:variables'].moisture.type).toEqual('integer');
      expect(valueString['bdo:variables'].moisture['bdo:bytelength']).toEqual(
        1
      );
      expect(valueString['bdo:variables'].conduct.type).toEqual('integer');
      expect(valueString['bdo:variables'].conduct['bdo:bytelength']).toEqual(2);
      expect(valueString.forms).toHaveLength(1);
      expect(valueString.forms[0].op).toEqual('readproperty');
      expect(valueString.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(valueString.forms[0]['sbo:methodName']).toEqual('sbo:read');
    });
  });
  describe('actions', () => {
    test('readMode', () => {
      const readMode = thing?.actions.readMode;
      expect(readMode).toBeDefined();
      expect(readMode.readOnly).toBeFalsy();
      expect(readMode.writeOnly).toBeTruthy();
      expect(readMode.observable).toBeFalsy();
      expect(readMode.type).toEqual('string');
      expect(readMode.input.type).toEqual('string');
      expect(readMode.input.format).toEqual('hex');
      expect(readMode.input.enum).toHaveLength(1);
      expect(readMode.input.enum[0]).toEqual('A01F');
      expect(readMode.input['bdo:bytelength']).toEqual(2);
      expect(readMode.forms).toHaveLength(1);
      expect(readMode.forms[0].op).toEqual('invokeaction');
      expect(readMode.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(readMode.forms[0]['sbo:methodName']).toEqual('sbo:write');
    });
  });
});
