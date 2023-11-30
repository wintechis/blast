/**
 * @fileoverview Code generators for the streamdeck blocks
 * (https://www.elgato.com/de/stream-deck).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_streamdeck block.
 */
JavaScript.forBlock['things_streamdeck'] = function (block: Block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['StreamDeckMini'] = 'const {StreamDeckMini} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThing(StreamDeckMini, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the streamdeck_button_event block.
 */
JavaScript.forBlock['streamdeck_button_event'] = function (
  block: Block
): string {
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
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};

/**
 * Generates JavaScript code for the streamdeck_color_buttons block.
 */
JavaScript.forBlock['streamdeck_color_buttons'] = function (
  block: Block
): string {
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

  const buttons = [button1, button2, button3, button4, button5, button6];

  const writeBMPHeader = JavaScript.provideFunction_('writeBMPHeader', [
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
    '}\n',
  ]);

  const writeCommandHeader = JavaScript.provideFunction_('writeCommandHeader', [
    'function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(dataView, keyIndex, partIndex, isLast) {',
    '  dataView.setUint8(0, 2);',
    '  dataView.setUint8(1, 1);',
    '  dataView.setUint16(2, partIndex, true);',
    '  // 3 = 0x00',
    '  dataView.setUint8(4, isLast ? 1 : 0);',
    '  dataView.setUint8(5, keyIndex + 1);',
    '}\n',
  ]);

  const generateWrites = JavaScript.provideFunction_('generateWrites', [
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
    `    ${writeCommandHeader}(packet, keyIndex, part, remainingBytes <= MAX_PAYLOAD_SIZE, byteCount);`,
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
    '}\n',
  ]);

  const generatePixels = JavaScript.provideFunction_('generatePixels', [
    'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(r, g, b) {',
    '  const pixels = new DataView(new ArrayBuffer(54 + 80 * 80 * 3));',
    '    for (let i = 0; i < 54 + 80 * 80 * 3; i += 3) {',
    '      pixels.setUint8(i, b);',
    '      pixels.setUint8(i + 1, g);',
    '      pixels.setUint8(i + 2, r);',
    '    }',
    '    return pixels;',
    '}\n',
  ]);

  const writeStreamDeckData = JavaScript.provideFunction_(
    'writeStreamDeckData',
    [
      'async function ' +
        JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(r, g, b, buttons) {',
      `  const data = ${writeBMPHeader}(${generatePixels}(r, g, b), 80, 80, 2835)`,
      '  for (let i = 0; i < 6; i++) {',
      '    if (buttons[i] === 1) {',
      `      const buffers = ${generateWrites}(i, data);`,
      '      for (const data of buffers) {',
      '        const buf = [...new Uint8Array(data.buffer)]',
      "        const str = buf.map(x => x.toString(16).padStart(2, '0')).join('')",
      `        await things.get(${name}).invokeAction('sendReport', str);`,
      '      }',
      '    }',
      '  }',
      '}',
    ]
  );

  const r = parseInt(colour.slice(2, 4), 16);
  const g = parseInt(colour.slice(4, 6), 16);
  const b = parseInt(colour.slice(6, 8), 16);

  const code = `${writeStreamDeckData}(${r}, ${g}, ${b}, [${buttons}]);\n`;
  return code;
};

/**
 * Displays a value on a Stream Deck's buttons.
 */
JavaScript.forBlock['streamdeck_write_on_buttons'] = function (
  block: Block
): string {
  const button1 = block.getFieldValue('button1') === 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') === 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') === 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') === 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') === 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') === 'TRUE' ? 1 : 0;
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || '';
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const buttons = [button1, button2, button3, button4, button5, button6];

  const writeBMPHeader = JavaScript.provideFunction_('writeBMPHeader', [
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
    '}\n',
  ]);

  const writeCommandHeader = JavaScript.provideFunction_('writeCommandHeader', [
    'function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(dataView, keyIndex, partIndex, isLast) {',
    '  dataView.setUint8(0, 2);',
    '  dataView.setUint8(1, 1);',
    '  dataView.setUint16(2, partIndex, true);',
    '  // 3 = 0x00',
    '  dataView.setUint8(4, isLast ? 1 : 0);',
    '  dataView.setUint8(5, keyIndex + 1);',
    '}\n',
  ]);

  const generateWrites = JavaScript.provideFunction_('generateWrites', [
    'function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(keyIndex, dataView) {',
    '  const MAX_PACKET_SIZE = 1024;',
    '  const PACKET_HEADER_LENGTH = 16;',
    '  const MAX_PAYLOAD_SIZE = MAX_PACKET_SIZE - PACKET_HEADER_LENGTH;',
    '  const result = [];',
    '  let remainingBytes = dataView.byteLength;',
    '  for (let part = 0; remainingBytes > 0; part++) {',
    '    const packet = new DataView(new ArrayBuffer(MAX_PACKET_SIZE));',
    '    const byteCount = remainingBytes < MAX_PAYLOAD_SIZE ? remainingBytes : MAX_PAYLOAD_SIZE;',
    `    ${writeCommandHeader}(packet, keyIndex, part, remainingBytes <= MAX_PAYLOAD_SIZE, byteCount);`,
    '    const byteOffset = dataView.byteLength - remainingBytes;',
    '    remainingBytes -= byteCount;',
    '    for (let i = 0; i < byteCount; i++) {',
    '      packet.setUint8(i + PACKET_HEADER_LENGTH, dataView.getUint8(byteOffset + i));',
    '    }',
    '    result.push(packet);',
    '  }',
    '  return result;',
    '}\n',
  ]);

  const convertFillImage = JavaScript.provideFunction_('convertFillImage', [
    'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(dataView) {',
    '  const byteBuffer = new ArrayBuffer(54 + 80 * 80 * 3);',
    '  let targetBuffer = new DataView(byteBuffer);',
    '  for (let y = 0; y < 80; y++) {',
    '    const rowOffset = 54 + y * 80 * 3;',
    '    for (let x = 0; x < 80; x++) {',
    '      y2 = 79 - y;',
    '      x2 = y2;',
    '      y2 = x;',
    '      const srcOffset = y2 * 80 * 4 + x2 * 4;',
    '      const targetOffset = rowOffset + x * 3;',
    '      targetBuffer.setUint8(targetOffset, dataView.getUint8(srcOffset+2));',
    '      targetBuffer.setUint8(targetOffset + 1, dataView.getUint8(srcOffset + 1));',
    '      targetBuffer.setUint8(targetOffset + 2, dataView.getUint8(srcOffset));',
    '    }',
    '  }',
    `  targetBuffer = ${writeBMPHeader}(targetBuffer, 80, 80 * 80 * 3, 2835);`,
    '  return targetBuffer;',
    '}\n',
  ]);

  const fillImageRange = JavaScript.provideFunction_('fillImageRange', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(keyIndex, dataView) {',
    `  const byteBuffer = ${convertFillImage}(dataView);`,
    `  const packets = ${generateWrites}(keyIndex, byteBuffer);`,
    '  for (const packet of packets) {',
    '    const buf = [...new Uint8Array(packet.buffer)]',
    "    const str = buf.map(x => x.toString(16).padStart(2, '0')).join('');",
    `    await things.get(${name}).invokeAction('sendReport', str);`,
    '  }',
    '}',
  ]);

  const generateImageData = JavaScript.provideFunction_('generateImageData', [
    'function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(value) {',
    '  const canvas = document.createElement("canvas");\n',
    '  canvas.width = 80;\n',
    '  canvas.height = 80;\n',
    '  const ctx = canvas.getContext("2d");\n',
    '  ctx.save();\n',
    '  ctx.clearRect(0, 0, canvas.width, canvas.height);\n',
    '  ctx.font = canvas.height * 0.8 + "px Arial";\n',
    '  ctx.strokeStyle = "blue";\n',
    '  ctx.lineWidth = 1;\n',
    '  ctx.strokeText(value, 8, 60, canvas.width * 0.8);\n',
    '  ctx.fillStyle = "white";\n',
    '  ctx.fillText(value, 8, 60, canvas.width * 0.8);\n',
    '  const imageData = ctx.getImageData(0, 0, 80, 80);\n',
    '  ctx.restore();\n',
    '  return imageData;\n',
    '}',
  ]);

  let code = 'const ps = [];\n';
  code += `const imageData = ${generateImageData}(${value});\n`;

  for (let i = 0; i < 6; i++) {
    if (buttons[i] === 1) {
      code += `ps.push(${fillImageRange}(${i}, new DataView(imageData.data.buffer)));\n`;
    }
  }
  code += 'await Promise.all(ps);\n';

  return code;
};

JavaScript.forBlock['streamdeck_set_brightness'] = function (block: Block) {
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('0');
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const code = `await things.get(${name}).writeProperty('brightness', ${value});\n`;

  return code;
};
