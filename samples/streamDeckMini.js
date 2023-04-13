import {createThing} from '../packages/core/dist/blast.node.js';
import {StreamDeckMini} from '../packages/core/dist/blast.tds.js';
import {HidHelpers} from '../packages/core/dist/blast.hidHelpers.js';

const device = await HidHelpers.selectDevice();
const thing = await createThing(StreamDeckMini, device.path);

// Set the brightness to 100%
thing.writeProperty('brightness', 100);

console.log("Device connected. Input events will be logged here.")

// Array of booleans to track the state of each key
const keyState = new Array(6).fill(false)

const handleInputBuffer = async function (interactionOutput) {
  const data = await interactionOutput.value();
  // button events are reported as reportId 0x01
  if (data[0] === 1) {
    const keyData = data.slice(1, 7);
    for (let i = 0; i < 6; i++) {
      const keyPressed = Boolean(keyData[i]);
      const keyIndex = i;
      const stateChanged = keyPressed !== keyState[keyIndex];
      if (stateChanged) {
        keyState[keyIndex] = keyPressed;
        if (keyPressed) {
          console.log('down', keyIndex);
        } else {
          console.log('up', keyIndex);
        }
      }
    }
  }
}

thing.subscribeEvent('inputreport', handleInputBuffer);




const convertFillImage = async function (sourceBuffer, sourceOptions) {
  const padding = 54;
  const imageHeight = 80;

  const byteBuffer = Buffer.alloc(padding + imageHeight * imageHeight * 3);

  for (let y = 0; y < imageHeight; y++) {
    const rowOffset = padding + y * imageHeight * 3;
    for (let x = 0; x < imageHeight; x++) {
      const srcOffset = y * sourceOptions.stride + sourceOptions.offset + x * 3;

      const red = sourceBuffer.readUInt8(srcOffset);
      const green = sourceBuffer.readUInt8(srcOffset + 1);
      const blue = sourceBuffer.readUInt8(srcOffset + 2);

      const targetOffset = rowOffset + x * 3;
      byteBuffer.writeUInt8(blue, targetOffset);
      byteBuffer.writeUInt8(green, targetOffset + 1);
      byteBuffer.writeUInt8(red, targetOffset + 2);
    }
  }
  writeBMPHeader(byteBuffer, 80, 80, 2835);
  return Promise.resolve(byteBuffer);
};

const writeBMPHeader = function (buf, iconSize, iconBytes, imagePPM) {
  buf.write('BM');
  buf.writeUInt32LE(54 + iconBytes, 2);
  buf.writeUInt32LE(0, 6);
  buf.writeUInt32LE(0, 8);
  buf.writeUInt32LE(54, 10); // Full header size

  // DIB header BITMAPINFOHEADER
  buf.writeUInt32LE(40, 14); // DIB header size
  buf.writeInt32LE(iconSize, 18)
	buf.writeInt32LE(iconSize, 22)
	buf.writeInt16LE(1, 26) // Color planes
	buf.writeInt16LE(24, 28) // Bit depth
	buf.writeInt32LE(0, 30) // Compression
	buf.writeInt32LE(iconBytes, 34) // Image size
	buf.writeInt32LE(imagePPM, 38) // Horizontal resolution ppm
	buf.writeInt32LE(imagePPM, 42) // Vertical resolution ppm
	buf.writeInt32LE(0, 46) // Colour pallette size
	buf.writeInt32LE(0, 50) // 'Important' Colour count
};


const generateWrites = function (keyIndex, byteBuffer) {
  const MAX_PACKET_SIZE = 1024;
  const PACKET_HEADER_LENGTH = 16;
  const MAX_PAYLOAD_SIZE = MAX_PACKET_SIZE - PACKET_HEADER_LENGTH;

  const result = [];

  let remainingBytes = byteBuffer.length;
  for (let part = 0; remainingBytes > 0; part++) {
    const packet = Buffer.alloc(MAX_PACKET_SIZE);

    const byteCount = Math.min(remainingBytes, MAX_PAYLOAD_SIZE);
    writeCommandHeader(packet, keyIndex, part, remainingBytes <= MAX_PAYLOAD_SIZE, byteCount);

    const byteOffset = byteBuffer.length - remainingBytes;
    remainingBytes -= byteCount;
    byteBuffer.copy(packet, PACKET_HEADER_LENGTH, byteOffset, byteOffset + byteCount);

    result.push(packet);
  }

  return result;
}


const writeCommandHeader = function (buffer, keyIndex, partIndex, isLast) {
  buffer.writeUInt8(0x02, 0)
  buffer.writeUInt8(0x01, 1)
  buffer.writeUInt16LE(partIndex, 2)
  // 3 = 0x00
  buffer.writeUInt8(isLast ? 1 : 0, 4)
  buffer.writeUInt8(keyIndex + 1, 5)
}


// Set the color of a key
const keyIndex = 0;
const r = 255;
const g = 0;
const b = 0;
const pixels = Buffer.alloc(3 * 80 * 80, Buffer.from([r, g, b]));

const sourceOptions = {
  format: 'rgb',
  offset: 0,
  stride: 80 * 3,
};
const byteBuffer = await convertFillImage(pixels, sourceOptions);

const buffers = generateWrites(keyIndex, byteBuffer);

for (const data of buffers) {
  await thing.invokeAction('sendReport', data.toString('hex'));
}
