import {ContentCodec} from '@node-wot/core';
import {DataSchema, DataSchemaValue} from 'wot-typescript-definitions';
import * as UriTemplate from 'uritemplate';

export class BinaryDataStreamCodec implements ContentCodec {
  getMediaType(): string {
    return 'application/x.binary-data-stream';
  }

  /**
   * Convert received bytes to concrete value.
   * @param {Buffer} bytes The received binary buffer.
   * @param {DataSchema} schema The schema information of the Thing Description for decoding.
   * @param {[key: string]: string} parameters Additonal parameters; not used in this codec.
   * @returns {DataSchemaValue} Decoded value.
   */
  bytesToValue(
    bytes: Buffer,
    schema: DataSchema,
    parameters?: {[key: string]: string}
  ): DataSchemaValue {
    let parsed: any;
    let nameList;
    let valueList;

    if (typeof schema['bdo:pattern'] != 'undefined') {
      // Pattern
      const resultArr = readPattern(schema, bytes);
      nameList = resultArr[0];
      valueList = resultArr[1];
      let decodedResultArr = [];
      for (let i = 0; i < nameList.length; i++) {
        // Get parameter
        const schemaTemp = schema['bdo:variables'][nameList[i]];
        const bytesTemp = valueList[i];

        if (schemaTemp.type == 'integer') {
          decodedResultArr.push(byte2int(schemaTemp, bytesTemp));
        } else if (schemaTemp.type == 'string') {
          decodedResultArr.push(byte2string(schemaTemp, bytesTemp));
        }

        // Used if scale leads to float number, instead of int
        else if (schemaTemp.type == 'number') {
          decodedResultArr.push(byte2int(schemaTemp, bytesTemp));
        } else {
          throw new Error('Datatype not supported by codec');
        }
        parsed = decodedResultArr;
      }
    } else {
      if (schema.type == 'integer') {
        parsed = byte2int(schema, bytes);
      } else if (schema.type == 'string') {
        parsed = byte2string(schema, bytes);
      }

      // Used if scale leads to float number, instead of int
      else if (schema.type == 'number') {
        parsed = byte2int(schema, bytes);
      } else {
        throw new Error('Datatype not supported by codec');
      }
    }

    return parsed;
  }

  /**
   * Convert concrete value to bytes.
   * @param {any} dataValue The data to be encoded.
   * @param {DataSchema} schema The schema information of the Thing Description for encoding.
   * @param {[key: string]: string} parameters Additonal parameters; not used in this codec.
   * @returns {Buffer} Encodec value.
   */
  valueToBytes(
    dataValue: any,
    schema: DataSchema,
    parameters?: {[key: string]: string}
  ): Buffer {
    let buf: Buffer = Buffer.alloc(1);
    let hexString: string;

    // Check if pattern is provieded and fill in
    if (typeof schema['bdo:pattern'] != 'undefined') {
      // String Pattern

      hexString = fillStringPattern(schema, dataValue);
      buf = string2byte(schema, hexString);

      //console.log('[CODEC]', 'Codec generated value:', hexString);
    }
    // Else create buffer without pattern
    else {
      // Convert to specified type
      switch (schema.type) {
        case 'integer':
          buf = int2byte(schema, dataValue);
          break;
        case 'string':
          buf = string2byte(schema, dataValue);
          break;
      }
    }
    return buf;
  }
}

/**
 * Converts bytes to integer.
 * @param {DataSchema} schema schema of executed property, action or event.
 * @param {Buffer} bytes received byte value.
 * @return {Integer} converted byte value.
 */
function byte2int(schema: DataSchema, bytes: Buffer) {
  const bytelength = schema['bdo:bytelength'];
  const signed = schema['bdo:signed'] || false;
  const byteOrder = schema['bdo:byteOrder'] || 'little';
  const scale = schema['bdo:scale'] || 1;
  const offset = schema['bdo:offset'] || 0;

  if (typeof bytelength == 'undefined') {
    throw new Error('Not all parameters are provided!');
  }

  let parsed: number = 0;

  if (byteOrder == 'little') {
    if (signed) {
      parsed = bytes.readIntLE(offset, bytelength);
    } else {
      parsed = bytes.readUIntLE(offset, bytelength);
    }
  } else if (byteOrder == 'big') {
    if (signed) {
      parsed = bytes.readIntBE(offset, bytelength);
    } else {
      parsed = bytes.readUIntBE(offset, bytelength);
    }
  }

  parsed = parsed * scale;

  return parsed;
}

/**
 * Converts integer to bytes.
 * @param {DataSchema} schema schema of executed property, action or event.
 * @param {Buffer} bytes received byte value.
 * @return {Integer} converted byte value.
 */
