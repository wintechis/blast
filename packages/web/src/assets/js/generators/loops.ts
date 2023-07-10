/**
 * @fileoverview Generating JavaScript for Blast's loop blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {stopJS} from '../interpreter';

// Remap blockly blocks to improve naming in xml.
JavaScript.forBlock['repeat'] = JavaScript.forBlock['controls_repeat_ext'];
JavaScript.forBlock['while_until'] = JavaScript.forBlock['controls_whileUntil'];
JavaScript.forBlock['for'] = JavaScript.forBlock['controls_for'];
JavaScript.forBlock['break_continue'] =
  JavaScript.forBlock['controls_flow_statements'];
JavaScript.forBlock['conditional_statement'] =
  JavaScript.forBlock['controls_if'];

/**
 * Generates JavaScript code for the wait_seconds block.
 */
JavaScript.forBlock['wait_seconds'] = function (block: Block): string {
  const seconds =
    JavaScript.valueToCode(block, 'SECONDS', JavaScript.ORDER_ATOMIC) || 0;

  const waitSeconds = JavaScript.provideFunction_('waitSeconds', [
    'async function ' + JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(seconds) {',
    '  await new Promise(resolve => setTimeout(resolve, seconds * 1000));',
    '}',
  ]);
  const code = `await ${waitSeconds}(${seconds});\n`;
  return code;
};

/**
 * Generates JavaScript code for the every_seconds block.
 */
JavaScript.forBlock['every_seconds'] = function (block: Block): string {
  // read block inputs
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || 1;
  const unit = block.getFieldValue('units');
  const statements = JavaScript.statementToCode(block, 'statements');

  JavaScript.definitions_['every_seconds'] =
    'const everySecondsIntervals = {};';

  if (value < 0.1) {
    console.error('Event interval value must be greater than 0.1.');
  }

  let milliSeconds;
  if (unit === 'seconds') {
    milliSeconds = value * 1000;
  } else if (unit === 'minutes') {
    milliSeconds = value * 60 * 1000;
  } else if (unit === 'hours') {
    milliSeconds = value * 60 * 60 * 1000;
  }

  const code = `everySecondsIntervals['${block.id}'] = setInterval(
  async () => {${statements}},
  ${milliSeconds}
);
// Add interval to intervalEvents, so it can be removed when BLAST is stopped.
intervalEvents.push(everySecondsIntervals['${block.id}']);\n`;

  return code;
};

/**
 * Generates JavaScript for the terminate block.
 * @param {Blockly.Block} block the terminate block.
 * @returns {String} the generated code.
 */
JavaScript.forBlock['terminate'] = function (block: Block): string {
  const code = 'process.exit();\n';

  return code;
};

if (typeof window !== 'undefined') {
  (globalThis as any)['interpreterExecutionExit'] = false;
  (globalThis as any)['process'] = {
    exit: () => {
      // eslint-disable-next-line no-undef
      (globalThis as any)['interpreterExecutionExit'] = true;
      stopJS();
    },
  };
}
