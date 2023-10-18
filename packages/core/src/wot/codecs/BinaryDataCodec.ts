import {ContentCodec} from '@node-wot/core';
import {DataSchema, DataSchemaValue} from 'wot-typescript-definitions';
import * as UriTemplate from 'uritemplate';

export class BinaryDataStreamCodec implements ContentCodec {
  getMediaType(): string {
    return 'application/x.binary-data-stream';
  }

  /**
   * Convert received bytes to concrete value.
   * @param bytes The received binary buffer.
   * @param schema The schema information of the Thing Description for decoding.
   * @returns Decoded value.
   */
  bytesToValue(bytes: Buffer, schema: DataSchema): DataSchemaValue {
    let parsed: DataSchemaValue = null;
    let nameList;
    let valueList;

    if (typeof schema['bdo:pattern'] !== 'undefined') {
      // Pattern
      const resultArr = readPattern(schema, bytes);
      nameList = resultArr[0];
      valueList = resultArr[1];
      const decodedResultArr = [];
      for (let i = 0; i < nameList.length; i++) {
        // Get parameter
        const schemaTemp = schema['bdo:variables'][nameList[i]];
        const bytesTemp = valueList[i];

        switch (schemaTemp.type) {
          case 'integer':
          case 'number':
            decodedResultArr.push(byte2int(schemaTemp, bytesTemp));
            break;
          case 'string':
            decodedResultArr.push(byte2string(schemaTemp, bytesTemp));
            break;
          case 'object':
            decodedResultArr.push(byte2object(schemaTemp, bytesTemp));
            break;
          default:
            throw new Error('Datatype not supported by codec');
        }
        parsed = decodedResultArr;
      }
    } else {
      switch (schema.type) {
        case 'integer':
        case 'number':
          parsed = byte2int(schema, bytes);
          break;
        case 'string':
          parsed = byte2string(schema, bytes);
          break;
        case 'object':
          parsed = byte2object(schema, bytes);
          break;
        default:
          throw new Error(`Datatype ${schema.type} not supported by codec`);
      }
    }
    return parsed;
  }

  /**
   * Convert concrete value to bytes.
   * @param dataValue The data to be encoded.
   * @param schema The schema information of the Thing Description for encoding.
   * @returns Encodec value.   */
  valueToBytes(dataValue: unknown, schema: DataSchema): Buffer {
    let buf: Buffer = Buffer.alloc(1);
    let hexString: string;

    // Check if pattern is provieded and fill in
    if (typeof schema['bdo:pattern'] !== 'undefined') {
      // String Pattern
      hexString = fillStringPattern(schema, dataValue as string);
      buf = string2byte(schema, hexString);
    }
    // Else create buffer without pattern
    else {
      // Convert to specified type
      switch (schema.type) {
        case 'number':
        case 'integer':
          buf = int2byte(schema, dataValue as number);
          break;
        case 'string':
          buf = string2byte(schema, dataValue as string);
          break;
        case 'object':
        case 'array':
          buf = object2byte(schema, dataValue as Array<unknown>);
          break;
      }
    }

    // Check if additional function code is provided and execute it
    // Modify bytes before sending them
    if (typeof schema['tst:function'] !== 'undefined') {
      const body = schema['tst:function'];
      const execFunction = new Function('buf', body);
      buf = execFunction(buf);
    }
    return buf;
  }
}

/**h
 * Converts bytes to integer.
 * @param schema schema of executed property, action or event.
 * @param bytes received byte value.
 * @returns converted byte value.
 */
function byte2int(schema: DataSchema, bytes: Buffer) {
  const bytelength = schema['bdo:bytelength'] ?? bytes.byteLength;
  const signed = schema['bdo:signed'] ?? false;
  const byteOrder = schema['bdo:byteOrder'] ?? 'little';
  const scale = schema['bdo:scale'] ?? 1;
  const offset = schema['bdo:offset'] ?? 0;
  const precision = schema['bdo:precision'] ?? 2;

  if (typeof bytelength === 'undefined') {
    throw new Error('Not all parameters are provided!');
  }

  let parsed = 0;

  if (byteOrder === 'little') {
    if (signed) {
      parsed = bytes.readIntLE(offset, bytelength);
    } else {
      parsed = bytes.readUIntLE(offset, bytelength);
    }
  } else if (byteOrder === 'big') {
    if (signed) {
      parsed = bytes.readIntBE(offset, bytelength);
    } else {
      parsed = bytes.readUIntBE(offset, bytelength);
    }
  }

  parsed = parsed * scale;

  // Round parsed number
  parsed = +(Math.round(Number(parsed + 'e+' + precision)) + 'e-' + precision);
  return parsed;
}

/**
 * Converts integer to bytes.
 * @param schema schema of executed property, action or event.
 * @param bytes received byte value.
 * @returns converted byte value.
 */
