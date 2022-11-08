/**
 * @fileoverview JavaScript code generators for the Xiaomi Flower Care blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {getWorkspace} from '../../interpreter.js';

/**
 * Generates JavaScript code for the things_xiaomiFlowerCare block.
 * @param {Blockly.Block} block the things_xiaomiFlowerCare block.
 * @returns {String} the generated code.
 */
JavaScript['things_xiaomiFlowerCare'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

JavaScript['xiaomiFlowerCare_read'] = function (block) {
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }

  const code = `await flowerCare_read(${blockId})\n`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Read all values of Flower Care Sensor
 * @param {Blockly.Block.id} blockId the things_xiaomiFlowerCare block's id.
 */
globalThis['flowerCare_read'] = async function (blockId) {
  // Get thing instance of block.
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;

  // Activate read mode.
  await thing.invokeAction('readMode', 'A01F');

  // Read values
  let readValue = await thing.readProperty('valueString');
  readValue = await readValue.value();

  return readValue;
};
