/**
 * @fileoverview Utility functions for handling states.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks, Msg, Names, utils} = Blockly;
import {getCategory} from './toolbox.ts';

/**
 * Find all user-created state definitions in a workspace.
 * @param {!Blockly.Workspace} root Root workspace.
 * @return {!Array} Array containing states.
 */
const allStates = function (root) {
  const states = root.getBlocksByType('state_definition', false).map(block => {
    return /** @type {!StateBlock} */ (block).getStateDef()[0];
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
export const findLegalName = function (name, block) {
  if (block.isInFlyout) {
    return name;
  }
  name = name ?? Msg['UNNAMED_KEY'] ?? 'unnamed';
  while (!isLegalName_(name, block.workspace, block)) {
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
const isLegalName_ = function (name, workspace, optExclude) {
  return !isNameUsed(name, workspace, optExclude);
};

/**
 * Return if the given name is already a state name.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block=} optExclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is used, otherwise return false.
 */
const isNameUsed = function (name, workspace, optExclude) {
  const blocks = workspace.getAllBlocks(false);
  // Iterate through every block and check the name.
  for (const block of blocks) {
    if (block === optExclude) {
      continue;
    }
    if (block.getStateDef) {
      const stateBlock = /** @type {!StateBlock} */ (block);
      const stateName = stateBlock.getStateDef()[0];
      if (Names.equals(stateName, name)) {
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
export const rename = function (name) {
  // Strip leading and trailing whitespace. Beyond this, all names are legal.
  name = name.trim();

  const legalName = findLegalName(
    name,
    /** @type {!Blockly.Block} */ (this.getSourceBlock())
  );
  const oldName = this.getValue();
  if (oldName !== name && oldName !== legalName) {
    // Rename any events.
    const blocks = this.getSourceBlock().workspace.getAllBlocks(false);
    for (const block of blocks) {
      if (block.renameState) {
        const stateBlock = /** @type {!Stateblock} */ (block);
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
export const statesFlyoutCategory = function (workspace) {
  const xmlList = [];

  if (Blocks['state_definition']) {
    const block = utils.xml.createElement('block');
    block.setAttribute('type', 'state_definition');
    block.setAttribute('gap', 16);
    const nameField = utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(utils.xml.createTextNode('state name'));
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }

  /**
   * Creates an event block for each state in stateList.
   * @param {Array<string>} stateList Array containing states.
   */
  function populateEvents(stateList) {
    // if stateList is empty create disabled event block.
    if (stateList.length === 0) {
      const block = utils.xml.createElement('block');
      block.setAttribute('type', 'event');
      block.setAttribute('gap', 16);
      block.setAttribute('disabled', true);
      const mutation = utils.xml.createElement('mutation');
      mutation.setAttribute('name', 'state name');
      block.appendChild(mutation);
      xmlList.push(block);
    }

    for (const stateName of stateList) {
      const block = utils.xml.createElement('block');
      block.setAttribute('type', 'event');
      block.setAttribute('gap', 16);
      const mutation = utils.xml.createElement('mutation');
      mutation.setAttribute('name', stateName);
      block.appendChild(mutation);
      xmlList.push(block);
    }
  }

  const states = allStates(workspace);
  // Add event blocks to the list.
  populateEvents(states);

  // Add all blocks from the categories contents array to the list.
  const category = getCategory('States');
  if (category) {
    for (const content of category.contents) {
      const block = utils.xml.createElement('block');
      block.setAttribute('type', content.type);
      block.setAttribute('gap', 16);
      xmlList.push(block);
    }
  }

  return xmlList;
};

/**
 * Find the definition block for the named event.
 * @param {string} name Name of event.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The state definition block, or null if not found.
 */
export const getDefinition = function (name, workspace) {
  // Assume that a state definition is a top block.
  const blocks = workspace.getTopBlocks(false);
  for (const block of blocks) {
    if (block.getStateDef) {
      const stateBlock = /** @type {!StateBlock} */ (block);
      const stateName = stateBlock.getStateDef()[0];
      if (stateName && Names.equals(stateName, name)) {
        return block;
      }
    }
  }
  return null;
};