function int2byte(schema: DataSchema, dataValue: number) {
  const bytelength = schema['bdo:bytelength'];
  const signed = schema['bdo:signed'] ?? false;
  const byteOrder = schema['bdo:byteOrder'] ?? 'little';
  const scale = schema['bdo:scale'] ?? 1;
  const offset = schema['bdo:offset'] ?? 0;

  if (typeof bytelength === 'undefined') {
    throw new Error('Not all parameters are provided!');
  }

  // Apply scale
  dataValue = dataValue * scale;

  const buf = Buffer.alloc(bytelength);
  if (byteOrder === 'little') {
    if (signed) {
      buf.writeIntLE(dataValue, offset, bytelength);
    } else {
      buf.writeUIntLE(dataValue, offset, bytelength);
    }
  } else if (byteOrder === 'big') {
    if (signed) {
      buf.writeIntBE(dataValue, offset, bytelength);
    } else {
      buf.writeUIntBE(dataValue, offset, bytelength);
    }
  }

  return buf;
}

/**
 * Reads binary buffer based on provided pattern.
 * @param schema schema of executed property, action or event.
 * @param bytes received byte value.
 * @returns Array containing bytes in the order of the provided variables.
 */
function readPattern(schema: DataSchema, bytes: Buffer) {
  // Get name of variables in template
  const template = schema['bdo:pattern'];
  const variables = schema['bdo:variables'];

  // additionalOffset is offset beetween variables
  // e.g.  {temp}00{light}
  // additionalOffset = [0, 1]
  // means: no offset before temp but offset of 1 byte after temp
  const additionalOffset = [];
  const variableNameList = [];

  // Get variable names and additional offset
  const splitTemplate = template.split('{');
  for (let i = 0; i < splitTemplate.length; i++) {
    const splitValue = splitTemplate[i].split('}');
    if (i === 0) {
      // Only additional offest at i == 0; never a variable name
      // divided by 2 to get bytelength
      additionalOffset.push(splitValue[0].length / 2);
    } else {
      variableNameList.push(splitValue[0]);
      additionalOffset.push(splitValue[1].length / 2);
    }
  }

  // Slice buffer
  const valueList = [];
  let offset = 0 + additionalOffset[0];
  for (let i = 0; i < variableNameList.length; i++) {
    const byteLength = variables[variableNameList[i]]['bdo:bytelength'];
    valueList.push(bytes.subarray(offset, offset + byteLength));
    offset += byteLength + additionalOffset[i + 1];
  }

  return [variableNameList, valueList];
}

/**
 * Fills in the desired pattern.
 * @param schema schema of executed property, action or event.
 * @param dataValue values to fill in.
 * @returns Filled in hexString.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fillStringPattern(schema: DataSchema, dataValue: any) {
  let key: number | string;
  let params: unknown;
  // Iterate over provided parameters and convert to hex string
  for ([key, params] of Object.entries(schema['bdo:variables'])) {
    // Convert integer values to hex string
    if ((params as DataSchema).type === 'integer') {
      const buf = int2byte(params as DataSchema, dataValue[key]);
      // Convert Buffer back to hex
      dataValue[key] = buf.toString('hex');
    }
    // Fill in Hex values
    // if (params.type === 'string') {
    //   if (params.format === 'hex') {
    //     dataValue[key] = dataValue[key];
    //   }
    // }
  }

  //Fill in pattern
  const template = UriTemplate.parse(schema['bdo:pattern']);
  // replace dataValue object with filled in pattern
  return template.expand(dataValue);
}

/**
 * Convert string to buffer.
 * @param schema schema of executed property, action or event.
 * @param dataValue values to convert.
 * @returns Value converted to hexString.
 */
function string2byte(schema: DataSchema, dataValue: string) {
  let buf: Buffer;
  if (typeof schema.format === 'undefined') {
    buf = Buffer.from(dataValue, 'utf-8');
    return buf;
  } else if (schema.format === 'hex') {
    buf = Buffer.from(dataValue, 'hex');
    return buf;
  } else {
    throw Error('String can not be converted to bytes, format not supported');
  }
}

/**
 * Convert buffer to string.
 * @param schema schema of executed property, action or event.
 * @param bytes values to convert.
 * @returns Converted String.
 */
function byte2string(schema: DataSchema, bytes: Buffer): string {
  let value;
  if (typeof schema.format === 'undefined') {
    value = bytes.toString('utf-8');
  } else if (schema.format === 'hex') {
    value = bytes.toString('hex');
  }
  if (typeof value === 'undefined') {
    throw Error('String can not be converted to bytes, format not supported');
  }
  return value;
}

/**
 * Convert buffer to object.
 * @param schema schema of executed property, action or event.
 * @param bytes values to convert.
 * @returns converted object.
 */
function byte2object(schema: DataSchema, bytes: Buffer): Object {
  const value = bytes.toString('utf-8');
  return JSON.parse(value);
}

/**
 * Converts an object to buffer.
 * @param schema schema of executed property, action or event.
 * @param dataValue values to convert.
 * @returns converted buffer.
 */
function object2byte(schema: DataSchema, dataValue: unknown): Buffer {
  let bytes: Buffer;
  if (Array.isArray(dataValue)) {
    bytes = Buffer.from(dataValue);
  } else if (typeof dataValue === 'object' && dataValue !== null) {
    bytes = Buffer.from(JSON.stringify(dataValue));
  } else {
    throw new Error('Datatype not supported by codec');
  }
  return bytes;
}
