/**
 * @fileoverview Utility functions for handling states.
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * Namespace for state Utility functions.
 * @name Blast.States
 * @namespace
 * @public
 */
Blast.States = {};

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
 * Find all user-created state definitions in a workspace.
 * @param {!Blockly.Workspace} root Root workspace.
 * @return {!Array} Array containing states.
 */
Blast.States.allStates = function(root) {
  const states = root
      .getBlocksByType('state_definition', false)
      .map(function(block) {
        return /** @type {!Blast.States.StateBlock} */ (block).getStateName();
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
 * @param {Blockly.Block=} opt_exclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is legal.
 * @private
 */
Blast.States.isLegalName_ = function(name, workspace, opt_exclude) {
  return !Blast.States.isNameUsed(name, workspace, opt_exclude);
};

/**
 * Return if the given name is already a state name.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block=} opt_exclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is used, otherwise return false.
 */
Blast.States.isNameUsed = function(name, workspace, opt_exclude) {
  const blocks = workspace.getAllBlocks(false);
  // Iterate through every block and check the name.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] == opt_exclude) {
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
    nameField.appendChild(
        Blockly.utils.xml.createTextNode('state name'),
    );
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
      const stateBlock = /** @type {!Blast.States.StateBlock} */ (blocks[i]);
      const stateName = stateBlock.getStateName();
      // State name may be null if the block is only half-built.
      if (stateName && Blockly.Names.equals(stateName, name)) {
        events.push(blocks[i]);
      }
    }
  }
  return events;
};

/**
 * Find the definition block for the named state.
 * @param {string} name Name of state.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The state definition block, or null if not found.
 */
Blast.States.getDefinition = function(name, workspace) {
  // Assume that a state definition is a top block.
  const blocks = workspace.getTopBlocks(false);
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getStateDef) {
      const stateBlock = /** @type {!Blast.States.StateBlock} */ (blocks[i]);
      const state = stateBlock.getStateDef();
      if (state && Blockly.Names.equals(state, name)) {
        return blocks[i];
      }
    }
  }
  return null;
};
