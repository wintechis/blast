/**
 * @fileoverview Generating JavaScript for Blast's event blocks.
 * Most of the events' code is handled in js/blast_states.js
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

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
  const stateBlock = Blast.States.getDefinition(stateName, Blast.workspace);
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
        setInterrupt(true);
        ${statements} 
        setInterrupt(false);
      }`;
  
    Blast.States.addEventCode(block.id, eventCode);
  }
  
  return null;
};

