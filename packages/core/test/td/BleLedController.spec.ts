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
      expect(colour.readOnly).toBe(false);
      expect(colour.writeOnly).toBe(true);
      expect(colour.observable).toBe(false);
      expect(colour.type).toBe('string');
      expect(colour.format).toBe('hex');
      expect(colour['bdo:pattern']).toBe('7e000503{R}{G}{B}00ef');
      expect(Object.keys(colour['bdo:variables']).length).toBe(3);
      expect(colour['bdo:variables'].R).toBeDefined();
      expect(colour['bdo:variables'].R.type).toBe('integer');
      expect(colour['bdo:variables'].R['bdo:bytelength']).toBe(1);
      expect(colour['bdo:variables'].R.minimum).toBe(0);
      expect(colour['bdo:variables'].R.maximum).toBe(255);
      expect(colour['bdo:variables'].G).toBeDefined();
      expect(colour['bdo:variables'].G.type).toBe('integer');
      expect(colour['bdo:variables'].G['bdo:bytelength']).toBe(1);
      expect(colour['bdo:variables'].G.minimum).toBe(0);
      expect(colour['bdo:variables'].G.maximum).toBe(255);
      expect(colour['bdo:variables'].B).toBeDefined();
      expect(colour['bdo:variables'].B.type).toBe('integer');
      expect(colour['bdo:variables'].B['bdo:bytelength']).toBe(1);
      expect(colour['bdo:variables'].B.minimum).toBe(0);
      expect(colour['bdo:variables'].B.maximum).toBe(255);
      expect(colour.forms.length).toBe(1);
      expect(colour.forms[0].contentType).toBe(
        'application/x.binary-data-stream'
      );
      expect(colour.forms[0]['sbo:methodName']).toBe(
        'sbo:write-without-response'
      );
    });
    test('power', () => {
      const power = thing?.properties.power;
      expect(power).toBeDefined();
      expect(power.readOnly).toBe(false);
      expect(power.writeOnly).toBe(true);
      expect(power.observable).toBe(false);
      expect(power.type).toBe('string');
      expect(power.format).toBe('hex');
      expect(power['bdo:pattern']).toBe('7e0004{is_on}00000000ef');
      expect(Object.keys(power['bdo:variables']).length).toBe(1);
      expect(power['bdo:variables'].is_on).toBeDefined();
      expect(power['bdo:variables'].is_on.type).toBe('integer');
      expect(power['bdo:variables'].is_on['bdo:bytelength']).toBe(1);
      expect(power['bdo:variables'].is_on.minimum).toBe(0);
      expect(power['bdo:variables'].is_on.maximum).toBe(1);
      expect(power.forms.length).toBe(1);
      expect(power.forms[0].contentType).toBe(
        'application/x.binary-data-stream'
      );
      expect(power.forms[0]['sbo:methodName']).toBe('sbo:write');
    });
    test('effect', () => {
      const effect = thing?.properties.effect;
      expect(effect).toBeDefined();
      expect(effect.readOnly).toBe(false);
      expect(effect.writeOnly).toBe(true);
      expect(effect.observable).toBe(false);
      expect(effect.type).toBe('string');
      expect(effect.format).toBe('hex');
      expect(effect['bdo:pattern']).toBe('7e0003{effect}03000000ef');
      expect(Object.keys(effect['bdo:variables']).length).toBe(1);
      expect(effect['bdo:variables'].effect).toBeDefined();
      expect(effect['bdo:variables'].effect.type).toBe('integer');
      expect(effect['bdo:variables'].effect['bdo:bytelength']).toBe(1);
      expect(effect['bdo:variables'].effect.minimum).toBe(128);
      expect(effect['bdo:variables'].effect.maximum).toBe(156);
      expect(effect.forms.length).toBe(1);
      expect(effect.forms[0].contentType).toBe(
        'application/x.binary-data-stream'
      );
      expect(effect.forms[0]['sbo:methodName']).toBe('sbo:write');
    });
  });
});
