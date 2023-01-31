/**
 * @fileoverview JavaScript code generators for the Xiaomi Flower Care blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {getWorkspace} from '../../interpreter';

/**
 * Generates JavaScript code for the things_xiaomiFlowerCare block.
 */
JavaScript['things_xiaomiFlowerCare'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.web.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.definitions_['XiaomiFlowerCare'] =
    'const {XiaomiFlowerCare} = blastTds;';
  JavaScript.definitions_['things'] = 'const things = new Map();';
  JavaScript.definitions_[
    'things' + block.id
  ] = `things.set(${name}, await createThing(XiaomiFlowerCare, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

JavaScript['xiaomiFlowerCare_read'] = function (block: Block) {
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
