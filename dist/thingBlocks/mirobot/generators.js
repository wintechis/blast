/**
 * @fileoverview JavaScript generators for the miroBot blocks
 * (https://www.wlkata.com/products/wlkata-mirobot-introduction).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
// import {asyncApiFunctions} from './../../blast_interpreter.js';
import {throwError} from './../../blast_interpreter.js';


/**
 * Generates JavaScript code for the mirobot_pickup block.
 * @param {Blockly.Block} block the mirobot_pickup block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['mirobot_pickup'] = function(block) {
  const box = Blockly.JavaScript.quote_(
      block.getFieldValue('box').toLowerCase(),
  );
    
  const code = `mirobotPickUpBox(${box});\n`;
  return code;
};

/**
 * Invokes a pick up action on the Mirobot
 * @param {String} box the box to pick up.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
// eslint-disable-next-line no-unused-vars
const mirobotPickUp = async function(box, callback) {
  const uri = 'https://bot.rapidthings.eu/thing/action/grab_' + box.toLowerCase();
  const headers = {'Content-Type': 'application/json', 'Accept': 'application/json'};
  const requestOptions = {
    method: 'POST',
    headers: new Headers(headers),
  };

  try {
    const res = await fetch(uri, requestOptions);

    if (!res.ok) {
      throwError(`Failed to get ${uri}, Error: ${res.status} ${res.statusText}`);
      return;
    }

    callback(res.status);
  } catch (err) {
    throwError(`Failed to get ${uri}, Error: ${err}`);
  }
};
// add pick-up function to the interpreter's API.
// asyncApiFunctions.push(['mirobot_pickup', mirobotPickUp]);
