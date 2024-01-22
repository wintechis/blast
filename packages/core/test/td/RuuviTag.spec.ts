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
      expect(uart.data.type).toEqual('object');
      expect(uart.data['properties']).toBeDefined();
      expect(Object.keys(uart.data['properties'])).toHaveLength(10);
      expect(uart.data['properties'].format.type).toEqual('integer');
      expect(uart.data['properties'].format['ex:bitOffset']).toEqual(0);
      expect(uart.data['properties'].format['ex:bitLength']).toEqual(8);
      expect(uart.data['properties'].temp.type).toEqual('number');
      expect(uart.data['properties'].temp['ex:bitOffset']).toEqual(8);
      expect(uart.data['properties'].temp['ex:bitLength']).toEqual(16);
      expect(uart.data['properties'].temp.scale).toEqual(0.005);
      expect(uart.data['properties'].temp.unit).toEqual('qudtUnit:DEG_C');
      expect(uart.data['properties'].humidity.type).toEqual('number');
      expect(uart.data['properties'].humidity['ex:bitOffset']).toEqual(24);
      expect(uart.data['properties'].humidity['ex:bitLength']).toEqual(16);
      expect(uart.data['properties'].humidity.signed).toBeFalsy();
      expect(uart.data['properties'].humidity.scale).toEqual(0.0025);
      expect(uart.data['properties'].humidity.unit).toEqual('qudtUnit:PERCENT');
      expect(uart.data['properties'].pressure.type).toEqual('number');
      expect(uart.data['properties'].pressure['ex:bitOffset']).toEqual(40);
      expect(uart.data['properties'].pressure['ex:bitLength']).toEqual(16);
      expect(uart.data['properties'].pressure.signed).toBeFalsy();
      expect(uart.data['properties'].pressure.unit).toEqual('qudt:PA');
      expect(uart.data['properties']['acc-x'].type).toEqual('integer');
      expect(uart.data['properties']['acc-x']['ex:bitOffset']).toEqual(56);
      expect(uart.data['properties']['acc-x']['ex:bitLength']).toEqual(16);
      expect(uart.data['properties']['acc-x'].byteOrder).toEqual(
        'LITTLE_ENDIAN'
      );
      expect(uart.data['properties']['acc-x'].unit).toEqual('qudtUnit:mG');

      expect(uart.data['properties']['acc-y'].type).toEqual('integer');
      expect(uart.data['properties']['acc-y']['ex:bitOffset']).toEqual(72);
      expect(uart.data['properties']['acc-y']['ex:bitLength']).toEqual(16);
      expect(uart.data['properties']['acc-y'].byteOrder).toEqual(
        'LITTLE_ENDIAN'
      );
      expect(uart.data['properties']['acc-y'].unit).toEqual('qudtUnit:mG');

      expect(uart.data['properties']['acc-z'].type).toEqual('integer');
      expect(uart.data['properties']['acc-z']['ex:bitOffset']).toEqual(88);
      expect(uart.data['properties']['acc-z']['ex:bitLength']).toEqual(16);
      expect(uart.data['properties']['acc-z'].byteOrder).toEqual(
        'LITTLE_ENDIAN'
      );
      expect(uart.data['properties']['acc-z'].unit).toEqual('qudtUnit:mG');

      expect(uart.data['properties']['power-info'].type).toEqual('integer');
      expect(uart.data['properties']['power-info']['ex:bitOffset']).toEqual(
        104
      );
      expect(uart.data['properties']['power-info']['ex:bitLength']).toEqual(16);

      expect(uart.data['properties']['movement-counter'].type).toEqual(
        'integer'
      );
      expect(
        uart.data['properties']['movement-counter']['ex:bitOffset']
      ).toEqual(120);
      expect(
        uart.data['properties']['movement-counter']['ex:bitLength']
      ).toEqual(8);

      expect(
        uart.data['properties']['measurement-sequence-number'].type
      ).toEqual('integer');
      expect(
        uart.data['properties']['measurement-sequence-number']['ex:bitOffset']
      ).toEqual(128);
      expect(
        uart.data['properties']['measurement-sequence-number']['ex:bitLength']
      ).toEqual(16);
    });
  });
});
