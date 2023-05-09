// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/BleRgbController.json';
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
      expect(colour.type).toEqual('string');
      expect(colour.format).toEqual('hex');
      expect(colour['bdo:pattern']).toEqual('7e000503{R}{G}{B}00ef');
      expect(Object.keys(colour['bdo:variables'])).toHaveLength(3);
      expect(colour['bdo:variables'].R).toBeDefined();
      expect(colour['bdo:variables'].R.type).toEqual('integer');
      expect(colour['bdo:variables'].R['bdo:bytelength']).toEqual(1);
      expect(colour['bdo:variables'].R.minimum).toEqual(0);
      expect(colour['bdo:variables'].R.maximum).toEqual(255);
      expect(colour['bdo:variables'].G).toBeDefined();
      expect(colour['bdo:variables'].G.type).toEqual('integer');
      expect(colour['bdo:variables'].G['bdo:bytelength']).toEqual(1);
      expect(colour['bdo:variables'].G.minimum).toEqual(0);
      expect(colour['bdo:variables'].G.maximum).toEqual(255);
      expect(colour['bdo:variables'].B).toBeDefined();
      expect(colour['bdo:variables'].B.type).toEqual('integer');
      expect(colour['bdo:variables'].B['bdo:bytelength']).toEqual(1);
      expect(colour['bdo:variables'].B.minimum).toEqual(0);
      expect(colour['bdo:variables'].B.maximum).toEqual(255);
      expect(colour.forms).toHaveLength(1);
      expect(colour.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(colour.forms[0]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
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
