// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/GoveeLamp.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('GoveeLamp Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('power', () => {
      const power = thing?.properties.power;
      expect(power).toBeDefined();
      expect(power.readOnly).toBeFalsy();
      expect(power.writeOnly).toBeTruthy();
      expect(power.observable).toBeFalsy();
      expect(power.type).toEqual('object');
      expect(power.properties).toBeDefined();
      // commandId, integer, bitlength 8, bitoffset 0, default 51
      expect(power.properties.commandId).toBeDefined();
      expect(power.properties.commandId.type).toEqual('integer');
      expect(power.properties.commandId['ex:bitLength']).toEqual(8);
      expect(power.properties.commandId['ex:bitOffset']).toEqual(0);
      expect(power.properties.commandId.default).toEqual(51);
      // packet type, integer, bitlength 8, bitoffset 8, default 1
      expect(power.properties.packetType).toBeDefined();
      expect(power.properties.packetType.type).toEqual('integer');
      expect(power.properties.packetType['ex:bitLength']).toEqual(8);
      expect(power.properties.packetType['ex:bitOffset']).toEqual(8);
      expect(power.properties.packetType.default).toEqual(1);
      // power, boolean, bitlength 1, bitoffset 23
      expect(power.properties.power).toBeDefined();
      expect(power.properties.power.type).toEqual('boolean');
      expect(power.properties.power['ex:bitLength']).toEqual(1);
      expect(power.properties.power['ex:bitOffset']).toEqual(23);
      // checksum, integer, bitlength 8, bitoffset 152
      expect(power.properties.checksum).toBeDefined();
      expect(power.properties.checksum.type).toEqual('integer');
      expect(power.properties.checksum['ex:bitLength']).toEqual(8);
      expect(power.properties.checksum['ex:bitOffset']).toEqual(152);
    });
    test('brightness', () => {
      const brightness = thing?.properties.brightness;
      expect(brightness).toBeDefined();
      expect(brightness.readOnly).toBeFalsy();
      expect(brightness.writeOnly).toBeTruthy();
      expect(brightness.observable).toBeFalsy();
      expect(brightness.type).toEqual('object');
      expect(brightness.properties).toBeDefined();
      // commandId, integer, bitlength 8, bitoffset 0, default 51
      expect(brightness.properties.commandId).toBeDefined();
      expect(brightness.properties.commandId.type).toEqual('integer');
      expect(brightness.properties.commandId['ex:bitLength']).toEqual(8);
      expect(brightness.properties.commandId['ex:bitOffset']).toEqual(0);
      expect(brightness.properties.commandId.default).toEqual(51);
      // packet type, integer, bitlength 8, bitoffset 8, default 4
      expect(brightness.properties.packetType).toBeDefined();
      expect(brightness.properties.packetType.type).toEqual('integer');
      expect(brightness.properties.packetType['ex:bitLength']).toEqual(8);
      expect(brightness.properties.packetType['ex:bitOffset']).toEqual(8);
      expect(brightness.properties.packetType.default).toEqual(4);
      // brightness, integer, bitlength 8, bitoffset 16
      expect(brightness.properties.brightness).toBeDefined();
      expect(brightness.properties.brightness.type).toEqual('integer');
      expect(brightness.properties.brightness['ex:bitLength']).toEqual(8);
      expect(brightness.properties.brightness['ex:bitOffset']).toEqual(16);
      // checksum, integer, bitlength 8, bitoffset 152
      expect(brightness.properties.checksum).toBeDefined();
      expect(brightness.properties.checksum.type).toEqual('integer');
      expect(brightness.properties.checksum['ex:bitLength']).toEqual(8);
      expect(brightness.properties.checksum['ex:bitOffset']).toEqual(152);
    });
    test('colour', () => {
      const colour = thing?.properties.colour;
      expect(colour).toBeDefined();
      expect(colour.readOnly).toBeFalsy();
      expect(colour.writeOnly).toBeTruthy();
      expect(colour.observable).toBeFalsy();
      expect(colour.type).toEqual('object');
      expect(colour.properties).toBeDefined();
      // commandId, integer, bitlength 8, bitoffset 0, default 51
      expect(colour.properties.commandId).toBeDefined();
      expect(colour.properties.commandId.type).toEqual('integer');
      expect(colour.properties.commandId['ex:bitLength']).toEqual(8);
      expect(colour.properties.commandId['ex:bitOffset']).toEqual(0);
      expect(colour.properties.commandId.default).toEqual(51);
      // packet type, integer, bitlength 8, bitoffset 8, default 5
      expect(colour.properties.packetType).toBeDefined();
      expect(colour.properties.packetType.type).toEqual('integer');
      expect(colour.properties.packetType['ex:bitLength']).toEqual(8);
      expect(colour.properties.packetType['ex:bitOffset']).toEqual(8);
      expect(colour.properties.packetType.default).toEqual(5);
      // packetType2, integer, bitlength 8, bitoffset 16, default 2
      expect(colour.properties.packetType2).toBeDefined();
      expect(colour.properties.packetType2.type).toEqual('integer');
      expect(colour.properties.packetType2['ex:bitLength']).toEqual(8);
      expect(colour.properties.packetType2['ex:bitOffset']).toEqual(16);
      expect(colour.properties.packetType2.default).toEqual(2);
      // red, integer, bitlength 8, bitoffset 24
      expect(colour.properties.red).toBeDefined();
      expect(colour.properties.red.type).toEqual('integer');
      expect(colour.properties.red['ex:bitLength']).toEqual(8);
      expect(colour.properties.red['ex:bitOffset']).toEqual(24);
      // green, integer, bitlength 8, bitoffset 32
      expect(colour.properties.green).toBeDefined();
      expect(colour.properties.green.type).toEqual('integer');
      expect(colour.properties.green['ex:bitLength']).toEqual(8);
      expect(colour.properties.green['ex:bitOffset']).toEqual(32);
      // blue, integer, bitlength 8, bitoffset 40
      expect(colour.properties.blue).toBeDefined();
      expect(colour.properties.blue.type).toEqual('integer');
      expect(colour.properties.blue['ex:bitLength']).toEqual(8);
      expect(colour.properties.blue['ex:bitOffset']).toEqual(40);
      // checksum, integer, bitlength 8, bitoffset 152
      expect(colour.properties.checksum).toBeDefined();
      expect(colour.properties.checksum.type).toEqual('integer');
      expect(colour.properties.checksum['ex:bitLength']).toEqual(8);
      expect(colour.properties.checksum['ex:bitOffset']).toEqual(152);
    });
  });
});
