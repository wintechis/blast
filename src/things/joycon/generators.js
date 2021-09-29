/**
 * @fileoverview Code generators for the joycon blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
/**
  * Generates JavaScript code for the joycon_read_property block.
  * @param {Blockly.Block} block the joycon_read_property block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['joycon_read_property'] = function(block) {
  const property = block.getFieldValue('property');
  const id = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `readJoyConProperty(${id}, '${property}');\n`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Reads a property of a Joy-Con.
 * @param {string} id the id of the Joy-Con.
 * @param {string} property the property to read.
 * @returns {string} the value of the property.
 * @private
 */
const readJoyConProperty = async function(id, property) {
  const device = Blast.Things.webHidDevices.get(id);
  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      Blast.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  const joyCon = connectedJoyCons.get(device.productId);

  if (!joyCon.eventListenerAttached) {
    await joyCon.open();
    await joyCon.enableStandardFullMode();
    await joyCon.enableIMUMode();
    await joyCon.enableVibration();
    joyCon.addEventListener('hidinput', (event) => {
      console.log(joyCon);
      console.log(event.detail);
    });
    joyCon.eventListenerAttached = true;
  }
};

// add joycon_read_property function to the interpreter's API.
Blast.asyncApiFunctions.push(['readJoyConProperty', readJoyConProperty]);
