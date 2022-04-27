/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from 'blockly';
import {
  apiFunctions,
  continueRunner,
  getInterpreter,
  getWorkspace,
  intervalEvents,
  interruptRunner,
  throwError,
} from './../blast_interpreter.js';
// eslint-disable-next-line node/no-unpublished-import
import Interpreter from 'js-interpreter';
import {addEventCode} from './../blast_states_interpreter.js';
import {getDefinition} from './../blast_states.js';

// eslint-disable-next-line no-unused-vars
JavaScript['state_definition'] = function (block) {
  // event code is generated at Blast.States.generateCode(),
  // and the event block generator
  return null;
};

JavaScript['event'] = function (block) {
  // read block inputs
  const entersExits = block.getFieldValue('entersExits');
  const stateName = block.getFieldValue('NAME');
  const statements = JavaScript.statementToCode(block, 'statements');

  // When an event block is in the workspace start the event interpreter
  JavaScript.definitions_['eventChecker'] = 'startEventChecker()';

  // get this events' conditions
  const stateBlock = getDefinition(stateName, getWorkspace());
  if (stateBlock) {
    const stateConditions = JavaScript.valueToCode(
      stateBlock,
      'state_condition',
      JavaScript.ORDER_NONE
    );

    let conditions = stateConditions;
    if (entersExits !== 'ENTERS') {
      conditions = `!(${conditions})`;
    }

    const eventCode = `if(eventChecker("${block.id}", ${conditions})) {
        interruptRunner();
        ${statements} 
        continueRunner();
      }`;

    addEventCode(block.id, eventCode);
  }

  return null;
};

JavaScript['event_every_minutes'] = function (block) {
  // read block inputs
  const value =
    JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || 0;
  const unit = block.getFieldValue('units');
  const statements = JavaScript.quote_(
    JavaScript.statementToCode(block, 'statements')
  );

  let seconds;
  if (unit === 'seconds') {
    seconds = value;
  } else if (unit === 'minutes') {
    seconds = value * 60;
  } else if (unit === 'hours') {
    seconds = value * 60 * 60;
  }

  // When an event block is in the workspace start the event interpreter
  JavaScript.definitions_[
    block.id
  ] = `addIntervalEvent(${seconds}, ${statements});\n`;

  return null;
};

/**
 * Executes statements every x seconds.
 * @param {!number} seconds seconds to wait.
 * @param {!string} statements statements to execute.
 */
const addIntervalEvent = (seconds, statements) => {
  if (seconds === undefined || typeof seconds !== 'number' || seconds <= 0) {
    throwError('Timed event interval must be a number greater than 0.');
    return;
  }

  const func = function () {
    // interrupt BLAST execution
    interruptRunner();

    const interpreter = new Interpreter('');
    interpreter.getStateStack()[0].scope = getInterpreter().getGlobalScope();
    interpreter.appendCode(statements);

    const interruptRunner_ = function () {
      try {
        const hasMore = interpreter.step();
        if (hasMore) {
          setTimeout(interruptRunner_, 5);
        } else {
          // Continue BLAST execution.
          continueRunner();
        }
      } catch (error) {
        throwError(`Error executing program:\n ${error}`);
        console.error(error);
      }
    };
    interruptRunner_();
  };

  const interval = setInterval(func, seconds * 1000);
  intervalEvents.push(interval);
};

apiFunctions.push(['addIntervalEvent', addIntervalEvent]);
