/**
 * @fileoverview Generates JavaScript of the HuskyDuino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the things_Huskylens block.
 */
JavaScript.forBlock['things_Huskylens'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
  JavaScript.priority_['HuskyDuino'] = 'const {HuskyDuino} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThing(HuskyDuino, ${id}));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generate JavaScript code of the huskylens_write_algo_property block.
 */
JavaScript.forBlock['huskylens_write_algo_property'] = function (
  block: Block
): string {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const algorithm = JavaScript.quote_(block.getFieldValue('algorithm'));

  const code = `await things.get(${name}).writeProperty('algorithm', ${algorithm});\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_write_id_property block.
 */
JavaScript.forBlock['huskylens_write_id_property'] = function (
  block: Block
): string {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const id =
    JavaScript.quote_(
      JavaScript.valueToCode(block, 'id', JavaScript.ORDER_ATOMIC)
    ) || '0';

  const code = `await things.get(${name}).writeProperty('id', ${id});\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_forgetAll_action block.
 */
JavaScript.forBlock['huskylens_forgetAll_action'] = function (
  block: Block
): string {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const code = `await things.get(${name}).invokeAction('forgetAll');\n`;
  return code;
};

/**
 * Generate JavaScript code for the huskylens_read_id_propery block.
 */
JavaScript.forBlock['huskylens_read_id_propery'] = function (
  block: Block
): [string, number] {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const code = `await things.get(${name}).readProperty('id')`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generate JavaScript code for the huskylens_read_location_property block.
 */
JavaScript.forBlock['huskylens_read_location_property'] = function (
  block: Block
): [string, number] {
  const name =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const code = `await things.get(${name}).readProperty('location')`;
  return [code, JavaScript.ORDER_NONE];
};
