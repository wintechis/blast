/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block, Names} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Collects the generated names of every workspace variable read inside a state
 * condition's block subtree. The scheduler uses these to re-evaluate the state
 * the instant one of the variables is written, instead of waiting for a poll.
 */
const collectConditionVariables = function (
  conditionBlock: Block | null
): string[] {
  if (!conditionBlock) {
    return [];
  }
  const names = new Set<string>();
  for (const descendant of conditionBlock.getDescendants(false)) {
    if (descendant.type === 'variables_get') {
      names.add(
        JavaScript.nameDB_.getName(
          descendant.getFieldValue('VAR'),
          Names.NameType.VARIABLE
        )
      );
    }
  }
  return [...names];
};

JavaScript.forBlock['state_definition'] = function (block: Block): string {
  const stateName = block.getFieldValue('NAME');
  const stateCondition =
    JavaScript.valueToCode(block, 'state_condition', JavaScript.ORDER_NONE) ||
    'false';

  const id = JavaScript.quote_(block.id);

  JavaScript.definitions_['customEvents'] = `
const customEvents = new Map();
const eventTargets = new Map();`;

  // Create the CustomEvents and EventTargets this state dispatches on. Doing so
  // in the definitions section guarantees they exist before any `event` block
  // adds a listener or the scheduler fires an edge.
  JavaScript.definitions_['customEvents-' + block.id] =
    `customEvents.set(${id}, [new CustomEvent('${stateName}'), new CustomEvent('${stateName}')]);
eventTargets.set('${stateName}', [new EventTarget(), new EventTarget()]);`;

  // Discover the variables this condition reads so the scheduler can re-evaluate
  // it the moment one of them changes (push), rather than only on the next poll.
  const variables = collectConditionVariables(
    block.getInputTargetBlock('state_condition')
  );
  const variableList = variables.map(name => JavaScript.quote_(name)).join(', ');

  // Register the state with the shared scheduler instead of spinning up a
  // dedicated `while (true)` poll loop. The scheduler evaluates the condition on
  // variable writes (push) and on a shared timer (fallback), performs edge
  // detection and dispatches the enter/exit events, and is torn down cleanly
  // when the interpreter stops.
  const code = `blastScheduler.addState(
  ${id},
  async () => (${stateCondition}),
  () => eventTargets.get('${stateName}')[0].dispatchEvent(customEvents.get(${id})[0]),
  () => eventTargets.get('${stateName}')[1].dispatchEvent(customEvents.get(${id})[1]),
  [${variableList}]
);\n`;

  return code;
};

JavaScript.forBlock['event'] = function (block: Block): string {
  // read block inputs
  const stateName = block.getFieldValue('NAME');
  const statements = JavaScript.statementToCode(block, 'statements');
  const enters = block.getFieldValue('entersExits') === 'ENTERS';

  const index = enters ? 0 : 1;
  // Wrap the handler body so a throw in one event handler is reported through
  // the scheduler instead of surfacing as an unhandled promise rejection.
  return `eventTargets.get('${stateName}')[${index}].addEventListener('${stateName}', async () => {
  try {
${statements}
  } catch (e) {
    blastScheduler.reportError(e);
  }
});\n`;
};

/**
 * Instruments Blockly's built-in variable-write generators (`variables_set` and
 * `math_change`) so that every write notifies the scheduler. This is what makes
 * state conditions push-driven: a state that reads a variable is re-evaluated
 * the instant that variable is assigned, with no polling latency.
 */
const instrumentVariableWrite = function (type: 'variables_set' | 'math_change') {
  const original = JavaScript.forBlock[type];
  if (!original) {
    return;
  }
  JavaScript.forBlock[type] = function (block: Block): string {
    // Forward the generator as both `this` and the second argument to support
    // either Blockly forBlock calling convention.
    const code = original.call(JavaScript, block, JavaScript) as string;
    const name = JavaScript.nameDB_.getName(
      block.getFieldValue('VAR'),
      Names.NameType.VARIABLE
    );
    // Fire-and-forget: re-evaluation is async but must not change the timing or
    // control flow of the surrounding user code.
    return `${code}blastScheduler.notifyVariable(${JavaScript.quote_(name)});\n`;
  };
};

instrumentVariableWrite('variables_set');
instrumentVariableWrite('math_change');
