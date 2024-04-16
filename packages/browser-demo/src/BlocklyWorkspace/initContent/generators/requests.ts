/**
 * @fileoverview Javascript generators for `requests` Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the http_request block.
 */
JavaScript.forBlock['http_request'] = function (
  block: Block
): [string, number] {
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

  const functionName = JavaScript.provideFunction_('sendHttpRequest', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + ' (',
    '  uri, method, headersString, body, output',
    ') {',
    '  if (uri === null || uri === undefined || uri === "") {',
    '    console.error("URI input of HttpRequest blocks must not be empty");',
    '  }',
    '  const headersJSON = JSON.parse(headersString);',
    '  const requestOptions = {',
    '    method: method,',
    '    headers: new Headers(headersJSON),',
    '  };',
    '  if (method !== "GET" && body) {',
    '    requestOptions.body = body;',
    '  }',
    '  try {',
    '    const res = await fetch(uri, requestOptions);',
    '    if (!res.ok) {',
    '      console.error(',
    '        `Failed to get ${uri}, Error: ${res.status} ${res.statusText}`',
    '      );',
    '      return;',
    '    }',
    '    if (output === "status") {',
    '      return res.status;',
    '    }',
    '    return await res.text();',
    '  } catch (e) {',
    '    console.error(`Failed to get ${uri}, Error: ${e}`);',
    '  }',
    '}',
  ]);

  const code = `await ${functionName}(${uri},'${method}',
        '{${headers}}', ${body}, '${output}')\n`;
  return [code, JavaScript.ORDER_NONE];
};
