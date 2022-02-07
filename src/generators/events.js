/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
import {apiFunctions} from './../blast_interpreter.js';
import {addEventCode} from './../blast_states_interpreter.js';
import {getDefinition} from './../blast_states.js';
import {getInterpreter} from './../blast_interpreter.js';
import {getWorkspace} from './../blast_interpreter.js';
import {intervalEvents} from './../blast_interpreter.js';
import {setInterrupted} from './../blast_interpreter.js';
import {throwError} from './../blast_interpreter.js';


// eslint-disable-next-line no-unused-vars
Blockly.JavaScript['state_definition'] = function(block) {
  // event code is generated at Blast.States.generateCode(),
  // and the event block generator
  return null;
};
  
Blockly.JavaScript['event'] = function(block) {
  // read block inputs
  const entersExits = block.getFieldValue('entersExits');
  const stateName = block.getFieldValue('NAME');
  const statements = Blockly.JavaScript.statementToCode(block, 'statements');
  
  // When an event block is in the workspace start the event interpreter
  Blockly.JavaScript.definitions_['eventChecker'] = 'startEventChecker()';
  
  // get this events' conditions
  const stateBlock = getDefinition(stateName, getWorkspace());
  if (stateBlock) {
    const stateConditions = Blockly.JavaScript.valueToCode(
        stateBlock,
        'state_condition',
        Blockly.JavaScript.ORDER_NONE,
    );
    
    let conditions = stateConditions;
    if (entersExits != 'ENTERS') {
      conditions = `!(${conditions})`;
    }
  
    const eventCode = `if(eventChecker("${block.id}", ${conditions})) {
        setInterrupted(true);
        ${statements} 
        setInterrupted(false);
      }`;
  
    addEventCode(block.id, eventCode);
  }
  
  return null;
};

Blockly.JavaScript['event_every_minutes'] = function(block) {
  // read block inputs
  const value = Blockly.JavaScript.valueToCode(
      block,
      'value',
      Blockly.JavaScript.ORDER_NONE,
  ) || 0;
  const unit = block.getFieldValue('units');
  const statements = Blockly.JavaScript.quote_(
      Blockly.JavaScript.statementToCode(block, 'statements'),
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
  Blockly.JavaScript.definitions_[block.id] =
  `addIntervalEvent(${seconds}, ${statements});\n`;

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

  const func = function() {
  // interrupt BLAST execution
    setInterrupted(false);

    const interpreter = new Interpreter('');
    interpreter.getStateStack()[0].scope = getInterpreter().getGlobalScope();
    interpreter.appendCode(statements);

    const interruptRunner_ = function() {
      try {
        const hasMore = interpreter.step();
        if (hasMore) {
          setTimeout(interruptRunner_, 5);
        } else {
        // Continue BLAST execution.
          setInterrupted(false);
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
