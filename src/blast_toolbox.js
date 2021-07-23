/**
 * @fileoverview Defines the toolbox and its helper methods.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

goog.provide('Blast.Toolbox');

const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'repeat'},
        {kind: 'BLOCK', type: 'while_until'},
        {kind: 'BLOCK', type: 'for'},
        {kind: 'BLOCK', type: 'wait_seconds'},
        {kind: 'BLOCK', type: 'break_continue'},
        {kind: 'BLOCK', type: 'conditional_statement'},
      ],
      name: 'Control Flow',
      colour: '120',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'logic_compare'},
        {kind: 'BLOCK', type: 'logic_operation'},
        {kind: 'BLOCK', type: 'logic_negate'},
      ],
      name: 'Boolean Expressions',
      colour: '210',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Things',
      custom: 'THINGS',
      colour: '60',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Properties',
      colour: '255',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Events',
      colour: '180',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'States',
      custom: 'STATES',
      colour: '180',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'string'},
        {kind: 'BLOCK', type: 'string_join'},
        {kind: 'BLOCK', type: 'string_length'},
        {kind: 'BLOCK', type: 'string_indexOf'},
        {kind: 'BLOCK', type: 'string_charAt'},
        {kind: 'BLOCK', type: 'string_getSubstring'},
        {kind: 'BLOCK', type: 'string_changeCase'},
        {kind: 'BLOCK', type: 'string_replace'},
      ],
      name: 'Strings',
      colour: '160',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'number_value'},
        {kind: 'BLOCK', type: 'number_infinity'},
        {kind: 'BLOCK', type: 'number_arithmetic'},
        {kind: 'BLOCK', type: 'number_modulo'},
        {kind: 'BLOCK', type: 'number_random'},
      ],
      name: 'Numbers',
      colour: '230',
    },
    {
      kind: 'CATEGORY',
      contents: [{kind: 'BLOCK', type: 'logic_boolean'}],
      name: 'Booleans',
      colour: '210',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '330',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Functions',
      colour: '290',
      custom: 'PROCEDURE',
    },
    {
      kind: 'sep',
      gap: '32',
    },
  ],
};

/**
 * The currently used toolbox.
 * @type {Blockly.toolbox}
 * @public
 */
Blast.Toolbox.currentToolbox = defaultToolbox;

/**
 * Initialize the toolbox
 */
Blast.Toolbox.init = function() {
  // register states category flyout callback
  Blast.workspace.registerToolboxCategoryCallback('STATES', Blast.States.flyoutCategory);

  // register things category flyout callback
  Blast.workspace.registerToolboxCategoryCallback('THINGS', Blast.Things.flyoutCategory);
};

/**
 * Get category by name.
 * @param {string} name The name of the category.
 * @returns {Object} the category
 * */
Blast.Toolbox.getCategory = function(name) {
  return Blast.Toolbox.currentToolbox.contents.find(function(category) {
    if (category.name) {
      return category.name.toLowerCase() === name.toLowerCase();
    }
    return false;
  });
};

/**
 * Adds a block to the toolbox.
 * @param {string} type The type of block to add.
 * @param {string} blockCategory The category of the block.
 */
Blast.Toolbox.addBlock = function(type, blockCategory) {
  const block = {
    kind: 'BLOCK',
    type: type,
  };
  // Find the category and add the block to it.
  const category = Blast.Toolbox.getCategory(blockCategory);
  if (category) {
    category.contents.push(block);
  }
};
