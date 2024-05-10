/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {getDefinition} from '../../states';

JavaScript.forBlock['state'] = function (block: Block): string {
  // read block inputs
  const stateName = block.getFieldValue('NAME');
  const statements = JavaScript.statementToCode(block, 'statements');

  const id = JavaScript.quote_(block.id);

  JavaScript.definitions_['customEvents'] = `
const customEvents = new Map();
const eventTargets = new Map();`;

  JavaScript.definitions_['customEvents-' + block.id] =
    `customEvents.set(${id}, new CustomEvent('${stateName}'));
eventTargets.set('${stateName}', new EventTarget());`;

  JavaScript.definitions_['states'] = `
const states = new Map();`;

  const functionName = JavaScript.provideFunction_(
    stateName,
    `async function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}() {
    ${statements}
  }`
  );

  JavaScript.definitions_['states-' + block.id] =
    `states.set(${id}, eventTargets.get('${stateName}').addEventListener('${stateName}', ${functionName}));`;

  return '';
};

JavaScript.forBlock['transition'] = function (block: Block): string {
  const stateName = block.getFieldValue('NAME');
  const stateDefBlock = getDefinition(stateName, block.workspace);
  const code = `eventTargets.get('${stateName}')
  .dispatchEvent(customEvents.get(${JavaScript.quote_(stateDefBlock.id)}));\n`;

  return code;
};
