/**
 * @fileoverview JavaScript code generators for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {getWorkspace} from '../../blast_interpreter.js';

/**
 * Generates JavaScript code for the things_ruuviTag block.
 * @param {Blockly.Block} block the things_ruuviTag block.
 * @returns {String} the generated code.
 */
JavaScript['things_ruuviTag'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_temperature block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
JavaScript['read_ruuvi_property'] = function (block) {
  const measurement = JavaScript.quote_(block.getFieldValue('measurement'));
  const thing =
    JavaScript.valueToCode(block, 'Thing', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('Thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('Thing').id);
  }

  const code = `await getRuuviProperty(${blockId}, ${measurement}, ${thing})`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Fetches the selected measurement from a RuuviTag.
 * @param {Blockly.Block.id} blockId the read_ruuvi_property block's id.
 * @param {String} measurement the measurement to fetch.
 * @public
 */
globalThis['getRuuviProperty'] = async function (blockId, measurement) {
  const block = getWorkspace().getBlockById(blockId);
  const thing = block.thing;
  await thing.subscribeEvent('rawv2', value => {
    return value[measurement];
  });
};
