/**
 * @fileoverview Generates JavaScript for the BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {
  asyncApiFunctions,
  getWorkspace,
  throwError,
} from './../../blast_interpreter.js';
// eslint-disable-next-line node/no-missing-import
import {stringToReadble} from './../../things/bindings/binding-helpers.js';

/**
 * Generates JavaScript code for the things_bleLedController block.
 * @param {Blockly.Block} block the things_bleLedController block.
 * @returns {String} the generated code.
 */
JavaScript['things_bleLedController'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the switch_lights_RGB block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
JavaScript['switch_lights_rgb'] = function (block) {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || 'null';
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `switchLights(${blockId}, ${thing}, ${colour});\n`;
  return code;
};

/**
 * switches lights of an LED controller via Bluetooth, by writing a value to it.
 * @param {Blockly.Block.id} blockId the things_bleLedController block's id.
 * @param {String} webBluetoothId identifier of the LED controller.
 * @param {String} colour the colour to switch the lights to, as hex value.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const switchLights = async function (
  blockId,
  webBluetoothId,
  colour,
  callback
) {
  // make sure a device is connected.
  if (!webBluetoothId) {
    throwError('No LED Controller is set.');
    callback();
    return;
  }
  // convert data to json
  const data = '7e000503' + colour.substring(1, 7) + '00ef';
  // convert json to stream
  const stream = stringToReadble(data);
  // get thing instance of block
  const block = getWorkspace().getBlockById(blockId);
  const thing = await block.thing;
  await thing.writeProperty('colour', stream);
  callback();
};
// Add switchLights function to the interpreter's API.
asyncApiFunctions.push(['switchLights', switchLights]);
