// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';

import {EddystoneHelpers} from '../../src/bindings/binding-bluetooth/EddystoneHelpers';

const {parseCapabilities, decodeAdvertisingData, encodeAdvertisingData} =
  EddystoneHelpers;

describe('EddystoneHelpers', () => {
  describe('parseCapabilities', () => {
    test('correctly parses eddystone capabilities', () => {
      const capabilities = [
        0, 4, 1, 3, 0, 15, -30, -20, -16, -12, -8, -4, 0, 4,
      ];
      const hexString = Buffer.from(capabilities).toString('hex');
      const parsed = parseCapabilities(hexString);
      expect(parsed).toEqual({
        specVersion: 0,
        maxSlots: 4,
        maxEidPerSlot: 1,
        isVarriableAdvIntervalSupported: true,
        isVariableTxPowerSupported: true,
        isUidSupported: true,
        isUrlSupported: true,
        isTlmSupported: true,
        isEidSupported: true,
        supportedTxPowerLevels: [-30, -20, -16, -12, -8, -4, 0, 4],
      });
    });
    test('stops parsing after tx levels', () => {
      const capabilities = [
        0, 4, 1, 3, 0, 15, -30, -20, -16, -12, -8, -4, 0, 4, 1, 2, 3, 4, 5, 6,
      ];
      const hexString = Buffer.from(capabilities).toString('hex');
      const parsed = parseCapabilities(hexString);
      expect(parsed).toEqual({
        specVersion: 0,
        maxSlots: 4,
        maxEidPerSlot: 1,
        isVarriableAdvIntervalSupported: true,
        isVariableTxPowerSupported: true,
        isUidSupported: true,
        isUrlSupported: true,
        isTlmSupported: true,
        isEidSupported: true,
        supportedTxPowerLevels: [-30, -20, -16, -12, -8, -4, 0, 4],
      });
    });
  });
  describe('decodeAdvertisingData', () => {
    test('returns namespace + instance for eddystone uids', () => {
      const uid = [
        0, // Frame type: UID
        20, // Calibrated Tx power at 0m
        1, // 10-byte namespace
        3,
        0,
        15,
        -30,
        -20,
        -16,
        -12,
        -8,
        -4,
        0, // 6-byte instance
        0,
        0,
        0,
        0,
        1,
        0, // Reserved for future use, must be 0x00
        0, // Reserved for future use, must be 0x00
      ];
      const hexString = Buffer.from(uid).toString('hex');
      const parsed = decodeAdvertisingData(hexString);
      expect(parsed).toEqual('0103000fe2ecf0f4f8fc000000000001');
    });
    test('returns url for all supported schemes', () => {
      const url = [
        0x10, // Frame type: URL
        0xf8, // Power
        0x00, // http://www.
        'e'.toLowerCase().charCodeAt(0),
        'x'.toLowerCase().charCodeAt(0),
        'a'.toLowerCase().charCodeAt(0),
        'm'.toLowerCase().charCodeAt(0),
        'p'.toLowerCase().charCodeAt(0),
        'l'.toLowerCase().charCodeAt(0),
        'e'.toLowerCase().charCodeAt(0),
        0x00, // .com/
      ];
      let hexString = Buffer.from(url).toString('hex');
      let parsed = decodeAdvertisingData(hexString);
      expect(parsed).toEqual('http://www.example.com/');
      url[2] = 0x01; // https://www.
      hexString = Buffer.from(url).toString('hex');
      parsed = decodeAdvertisingData(hexString);
      expect(parsed).toEqual('https://www.example.com/');
      url[2] = 0x02; // http://
      hexString = Buffer.from(url).toString('hex');
      parsed = decodeAdvertisingData(hexString);
      expect(parsed).toEqual('http://example.com/');
      url[2] = 0x03; // https://
      hexString = Buffer.from(url).toString('hex');
      parsed = decodeAdvertisingData(hexString);
      expect(parsed).toEqual('https://example.com/');
    });
    test('throws for unsupported url schemes', () => {
      const url = [
        0x10, // Frame type: URL
        0xf8, // Power
        0x04, // Unsupported schema
        'e'.toLowerCase().charCodeAt(0),
        'x'.toLowerCase().charCodeAt(0),
        'a'.toLowerCase().charCodeAt(0),
        'm'.toLowerCase().charCodeAt(0),
        'p'.toLowerCase().charCodeAt(0),
        'l'.toLowerCase().charCodeAt(0),
        'e'.toLowerCase().charCodeAt(0),
        0x00, // .com/
      ];
      const hexString = Buffer.from(url).toString('hex');
      expect(() => decodeAdvertisingData(hexString)).toThrow();
    });
    test('returns temperature for tlm data', () => {
      const tlm = [
        0x20, // Frame type: TLM
        0x00, // Version
        0x00, // Battery voltage
        0x64,
        0x15, // Beacon temperature
        0x06,
        0x00, // Advertising PDU count
        0x00,
        0x02,
        0xf8,
        0x00, // Time since power-on or reboot
        0x00,
        0x12,
        0xcb,
        0x3a,
      ];
      const hexString = Buffer.from(tlm).toString('hex');
      const parsed = decodeAdvertisingData(hexString);
      expect(parsed).toEqual(21.06);
    });
    test('throws for unsupported frame types', () => {
      // EID
      expect(() => decodeAdvertisingData('30')).toThrow(
        'EID frame type is not supported by blast.'
      );
      // Others
      expect(() => decodeAdvertisingData('40')).toThrow(
        'Eddystone frame type is not valid.'
      );
      expect(() => decodeAdvertisingData('21')).toThrow(
        'Eddystone frame type is not valid.'
      );
      expect(() => decodeAdvertisingData('31')).toThrow(
        'Eddystone frame type is not valid.'
      );
      expect(() => decodeAdvertisingData('01')).toThrow(
        'Eddystone frame type is not valid.'
      );
    });
  });
  describe('encodeAdvertisingData', () => {
    test('correctly encodes urls with supported schemes', () => {
      let url = 'http://www.example.com/';
      let encoded = encodeAdvertisingData(url, 'URL');
      expect(encoded).toEqual(
        new Uint8Array([
          0x10, // Frame type: URL
          0x00, // http://
          'e'.toLowerCase().charCodeAt(0),
          'x'.toLowerCase().charCodeAt(0),
          'a'.toLowerCase().charCodeAt(0),
          'm'.toLowerCase().charCodeAt(0),
          'p'.toLowerCase().charCodeAt(0),
          'l'.toLowerCase().charCodeAt(0),
          'e'.toLowerCase().charCodeAt(0),
          0x00, // .com/
        ])
      );
      url = 'https://www.example.com/';
      encoded = encodeAdvertisingData(url, 'URL');
      expect(encoded).toEqual(
        new Uint8Array([
          0x10, // Frame type: URL
          0x01, // https://
          'e'.toLowerCase().charCodeAt(0),
          'x'.toLowerCase().charCodeAt(0),
          'a'.toLowerCase().charCodeAt(0),
          'm'.toLowerCase().charCodeAt(0),
          'p'.toLowerCase().charCodeAt(0),
          'l'.toLowerCase().charCodeAt(0),
          'e'.toLowerCase().charCodeAt(0),
          0x00, // .com/
        ])
      );
      url = 'http://example.com/';
      encoded = encodeAdvertisingData(url, 'URL');
      expect(encoded).toEqual(
        new Uint8Array([
          0x10, // Frame type: URL
          0x02, // http://
          'e'.toLowerCase().charCodeAt(0),
          'x'.toLowerCase().charCodeAt(0),
          'a'.toLowerCase().charCodeAt(0),
          'm'.toLowerCase().charCodeAt(0),
          'p'.toLowerCase().charCodeAt(0),
          'l'.toLowerCase().charCodeAt(0),
          'e'.toLowerCase().charCodeAt(0),
          0x00, // .com/
        ])
      );
      url = 'https://example.com/';
      encoded = encodeAdvertisingData(url, 'URL');
      expect(encoded).toEqual(
        new Uint8Array([
          0x10, // Frame type: URL
          0x03, // https://
          'e'.toLowerCase().charCodeAt(0),
          'x'.toLowerCase().charCodeAt(0),
          'a'.toLowerCase().charCodeAt(0),
          'm'.toLowerCase().charCodeAt(0),
          'p'.toLowerCase().charCodeAt(0),
          'l'.toLowerCase().charCodeAt(0),
          'e'.toLowerCase().charCodeAt(0),
          0x00, // .com/
        ])
      );
    });
    test('encodes unsupported url schemes', () => {
      const url = 'abc://www.example.com/';
      const encoded = encodeAdvertisingData(url, 'URL');
      expect(encoded).toEqual(
        new Uint8Array([
          0x10, // Frame type: URL
          ...'abc://www.example'.split('').map(c => c.charCodeAt(0)),
          0x00, // .com/
        ])
      );
    });
    test('throws if encoded url is greater than 18 bytes', () => {
      const url = 'http://www.example.com/1234567890';
      expect(() => encodeAdvertisingData(url, 'URL')).toThrow(
        'URL is too long.'
      );
    });
    test('throws for frame types that are not writable', () => {
      expect(() => encodeAdvertisingData('1234', 'EID')).toThrow(
        'EID frame type is not writable.'
      );
      expect(() => encodeAdvertisingData('1234', 'TLM')).toThrow(
        'TLM frame type is not writable.'
      );
    });
    test('throws for unknown frame types', () => {
      expect(() => encodeAdvertisingData('1234', 'XYZ' as any)).toThrow(
        'Unkown frame type. Known types are "UID", "URL", "TLM", or "EID".'
      );
    });
    test('encodes UID data', () => {
      const uid = encodeAdvertisingData(
        '0103000fe2ecf0f4f8fc000000000001',
        'UID'
      );
      expect(uid).toEqual('000103000fe2ecf0f4f8fc000000000001');
    });
    test('throws for invalid UID data', () => {
      let uid = '0103000fe2ecf0f4f8fc0000000000';
      expect(() => encodeAdvertisingData(uid, 'UID')).toThrow(
        'Eddystone UID must be 32 hexadecimal characters.'
      );
      uid = '0103000fe2ecf0f4f8fc0000000000012';
      expect(() => encodeAdvertisingData(uid, 'UID')).toThrow(
        'Eddystone UID must be 32 hexadecimal characters.'
      );
      uid = '0103000fe2ecf0f4f8fc00000000000x';
      expect(() => encodeAdvertisingData(uid, 'UID')).toThrow(
        'Eddystone UID must be 32 hexadecimal characters.'
      );
    });
  });
});
