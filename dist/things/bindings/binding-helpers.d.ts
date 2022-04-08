/**
 * Decodes a ReadableStream into JSON.
 * @param data The ReadableStream to decode
 * @returns The decoded JSON
 */
export declare const readableStreamToJson: (data: NodeJS.ReadableStream) => Promise<any>;
/**
 * Converts a ReadableStream into a string.
 * @param data The ReadableStream to convert
 * @returns The converted string
 */
export declare const readableStreamToString: (data: NodeJS.ReadableStream) => Promise<string>;
/**
 * Endocdes json data into a ReadableStream.
 * @param {JSON} data the data to encode
 */
export declare const jsonToReadble: (data: JSON) => ReadableStream;
/**
 * Converts a string into a ReadableStream.
 * @param str The string to convert
 * @returns The converted ReadableStream
 */
export declare const stringToReadable: (str: string) => ReadableStream;
/**
 * Converts a string into a NodeJS.ReadableStream.
 * @param data The string to convert
 * @returns The converted string as a ReadableStream
 */
export declare const stringToNodeReadable: (data: string) => NodeJS.ReadableStream;
