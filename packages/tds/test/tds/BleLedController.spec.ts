// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/tds/BleRgbController.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('BleLedController Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('colour', () => {
      const colour = thing?.properties.colour;
      expect(colour).toBeDefined();
      expect(colour.readOnly).toBeFalsy();
      expect(colour.writeOnly).toBeTruthy();
      expect(colour.observable).toBeFalsy();
      expect(colour.type).toEqual('object');
      expect(colour.properties).toBeDefined();
      expect(colour.forms).toHaveLength(1);
      expect(colour.forms[0].contentType).toEqual(
        'application/octet-stream;length=9;signed=false'
      );
      expect(colour.forms[0]['sbo:methodName']).toEqual('sbo:write');
    });
    test('power', () => {
      const power = thing?.properties.power;
      expect(power).toBeDefined();
      expect(power.readOnly).toBeFalsy();
      expect(power.writeOnly).toBeTruthy();
      expect(power.observable).toBeFalsy();
      expect(power.type).toEqual('string');
      expect(power.format).toEqual('hex');
      expect(power['bdo:pattern']).toEqual('7e0004{is_on}00000000ef');
      expect(Object.keys(power['bdo:variables'])).toHaveLength(1);
      expect(power['bdo:variables'].is_on).toBeDefined();
      expect(power['bdo:variables'].is_on.type).toEqual('integer');
      expect(power['bdo:variables'].is_on['bdo:bytelength']).toEqual(1);
      expect(power['bdo:variables'].is_on.minimum).toEqual(0);
      expect(power['bdo:variables'].is_on.maximum).toEqual(1);
      expect(power.forms).toHaveLength(1);
      expect(power.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(power.forms[0]['sbo:methodName']).toEqual('sbo:write');
    });
    test('effect', () => {
      const effect = thing?.properties.effect;
      expect(effect).toBeDefined();
      expect(effect.readOnly).toBeFalsy();
      expect(effect.writeOnly).toBeTruthy();
      expect(effect.observable).toBeFalsy();
      expect(effect.type).toEqual('string');
      expect(effect.format).toEqual('hex');
      expect(effect['bdo:pattern']).toEqual('7e0003{effect}03000000ef');
      expect(Object.keys(effect['bdo:variables'])).toHaveLength(1);
      expect(effect['bdo:variables'].effect).toBeDefined();
      expect(effect['bdo:variables'].effect.type).toEqual('integer');
      expect(effect['bdo:variables'].effect['bdo:bytelength']).toEqual(1);
      expect(effect['bdo:variables'].effect.minimum).toEqual(128);
      expect(effect['bdo:variables'].effect.maximum).toEqual(156);
      expect(effect.forms).toHaveLength(1);
      expect(effect.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(effect.forms[0]['sbo:methodName']).toEqual('sbo:write');
    });
  });
});