function int2byte(schema: DataSchema, dataValue: number) {
  const bytelength = schema['bdo:bytelength'];
  const signed = schema['bdo:signed'] || false;
  const byteOrder = schema['bdo:byteOrder'] || 'little';
  const scale = schema['bdo:scale'] || 1;
  const offset = schema['bdo:offset'] || 0;

  if (typeof bytelength == 'undefined') {
    throw new Error('Not all parameters are provided!');
  }

  // Apply scale
  dataValue = dataValue * scale;

  let buf = Buffer.alloc(bytelength);
  if (byteOrder == 'little') {
    if (signed) {
      buf.writeIntLE(dataValue, offset, bytelength);
    } else {
      buf.writeUIntLE(dataValue, offset, bytelength);
    }
  } else if (byteOrder == 'big') {
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
 * @param {DataSchema} schema schema of executed property, action or event.
 * @param {Buffer} bytes received byte value.
 * @return {Array} Array containing bytes in the order of the provided variables.
 */
function readPattern(schema: DataSchema, bytes: Buffer) {
  // Get name of variables in template
  let template = schema['bdo:pattern'];
  let variables = schema['bdo:variables'];

  // Find Names and positions of variables
  let openPos = [];
  let closePos = [];
  for (let i = 0; i < template.length; i++) {
    if (template[i] == '{') {
      openPos.push(i);
    }
    if (template[i] == '}') {
      closePos.push(i);
    }
  }
  let variableNameList = [];
  if (openPos.length == closePos.length) {
    for (let i = 0; i < openPos.length; i++) {
      variableNameList.push(
        template.substring(openPos[i] + 1, closePos[i])
      );
    }
  } else {
    throw Error('number of "{" not equal to "}" in pattern');
  }

  // replace variabel with actual length placeholder
  for (let i = 0; i < variableNameList.length; i++) {
    let varName = variableNameList[i];
    let byteleng = variables[varName]['bdo:bytelength'];
    template = template.replace(
      '{' + varName + '}',
      '[' + 'X'.repeat((byteleng - 1) * 2) + ']'
    );
  }

  // Get start and end positions of relevant parts
  let startVals = [];
  let stopVals = [];
  for (let i = 0; i < template.length; i++) {
    if (template[i] == '[') {
      startVals.push(i);
    }
    if (template[i] == ']') {
      stopVals.push(i);
    }
  }

  // Slice Buffer
  let res = [];
  for (let i = 0; i < startVals.length; i++) {
    res.push(bytes.subarray(startVals[i] / 2, (stopVals[i] + 1) / 2));
  }

  return [variableNameList, res];
}

/**
 * Fills in the desired pattern.
 * @param {DataSchema} schema schema of executed property, action or event.
 * @param {any} dataValue values to fill in.
 * @return {String} filled in hexString.
 */
function fillStringPattern(schema: DataSchema, dataValue: any) {
  let key: string;
  let params: any;
  // Iterate over provided parameters and convert to hex string
  for ([key, params] of Object.entries(schema['bdo:variables'])) {
    // Convert integer values to hex string
    if (params.type == 'integer') {
      let buf = int2byte(params, dataValue[key]);
      // Convert Buffer back to hex
      dataValue[key] = buf.toString('hex');
    }
    // Fill in Hex values
    if (params.type == 'string') {
      if (params.format == 'hex') {
        dataValue[key] = dataValue[key];
      }
    }
  }

  //Fill in pattern
  const template = UriTemplate.parse(schema['bdo:pattern']);
  // replace dataValue object with filled in pattern
  dataValue = template.expand(dataValue);

  return dataValue;
}

/**
 * Convert string to buffer.
 * @param {DataSchema} schema schema of executed property, action or event.
 * @param {String} dataValue values to convert.
 * @return {String} hexString.
 */
function string2byte(schema: DataSchema, dataValue: string) {
  let buf: Buffer;
  if (typeof schema.format == 'undefined') {
    buf = Buffer.from(dataValue, 'utf-8');
    return buf;
  } else if (schema.format == 'hex') {
    buf = Buffer.from(dataValue, 'hex');
    return buf;
  } else {
    throw Error('String can not be converte to bytes, format not supported');
  }
}

/**
 * Convert buffer to string.
 * @param {DataSchema} schema schema of executed property, action or event.
 * @param {Buffer} bytes values to convert.
 * @return {String} Converted String.
 */
function byte2string(schema: DataSchema, bytes: Buffer) {
  let value;
  if (typeof schema.format == 'undefined') {
    value = bytes.toString('utf-8');
  } else if (schema.format == 'hex') {
    value = bytes.toString('hex');
  }
  return value;
}
