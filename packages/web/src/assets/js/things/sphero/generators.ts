/**
 * @fileoverview Generates JavaScript for the Sphero Mini.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {getWorkspace} from '../../interpreter';

/**
 * Generates JavaScript code for the things_bleLedController block.
 */
JavaScript['things_spheroMini'] = function (block: Block): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  return [id, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the spheroMini_roll block.
 */
JavaScript['spheroMini_roll'] = function (block: Block): string {
  const speed = JavaScript.valueToCode(block, 'speed', JavaScript.ORDER_ATOMIC);
  const heading = JavaScript.valueToCode(
    block,
    'heading',
    JavaScript.ORDER_ATOMIC
  );
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }
  const code = `spheroRoll(${blockId}, ${speed}, ${heading});\n`;
  return code;
};

/**
 * Generates JavaScript code for the spheroMini_roll block.
 */
JavaScript['spheroMini_stop'] = function (block: Block): string {
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }
  const code = `spheroStop(${blockId});\n`;
  return code;
};

/**
 * Generates JavaScript code for the spheroMini_color block.
 */
JavaScript['spheroMini_color'] = function (block: Block) {
  const color = JavaScript.valueToCode(block, 'color', JavaScript.ORDER_ATOMIC);
  let blockId = "''";
  if (block.getInputTargetBlock('thing')) {
    blockId = JavaScript.quote_(block.getInputTargetBlock('thing')?.id);
  }
  const code = `await spheroColor(${blockId}, ${color});\n`;
  return code;
};

/**
 * Sends a roll command to the Sphero Mini.
 */
(globalThis as any)['spheroRoll'] = function (
  blockId: string,
  speed: number,
  heading: number
) {
  if (speed > 255) {
    speed = 255;
  }
  // get thing instance of block
  const block = getWorkspace()?.getBlockById(blockId);
  const bolt = (block as any).thing;
  bolt.roll(speed, heading, []);
};

/**
 * Sends a stop command to the Sphero Mini.
 */
(globalThis as any)['spheroStop'] = function (blockId: string) {
  // get thing instance of block
  const block = getWorkspace()?.getBlockById(blockId);
  const bolt = (block as any).thing;
  bolt.queue.clear();
  bolt.roll(0, 0, []);
};

/**
 * Sets the color of the Sphero Mini.
 */
(globalThis as any)['spheroColor'] = async function (
  blockId: string,
  color: string
) {
  // get thing instance of block
  const block = getWorkspace()?.getBlockById(blockId);
  const bolt = (block as any).thing;

  // convert color to rgb
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);

  await bolt.setAllLeds(red, green, blue);
};
