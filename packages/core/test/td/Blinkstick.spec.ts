// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/Blinkstick.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('Blinkstick Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('color', () => {
      const color = thing?.properties.color;
      expect(color).toBeDefined();
      expect(color.readOnly).toBeFalsy();
      expect(color.writeOnly).toBeTruthy();
      expect(color.observable).toBeFalsy();
      expect(color.type).toEqual('array');
      expect(color.forms).toHaveLength(1);
      expect(color.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(color.forms[0]['hid:reportId']).toEqual(5);
    });
  });
});
