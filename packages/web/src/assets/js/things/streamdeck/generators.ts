/**
 * @fileoverview Code generators for the streamdeck blocks
 * (https://www.elgato.com/de/stream-deck).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {StreamDeckWeb as StreamDeck} from '@elgato-stream-deck/webhid';
import {getWorkspace} from '../../interpreter';
import {getThingsLog, getWebHidDevice} from '../../things.js';

const thingsLog = getThingsLog();
// Add StreamDeck lib to the global scope
(globalThis as any)['StreamDeck'] = StreamDeck;

/**
 * Generates JavaScript code for the things_streamdeck block.
 */
JavaScript['things_streamdeck'] = function (block: Block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.definitions_['StreamDeckMini'] =
    'const {StreamDeckMini} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + name
  ] = `things.set(${name}, await createThing(StreamDeckMini, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the streamdeck_button_event block.
 */
JavaScript['streamdeck_button_event'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const button1Name = block.getFieldValue('button1');
  const button2Name = block.getFieldValue('button2');
  const button3Name = block.getFieldValue('button3');
  const button4Name = block.getFieldValue('button4');
  const button5Name = block.getFieldValue('button5');
  const button6Name = block.getFieldValue('button6');

  const eventHandler = JavaScript.provideFunction_('streamdeckHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '    const keyData = await interactionOutput.value();',
    `    ${button1Name} = keyData[0];`,
    `    ${button2Name} = keyData[1];`,
    `    ${button3Name} = keyData[2];`,
    `    ${button4Name} = keyData[3];`,
    `    ${button5Name} = keyData[4];`,
    `    ${button6Name} = keyData[5];`,
    `    ${statements.replace(/`/g, '\\`')}`,
    '}',
  ]);

  const handler = `await things.get(${thing}).subscribeEvent('inputreport', ${eventHandler});\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Generates JavaScript code for the streamdeck_color_buttons block.
 */
JavaScript['streamdeck_color_buttons'] = function (block: Block): string {
  const button1 = block.getFieldValue('button1') === 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') === 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') === 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') === 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') === 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') === 'TRUE' ? 1 : 0;
  const colour =
    JavaScript.valueToCode(block, 'color', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );

  JavaScript.provideFunction_('writeBMPHeader', [
    'function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(dataView, iconSize, iconBytes, imagePPM) {',
    '  dataView.setUint8(0, 66); // BM',
    '  dataView.setUint8(1, 77); // BM',
    '  dataView.setUint32(2, 54 + iconBytes, true);',
    '  dataView.setUint32(6, 0, true);',
    '  dataView.setUint32(8, 0, true);',
    '  dataView.setUint32(10, 54, true);',
    '  // DIB header BITMAPINFOHEADER',
    '  dataView.setUint32(14, 40, true); // DIB header size:',
    '  dataView.setInt32(18, iconSize, true);',
    '  dataView.setInt32(22, iconSize, true);',
    '  dataView.setInt16(26, 1, true); // Color planes',
    '  dataView.setInt16(28, 24, true); // Bit depth',
    '  dataView.setInt32(30, 0, true); // Compression',
    '  dataView.setInt32(34, iconBytes, true); // Image size',
    '  dataView.setInt32(38, imagePPM, true); // Horizontal resolution ppm',
    '  dataView.setInt32(42, imagePPM, true); // Vertical resolution ppm',
    '  dataView.setInt32(46, 0, true); // Colour pallette size',
    '  dataView.setInt32(50, 0, true); // "Important" Colour count',
    '  return dataView;',
    '}',
  ]);

  JavaScript.provideFunction_('generateWrites', [
    'function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(keyIndex, dataView) {',
    '  const MAX_PACKET_SIZE = 1024;',
    '  const PACKET_HEADER_LENGTH = 16;',
    '  const MAX_PAYLOAD_SIZE = MAX_PACKET_SIZE - PACKET_HEADER_LENGTH;',
    '',
    '  const result = [];',
    '',
    '  let remainingBytes = dataView.byteLength;',
    '  for (let part = 0; remainingBytes > 0; part++) {',
    '    const packet = new DataView(new ArrayBuffer(MAX_PACKET_SIZE));',
    '',
    '    const byteCount = remainingBytes < MAX_PAYLOAD_SIZE ? remainingBytes : MAX_PAYLOAD_SIZE;',
    '    writeCommandHeader(packet, keyIndex, part, remainingBytes <= MAX_PAYLOAD_SIZE, byteCount);',
    '',
    '    const byteOffset = dataView.byteLength - remainingBytes;',
    '    remainingBytes -= byteCount;',
    '    for (let i = 0; i < byteCount; i++) {',
    '      packet.setUint8(i + PACKET_HEADER_LENGTH, dataView.getUint8(byteOffset + i));',
    '    }',
    '',
    '    result.push(packet);',
    '  }',
    '',
    '  return result;',
    '}',
  ]);

  JavaScript.provideFunction_('writeCommandHeader', [
    'function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(dataView, keyIndex, partIndex, isLast) {',
    '  dataView.setUint8(0, 2);',
    '  dataView.setUint8(1, 1);',
    '  dataView.setUint16(2, partIndex, true);',
    '  // 3 = 0x00',
    '  dataView.setUint8(4, isLast ? 1 : 0);',
    '  dataView.setUint8(5, keyIndex + 1);',
    '}',
  ]);

  const r = parseInt(colour.slice(2, 4), 16);
  const g = parseInt(colour.slice(4, 6), 16);
  const b = parseInt(colour.slice(6, 8), 16);

  let code =
    'const pixels = new DataView(new ArrayBuffer(54 + 80 * 80 * 3));\n';
  code += 'for (let i = 0; i < 54 + 80 * 80 * 3; i += 3) {\n';
  code += `  pixels.setUint8(i, ${b});\n`;
  code += `  pixels.setUint8(i + 1, ${g});\n`;
  code += `  pixels.setUint8(i + 2, ${r});\n`;
  code += '}\n';

  code += 'let data = writeBMPHeader(pixels, 80, 80, 2835);\n';
  for (let i = 0; i < 6; i++) {
    if (buttons[i] === '1') {
      code += `const buffers = generateWrites(${i}, data);\n`;
      code += 'for (const data of buffers) {\n';
      code += `  await things.get(${name}).invokeAction('sendReport', new Uint8Array(data.buffer));\n`;
      code += '}\n';
    }
  }
  return code;
};

/**
 * Fills the buttons of a Stream Deck with a color.
 */
(globalThis as any)['streamdeckColorButtons'] = async function (
  blockId: string,
  id: string,
  buttons: string,
  color: string
) {
  // If no things block is attached, return.
  if (id === null) {
    console.error('No streamdeck block set.');
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    console.error(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace()?.getBlockById(blockId);
  const streamdeck = (block as any).thing;

  // convert color to rgb
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);

  // fill selected buttons with color
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      thingsLog(
        `Invoke <code>fillKeyColor</code> with value <code>${[
          i,
          red,
          green,
          blue,
        ].toString()}</code>`,
        'hid',
        device.productName
      );
      await streamdeck.fillKeyColor(i, red, green, blue);
      thingsLog(
        'Finished <code>fillKeyColor</code>',
        'hid',
        device.productName
      );
    }
  }
};

/**
 * Displays a value on a Stream Deck's buttons.
 */
JavaScript['streamdeck_write_on_buttons'] = function (block: Block): string {
  const button1 = block.getFieldValue('button1') === 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') === 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') === 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') === 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') === 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') === 'TRUE' ? 1 : 0;
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('');
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const buttons = JavaScript.quote_(
    `${button1}${button2}${button3}${button4}${button5}${button6}`
  );

  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }

  const code = `await streamdeckWriteOnButtons(${blockId}, ${id}, ${buttons}, ${value});\n`;
  return code;
};

/**
 * Displays a value on a Stream Deck's buttons.
 */
(globalThis as any)['streamdeckWriteOnButtons'] = async function (
  blockId: string,
  id: string,
  buttons: string,
  value: string
) {
  // If no things block is attached, return.
  if (id === null) {
    console.error('No streamdeck block set.');
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    console.error(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace()?.getBlockById(blockId);
  const streamdeck = (block as any).thing;

  const ps = [];

  const canvas = document.createElement('canvas');
  canvas.width = streamdeck.ICON_SIZE;
  canvas.height = streamdeck.ICON_SIZE;

  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return;
  }
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = canvas.height * 0.8 + 'px Arial';
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 1;
  ctx.strokeText(value.toString(), 8, 60, canvas.width * 0.8);
  ctx.fillStyle = 'white';
  ctx.fillText(value.toString(), 8, 60, canvas.width * 0.8);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < buttons.length; i++) {
    if (buttons.charAt(i) === '1') {
      thingsLog(
        `Invoke <code>fillKeyImageData</code> with value <code>${[
          i,
          imageData,
        ].toString()}</code>`,
        'hid',
        device.productName
      );
      ps.push(
        streamdeck.fillKeyBuffer(i, Buffer.from(imageData.data), {
          format: 'rgba',
        })
      );
      thingsLog(
        'Finished <code>fillKeyImageData</code>',
        'hid',
        device.productName
      );
    }
  }

  ctx.restore();

  await Promise.all(ps);
};

JavaScript['streamdeck_set_brightness'] = function (block: Block) {
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('100');
  const id =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }

  const code = `await streamdeckSetBrightness(${blockId}, ${id}, ${value});\n`;
  return code;
};

(globalThis as any)['streamdeckSetBrightness'] = async function (
  blockId: string,
  id: string,
  value: string
) {
  // If no things block is attached, return.
  if (id === null) {
    console.error('No streamdeck block set.');
    return;
  }

  const device = getWebHidDevice(id);

  if (!device) {
    console.error(
      'Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID'
    );
    return;
  }

  const block = getWorkspace()?.getBlockById(blockId);
  const streamdeck = (block as any).thing;

  thingsLog(
    `Invoke <code>setBrightness</code> with value <code>${value}</code>`,
    'hid',
    device.productName
  );
  await streamdeck.setBrightness(value);
  thingsLog('Finished <code>setBrightness</code>', 'hid', device.productName);
};
