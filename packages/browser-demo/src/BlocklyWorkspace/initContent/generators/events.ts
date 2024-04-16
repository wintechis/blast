/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

// eslint-disable-next-line no-unused-vars
JavaScript.forBlock['state_definition'] = function (block: Block): string {
  const stateName = block.getFieldValue('NAME');
  const stateCondition = JavaScript.valueToCode(
    block,
    'state_condition',
    JavaScript.ORDER_NONE
  );

  const id = JavaScript.quote_(block.id);

  JavaScript.definitions_['customEvents'] = `
const customEvents = new Map();
const eventTargets = new Map();`;

  JavaScript.definitions_['customEvents-' + block.id] =
    `customEvents.set(${id}, [new CustomEvent('${stateName}'), new CustomEvent('${stateName}')]);`;

  const functionName = JavaScript.provideFunction_(
    stateName,
    `
eventTargets.set('${stateName}', [new EventTarget(), new EventTarget()]);
async function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}() {
  let prevValue = false;
  while (true) {
    let value = (${stateCondition});
    if (!prevValue && value) {
      eventTargets.get('${stateName}')[0].dispatchEvent(customEvents.get(${id})[0]);
      value = (${stateCondition});
    }
    if (prevValue && !value) {
      eventTargets.get('${stateName}')[1].dispatchEvent(customEvents.get(${id})[1]);
      value = (${stateCondition});
    }
    prevValue = value;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}`
  );

  const code = `${functionName}();\n`;

  return code;
};

JavaScript.forBlock['event'] = function (block: Block): string {
  // read block inputs
  const stateName = block.getFieldValue('NAME');
  const statements = JavaScript.statementToCode(block, 'statements');
  const enters = block.getFieldValue('entersExits') === 'ENTERS';

  if (enters) {
    return `eventTargets.get('${stateName}')[0].addEventListener('${stateName}', async () => {\n${statements}\n});\n`;
  } else {
    return `eventTargets.get('${stateName}')[1].addEventListener('${stateName}', async () => {\n${statements}\n});\n`;
  }
};
