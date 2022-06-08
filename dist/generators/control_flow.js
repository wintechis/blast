/**
 * @fileoverview Generating JavaScript for Blast's control flow blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;

// Remap blockly blocks to improve naming in xml.
JavaScript['repeat'] = JavaScript['controls_repeat_ext'];
JavaScript['while_until'] = JavaScript['controls_whileUntil'];
JavaScript['for'] = JavaScript['controls_for'];
JavaScript['break_continue'] = JavaScript['controls_flow_statements'];
JavaScript['conditional_statement'] = JavaScript['controls_if'];

JavaScript['wait_seconds'] = function (block) {
  const seconds =
    JavaScript.valueToCode(block, 'SECONDS', JavaScript.ORDER_ATOMIC) || 0;

  const functionName = JavaScript.provideFunction_(
    'waitSeconds',
    `
async function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}(seconds) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}`
  );

  const code = `await ${functionName}(${seconds});\n`;
  return code;
};
