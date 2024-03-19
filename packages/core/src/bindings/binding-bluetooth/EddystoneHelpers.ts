/**
 * @fileoverview helpers functions to parse Eddystone data from a DataView
 * and writing Eddystone data to a DataView.
 */

/**
 * The Eddystone config service UUID
 */
const EDDYSTONE_CONFIG_SERVICE = 'a3c87500-8ed3-4bdf-8a39-a01bebede295';

const eddystoneCharacteristicUUIDs = [
  'a3c87501-8ed3-4bdf-8a39-a01bebede295',
  'a3c87502-8ed3-4bdf-8a39-a01bebede295',
  'a3c87503-8ed3-4bdf-8a39-a01bebede295',
  'a3c87504-8ed3-4bdf-8a39-a01bebede295',
  'a3c87505-8ed3-4bdf-8a39-a01bebede295',
  'a3c87506-8ed3-4bdf-8a39-a01bebede295',
  'a3c87507-8ed3-4bdf-8a39-a01bebede295',
  'a3c87508-8ed3-4bdf-8a39-a01bebede295',
  'a3c87509-8ed3-4bdf-8a39-a01bebede295',
  'a3c8750a-8ed3-4bdf-8a39-a01bebede295',
  'a3c8750b-8ed3-4bdf-8a39-a01bebede295',
];
type EddystoneCharacteristicUUID =
  (typeof eddystoneCharacteristicUUIDs)[number];

type EddystoneCharacteristicName =
  | 'Capabilities'
  | 'Active Slot'
  | 'Advertising Interval'
  | 'Radio Tx Power'
  | 'Advertised Tx Power'
  | 'Lock State'
  | 'Unlock'
  | 'Public ECDH Key'
  | 'EID Identity Key'
  | 'Adv Slot Data'
  | 'Factory Reset';

/**
 * Characteristics of the Eddystone Config service, see
 * https://github.com/google/eddystone/tree/master/configuration-service
 * for detailed descriptions.
 */
const EDDYSTONE_CHARACTERISTICS: Record<
  EddystoneCharacteristicUUID,
  EddystoneCharacteristicName
> = {
  'a3c87501-8ed3-4bdf-8a39-a01bebede295': 'Capabilities',
  'a3c87502-8ed3-4bdf-8a39-a01bebede295': 'Active Slot',
  'a3c87503-8ed3-4bdf-8a39-a01bebede295': 'Advertising Interval',
  'a3c87504-8ed3-4bdf-8a39-a01bebede295': 'Radio Tx Power',
  'a3c87505-8ed3-4bdf-8a39-a01bebede295': 'Advertised Tx Power',
  'a3c87506-8ed3-4bdf-8a39-a01bebede295': 'Lock State',
  'a3c87507-8ed3-4bdf-8a39-a01bebede295': 'Unlock',
  'a3c87508-8ed3-4bdf-8a39-a01bebede295': 'Public ECDH Key',
  'a3c87509-8ed3-4bdf-8a39-a01bebede295': 'EID Identity Key',
  'a3c8750a-8ed3-4bdf-8a39-a01bebede295': 'Adv Slot Data',
  'a3c8750b-8ed3-4bdf-8a39-a01bebede295': 'Factory Reset',
};

interface Capabilities {
  // Version of the eddystone spec
  specVersion: number;

  // The maximum number of slots this beacon is
  // capable of broadcasting concurrently, inclusive
  // of EID slots. This is the total number of
  // advertisement frames the beacon is capable
  // of broadcasting concurrently.
  maxSlots: number;

  // The maximum number of independent EID slots this
  // beacon is capable of broadcasting.
  // (Independent in this context means full ECDH key
  // exchange to generate the EID with separate identity
  // keys and clock values.)
  maxEidPerSlot: number;

  // True, if the beacon supports individual per-slot
  // advertising intervals. Not set if the beacon supports
  // only a global advertising interval.
  isVarriableAdvIntervalSupported: boolean;

  // True, if the beacon supports individual per-slot Tx
  // powers. Not set if the beacon supports only a single
  // global Tx power.
  isVariableTxPowerSupported: boolean;

  // True, if the beacon supports UID frames.
  isUidSupported: boolean;

  // True, if the beacon supports URL frames.
  isUrlSupported: boolean;

  // True, if the beacon supports TLM frames.
  isTlmSupported: boolean;

  // True, if the beacon supports EID frames.
  isEidSupported: boolean;

