import {Readable} from 'stream';
import * as core from '@node-wot/core';
const {ProtocolHelpers} = core;

/**
 * Decodes a ReadableStream into JSON.
 * @param data The ReadableStream to decode
 * @returns The decoded JSON
 */
export const readableStreamToJson = async function (
  data: NodeJS.ReadableStream
) {
  const chunks = [];
  for await (const chunk of data) {
    chunks.push(chunk as Buffer);
  }
  const buffer = Buffer.concat(chunks);
  const str = new TextDecoder().decode(buffer);
  return JSON.parse(str);
};

/**
 * Converts a ReadableStream into a string.
 * @param data The ReadableStream to convert
 * @returns The converted string
 */
export const readableStreamToString = async function (
  data: NodeJS.ReadableStream
) {
  const chunks = [];
  for await (const chunk of data) {
    chunks.push(chunk as Buffer);
  }
  const buffer = Buffer.concat(chunks);
  return new TextDecoder().decode(buffer);
};

/**
 * Endocdes json data into a ReadableStream.
 * @param {JSON} data the data to encode
 */
export const jsonToReadable = function (data: JSON): ReadableStream {
  const encoder = new TextEncoder();
  const jsonArr = encoder.encode(JSON.stringify(data));

  return new ReadableStream({
    start(controller) {
      controller.enqueue(jsonArr);
      controller.close();
    },
  });
};

/**
 * Converts a string into a ReadableStream.
 * @param str The string to convert
 * @returns The converted ReadableStream
 */
export const stringToReadable = function (str: string): ReadableStream {
  const encoder = new TextEncoder();
  const strArr = encoder.encode(str);

  return new ReadableStream({
    start(controller) {
      controller.enqueue(strArr);
      controller.close();
    },
  });
};

/**
 * Converts data into a NodeJS.ReadableStream.
 * @param data The data to convert
 * @returns The converted data as a ReadableStream
 */
export const convertToNodeReadable = function (data: any): Readable {
  // create a new NodeJS.ReadableStream and push the data into it
  const readable = new Readable();
  // push buffer into readable
  readable.push(data);
  // close readable
  readable.push(null);
  const stream = ProtocolHelpers.toNodeStream(readable);

  return stream;
};
