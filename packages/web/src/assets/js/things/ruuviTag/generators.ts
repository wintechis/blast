/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 */

declare global {
  interface RAWv1 {
    accelerationX?: number;
    accelerationY?: number;
    accelerationZ?: number;
    battery?: number;
    humidity?: number;
    pressure?: number;
    temperature?: number;
  }

  interface RAWv2 {
    accelerationX?: number;
    accelerationY?: number;
    accelerationZ?: number;
    battery?: number;
    humidity?: number;
    pressure?: number;
    temperature?: number;
    txPower?: number;
    movementCounter?: number;
    measurementSequenceNumber?: number;
    mac?: string;
  }

  let accelerationX: unknown;
  let accelerationY: unknown;
  let accelerationZ: unknown;
  let battery: unknown;
  let humidity: unknown;
  let pressure: unknown;
  let temperature: unknown;
  let txPower: unknown;
  let movementCounter: unknown;
  let measurementSequenceNumber: unknown;
  let mac: unknown;
}

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {LEScanResults} from '../../webBluetooth.js';

/**
 * Generates JavaScript code for the things_ruuviTag block.
 */
JavaScript['things_ruuviTag'] = function (block: Block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';

  JavaScript.definitions_['RuuviTag'] = 'const {RuuviTag} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThing(RuuviTag, ${id}));`;

  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the ruuviTag_event block.
 */
JavaScript['ruuviTag_event'] = function (block: Block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }
  const ownId = JavaScript.quote_(block.id);

  const handler = `ruuvi_handleEvents(${ownId}, ${blockId}, ${thing}, ${statements})\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

const parseRawV1 = function (data: ArrayBuffer): RAWv1 {
  const dataString = arrayBufferToHex(data);

  const humidityStart = 6;
  const humidityEnd = 8;
  const temperatureStart = 8;
  const temperatureEnd = 12;
  const pressureStart = 12;
  const pressureEnd = 16;
  const accelerationXStart = 16;
  const accelerationXEnd = 20;
  const accelerationYStart = 20;
  const accelerationYEnd = 24;
  const accelerationZStart = 24;
  const accelerationZEnd = 28;
  const batteryStart = 28;
  const batteryEnd = 32;

  let humidity = parseInt(dataString.substring(humidityStart, humidityEnd), 16);
  humidity /= 2; // scale

  const temperatureString = dataString.substring(
    temperatureStart,
    temperatureEnd
  );
  let temperature = parseInt(temperatureString.substring(0, 2), 16); // Full degrees
  temperature += parseInt(temperatureString.substring(2, 4), 16) / 100; // Decimals
  if (temperature > 128) {
    // Ruuvi format, sign bit + value
    temperature = temperature - 128;
    temperature = 0 - temperature;
  }

  let pressure = parseInt(dataString.substring(pressureStart, pressureEnd), 16); // uint16_t pascals
  pressure += 50000; // Ruuvi format

  let accelerationX = parseInt(
    dataString.substring(accelerationXStart, accelerationXEnd),
    16
  ); // milli-g
  if (accelerationX > 32767) {
    accelerationX -= 65536;
  } // two's complement

  let accelerationY = parseInt(
    dataString.substring(accelerationYStart, accelerationYEnd),
    16
  ); // milli-g
  if (accelerationY > 32767) {
    accelerationY -= 65536;
  } // two's complement

  let accelerationZ = parseInt(
    dataString.substring(accelerationZStart, accelerationZEnd),
    16
  ); // milli-g
  if (accelerationZ > 32767) {
    accelerationZ -= 65536;
  } // two's complement

  const battery = parseInt(dataString.substring(batteryStart, batteryEnd), 16); // milli-g

  return {
    accelerationX,
    accelerationY,
    accelerationZ,
    battery,
    humidity,
    pressure,
    temperature,
  };
};

const parseRawV2 = function (data: ArrayBuffer): RAWv2 {
  const dataArr = new Uint8Array(data);

  const int2Hex = (str: number) =>
    ('0' + str.toString(16).toUpperCase()).slice(-2);

  let temperature: number | undefined = (dataArr[1] << 8) | (dataArr[2] & 0xff);
  if (temperature === 32768) {
    // ruuvi spec := 'invalid/not available'
    temperature = undefined;
  } else if (temperature > 32768) {
    // two's complement
    temperature = Number(((temperature - 65536) * 0.005).toFixed(4));
  } else {
    temperature = Number((temperature * 0.005).toFixed(4));
  }

  let humidity: number | undefined =
    ((dataArr[3] & 0xff) << 8) | (dataArr[4] & 0xff);
  humidity =
    humidity !== 65535 ? Number((humidity * 0.0025).toFixed(4)) : undefined;

  let pressure: number | undefined =
    ((dataArr[5] & 0xff) << 8) | (dataArr[6] & 0xff);
  pressure =
    pressure !== 65535 ? Number((pressure + 50000).toFixed(4)) : undefined;

  let accelerationX: number | undefined =
    (dataArr[7] << 8) | (dataArr[8] & 0xff);
  if (accelerationX === 32768) {
    // ruuvi spec := 'invalid/not available'
    accelerationX = undefined;
  } else if (accelerationX > 32768) {
    // two's complement
    accelerationX = accelerationX - 65536;
  }

  let accelerationY: number | undefined =
    (dataArr[9] << 8) | (dataArr[10] & 0xff);
  if (accelerationY === 32768) {
    // ruuvi spec := 'invalid/not available'
    accelerationY = undefined;
  } else if (accelerationY > 32768) {
    // two's complement
    accelerationY = accelerationY - 65536;
  }

  let accelerationZ: number | undefined =
    (dataArr[11] << 8) | (dataArr[12] & 0xff);
  if (accelerationZ === 32768) {
    // ruuvi spec := 'invalid/not available'
    accelerationZ = undefined;
  } else if (accelerationZ > 32768) {
    // two's complement
    accelerationZ = accelerationZ - 65536;
  }

  const powerInfo = ((dataArr[13] & 0xff) << 8) | (dataArr[14] & 0xff);

  let battery: number | undefined = powerInfo >>> 5;
  battery = battery !== 2047 ? battery + 1600 : undefined;

  let txPower: number | undefined = powerInfo & 0b11111;
  txPower = txPower !== 31 ? txPower * 2 - 40 : undefined;

  let movementCounter: number | undefined = dataArr[15] & 0xff;
  movementCounter = movementCounter !== 255 ? movementCounter : undefined;

  let measurementSequenceNumber: number | undefined =
    ((dataArr[16] & 0xff) << 8) | (dataArr[17] & 0xff);
  measurementSequenceNumber =
    measurementSequenceNumber !== 65535 ? measurementSequenceNumber : undefined;

  const mac = [
    int2Hex(dataArr[18]),
    int2Hex(dataArr[19]),
    int2Hex(dataArr[20]),
    int2Hex(dataArr[21]),
    int2Hex(dataArr[22]),
    int2Hex(dataArr[23]),
  ].join(':');

  return {
    accelerationX,
    accelerationY,
    accelerationZ,
    battery,
    humidity,
    mac,
    measurementSequenceNumber,
    movementCounter,
    pressure,
    temperature,
    txPower,
  };
};

// Pre-computing the hex values for the data format bytes
const byteToHex: Array<string> = [];
for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, '0');
  byteToHex.push(hexOctet);
}

/**
 * Converts an ArrayBuffer to a hex string.
 * @param arrayBuffer The array buffer to convert.
 * @returns The hex string.
 */
function arrayBufferToHex(arrayBuffer: ArrayBuffer) {
  const buff = new Uint8Array(arrayBuffer);
  const hexOctets = [];

  for (let i = 0; i < buff.length; ++i) {
    hexOctets.push(byteToHex[buff[i]]);
  }

  return hexOctets.join('');
}

/**
 * Handles RuuviTag events.
 */
(globalThis as any)['ruuvi_handleEvents'] = async function (
  ownId: string,
  blockId: string,
  id: BluetoothDevice['id'],
  statements: string
): Promise<void> {
  if (id === null) {
    console.error('No thermometer is set');
  }

  /**
   * Tries getting the measurements from the RuuviTag, throws an error after 30 tries.
   * @param tries the current number of tries.
   * @returns the measurements.
   */
  const getAdvertisementData = async function (
    tries: number
  ): Promise<void | RAWv2 | RAWv1> {
    // try to get the measurements from the cache once per second for 10 seconds
    if (tries < 30) {
      const events = LEScanResults[id];
      if (events) {
        for (const event of events) {
          const data = event.manufacturerData.get(0x0499);
          if (data) {
            const buffer = data.buffer;
            const dataFormat = data.getUint8(0);
            if (dataFormat === 3) {
              return new Promise(resolve => resolve(parseRawV1(buffer)));
            } else if (dataFormat === 5) {
              return new Promise(resolve => resolve(parseRawV2(buffer)));
            }
          }
        }
      }
      // no measurements found, try again in 1 second
      return new Promise(resolve =>
        setTimeout(
          () =>
            resolve(
              getAdvertisementData(tries + 1) as unknown as RAWv1 | RAWv2
            ),
          1000
        )
      );
    }
    console.error('No measurements found after 30 seconds.');
  };

  const parsedData = (await getAdvertisementData(0)) as RAWv1 | RAWv2;

  if (parsedData) {
    // declare parsedData in global scope
    Object.assign(globalThis, parsedData);
    // execute statements
    eval(`(async () => {${statements}})();`);
  }
};
