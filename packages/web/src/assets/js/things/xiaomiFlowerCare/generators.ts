/**
 * @fileoverview JavaScript code generators for the Xiaomi Flower Care blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_xiaomiFlowerCare block.
 */
JavaScript.forBlock['things_xiaomiFlowerCare'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['XiaomiFlowerCare'] =
    'const {XiaomiFlowerCare} = blastTds;';
  JavaScript.things_['things' + name] =
    `things.set(${name}, await createThing(XiaomiFlowerCare, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

JavaScript.forBlock['xiaomiFlowerCare_read'] = function (block: Block) {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const readFlowerCare = JavaScript.provideFunction_('readFlowerCare', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(name) {',
    " await things.get(name).invokeAction('readMode', 'A01F');",
    " const interactionOutput = await things.get(name).readProperty('valueString');",
    ' return interactionOutput.value();',
    '}',
  ]);

  return [`await ${readFlowerCare}(${name})`, JavaScript.ORDER_NONE];
};
