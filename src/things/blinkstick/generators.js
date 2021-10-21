/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
Blockly.JavaScript['blinkstick_set_colors'] = function(block) {
  const red = Blockly.JavaScript.valueToCode(block, 'red', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const green = Blockly.JavaScript.valueToCode(block, 'green', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const blue = Blockly.JavaScript.valueToCode(block, 'blue', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const thing = Blockly.JavaScript.valueToCode(block, 'thing', Blockly.JavaScript.ORDER_ATOMIC);

  const code = `blinkstickSetColors(${thing}, ${red}, ${green}, ${blue})`;
  return code;
};

/**
 * Set the color of the BlinkStick.
 * @param {string} id the id identifier of the BlinkStick.
 * @param {number} red red color intensity 0 is off, 255 is full red intensity.
 * @param {number} green green color intensity 0 is off, 255 is full green intensity.
 * @param {number} blue blue color intensity 0 is off, 255 is full blue intensity.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const blinkstickSetColors = async function(id, red, green, blue, callback) {
  const device = Blast.Things.webHidDevices.get(id);
  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      Blast.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  const reportId = 5;
  const report = Int8Array.from([reportId, 1, red, green, blue]);

  const setColor = async function(retries) {
    try {
      await device.sendFeatureReport(reportId, report);
    } catch (error) {
      if (retries > 0) {
        await setColor(--retries);
      } else {
        console.error(error);
        Blast.throwError(`Failed to set BlinkStick colors after ${retires} retries, \
        please check its connection.`);
      }
    }
  };
  await setColor(5);
  callback();
};

// add joycon_read_property function to the interpreter's API.
Blast.asyncApiFunctions.push(['blinkstickSetColors', blinkstickSetColors]);