  // A variable length array of the supported radio Tx power
  // absolute (dBm) values. Note: This array should be
  // ordered from the lowest power supported at index 0, to
  // the highest power supported at index N.
  // This is to allow the power table to be easily searchable.
  supportedTxPowerLevels: number[];
}

/**
 * Converts a hex string to signed integer of size numSize.
 * @param num the hex string to convert
 * @param numSize the size of the integer to return
 * @returns the signed integer
 */
const HexToSignedInt = function (num: string, numSize: number): number {
  const val = {
    mask: 0x8 * Math.pow(16, numSize - 1),
    sub: -0x1 * Math.pow(16, numSize),
  };
  if ((parseInt(num, 16) & val.mask) > 0) {
    return val.sub + parseInt(num, 16);
  } else {
    return parseInt(num, 16);
  }
};

/**
 * Parses hex string for the Eddystone Capabilities.
 * @param data the data received from the device.
 * @returns An object containing the capabilities.
 */
const parseCapabilities = function (data: string): Capabilities {
  const capabilitiesArray = [];

  for (let i = 0; i < data.length; i += 2) {
    capabilitiesArray.push(HexToSignedInt(data.substring(i, i + 2), 2));
  }

  // Parse the capabilities.
  const supportedTxPowerLevels = [];
  for (let i = 6; i < capabilitiesArray.length; i++) {
    // elements have to be in ascending order
    const lastElem = supportedTxPowerLevels[supportedTxPowerLevels.length - 1];
    if (lastElem && lastElem >= capabilitiesArray[i]) {
      break;
    }
    supportedTxPowerLevels.push(capabilitiesArray[i]);
  }
  return {
    specVersion: capabilitiesArray[0],
    maxSlots: capabilitiesArray[1],
    maxEidPerSlot: capabilitiesArray[2],
    isVarriableAdvIntervalSupported: (capabilitiesArray[3] & 1) !== 0,
    isVariableTxPowerSupported: (capabilitiesArray[3] & 2) !== 0,
    isUidSupported: (capabilitiesArray[5] & 1) !== 0,
    isUrlSupported: (capabilitiesArray[5] & 2) !== 0,
    isTlmSupported: (capabilitiesArray[5] & 4) !== 0,
    isEidSupported: (capabilitiesArray[5] & 8) !== 0,
    supportedTxPowerLevels: supportedTxPowerLevels,
  };
};

/**
 * Gets the advertising data of the currently active slot.
 * @param hexString The advertising data to decode.
 * @return The advertising data of the currently active slot.
 */
const decodeAdvertisingData = function (
  hexString: string
): string | Uint8Array | number {
  const decodeEddystoneUid = function (advData: string) {
    // TX Power is the second byte of the advertised data.
    const txPower = parseInt(advData.substring(2, 4), 16);

    // Namespace is the next 10 bytes.
    const namespace = advData.substring(4, 24);

    // Instance is the next 6 bytes.
    const instance = advData.substring(24, 36);

    return {
      frameType: 'UID',
      txPower: txPower,
      namespace: namespace,
      instance: instance,
    };
  };

  const decodeEddystoneUrl = function (advData: string) {
    // TX Power is the second byte of the advertising data.
    const txPower = parseInt(advData.substring(2, 4), 16);

    // URL Scheme is the third byte of the advertising data.
    const urlScheme = advData.substring(4, 6);
    let urlPrefix = '';
    switch (urlScheme) {
      case '00':
        urlPrefix = 'http://www.';
        break;
      case '01':
        urlPrefix = 'https://www.';
        break;
      case '02':
        urlPrefix = 'http://';
        break;
      case '03':
        urlPrefix = 'https://';
        break;
      default:
        throw new Error('Eddystone URL scheme is not valid.');
    }

    const suffixes = [
      '.com/',
      '.org/',
      '.edu/',
      '.net/',
      '.info/',
      '.biz/',
      '.gov/',
      '.com',
      '.org',
      '.edu',
      '.net',
      '.info',
      '.biz',
      '.gov',
    ];

    // Encoded URL is the remaining bytes of the advertising data.
    const encodedUrl = advData.substring(6, advData.length);
    let url = urlPrefix;
    for (let i = 0; i < encodedUrl.length; i += 2) {
      const charCode = parseInt(encodedUrl.substring(i, i + 2), 16);
      if (charCode < suffixes.length) {
        url += suffixes[charCode];
      } else {
        url += String.fromCharCode(charCode);
      }
    }

    return {
      frameType: 'URL',
      txPower: txPower,
      url: url,
    };
  };

  const decodeEddystoneTlm = function (advData: string) {
    // Byte 0 is the frame type, byte 1 is the version.
    // 2nd and 3rd bytes are the Barrery Voltage, 1mV/bit.
    const batteryVoltage = parseInt(advData.substring(4, 8), 16);

    // 4th and 5th bytes are the beacon temperature.
    const beaconTemperature =
      parseInt(advData.substring(8, 10), 16) +
      parseInt(advData.substring(10, 12), 16) / 100;

    // 6th to 9th bytes are the Advertising PDU count.
    const pduCount = parseInt(advData.substring(12, 20), 16);

    // 10th to 13th bytes are the time since the Beacon last rebooted.
    const timeSinceReboot = parseInt(advData.substring(20, 28), 16);

    return {
      frameType: 'TLM',
      batteryVoltage: batteryVoltage,
      beaconTemperature: beaconTemperature,
      pduCount: pduCount,
      timeSinceReboot: timeSinceReboot,
    };
  };

  // Convert DataView to byte value
  const dataArr = [];
  for (let c = 0; c < hexString.length; c += 2) {
    dataArr.push(parseInt(hexString.substring(c, c + 2), 16));
  }
  const advertisingData = new Uint8Array(dataArr).reduce((acc, byte) => {
    return acc + ('0' + byte.toString(16)).slice(-2);
  }, '');

  // Frame type is the first byte of the advertising data.
  let data;
  switch (advertisingData[0] + advertisingData[1]) {
    case '00':
      data = decodeEddystoneUid(advertisingData);
      return data.namespace + data.instance;
    case '10':
      data = decodeEddystoneUrl(advertisingData);
      return data.url;
    case '20':
      data = decodeEddystoneTlm(advertisingData);
      return data.beaconTemperature;
    case '30':
      throw new Error('EID frame type is not supported by blast.');
    default:
      throw new Error('Eddystone frame type is not valid.');
  }
};

