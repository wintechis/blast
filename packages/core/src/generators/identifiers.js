/**
 * @fileoverview Generating JavaScript for identifier blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {throwError} from './../blast_interpreter.js';

JavaScript['uri'] = function (block) {
  const uri = JavaScript.quote_(block.getFieldValue('URI'));
  return [uri, JavaScript.ORDER_NONE];
};

JavaScript['uri_from_string'] = function (block) {
  const uri = JavaScript.valueToCode(block, 'URI', JavaScript.ORDER_NONE);

  const code = `convertToUri(${uri})`;

  return [code, JavaScript.ORDER_NONE];
};

globalThis['convertToUri'] = function (uri) {
  // Check if the string is a valid URI.
  try {
    new URL(uri);
  } catch (e) {
    throwError('The given string is not a valid URI.');
  }
  return uri;
};

JavaScript['mac'] = function (block) {
  const mac = JavaScript.quote_(block.getFieldValue('MAC'));
  return [mac, JavaScript.ORDER_NONE];
};
