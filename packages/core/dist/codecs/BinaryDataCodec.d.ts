import { ContentCodec } from '@node-wot/core';
import { DataSchema, DataSchemaValue } from 'wot-typescript-definitions';
export declare class BinaryDataStreamCodec implements ContentCodec {
    getMediaType(): string;
    /**
     * Convert received bytes to concrete value.
     * @param bytes The received binary buffer.
     * @param schema The schema information of the Thing Description for decoding.
     * @returns Decoded value.
     */
    bytesToValue(bytes: Buffer, schema: DataSchema): DataSchemaValue;
    /**
     * Convert concrete value to bytes.
     * @param dataValue The data to be encoded.
     * @param schema The schema information of the Thing Description for encoding.
     * @returns Encodec value.   */
    valueToBytes(dataValue: unknown, schema: DataSchema): Buffer;
}