type FrameType = 'UID' | 'URL' | 'TLM' | 'EID';

/**
 * Encodes data to the given frametype format.
 * @param data The data to set.
 * @param frameType The frame type to encode.
 * @returns The encoded data.
 */
const encodeAdvertisingData = function (
  data: string,
  frameType: FrameType
): string | Uint8Array {
  const encodeEddystoneUrl = function (url: string) {
    const URL_SCHEMES = ['http://www.', 'https://www.', 'http://', 'https://'];

    const URL_CODES = [
      '.com/',
      '.org/',
      '.edu/',
      '.net/',
      '.info/',
      '.biz/',
      '.gov/',
      '.com',
      '.org',
      '.edu',
      '.net',
      '.info',
      '.biz',
      '.gov',
    ];

    const encodedUrl = [];
    let position = 0;
    const encoder = new TextEncoder();

    for (let i = 0; i < URL_SCHEMES.length; i++) {
      if (url.startsWith(URL_SCHEMES[i])) {
        encodedUrl.push(i);
        position = URL_SCHEMES[i].length;
        break;
      }
    }

    while (position < url.length) {
      const initialPosition = position;
      for (let i = 0; i < URL_CODES.length; i++) {
        if (url.startsWith(URL_CODES[i], position)) {
          encodedUrl.push(i);
          position += URL_CODES[i].length;
          break;
        }
      }
      if (initialPosition === position) {
        encodedUrl.push(encoder.encode(url[position])[0]);
        position++;
      }
    }

    if (encodedUrl.length > 18) {
      throw new Error('URL is too long.');
    }

    // prefix the frame type
    encodedUrl.splice(0, 0, 0x10);
    return new Uint8Array(encodedUrl);
  };

  let encodedData;

  switch (frameType) {
    case 'URL':
      break;
    case 'UID':
      break;
    case 'TLM':
      throw new Error('TLM frame type is not writable.');
    case 'EID':
      throw new Error('EID frame type is not writable.');
    default:
      throw new Error(
        'Unkown frame type. Known types are "UID", "URL", "TLM", or "EID".'
      );
  }

  if (frameType === 'URL') {
    encodedData = encodeEddystoneUrl(data);
  } else {
    // Checks if the UID is 32 hex chars.
    if (!/^[0-9A-Fa-f]{32}$/.test(data)) {
      throw new Error('Eddystone UID must be 32 hexadecimal characters.');
    }

    // prefix the frame type
    encodedData = '00' + data;
  }

  return encodedData;
};

export const EddystoneHelpers = {
  EDDYSTONE_CONFIG_SERVICE,
  EDDYSTONE_CHARACTERISTICS,
  parseCapabilities,
  decodeAdvertisingData,
  encodeAdvertisingData,
};
