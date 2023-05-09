// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/PhilipsHue.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('Philips Hue Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('power', () => {
      const power = thing?.properties.power;
      expect(power).toBeDefined();
      expect(power.type).toEqual('integer');
      expect(power.observable).toBeFalsy();
      expect(power.readOnly).toBeFalsy();
      expect(power.writeOnly).toBeFalsy();
      expect(power.minimum).toEqual(0);
      expect(power.maximum).toEqual(1);
      expect(power['bdo:bytelength']).toEqual(1);
      expect(power.forms).toHaveLength(2);
      expect(power.forms[0].op).toEqual('readproperty');
      expect(power.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(power.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(power.forms[1].op).toEqual('writeproperty');
      expect(power.forms[1]['sbo:methodName']).toEqual('sbo:write');
      expect(power.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('brightness', () => {
      const brightness = thing?.properties.brightness;
      expect(brightness).toBeDefined();
      expect(brightness.type).toEqual('integer');
      expect(brightness.observable).toBeFalsy();
      expect(brightness.readOnly).toBeTruthy();
      expect(brightness.writeOnly).toBeFalsy();
      expect(brightness.minimum).toEqual(1);
      expect(brightness.maximum).toEqual(255);
      expect(brightness['bdo:bytelength']).toEqual(1);
      expect(brightness.forms).toHaveLength(2);
      expect(brightness.forms[0].op).toEqual('readproperty');
      expect(brightness.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(brightness.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(brightness.forms[1].op).toEqual('writeproperty');
      expect(brightness.forms[1]['sbo:methodName']).toEqual('sbo:write');
      expect(brightness.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('colour', () => {
      const colour = thing?.properties.colour;
      expect(colour).toBeDefined();
      expect(colour.type).toEqual('object');
      expect(colour.format).toEqual('hex');
      expect(colour.observable).toBeFalsy();
      expect(colour.readOnly).toBeFalsy();
      expect(colour.writeOnly).toBeTruthy();
      expect(colour['bdo:pattern']).toEqual('0F{red}{blue}{green}');
      expect(Object.keys(colour['bdo:variables'])).toHaveLength(3);
      expect(colour['bdo:variables'].red).toBeDefined();
      expect(colour['bdo:variables'].red.type).toEqual('integer');
      expect(colour['bdo:variables'].red['bdo:bytelength']).toEqual(1);
      expect(colour['bdo:variables'].red.minimum).toEqual(0);
      expect(colour['bdo:variables'].red.maximum).toEqual(255);
      expect(colour['bdo:variables'].green).toBeDefined();
      expect(colour['bdo:variables'].green.type).toEqual('integer');
      expect(colour['bdo:variables'].green['bdo:bytelength']).toEqual(1);
      expect(colour['bdo:variables'].green.minimum).toEqual(0);
      expect(colour['bdo:variables'].green.maximum).toEqual(255);
      expect(colour['bdo:variables'].blue).toBeDefined();
      expect(colour['bdo:variables'].blue.type).toEqual('integer');
      expect(colour['bdo:variables'].blue['bdo:bytelength']).toEqual(1);
      expect(colour['bdo:variables'].blue.minimum).toEqual(0);
      expect(colour['bdo:variables'].blue.maximum).toEqual(255);
      expect(colour['tst:function']).toEqual(
        'const scale = 0xff; const adjustedArr = []; for (const chan of [buf[1], buf[2], buf[3]]) {adjustedArr.push(Math.max(1, chan));} const total = adjustedArr.reduce((partialSum, a) => partialSum + a, 0); const adjustedArrFinal = []; for (const chan of [buf[1], buf[2], buf[3]]) {let x = Math.round((chan / total) * scale); adjustedArrFinal.push(Math.max(1, x));} for (let i = 1; i < 4; i++) {buf[i] = adjustedArrFinal[i-1]} return buf;'
      );
      expect(colour.forms).toHaveLength(1);
      expect(colour.forms[0].op).toEqual('writeproperty');
      expect(colour.forms[0]['sbo:methodName']).toEqual('sbo:write');
      expect(colour.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
  describe('actions', () => {
    test('dim', () => {
      const dim = thing?.actions.dim;
      expect(dim).toBeDefined();
      expect(dim.input.type).toEqual('integer');
      expect(dim.input.observable).toBeFalsy();
      expect(dim.input.readOnly).toBeFalsy();
      expect(dim.input.writeOnly).toBeFalsy();
      expect(dim.input.minimum).toEqual(1);
      expect(dim.input.maximum).toEqual(255);
      expect(dim.input['bdo:bytelength']).toEqual(1);
      expect(dim.output).toBeUndefined();
      expect(dim.forms).toHaveLength(1);
      expect(dim.forms[0].op).toEqual('invokeaction');
      expect(dim.forms[0]['sbo:methodName']).toEqual('sbo:write');
      expect(dim.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
});
