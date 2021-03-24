/**
 * @fileoverview Utility functions for handling states.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
 * Namespace for state Utility functions.
 * @name Blast.States
 * @namespace
 * @public
 */
goog.provide('Blast.States');

/**
 * State block type.
 * @typedef {{
 *    getStateName: function():string,
 *    renameState: function(string,string),
 *    getStateDef: function():!String
 * }}
 */
Blast.States.StateBlock;

/**
 * Instance of the JS Interpreter checking for changing states.
 * @type {?Interpreter}
 * @public
 */
Blast.States.Interpreter = null;

/**
 * latest JavaScript code generated by Blast's State and event blocks.
 * @type {string}
 * @public
 */
Blast.States.latestCode = '';

/**
 * Map containing code generated by every event block.
 */
Blast.States.eventCode = new Map();

/**
 * Map containing previous values for events identified by block IDs.
 * @type {Map<!Blockly.Block.id, boolean>}
 * @public
 */
Blast.States.eventValues = new Map();

/**
 * Compares a given state condition with its' previous value.
 * @param {Blockly.Block.id} blockId id of the state definition block.
 * @param {boolean} curValue the current condition evaluated.
 * @return {boolean} true if state condition is now true and was false before,
 * false otherwise.
 */
Blast.States.eventChecker = function(blockId, curValue) {
  const prevValue = Blast.States.eventValues.get(blockId);
  Blast.States.eventValues.set(blockId, curValue);

  if (prevValue != undefined) {
    return !prevValue && curValue;
  }
  return false;
};

/**
 * adds an event block's code to {@link Blast.States.eventCode}.
 * @param {Blockly.Block.id} blockId id of the event block.
 * @param {string} eventCode code generated by the event block.
 */
Blast.States.addEventCode = function(blockId, eventCode) {
  Blast.States.eventCode.set(blockId, eventCode);
};

/**
 * removes an event block's code from {@link Blast.States.eventCode}.
 * @param {Blockly.Block.id} blockId id of the event block.
 */
Blast.States.removeEventCode = function(blockId) {
  Blast.States.eventCode.delete(blockId);
};

/**
 * Generates the code for all events a workspace.
 * @param {!Blockly.Workspace} workspace Root workspace.
 */
Blast.States.generateCode = function() {
  // event blocks are continuously checking for state condditions.
  let code = 'while (true) {\n \n}';

  // get all event blocks in the workspace
  const eventIds = Blast.workspace.getBlocksByType('event', false).map(function(block) {
    return block.id;
  });

  for (const [id, eventCode] of Blast.States.eventCode) {
    // only add code for event blocks in the workspace
    if (eventIds.includes(id)) {
      // insert event code before the closing '\n}'
      code = code.slice(0, -2) + eventCode + '\n' + code.slice(-1);
    }
  }
  // prepend generated code with variable and function definitions
  Blast.States.latestCode = Blockly.JavaScript.finish(code);
};

/**
 * executes {@link Blast.States.latestCode} using {@link Blast.Interpreter}.
 */
Blast.States.startEventChecker = function() {
  Blast.States.Interpreter = null;
  // Begin execution
  Blast.States.Interpreter = new Interpreter(Blast.States.latestCode, initApi);
  Blast.States.Interpreter.stateStack[0].scope = Blast.Interpreter.stateStack[0].scope;

  const runner_ = function() {
    if (Blast.States.Interpreter) {
      try {
        Blast.States.Interpreter.step();
        setTimeout(runner_, 5);
      } catch (error) {
        Blockly.alert('Error executing program:\n%e'.replace('%e', error));
        Blast.setStatus(Blast.status.ERROR);
        Blast.resetInterpreter();
        console.error(error);
      }
    }
  };
  runner_();
};

/**
 * Find all user-created state definitions in a workspace.
 * @param {!Blockly.Workspace} root Root workspace.
 * @return {!Array} Array containing states.
 */
Blast.States.allStates = function(root) {
  const states = root.getBlocksByType('state_definition', false).map(function(block) {
    return /** @type {!Blast.States.StateBlock} */ (block).getStateDef()[0];
  });
  return states;
};

/**
 * Ensure two identically-named states don't exist.
 * Take the proposed state name, and return a legal name i.e. one that
 * is not empty and doesn't collide with other states.
 * @param {string} name Proposed state name.
 * @param {!Blockly.Block} block Block to disambiguate.
 * @return {string} Non-colliding name.
 */
