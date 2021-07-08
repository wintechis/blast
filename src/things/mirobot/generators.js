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
