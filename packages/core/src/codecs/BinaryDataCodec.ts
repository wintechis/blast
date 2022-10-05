import {ContentCodec} from '@node-wot/core';
import {DataSchema, DataSchemaValue} from 'wot-typescript-definitions';
import * as UriTemplate from 'uritemplate';

export class BLEBinaryCodec implements ContentCodec {
  getMediaType(): string {
    return 'application/x.binary-data-stream';
  }

  // Convert bytes to specified value
  bytesToValue(
    bytes: Buffer,
    schema: DataSchema,
    parameters?: {[key: string]: string}
  ): DataSchemaValue {

    let parsed: any;
    let name_list;
    let value_list;

    if (typeof schema['bdo:pattern'] != 'undefined') {
      // Pattern
      const result_arr = readPattern(schema, bytes);
      name_list = result_arr[0];
      value_list = result_arr[1];
      let decoded_result_arr = [];
      for (let i = 0; i < name_list.length; i++) {
        // Get parameter
        const schema_temp = schema['bdo:variables'][name_list[i]];
        const bytes_temp = value_list[i];

        if (schema_temp.type == 'integer') {
          decoded_result_arr.push(byte2int(schema_temp, bytes_temp));
        } else if (schema_temp.type == 'string') {
          decoded_result_arr.push(byte2string(schema_temp, bytes_temp));
        }

        // Used if scale leads to float number, instead of int
        else if (schema_temp.type == 'number') {
          decoded_result_arr.push(byte2int(schema_temp, bytes_temp));
        } else {
          throw new Error('Datatype not supported by codec');
        }
        parsed = decoded_result_arr;
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

  // Convert value to bytes
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

function readPattern(schema: DataSchema, bytes: Buffer) {
  // Get name of variables in template
  let template = schema['bdo:pattern'];
  let variables = schema['bdo:variables'];

  // Find Names and positions of variables
  let open_pos = [];
  let close_pos = [];
  for (let i = 0; i < template.length; i++) {
    if (template[i] == '{') {
      open_pos.push(i);
    }
    if (template[i] == '}') {
      close_pos.push(i);
    }
  }
  let variable_name_list = [];
  if (open_pos.length == close_pos.length) {
    for (let i = 0; i < open_pos.length; i++) {
      variable_name_list.push(
        template.substring(open_pos[i] + 1, close_pos[i])
      );
    }
  } else {
    throw Error('number of "{" not equal to "}" in pattern');
  }

  // replace variabel with actual length placeholder
  for (let i = 0; i < variable_name_list.length; i++) {
    let var_name = variable_name_list[i];
    let byteleng = variables[var_name]['bdo:bytelength'];
    template = template.replace(
      '{' + var_name + '}',
      '[' + 'X'.repeat((byteleng - 1) * 2) + ']'
    );
  }

  // Get start and end positions of relevant parts
  let start_vals = [];
  let stop_vals = [];
  for (let i = 0; i < template.length; i++) {
    if (template[i] == '[') {
      start_vals.push(i);
    }
    if (template[i] == ']') {
      stop_vals.push(i);
    }
  }

  // Slice Buffer
  let res = [];
  for (let i = 0; i < start_vals.length; i++) {
    res.push(bytes.subarray(start_vals[i] / 2, (stop_vals[i] + 1) / 2));
  }

  return [variable_name_list, res];
}

function extractVariableNames(template: string) {}

// Function fills in the desired pattern
// return filled in hexString
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
      if (params.format == 'hex'){
        dataValue[key] = dataValue[key]
      }
    }
  }

  //Fill in pattern
  const template = UriTemplate.parse(schema['bdo:pattern']);
  // replace dataValue object with filled in pattern
  dataValue = template.expand(dataValue);

  return dataValue;
}

// Convert string to buffer
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

// Convert buffer to string
function byte2string(schema: DataSchema, bytes: Buffer) {
  let value;
  if (typeof schema.format == 'undefined') {
    value = bytes.toString('utf-8');
  } else if (schema.format == 'hex') {
    value = bytes.toString('hex');
  }
  return value;
}
// TODO
// scale?
// readpattern
