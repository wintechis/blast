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
    describe('unsigned LE integer values', () => {
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

    describe('unsigned BE integer values', () => {
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

    describe('signed LE integer values', () => {
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

    describe('signed BE integer values', () => {
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

  describe('unsupported datatype throws', () => {
    const schema: DataSchema = {
      type: 'invalid',
    };
    test('should throw', () => {
      const buffer = Buffer.from(new Uint8Array([97, 98, 99]));
      expect(() => codec.bytesToValue(buffer, schema)).toThrow(
        'Datatype invalid not supported by codec'
      );
    });
  });

  describe('int2bytes', () => {
    describe('unsigned LE integer values', () => {
      const schema = {
        type: 'number',
        'bdo:bytelength': 4,
      };
      test('should return [0, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 0]));
        expect(codec.valueToBytes(0, schema)).toEqual(buffer);
      });
      test('should return [1, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0, 0, 0]));
        expect(codec.valueToBytes(1, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 255, 255]));
        expect(codec.valueToBytes(4294967295, schema)).toEqual(buffer);
      });
      test('should return [0, 1, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 1, 0, 0]));
        expect(codec.valueToBytes(256, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 255, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 255, 0]));
        expect(codec.valueToBytes(16777215, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 1, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 1, 0]));
        expect(codec.valueToBytes(65536, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 255, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 255, 0]));
        expect(codec.valueToBytes(16711680, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 0, 1]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 1]));
        expect(codec.valueToBytes(16777216, schema)).toEqual(buffer);
      });
    });

    describe('signed LE integer values', () => {
      const schema = {
        type: 'number',
        'bdo:bytelength': 4,
        'bdo:signed': true,
      };
      test('should return [0, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 0]));
        expect(codec.valueToBytes(0, schema)).toEqual(buffer);
      });
      test('should return [1, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0, 0, 0]));
        expect(codec.valueToBytes(1, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 255, 255]));
        expect(codec.valueToBytes(-1, schema)).toEqual(buffer);
      });
      test('should return [0, 1, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 1, 0, 0]));
        expect(codec.valueToBytes(256, schema)).toEqual(buffer);
      });
      test('should return [0, 255, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 255, 255, 255]));
        expect(codec.valueToBytes(-256, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 1, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 1, 0]));
        expect(codec.valueToBytes(65536, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 255, 255]));
        expect(codec.valueToBytes(-65536, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 0, 1]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 1]));
        expect(codec.valueToBytes(16777216, schema)).toEqual(buffer);
      });
    });

    describe('unsigned BE integer values', () => {
      const schema = {
        type: 'number',
        'bdo:bytelength': 4,
        'bdo:byteOrder': 'big',
      };
      test('should return [0, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 0]));
        expect(codec.valueToBytes(0, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 0, 1]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 1]));
        expect(codec.valueToBytes(1, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 255, 255]));
        expect(codec.valueToBytes(4294967295, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 1, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 1, 0]));
        expect(codec.valueToBytes(256, schema)).toEqual(buffer);
      });
      test('should return [0, 255, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 255, 255, 255]));
        expect(codec.valueToBytes(16777215, schema)).toEqual(buffer);
      });
      test('should return [0, 1, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 1, 0, 0]));
        expect(codec.valueToBytes(65536, schema)).toEqual(buffer);
      });
      test('should return [0, 255, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 255, 0, 0]));
        expect(codec.valueToBytes(16711680, schema)).toEqual(buffer);
      });
      test('should return [1, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0, 0, 0]));
        expect(codec.valueToBytes(16777216, schema)).toEqual(buffer);
      });
    });

    describe('signed BE integer values', () => {
      const schema = {
        type: 'number',
        'bdo:bytelength': 4,
        'bdo:byteOrder': 'big',
        'bdo:signed': true,
      };
      test('should return [0, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 0]));
        expect(codec.valueToBytes(0, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 0, 1]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 0, 1]));
        expect(codec.valueToBytes(1, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 255, 255]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 255, 255]));
        expect(codec.valueToBytes(-1, schema)).toEqual(buffer);
      });
      test('should return [0, 0, 1, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 0, 1, 0]));
        expect(codec.valueToBytes(256, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 255, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 255, 0]));
        expect(codec.valueToBytes(-256, schema)).toEqual(buffer);
      });
      test('should return [0, 1, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([0, 1, 0, 0]));
        expect(codec.valueToBytes(65536, schema)).toEqual(buffer);
      });
      test('should return [255, 255, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([255, 255, 0, 0]));
        expect(codec.valueToBytes(-65536, schema)).toEqual(buffer);
      });
      test('should return [1, 0, 0, 0]', () => {
        const buffer = Buffer.from(new Uint8Array([1, 0, 0, 0]));
        expect(codec.valueToBytes(16777216, schema)).toEqual(buffer);
      });
    });
  });

  describe('string2bytes', () => {
    const schema = {
      type: 'string',
    };

    test('should return []', () => {
      const buffer = Buffer.from(new Uint8Array([]));
      expect(codec.valueToBytes('', schema)).toEqual(buffer);
    });
    test('should return [97, 98, 99, 100]', () => {
      const buffer = Buffer.from(new Uint8Array([97, 98, 99, 100]));
      expect(codec.valueToBytes('abcd', schema)).toEqual(buffer);
    });
    test('should return [97, 98, 99, 100, 101]', () => {
      const buffer = Buffer.from(new Uint8Array([97, 98, 99, 100, 101]));
      expect(codec.valueToBytes('abcde', schema)).toEqual(buffer);
    });
  });

  describe('object2bytes', () => {
    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'number',
        },
      },
    };

    test('should return stringified object', () => {
      const object = {
        a: 'abc',
        b: 123,
      };
      const stringified = new TextEncoder().encode(JSON.stringify(object));
      const buffer = Buffer.from(stringified);
      expect(codec.valueToBytes(object, schema)).toEqual(buffer);
    });
  });

  describe('array2bytes', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'string',
      },
    };
    test('should return array', () => {
      const array = ['abc', 'def'];
      const stringified = new TextEncoder().encode(JSON.stringify(array));
      const buffer = Buffer.from(stringified);
      expect(codec.valueToBytes(array, schema)).toEqual(buffer);
    });
    test('should return buffer with array', () => {
      schema.items.type = 'number';
      const array = [1, 2, 3, 4, 5];
      const buffer = Buffer.from(array);
      expect(codec.valueToBytes(array, schema)).toEqual(buffer);
    });
  });

  describe('readPattern', () => {
    const schema = {
      type: 'array',
      'bdo:pattern': '{varx}00{vary}11{varz}',
      'bdo:variables': {
        varx: {
          type: 'number',
          'bdo:bytelength': 1,
        },
        vary: {
          type: 'number',
          'bdo:bytelength': 2,
        },
        varz: {
          type: 'number',
          'bdo:bytelength': 1,
        },
      },
    };
    test('should return [5, 24, 1]', () => {
      const buffer = Buffer.from(new Uint8Array([5, 0, 24, 0, 11, 1]));
      expect(codec.bytesToValue(buffer, schema)).toEqual([5, 24, 1]);
    });
  });

  describe('fillStringPattern', () => {
    const schema = {
      type: 'string',
      'bdo:pattern': '{varx}00{vary}11{varz}',
      'bdo:variables': {
        varx: {
          type: 'number',
          'bdo:bytelength': 1,
        },
        vary: {
          type: 'number',
          'bdo:bytelength': 2,
        },
        varz: {
          type: 'number',
          'bdo:bytelength': 1,
        },
      },
    };
    test('should return "4200071113', () => {
      const buffer = Buffer.from(new Uint8Array([48, 48, 49, 49]));
      expect(codec.valueToBytes('4200071113', schema)).toEqual(buffer);
    });
  });
});
