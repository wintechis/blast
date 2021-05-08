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
  const button1 = block.getFieldValue('button1') == 'TRUE';
  const button2 = block.getFieldValue('button2') == 'TRUE';
  const button3 = block.getFieldValue('button3') == 'TRUE';
  const button4 = block.getFieldValue('button4') == 'TRUE';
  const button5 = block.getFieldValue('button5') == 'TRUE';
  const button6 = block.getFieldValue('button6') == 'TRUE';
  const statements = Blockly.JavaScript.statementToCode(block, 'statements');
    
  const buttons = [button1, button2, button3, button4, button5, button6];

  // Add event listener for key presses.
  // block.device.addEventListener('inputreport', (event) => {
  //   if (event.reportId === 0x01) {
  //     block.onButtonPushed(event.data.buffer);
  //   }
  // });

  const code = '...;\n';
  return code;
};
 