Blast.States.findLegalName = function(name, block) {
  if (block.isInFlyout) {
    return name;
  }
  name = name || Blockly.Msg['UNNAMED_KEY'] || 'unnamed';
  while (!Blast.States.isLegalName_(name, block.workspace, block)) {
    // Collision with another state.
    const r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      name += '2';
    } else {
      name = r[1] + (parseInt(r[2], 10) + 1);
    }
  }
  return name;
};

/**
 * Does this state have a legal name?  Illegal names include names of
 * states already defined.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block=} optExclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is legal.
 * @private
 */
Blast.States.isLegalName_ = function(name, workspace, optExclude) {
  return !Blast.States.isNameUsed(name, workspace, optExclude);
};

/**
 * Return if the given name is already a state name.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block=} optExclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is used, otherwise return false.
 */
Blast.States.isNameUsed = function(name, workspace, optExclude) {
  const blocks = workspace.getAllBlocks(false);
  // Iterate through every block and check the name.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] == optExclude) {
      continue;
    }
    if (blocks[i].getStateDef) {
      const stateBlock = /** @type {!Blast.States.StateBlock} */ (blocks[i]);
      const stateName = stateBlock.getStateDef()[0];
      if (Blockly.Names.equals(stateName, name)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Rename a state.  Called by the editable field.
 * @param {string} name The proposed new name.
 * @return {string} The accepted name.
 * @this {Blockly.Field}
 */
Blast.States.rename = function(name) {
  // Strip leading and trailing whitespace. Beyond this, all names are legal.
  name = name.trim();

  const legalName = Blast.States.findLegalName(
      name,
      /** @type {!Blockly.Block} */ (this.getSourceBlock()),
  );
  const oldName = this.getValue();
  if (oldName != name && oldName != legalName) {
    // Rename any events.
    const blocks = this.getSourceBlock().workspace.getAllBlocks(false);
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].renameState) {
        const stateBlock = /** @type {!Blast.States.Stateblock} */ (blocks[i]);
        stateBlock.renameState(/** @type {string} */ (oldName), legalName);
      }
    }
  }
  return legalName;
};

/**
 * Construct the blocks required by the flyout for the state category.
 * @param {!Blockly.Workspace} workspace The workspace containing states.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blast.States.flyoutCategory = function(workspace) {
  const xmlList = [];
  if (Blockly.Blocks['state_definition']) {
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'state_definition');
    block.setAttribute('gap', 16);
    const nameField = Blockly.utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(Blockly.utils.xml.createTextNode('state name'));
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }

  /**
   * Creates an event block for each state in stateList.
   * @param {string[]} stateList Array containing states.
   */
  function populateEvents(stateList) {
    // if stateList is empty create disabled event block.
    if (stateList.length == 0) {
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'event');
      block.setAttribute('gap', 16);
      block.setAttribute('disabled', true);
      const mutation = Blockly.utils.xml.createElement('mutation');
      mutation.setAttribute('name', 'state name');
      block.appendChild(mutation);
      xmlList.push(block);
    }

    for (let i = 0; i < stateList.length; i++) {
      const name = stateList[i];
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'event');
      block.setAttribute('gap', 16);
      const mutation = Blockly.utils.xml.createElement('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      xmlList.push(block);
    }
  }

  const states = Blast.States.allStates(workspace);
  populateEvents(states);
  return xmlList;
};

/**
 * Find all the events of a named state.
 * @param {string} name Name of state.
 * @param {!Blockly.Workspace} workspace The workspace to find events in.
 * @return {!Array.<!Blockly.Block>} Array of event blocks.
 */
Blast.States.getEvents = function(name, workspace) {
  const events = [];
  const blocks = workspace.getAllBlocks(false);
  // Iterate through every block and check the name.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getStateName) {
      const eventBlock = /** @type {!Blast.States.EventBlock} */ (blocks[i]);
      const stateName = eventBlock.getStateName();
      // State name may be null if the block is only half-built.
      if (stateName && Blockly.Names.equals(stateName, name)) {
        events.push(blocks[i]);
      }
    }
  }
  return events;
};

/**
 * Find the definition block for the named event.
 * @param {string} name Name of event.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The state definition block, or null if not found.
 */
Blast.States.getDefinition = function(name, workspace) {
  // Assume that a state definition is a top block.
  const blocks = workspace.getTopBlocks(false);
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getStateDef) {
      const stateBlock = /** @type {!Blast.States.StateBlock} */ (blocks[i]);
      const stateName = stateBlock.getStateDef()[0];
      if (stateName && Blockly.Names.equals(stateName, name)) {
        return blocks[i];
      }
    }
  }
  return null;
};
