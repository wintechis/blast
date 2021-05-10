/**
 * @fileoverview Block definitions for the streamdeck
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Event blocks.   *
 *******************/
 
/**
  * Generates JavaScript code for the streamdeck_buttons block.
  * @param {Blockly.Block} block the streamdeck_buttons block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['streamdeck_buttons'] = function(block) {
  const button1 = block.getFieldValue('button1') == 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') == 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') == 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') == 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') == 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') == 'TRUE' ? 1 : 0;
    
  const buttonArray = [button1, button2, button3, button4, button5, button6];

  const code = `handleStreamdeck('${block.id}', [${buttonArray}]);\n`;
  return code;
};
