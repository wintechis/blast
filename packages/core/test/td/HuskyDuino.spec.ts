// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/HuskyDuino.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('HuskyDuino Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('algorithm', () => {
      const algorithm = thing?.properties.algorithm;
      expect(algorithm).toBeDefined();
      expect(algorithm.type).toEqual('integer');
      expect(algorithm.readOnly).toBeFalsy();
      expect(algorithm.writeOnly).toBeFalsy();
      expect(algorithm.observable).toBeFalsy();
      expect(algorithm.minimum).toEqual(1);
      expect(algorithm.maximum).toEqual(7);
      expect(algorithm['bdo:bytelength']).toEqual(1);
      expect(algorithm.forms).toHaveLength(2);
      expect(algorithm.forms[0].op).toEqual('readproperty');
      expect(algorithm.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(algorithm.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(algorithm.forms[1].op).toEqual('writeproperty');
      expect(algorithm.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
      expect(algorithm.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('id', () => {
      const id = thing?.properties.id;
      expect(id).toBeDefined();
      expect(id.type).toEqual('string');
      expect(id.readOnly).toBeTruthy();
      expect(id.writeOnly).toBeFalsy();
      expect(id.observable).toBeFalsy();
      expect(id.forms).toHaveLength(1);
      expect(id.forms[0].op).toEqual('readproperty');
      expect(id.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(id.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('location', () => {
      const location = thing?.properties.location;
      expect(location).toBeDefined();
      expect(location.type).toEqual('string');
      expect(location.readOnly).toBeTruthy();
      expect(location.writeOnly).toBeFalsy();
      expect(location.observable).toBeFalsy();
      expect(location.forms).toHaveLength(1);
      expect(location.forms[0].op).toEqual('readproperty');
      expect(location.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(location.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
  describe('actions', () => {
    test('forgetAll', () => {
      const forgetAll = thing?.actions.forgetAll;
      expect(forgetAll).toBeDefined();
      expect(forgetAll.input.type).toEqual('string');
      expect(forgetAll.input.enum).toEqual(['true']);
      expect(forgetAll.forms).toHaveLength(1);
      expect(forgetAll.forms[0].op).toEqual('invokeaction');
      expect(forgetAll.forms[0]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
      expect(forgetAll.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('learn', () => {
      const learn = thing?.actions.learn;
      expect(learn).toBeDefined();
      expect(learn.input.type).toEqual('integer');
      expect(learn.input.minimum).toEqual(0);
      expect(learn.input.maximum).toEqual(255);
      expect(learn.input['bdo:bytelength']).toEqual(1);
      expect(learn.forms).toHaveLength(1);
      expect(learn.forms[0].op).toEqual('invokeaction');
      expect(learn.forms[0]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
      expect(learn.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
});
