/**
 * Decodes a ReadableStream into JSON
 * @param data The ReadableStream to decode
 * @returns The decoded JSON
 */
export const decodeReadableStream = async function (data) {
    const chunks = [];
    for await (const chunk of data) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const str = new TextDecoder().decode(buffer);
    return JSON.parse(str);
};
/**
 * Endocdes json data into a ReadableStream.
 * @param {JSON} data the data to encode
 */
export const encodeJson = function (data) {
    const encoder = new TextEncoder();
    const jsonArr = encoder.encode(JSON.stringify(data));
    return new ReadableStream({
        start(controller) {
            controller.enqueue(jsonArr);
            controller.close();
        },
    });
};
//# sourceMappingURL=binding-helpers.js.map