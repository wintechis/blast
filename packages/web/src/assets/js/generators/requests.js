/**
 * @fileoverview Javascript generators for `requests` Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';

const {JavaScript} = Blockly;
import {throwError} from '../interpreter.js';

/**
 * Generates JavaScript code for the http_request block.
 * @param {Blockly.Block} block the http_request block.
 * @returns {String} the generated code.
 */
JavaScript['http_request'] = function (block) {
  const uri =
    JavaScript.valueToCode(block, 'uri', JavaScript.ORDER_NONE) || null;
  const method = block.getFieldValue('METHOD');
  const headers = JavaScript.valueToCode(
    block,
    'header',
    JavaScript.ORDER_NONE
  );
  const output = block.getFieldValue('OUTPUT');
  const body = JavaScript.valueToCode(block, 'body', JavaScript.ORDER_NONE);

  const code = `await sendHttpRequest(${uri},'${method}',
        '{${headers}}', ${body}, '${output}')\n`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Sends a HTTP request to URI returning the status or the response
 * depending on the output parameter.
 * @param {string} uri URI to request.
 * @param {string} method HTTP request method.
 * @param {string} headersString JSON string containing headers.
 * @param {string=} body JSON string containing body, optional.
 * Not needed when method is GET.
 * @param {string} output Output can be status or response.
 * @returns {string} the response status code or body, depending on output parameter.
 * @private
 */
globalThis['sendHttpRequest'] = async function (
  uri,
  method,
  headersString,
  body,
  output
) {
  if (uri === null || uri === undefined || uri === '') {
    throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: method,
    headers: new Headers(headersJSON),
  };

  if (method !== 'GET' && body) {
    requestOptions.body = body;
  }

  try {
    const res = await fetch(uri, requestOptions);

    if (!res.ok) {
      throwError(
        `Failed to get ${uri}, Error: ${res.status} ${res.statusText}`
      );
      return;
    }

    if (output === 'status') {
      return res.status;
    }

    const response = await res.text();
    return response;
  } catch (error) {
    throwError(`Failed to get ${uri}, Error: ${error.message}`);
  }
};
