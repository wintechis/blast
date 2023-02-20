/**
 * @fileoverview Javascript generators for (generic) bluetooth blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

JavaScript['things_eddyStoneDevice'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.definitions_['EddystoneDevice'] =
    'const {EddystoneDevice} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThing(EddystoneDevice, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

JavaScript['things_bluetoothGeneric'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.definitions_['BluetoothGeneric'] =
    'const {BluetoothGeneric} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThing(BluetoothGeneric, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_signal_strength block.
 */
JavaScript['bluetoothGeneric_get_signal_strength_wb'] = function (
  block: Block
): [string, number] {
  const id =
    JavaScript.quote_(
      block.getInputTargetBlock('thing')?.getFieldValue('id')
    ) || '';
  const getDeviceById = JavaScript.provideFunction_('getDeviceById', [
    'asnyc function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(id) {',
    '  const devices = await navigator.bluetooth.getDevices();',
    '  return devices.find(device => device.id === id);',
    '}',
  ]);

  const getRssi = JavaScript.provideFunction_('getRssi', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(id) {',
    '  if (!id) {',
    '    throw new Error("No device connected.");',
    '  }',
    `  const device = await ${getDeviceById}(id);`,
    '  return new Promise(resolve => {',
    '    const abortController = new AbortController();',
    '    device.addEventListener("advertisementreceived", event => {',
    '      abortController.abort();',
    '      resolve(event.rssi);',
    '    });',
    '    device.watchAdvertisements({signal: abortController.signal});',
    '  });',
    '}',
  ]);

  const code = `await ${getRssi}(${id})`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the eddyStoneDevice_write_eddystone_property block.
 */
JavaScript['eddyStoneDevice_write_eddystone_property'] = function (
  block: Block
): string {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let property = block.getFieldValue('property');
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;
  const frameType = JavaScript.quote_(block.getFieldValue('frameType'));

  let code;
  if (property === 'advertisedData') {
    property = JavaScript.quote_(property);
    JavaScript.imports_['core'] =
      "const blastCore = await import('../../assets/blast/blast.web.js');";
    JavaScript.definitions_['EddystoneHelpers'] =
      'const {EddystoneHelpers} = blastCore;';
    code = `
data = EddystoneHelpers.encodeAdvertisingData(${value}, ${frameType});
await things.get(${name}).writeProperty(${property}, data);
`;
  } else {
    property = JavaScript.quote_(property);
    code = `await things.get(${name}).writeProperty(${property}, ${value});`;
  }
  return code;
};

/**
 * Generates JavaScript code for the read_eddystone_property block.
 */
JavaScript['read_eddystone_property'] = function (
  block: Block
): [string, number] {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let property = block.getFieldValue('property');

  let code;
  if (property === 'advertisedData') {
    property = JavaScript.quote_(property);
    JavaScript.imports_['core'] =
      "const blastCore = await import('../../assets/blast/blast.web.js');";
    JavaScript.definitions_['EddystoneHelpers'] =
      'const {EddystoneHelpers} = blastCore;';
    code = `
EddystoneHelpers.decodeAdvertisingData(await (await things.get(${name}).readProperty(${property})).value())`;
  } else {
    property = JavaScript.quote_(property);
    code = `await (await things.get(${name}).readProperty(${property})).value()`;
  }
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the read_gatt_characteristic block.
 */
JavaScript['read_gatt_characteristic'] = function (
  block: Block
): [string, number] {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic = JavaScript.quote_(
    block.getFieldValue('characteristic')
  );

  const code = `await (await things.get(${name}).readProperty(${characteristic})).value()`;
  return [code, JavaScript.ORDER_NONE];
};

JavaScript['write_gatt_characteristic'] = function (block: Block): string {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic = JavaScript.quote_(
    block.getFieldValue('characteristic')
  );
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;

  const code = `await things.get(${name}).writeProperty(${characteristic}, ${value});`;
  return code;
};

JavaScript['read_characteristic'] = function (block: Block): [string, number] {
  const id =
    JavaScript.quote_(
      block.getInputTargetBlock('thing')?.getFieldValue('id')
    ) || '';
  const characteristic =
    JavaScript.valueToCode(block, 'characteristic', JavaScript.ORDER_NONE) ||
    null;
  const service =
    JavaScript.valueToCode(block, 'service', JavaScript.ORDER_NONE) || null;
  const format = block.getFieldValue('format');

  const getDeviceById = JavaScript.provideFunction_('getDeviceById', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(id) {',
    '  const devices = await navigator.bluetooth.getDevices();',
    '  return devices.find(device => device.id === id);',
    '}',
  ]);

  const getCharacteristic = JavaScript.provideFunction_('getCharacteristic', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(id, service, characteristic) {',
    `  const device = await ${getDeviceById}(id);`,
    ' if (!device) {',
    '    throw new Error(`Device with id ${id} not found`);',
    '  }',
    '  const server = await device.gatt.connect();',
    '  const GATTservice = await server.getPrimaryService(service);',
    '  return GATTservice.getCharacteristic(characteristic);',
    '}',
  ]);

  if (format === 'hex') {
    const getHexValue = JavaScript.provideFunction_('getHexValue', [
      'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(dataView) {',
      '  const decoder = new TextDecoder();',
      "  return '0x' + Array.from(new Uint8Array(dataView.buffer))",
      '    .map(b => b.toString(16).padStart(2, "0"))',
      '    .join("");',
      '}',
    ]);
    return [
      `${getHexValue}(await (await ${getCharacteristic}(${id}, ${service}, ${characteristic})).readValue())`,
      JavaScript.ORDER_NONE,
    ];
  } else if (format === 'utf8') {
    const getUtf8Value = JavaScript.provideFunction_('getUtf8Value', [
      'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(dataView) {',
      '  const decoder = new TextDecoder();',
      '  return decoder.decode(dataView);',
      '}',
    ]);
    return [
      `${getUtf8Value}(await (await ${getCharacteristic}(${id}, ${service}, ${characteristic})).readValue())`,
      JavaScript.ORDER_NONE,
    ];
  } else if (format === 'decimal') {
    const getDecimalValue = JavaScript.provideFunction_('getDecimalValue', [
      'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(dataView) {',
      '  const decoder = new TextDecoder();',
      '  return Array.from(new Uint8Array(dataView.buffer))',
      '    .map(b => b.toString(10))',
      '    .join("-");',
      '}',
    ]);
    return [
      `${getDecimalValue}(await (await ${getCharacteristic}(${id}, ${service}, ${characteristic})).readValue())`,
      JavaScript.ORDER_NONE,
    ];
  }

  const code = `await (await ${getCharacteristic}(${id}, ${service}, ${characteristic})).readValue()`;
  return [code, JavaScript.ORDER_NONE];
};

JavaScript['write_characteristic'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const characteristic =
    JavaScript.valueToCode(block, 'characteristic', JavaScript.ORDER_NONE) ||
    null;
  const service =
    JavaScript.valueToCode(block, 'service', JavaScript.ORDER_NONE) || null;

  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;

  const getDeviceById = JavaScript.provideFunction_('getDeviceById', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(id) {',
    '  const devices = await navigator.bluetooth.getDevices();',
    '  return devices.find(device => device.id === id);',
    '}',
  ]);

  const getCharacteristic = JavaScript.provideFunction_('getCharacteristic', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(id, service, characteristic) {',
    `  const device = await ${getDeviceById}(id);`,
    ' if (!device) {',
    '    throw new Error(`Device with id ${id} not found`);',
    '  }',
    '  const server = await device.gatt.connect();',
    '  const GATTservice = await server.getPrimaryService(service);',
    '  return GATTservice.getCharacteristic(characteristic);',
    '}',
  ]);

  const code = `await (await ${getCharacteristic}(${thing}, ${service}, ${characteristic})).writeValue(${value});`;
  return code;
};
