/**
 * @fileoverview Generates JavaScript for the Sphero Mini.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {getSpheroMini} from './blocks';

/**
 * Generates JavaScript code for the things_bleLedController block.
 */
JavaScript.forBlock['things_spheroMini'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.cjs');";

  JavaScript.priority_['createThingWithHandlers'] =
    'const {createThingWithHandlers} = blastCore;';
  JavaScript.priority_['SpheroMini'] = 'const {SpheroMini} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThingWithHandlers(SpheroMini, ${id}, addSpheroHandlers));
  things.get(${name}).id = ${id};`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the spheroMini_roll block.
 */
JavaScript.forBlock['spheroMini_roll'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_ATOMIC) || null;
  const speed =
    JavaScript.valueToCode(block, 'speed', JavaScript.ORDER_ATOMIC) || 100;
  const heading =
    JavaScript.valueToCode(block, 'heading', JavaScript.ORDER_ATOMIC) || 0;

  const code = `await things.get(${thing}).invokeAction('roll', {speed: ${speed}, heading: ${heading}});\n`;
  return code;
};

/**
 * Generates JavaScript code for the spheroMini_roll block.
 */
JavaScript.forBlock['spheroMini_stop'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_ATOMIC) || null;

  const code = `await things.get(${thing}).invokeAction('roll', {speed: 0, heading: 0});\n`;
  return code;
};

/**
 * Adds WoT interaction handlers to the Sphero Mini ExposedThing instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)['addSpheroHandlers'] = function (sphero: WoT.ExposedThing) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mini = getSpheroMini((sphero as any).id);
  sphero.setActionHandler('roll', async (params: WoT.InteractionOutput) => {
    const values = (await params.value()) as {speed: number; heading: number};
    let speed = values.speed;
    const heading = values.heading;

    if (speed > 255) {
      speed = 255;
    }

    mini.roll(speed, heading, []);

    return undefined;
  });
};
