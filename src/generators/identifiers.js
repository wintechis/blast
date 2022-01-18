/**
 * @fileoverview Generating JavaScript for identifier blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {apiFunctions} from './../blast_interpreter.js';
import {throwError} from './../blast_interpreter.js';


Blockly.JavaScript['uri'] = function(block) {
  const uri = Blockly.JavaScript.quote_(block.getFieldValue('URI'));
  return [uri, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['uri_from_string'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(block, 'URI', Blockly.JavaScript.ORDER_NONE);

  const code = `convertToUri(${uri})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

const convertToUri = function(uri) {
  // Check if the string is a valid URI.
  try {
    new URL(uri);
  } catch (e) {
    throwError('The given string is not a valid URI.');
  }
  return uri;
};

// add convertToUri method to the interpreter's API.
apiFunctions.push(['convertToUri', convertToUri]);
  
Blockly.JavaScript['mac'] = function(block) {
  const mac = Blockly.JavaScript.quote_(block.getFieldValue('MAC'));
  return [mac, Blockly.JavaScript.ORDER_NONE];
};
