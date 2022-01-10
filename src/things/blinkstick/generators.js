/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
Blockly.JavaScript['blinkstick_set_colors'] = function(block) {
  const colour = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC) || Blockly.JavaScript.quote_('#000000');
  const index = Blockly.JavaScript.valueToCode(block, 'index', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  const thing = Blockly.JavaScript.valueToCode(block, 'thing', Blockly.JavaScript.ORDER_ATOMIC) || '\'\'';

  const code = `blinkstickSetColors(${thing}, ${index}, ${colour})\n;`;
  return code;
};

/**
 * Set the color of the BlinkStick.
 * @param {string} id the id identifier of the BlinkStick.
 * @param {number} index index of the LED.
 * @param {string} colour the color to set, as hex value.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const blinkstickSetColors = async function(id, index, colour, callback) {
  // check if index is between 0 and 7.
  if (index < 0 || index > 7) {
    Blast.Interpreter.throwError('BlinkStick index must be between 0 and 7.');
    callback();
    return;
  }
  
  // If no things block is attached, return.
  if (!id) {
    Blast.Interpreter.throwError('No BlinkStick block set.');
    callback();
    return;
  }

  const device = Blast.Things.webHidDevices.get(id);

  if (!device) {
    Blast.Interpreter.throwError('Connected device is not a HID device.\nMake sure you are connecting the Blinkstick via webHID.');
    callback();
    return;
  }

  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      Blast.Interpreter.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  // check if the device is a BlinkStick
  if (device.vendorId !== 8352 || device.productId !== 16869) {
    Blast.Interpreter.throwError('The connected device is not a BlinkStick.');
    callback();
    return;
  }

  // convert hex colour to rgb
  const red = parseInt(colour.substring(1, 3), 16);
  const green = parseInt(colour.substring(3, 5), 16);
  const blue = parseInt(colour.substring(5, 7), 16);
  
  const reportId = 5;
  const report = Int8Array.from([reportId, index, red, green, blue]);

  const setColor = async function(retries) {
    try {
      Blast.Ui.addToLog(`Invoke <code>sendFeatureReport</code> with value <code>${report}</code>`, 'hid', device.productName);
      await device.sendFeatureReport(reportId, report);
      Blast.Ui.addToLog(`Finished <code>sendFeatureReport</code> with value <code>${report}</code>`, 'hid', device.productName);
    } catch (error) {
      if (retries > 0) {
        await setColor(--retries);
      } else {
        console.error(error);
        Blast.Interpreter.throwError('Failed to set BlinkStick colors, please check its connection.');
      }
    }
  };
  await setColor(5);
  callback();
};

// add joycon_read_property function to the interpreter's API.
Blast.Interpreter.asyncApiFunctions.push(['blinkstickSetColors', blinkstickSetColors]);
