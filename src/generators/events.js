/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import {throwError} from './../blast_interpreter.js';

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

JavaScript['event_every_minutes'] = function (block) {
  // read block inputs
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || 1;
  const unit = block.getFieldValue('units');
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );

  if (value < 0.1) {
    throwError('Event interval value must be greater than 0.1.');
  }

  let milliSeconds;
  if (unit === 'seconds') {
    milliSeconds = value * 1000;
  } else if (unit === 'minutes') {
    milliSeconds = value * 60 * 1000;
  } else if (unit === 'hours') {
    milliSeconds = value * 60 * 60 * 1000;
  }

  const code = `const interval = setInterval(() => eval(${statements}), ${milliSeconds});
// Add interval to intervalEvents, so it can be removed when BLAST is stopped.
intervalEvents.push(interval);\n`;

  return code;
};
