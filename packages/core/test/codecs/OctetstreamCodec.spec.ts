// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from 'bun:test';
import {OctetstreamCodec} from '../../src/codecs/OctetstreamCodec';
import {DataSchema} from 'wot-typescript-definitions';
import RuuviTag from '../../../tds/src/tds/RuuviTag.json';

/**
 * BLAST vendors node-wot's octetstream codec in order to add two non-standard data-schema
 * keywords that upstream does not support:
 *
 *   `scale`  - decode the field as an integer and multiply by this factor
 *   `signed` - override the `signed` content-type parameter from the data schema
 *
 * These are the sole reason the @node-wot/core fork existed. This suite pins their behaviour
 * so a future re-sync with upstream cannot silently drop them.
 */
describe('OctetstreamCodec', () => {
  const codec = new OctetstreamCodec();

  test('getMediaType returns application/octet-stream', () => {
    expect(codec.getMediaType()).toBe('application/octet-stream');
  });

  describe('scale', () => {
    test('multiplies a signed integer field by the scale factor', () => {
      // 0x12FC = 4860; 4860 * 0.005 = 24.3
      const schema: DataSchema = {
        type: 'number',
        'ex:bitLength': 16,
        scale: 0.005,
      };
      expect(codec.bytesToValue(Buffer.from([0x12, 0xfc]), schema)).toBeCloseTo(
        24.3,
        10
      );
    });

    test('applies scale to negative values (field stays signed)', () => {
      // 0xFF38 as a signed 16-bit int is -200; -200 * 0.005 = -1.0
      const schema: DataSchema = {
        type: 'number',
        'ex:bitLength': 16,
        scale: 0.005,
      };
      expect(codec.bytesToValue(Buffer.from([0xff, 0x38]), schema)).toBeCloseTo(
        -1.0,
        10
      );
    });

    test('without scale the same bytes decode as an IEEE float, not a scaled int', () => {
      const schema: DataSchema = {type: 'number', 'ex:bitLength': 16};
      expect(codec.bytesToValue(Buffer.from([0x12, 0xfc]), schema)).not.toBe(
        24.3
      );
    });
  });

  describe('signed', () => {
    test('schema signed:false decodes a high-bit value as unsigned', () => {
      // 0x8000 -> 32768 unsigned, -32768 signed
      const schema: DataSchema = {
        type: 'integer',
        'ex:bitLength': 16,
        signed: false,
      };
      expect(codec.bytesToValue(Buffer.from([0x80, 0x00]), schema)).toBe(32768);
    });

    test('defaults to signed when the schema says nothing', () => {
      const schema: DataSchema = {type: 'integer', 'ex:bitLength': 16};
      expect(codec.bytesToValue(Buffer.from([0x80, 0x00]), schema)).toBe(-32768);
    });

    test('schema signed:false combines with scale', () => {
      // 0x8000 -> 32768 unsigned; 32768 * 0.0025 = 81.92
      const schema: DataSchema = {
        type: 'number',
        'ex:bitLength': 16,
        signed: false,
        scale: 0.0025,
      };
      expect(codec.bytesToValue(Buffer.from([0x80, 0x00]), schema)).toBeCloseTo(
        81.92,
        10
      );
    });
  });

  describe('RuuviTag GapBroadcast (real TD, nested object schema)', () => {
    // Official Ruuvi RAWv2 "valid data" test vector.
    // https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2
    const payload = Buffer.from([
      0x05, 0x12, 0xfc, 0x53, 0x94, 0xc3, 0x7c, 0x00, 0x04, 0xff, 0xfc, 0x04,
      0x0c, 0xac, 0x36, 0x42, 0x00, 0xcd, 0xcb, 0xb8, 0x33, 0x4c, 0x88, 0x4f,
    ]);
    const schema = RuuviTag.events.GapBroadcast.data as DataSchema;

    const decoded = () =>
      codec.bytesToValue(payload, schema) as Record<string, number>;

    test('decodes temperature via scale on a nested property', () => {
      // scale + signed live on a property nested inside the object schema, so they must be
      // handled inside the codec's own recursion - a wrapper over bytesToValue cannot do this.
      expect(decoded().temp).toBeCloseTo(24.3, 10);
    });

    test('decodes humidity via scale + signed:false', () => {
      expect(decoded().humidity).toBeCloseTo(53.49, 10);
    });

    test('decodes the remaining fields', () => {
      const d = decoded();
      expect(d.format).toBe(5);
      expect(d.pressure).toBe(50044); // TD does not model RAWv2's +50000 Pa offset
      expect(d['acc-y']).toBe(-4); // signed by default
      expect(d['acc-z']).toBe(1036);
      expect(d['power-info']).toBe(1377); // 11-bit field -> 1377 + 1600 mV = 2.977 V
      expect(d['tx-power']).toBe(22); // 5-bit field -> -40 + 22*2 = +4 dBm
      expect(d['movement-counter']).toBe(66);
      expect(d['measurement-sequence-number']).toBe(205);
    });
  });
});
