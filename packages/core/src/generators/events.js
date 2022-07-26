/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;

// eslint-disable-next-line no-unused-vars
JavaScript['state_definition'] = function (block) {
  const stateName = block.getFieldValue('NAME');
  const stateCondition = JavaScript.valueToCode(
    block,
    'state_condition',
    JavaScript.ORDER_NONE
  );

  JavaScript.definitions_[
    block.id
  ] = `const stateEvent = new CustomEvent("${stateName}");`;
  JavaScript.definitions_['eventTargets'] = 'const eventTargets = new Map()';

  const functionName = JavaScript.provideFunction_(
    stateName,
    `
eventTargets.set("${stateName}", new EventTarget());
let prevValue = ${stateCondition};
async function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}() {
    while (true) {
        const value = ${stateCondition};
        if (!prevValue && value) {
          eventTargets.get("${stateName}").dispatchEvent(stateEvent);
        }
        prevValue = value;
        await new Promise(resolve => setTimeout(resolve, 5));
    }
}`
  );

  const code = `${functionName}();\n`;

  return code;
};

JavaScript['event'] = function (block) {
  // read block inputs
  const stateName = block.getFieldValue('NAME');
  const statements = JavaScript.statementToCode(block, 'statements');

  const code = `eventTargets.get("${stateName}").addEventListener("${stateName}", () => {\n${statements}});\n`;

  return code;
};
