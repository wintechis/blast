/**
 * @fileoverview Generates JavaScript for tulogic BlinkStick, see
 * (https://www.blinkstick.com).
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {getWorkspace} from '../../interpreter';

JavaScript['blinkstick_set_colors'] = function (block: Block): string {
  const colour =
    JavaScript.valueToCode(block, 'colour', JavaScript.ORDER_NONE) ||
    JavaScript.quote_('#000000');
  const index =
    JavaScript.valueToCode(block, 'index', JavaScript.ORDER_NONE) || '0';
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }

  const code = `await blinkstick_setColors(${blockId}, ${thing}, ${index}, ${colour});\n`;
  return code;
};

/**
 * Generates JavaScript code for the things_blinkstick block.
 */
JavaScript['things_blinkstick'] = function (block: Block): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Set the color of the BlinkStick.
 */
(globalThis as any)['blinkstick_setColors'] = async function (
  blockId: string,
  id: string,
  index: number,
  colour: string
) {
  // check if index is between 0 and 7.
  if (index < 0 || index > 7) {
    console.error('BlinkStick index must be between 0 and 7.');
    return;
  }

  // If no things block is attached, return.
  if (!id) {
    console.error('No BlinkStick block set.');
    return;
  }
  const channel = 0;

  // convert hex colour to rgb
  const red = parseInt(colour.substring(1, 3), 16);
  const green = parseInt(colour.substring(3, 5), 16);
  const blue = parseInt(colour.substring(5, 7), 16);

  // create report
  const report = [channel, index, red, green, blue];

  const block = getWorkspace()?.getBlockById(blockId);
  const thing = (block as any).thing;
  if (!thing.opened) {
    await thing.open();
  }
  await thing.sendFeatureReport(5, Uint8Array.from(report));
};
