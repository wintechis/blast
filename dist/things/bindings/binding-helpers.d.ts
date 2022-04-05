/**
 * Decodes a ReadableStream into JSON
 * @param data The ReadableStream to decode
 * @returns The decoded JSON
 */
export declare const decodeReadableStream: (data: NodeJS.ReadableStream) => Promise<any>;
/**
 * Endocdes json data into a ReadableStream.
 * @param {JSON} data the data to encode
 */
export declare const encodeJson: (data: JSON) => ReadableStream;
