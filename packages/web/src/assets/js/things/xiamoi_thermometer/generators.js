/**
 * @fileoverview JavaScript code generators for the Xiaomi Mijia thermometer.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {addCleanUpFunction, getWorkspace} from '../../interpreter.js';
import {throwError} from '../../interpreter.js';

/**
 * Generates JavaScript code for the things_xiaomiThermometer block.
 * @param {Blockly.Block} block the things_xiaomiThermometer block.
 * @returns {String} the generated code.
 */
JavaScript['things_xiaomiThermometer'] = function (block) {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the get_mijia_property block.
 * @param {Blockly.Block} block the get_temperature block.
 * @returns {String} the generated code.
 */
JavaScript['xiaomiThermometer_event'] = function (block) {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing').id);
  }
  const ownId = JavaScript.quote_(block.id);

  const handler = `xiaomi_handleThermometer(${ownId}, ${blockId}, ${thing}, ${statements})\n`;
  const handlersList = JavaScript.definitions_['eventHandlers'] || '';
  // Event handlers need to be executed first, so they're added to JavaScript.definitions
  JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};

/**
 * Handles xiaomi thermometer events.
 * @param {string} ownId the block id of this event block.
 * @param {string} blockId the block id of the thing_xiaomi_thermometer block connected to this block.
 * @param {string} id the id of the xiaomi thermometer.
 * @param {string} measurement the sensor to retrieve measurements from.
 * @param {string} statements the statements to execute.
 */
globalThis['xiaomi_handleThermometer'] = async function (
  ownId,
  blockId,
  id,
  statements
) {
  if (id === null) {
    throwError('No thermometer is set');
  }
  const ws = getWorkspace();
  const self = ws.getBlockById(ownId);
  const humidityName = self.getFieldValue('humidity');
  const temperatureName = self.getFieldValue('temperature');

  const block = ws.getBlockById(blockId);
  const thermometer = block.thing;
  const handler = async function (interactionOutput) {
    const arr = await interactionOutput.arrayBuffer();
    const data = new DataView(arr.buffer);
    if (data) {
      const sign = data.getUint8(1) & (1 << 7);
      let temp = ((data.getUint8(1) & 0x7f) << 8) | data.getUint8(0);
      if (sign) {
        temp = temp - 32767;
      }
      globalThis[temperatureName] = temp / 100;
      globalThis[humidityName] = data.getUint8(2);
      eval(`(async () => {${statements}})();`);
    }
  };
  const sub = await thermometer.subscribeEvent('measurements', handler);
  addCleanUpFunction(async () => sub.stop());
};
