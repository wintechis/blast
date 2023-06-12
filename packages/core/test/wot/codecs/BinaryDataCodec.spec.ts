// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import {BinaryDataStreamCodec} from '../../../src/wot/codecs/BinaryDataCodec';
import {DataSchema} from 'wot-typescript-definitions';

describe('BinaryDataStreamCodec', () => {
  const codec = new BinaryDataStreamCodec();

  describe('getMediaType', () => {
    test('should return application/x.binary-data-stream', () => {
      expect(codec.getMediaType()).toBe('application/x.binary-data-stream');
    });
  });

  describe('byte2int', () => {
    describe('unsigned LE integer values, when pattern is undefined', () => {
      const schema: DataSchema = {
        type: 'number',
      };
      test('should return 0', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(0);
      });
      test('should return 1', () => {
        const buffer = Buffer.from(new Uint8Array([1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(1);
      });
      test('should return 256', () => {
        const buffer = Buffer.from(new Uint8Array([0, 1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(256);
      });
      test('should return 65536', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(65536);
      });
      test('should return 16777216', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(16777216);
      });
    });

    describe('unsigned BE integer values, when pattern is undefined', () => {
      const schema: DataSchema = {
        type: 'number',
        'bdo:byteOrder': 'big',
      };
      test('should return 0', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(0);
      });
      test('should return 1', () => {
        const buffer = Buffer.from(new Uint8Array([1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(1);
      });
      test('should return 256', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(256);
      });
      test('should return 65536', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(65536);
      });
      test('should return 16777216', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(16777216);
      });
    });

    describe('signed LE integer values, when pattern is undefined', () => {
      const schema = {
        type: 'number',
        'bdo:signed': true,
      };
      test('should return 0', () => {
        const buffer = Buffer.from(new Int8Array([0, 0, 0, 0, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(0);
      });
      test('should return 1', () => {
        const buffer = Buffer.from(new Int8Array([1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(1);
      });
      test('should return -1', () => {
        const buffer = Buffer.from(new Int8Array([-1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(-1);
      });
      test('should return 256', () => {
        const buffer = Buffer.from(new Int8Array([0, 1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(256);
      });
      test('should return -256', () => {
        const buffer = Buffer.from(new Int8Array([0, -1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(-256);
      });
      test('should return 65536', () => {
        const buffer = Buffer.from(new Int8Array([0, 0, 1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(65536);
      });
      test('should return -65536', () => {
        const buffer = Buffer.from(new Int8Array([0, 0, -1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(-65536);
      });
      test('should return 16777216', () => {
        const buffer = Buffer.from(new Int8Array([0, 0, 0, 1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(16777216);
      });
    });

    describe('signed BE integer values, when pattern is undefined', () => {
      const schema = {
        type: 'number',
        'bdo:signed': true,
        'bdo:byteOrder': 'big',
      };
      test('should return 0', () => {
        const buffer = Buffer.from(new Int8Array([0, 0, 0, 0, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(0);
      });
      test('should return 1', () => {
        const buffer = Buffer.from(new Int8Array([1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(1);
      });
      test('should return -1', () => {
        const buffer = Buffer.from(new Int8Array([-1]));
        expect(codec.bytesToValue(buffer, schema)).toBe(-1);
      });
      test('should return 256', () => {
        const buffer = Buffer.from(new Int8Array([1, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(256);
      });
      test('should return -256', () => {
        const buffer = Buffer.from(new Int8Array([-1, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(-256);
      });
      test('should return 65536', () => {
        const buffer = Buffer.from(new Int8Array([1, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(65536);
      });
      test('should return -65536', () => {
        const buffer = Buffer.from(new Int8Array([-1, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(-65536);
      });
      test('should return 16777216', () => {
        const buffer = Buffer.from(new Int8Array([1, 0, 0, 0]));
        expect(codec.bytesToValue(buffer, schema)).toBe(16777216);
      });
    });
  });

  describe('byte2string', () => {
    const schema: DataSchema = {
      type: 'string',
    };
    test('should return "abc"', () => {
      const buffer = Buffer.from(new Uint8Array([97, 98, 99]));
      expect(codec.bytesToValue(buffer, schema)).toBe('abc');
    });
    test('should return "cafebabe"', () => {
      schema.format = 'hex';
      const buffer = Buffer.from(new Uint8Array([202, 254, 186, 190]));
      expect(codec.bytesToValue(buffer, schema)).toBe('cafebabe');
    });
    test('should throw on invalid format', () => {
      schema.format = 'invalid';
      const buffer = Buffer.from(new Uint8Array([202, 254, 186, 190]));
      expect(() => codec.bytesToValue(buffer, schema)).toThrow(
        'String can not be converted to bytes, format not supported'
      );
    });
  });

  describe('byte2object', () => {
    const schema: DataSchema = {
      type: 'object',
    };
    test('should return { a: 1, b: "abc" }', () => {
      const text = new TextEncoder().encode(
        JSON.stringify({
          a: 1,
          b: 'abc',
        })
      );
      const buffer = Buffer.from(text);
      expect(codec.bytesToValue(buffer, schema)).toEqual({
        a: 1,
        b: 'abc',
      });
    });
  });
});
