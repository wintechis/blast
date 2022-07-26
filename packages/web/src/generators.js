/**
 * @fileoverview Javascript generators for additional Blocks of BLAST web example.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import {addElementToOutputContainer} from './web.js';
import {getStdOut} from '../../core/dist/blast_interpreter.js';
import {JavaScript} from '../../core/dist/blast_blockly_interface.js';

/**
 * Generates JavaScript code for the capture_image block.
 * @param {Blockly.Block} block the display_image block.
 * @returns {String} the generated code.
 */
JavaScript['display_image'] = function (block) {
  const image = JavaScript.valueToCode(
    block,
    'image',
    JavaScript.ORDER_NONE
  );

  // This block only works if you define displayImage in your Environmnet
  // and add it to the interpreter's API. See packages/web for an example.
  const code = `displayImage(${image});\n`;
  return code;
};

/**
 * Adds an image to {@link Blast.Ui.messageOutputContainer}.
 * @param {string} image base64 encoded image.
 */
globalThis['displayImage'] = function (image) {
  const img = document.createElement('img');
  img.src = image;
  img.classList.add('output_image');
  addElementToOutputContainer(img);
};

/**
 * Generates JavaScript code for the display_table block.
 * @param {Blockly.Block} block the display_table block.
 * @returns {String} the generated code.
 */
JavaScript['display_table'] = function (block) {
  const table = JavaScript.valueToCode(
    block,
    'table',
    JavaScript.ORDER_NONE
  );

  // This block only works if you define displayTable in your Environmnet
  // and add it to the interpreter's API. See packages/web for an example.
  const code = `displayTable(${table});\n`;
  return code;
};

/**
 * Generates an HTML Table from a sparql query result (array of arrays).
 * and add it to {@link Blast.Ui.messageOutputContainer}.
 * @param {graph} arr graph to output.
 * @public
 */
globalThis['displayTable'] = function (arr) {
  // display message if table is empty
  if (arr.length === 0) {
    const stdOut = getStdOut();
    stdOut('empty table');
    return;
  }

  // create table
  const table = document.createElement('table');
  table.classList.add('output_table');

  // insert rows
  for (const row of arr) {
    const tr = document.createElement('tr');
    if (row === undefined) {
      continue;
    }
    for (const value of row) {
      if (value === undefined) {
        continue;
      }
      const td = document.createElement('td');
      td.innerHTML = value;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  // Insert new table
  addElementToOutputContainer(table);
};
