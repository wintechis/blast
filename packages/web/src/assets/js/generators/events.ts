/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

// eslint-disable-next-line no-unused-vars
JavaScript['state_definition'] = function (block: Block): string {
  const stateName = block.getFieldValue('NAME');
  const stateCondition = JavaScript.valueToCode(
    block,
    'state_condition',
    JavaScript.ORDER_NONE
  );

  const id = JavaScript.quote_(block.id);

  JavaScript.definitions_['customEvents'] = `
const customEvents = new Map();
const eventTargets = new Map();
const eventValues = new Map();`;

  JavaScript.definitions_[
    'customEvents-' + block.id
  ] = `customEvents.set(${id}, new CustomEvent("${stateName}"));`;

  const functionName = JavaScript.provideFunction_(
    stateName,
    `
eventTargets.set("${stateName}", new EventTarget());
eventValues.set(${id}, ${stateCondition});
async function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}() {
    while (true) {
        const value = ${stateCondition};
        if (!eventValues.get("${stateName}") && value) {
          eventTargets.get("${stateName}").dispatchEvent(customEvents.get(${id}));
        }
        eventValues.set("${stateName}", value);
        await new Promise(resolve => setTimeout(resolve, 5));
    }
}`
  );

  const code = `${functionName}();\n`;

  return code;
};

JavaScript['event'] = function (block: Block): string {
  // read block inputs
  const stateName = block.getFieldValue('NAME');
  const statements = JavaScript.statementToCode(block, 'statements');

  const code = `eventTargets.get("${stateName}").addEventListener("${stateName}", async () => {\n${statements}});\n`;

  return code;
};
