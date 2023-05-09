// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/RuuviTag.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('RuuviTag Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('events', () => {
    test('UART data', () => {
      const uart = thing?.events['UART data'];
      expect(uart).toBeDefined();
      expect(uart.data.type).toEqual('array');
      expect(uart.data['bdo:pattern']).toEqual(
        '{format}{temp}{humidity}{pressure}{acc-x}{acc-y}{acc-z}{power-info}{movement-counter}{measurement-sequence-number}'
      );
      expect(Object.keys(uart.data['bdo:variables'])).toHaveLength(10);
      expect(uart.data['bdo:variables'].format.type).toEqual('number');
      expect(uart.data['bdo:variables'].format['bdo:bytelength']).toEqual(1);
      expect(uart.data['bdo:variables'].temp.type).toEqual('number');
      expect(uart.data['bdo:variables'].temp['bdo:bytelength']).toEqual(2);
      expect(uart.data['bdo:variables'].temp['bdo:signed']).toBeTruthy();
      expect(uart.data['bdo:variables'].temp['bdo:byteOrder']).toEqual('big');
      expect(uart.data['bdo:variables'].temp['bdo:scale']).toEqual(0.005);
      expect(uart.data['bdo:variables'].humidity.type).toEqual('number');
      expect(uart.data['bdo:variables'].humidity['bdo:bytelength']).toEqual(2);
      expect(uart.data['bdo:variables'].humidity['bdo:byteOrder']).toEqual(
        'big'
      );
      expect(uart.data['bdo:variables'].humidity['bdo:scale']).toEqual(0.0025);
      expect(uart.data['bdo:variables'].pressure.type).toEqual('number');
      expect(uart.data['bdo:variables'].pressure['bdo:bytelength']).toEqual(2);
      expect(uart.data['bdo:variables'].pressure['bdo:byteOrder']).toEqual(
        'big'
      );
      expect(uart.data['bdo:variables']['acc-x'].type).toEqual('number');
      expect(uart.data['bdo:variables']['acc-x']['bdo:bytelength']).toEqual(2);
      expect(uart.data['bdo:variables']['acc-x']['bdo:signed']).toBeTruthy();
      expect(uart.data['bdo:variables']['acc-x']['bdo:byteOrder']).toEqual(
        'big'
      );
      expect(uart.data['bdo:variables']['acc-x']['bdo:scale']).toEqual(0.001);
      expect(uart.data['bdo:variables']['acc-y'].type).toEqual('number');
      expect(uart.data['bdo:variables']['acc-y']['bdo:bytelength']).toEqual(2);
      expect(uart.data['bdo:variables']['acc-y']['bdo:signed']).toBeTruthy();
      expect(uart.data['bdo:variables']['acc-y']['bdo:byteOrder']).toEqual(
        'big'
      );
      expect(uart.data['bdo:variables']['acc-y']['bdo:scale']).toEqual(0.001);
      expect(uart.data['bdo:variables']['acc-z'].type).toEqual('number');
      expect(uart.data['bdo:variables']['acc-z']['bdo:bytelength']).toEqual(2);
      expect(uart.data['bdo:variables']['acc-z']['bdo:signed']).toBeTruthy();
      expect(uart.data['bdo:variables']['acc-z']['bdo:byteOrder']).toEqual(
        'big'
      );
      expect(uart.data['bdo:variables']['acc-z']['bdo:scale']).toEqual(0.001);
      expect(uart.data['bdo:variables']['power-info'].type).toEqual('number');
      expect(
        uart.data['bdo:variables']['power-info']['bdo:bytelength']
      ).toEqual(2);
      expect(uart.data['bdo:variables']['movement-counter'].type).toEqual(
        'number'
      );
      expect(
        uart.data['bdo:variables']['movement-counter']['bdo:bytelength']
      ).toEqual(1);
      expect(
        uart.data['bdo:variables']['movement-counter']['bdo:byteOrder']
      ).toEqual('big');
      expect(
        uart.data['bdo:variables']['measurement-sequence-number'].type
      ).toEqual('number');
      expect(
        uart.data['bdo:variables']['measurement-sequence-number'][
          'bdo:bytelength'
        ]
      ).toEqual(2);
      expect(
        uart.data['bdo:variables']['measurement-sequence-number'][
          'bdo:byteOrder'
        ]
      ).toEqual('big');
      expect(uart.forms).toHaveLength(1);
      expect(uart.forms[0]['sbo:methodName']).toEqual('subscribe');
      expect(uart.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
});
