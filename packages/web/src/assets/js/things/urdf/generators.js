/**
 * @fileoverview Javascript generators for BLAST's properties, actions and events Blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {javascriptGenerator as JavaScript} from 'blockly/javascript.js';
import urdf from 'urdf';

globalThis['urdf'] = urdf;

/**
 * Generates JavaScript code for the sparql_query block.
 */
JavaScript['sparql_query'] = function (block) {
  let query = block.getFieldValue('query');
  const uri = JavaScript.valueToCode(block, 'uri', JavaScript.ORDER_NONE);
  const format = JavaScript.quote_(block.getFieldValue('format')) || '';

  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');

  const code = `await urdfQueryWrapper(${uri}, ${format}, '${query}')`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the sparql_ask block.
 */
JavaScript['sparql_ask'] = function (block) {
  let query = block.getFieldValue('query');
  const format = JavaScript.quote_(block.getFieldValue('format')) || '';
  const uri = JavaScript.valueToCode(block, 'uri', JavaScript.ORDER_NONE);

  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');

  const code = `await urdfQueryWrapper(${uri}, ${format}, '${query}')`;

  return [code, JavaScript.ORDER_NONE];
};

/**
 * Wrapper for urdf's query function.
 * @public
 */
globalThis['urdfQueryWrapper'] = async function (uri, format, query) {
  let res;

  try {
    res = await fetch(uri);

    if (!res.ok) {
      console.error(
        `Failed to get ${uri}, Error: ${res.status} ${res.statusText}`
      );
      return;
    }

    const response = await res.text();

    urdf.clear();
    const opts = {format: format};
    await urdf.load(response, opts);
    res = await urdf.query(query);
  } catch (error) {
    console.error(`Failed to get ${uri}, Error: ${error.message}`);
  }

  // if result is a boolean, return it.
  if (typeof res === 'boolean') {
    return res;
  }

  // Convert result from array of objects to array of arrays.
  const resultArray = new Array(res.length);
  for (const obj of res) {
    const resultArrayRow = new Array(Object.keys(obj).length);
    for (const value of Object.values(obj)) {
      resultArrayRow.push(value.value);
    }
    resultArray.push(resultArrayRow);
  }

  return resultArray;
};
