/**
 * @fileoverview JavaScript generators for the miroBot blocks
 * (https://www.wlkata.com/products/wlkata-mirobot-introduction).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

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
const mirobotPickUp = async function(box, callback) {
  return Blast.BlockMethods.sendHttpRequest(
      'https://bot.rapidthings.eu/thing/action/grab_' + box.toLowerCase(),
      'POST',
      '{"Content-Type": "application/json", "Accept": "application/json"}',
      '{}',
      'table',
      callback,
  );
};
// add pick-up function to the interpreter's API.
Blast.asyncApiFunction.push(['mirobot_pickup', mirobotPickUp]);
