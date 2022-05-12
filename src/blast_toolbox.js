/**
 * @fileoverview Defines the toolbox and its helper methods.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import {getWorkspace} from './blast_interpreter.js';

const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
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
      contents: [
        {
          kind: 'label',
          text: '(Connect things to see device dependent blocks)',
        },
      ],
      name: 'Properties',
      colour: '255',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {
          kind: 'label',
          text: '(Connect things to see device dependent blocks)',
        },
      ],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'States and Events',
      custom: 'STATES',
      colour: '180',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Requests and Queries',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'uri_from_string'},
        {kind: 'label', text: 'example audio resources'},
        {
          kind: 'BLOCK',
          type: 'uri_from_string',
          inputs: {
            URI: {
              block: {
                type: 'string',
                fields: {
                  TEXT: 'https://studio.code.org/blockly/media/skins/dance/win.mp3',
                },
              },
            },
          },
        },
        {
          kind: 'BLOCK',
          type: 'uri_from_string',
          inputs: {
            URI: {
              block: {
                type: 'string',
                fields: {
                  TEXT: 'https://studio.code.org/blockly/media/click.mp3',
                },
              },
            },
          },
        },
        {
          kind: 'BLOCK',
          type: 'uri_from_string',
          inputs: {
            URI: {
              block: {
                type: 'string',
                fields: {
                  TEXT: 'https://upload.wikimedia.org/wikipedia/commons/2/25/243020_plasterbrain_game-start.ogg',
                },
              },
            },
          },
        },
        {
          kind: 'BLOCK',
          type: 'uri_from_string',
          inputs: {
            URI: {
              block: {
                type: 'string',
                fields: {
                  TEXT: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg',
                },
              },
            },
          },
        },
      ],
      name: 'Resources',
      colour: '60',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'while_until'},
        {kind: 'BLOCK', type: 'break_continue'},
        {kind: 'BLOCK', type: 'conditional_statement'},
        {kind: 'BLOCK', type: 'controls_forEach'},
      ],
      name: 'Control Flow',
      colour: '120',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Server Components',
      colour: '240',
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
      kind: 'CATEGORY',
      contents: [],
      name: 'Functions',
      colour: '290',
      custom: 'PROCEDURE',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '330',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'lists_create_empty'},
        {kind: 'BLOCK', type: 'lists_create_with'},
        {kind: 'BLOCK', type: 'lists_repeat'},
        {kind: 'BLOCK', type: 'lists_length'},
        {kind: 'BLOCK', type: 'lists_isEmpty'},
        {kind: 'BLOCK', type: 'lists_indexOf'},
        {kind: 'BLOCK', type: 'lists_getIndex'},
        {kind: 'BLOCK', type: 'lists_setIndex'},
        {kind: 'BLOCK', type: 'lists_getSublist'},
        {kind: 'BLOCK', type: 'lists_sort'},
        {kind: 'BLOCK', type: 'lists_split'},
        {kind: 'BLOCK', type: 'lists_reverse'},
      ],
      name: 'Lists',
      colour: '310',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'string'},
        {kind: 'BLOCK', type: 'string_multiline'},
        {kind: 'BLOCK', type: 'string_join'},
        {kind: 'BLOCK', type: 'string_length'},
        {kind: 'BLOCK', type: 'string_isEmpty'},
        {kind: 'BLOCK', type: 'string_indexOf'},
        {kind: 'BLOCK', type: 'string_charAt'},
        {kind: 'BLOCK', type: 'string_getSubstring'},
        {kind: 'BLOCK', type: 'string_changeCase'},
        {kind: 'BLOCK', type: 'string_trim'},
        {kind: 'BLOCK', type: 'string_count'},
        {kind: 'BLOCK', type: 'string_replace'},
        {kind: 'BLOCK', type: 'string_reverse'},
        {kind: 'BLOCK', type: 'string_showPrompt'},
      ],
      name: 'Strings',
      colour: '160',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'number_value'},
        {kind: 'BLOCK', type: 'number_arithmetic'},
        {kind: 'BLOCK', type: 'number_single'},
        {kind: 'BLOCK', type: 'number_trig'},
        {kind: 'BLOCK', type: 'number_constant'},
        {kind: 'BLOCK', type: 'number_property'},
        {kind: 'BLOCK', type: 'number_round'},
        {kind: 'BLOCK', type: 'number_on_list'},
        {kind: 'BLOCK', type: 'number_modulo'},
        {kind: 'BLOCK', type: 'number_constrain'},
        {kind: 'BLOCK', type: 'number_random'},
        {kind: 'BLOCK', type: 'number_random_float'},
        {kind: 'BLOCK', type: 'number_atan2'},
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
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'colour_picker'},
        {kind: 'BLOCK', type: 'colour_random'},
      ],
      name: 'Colours',
      colour: '20',
    },
  ],
};

/**
 * The currently used toolbox.
 * @type {Blockly.toolbox}
 * @public
 */
export const currentToolbox = defaultToolbox;

/**
 * Get category by name.
 * @param {string} name The name of the category.
 * @returns {Object} the category
 * */
export const getCategory = function (name) {
  return currentToolbox.contents.find(category => {
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
 * @param {string=} blockxml optional, the xml of the block.
 */
export const addBlock = function (type, blockCategory, blockxml) {
  const block = {
    kind: 'BLOCK',
    type: type,
    blockxml: blockxml,
  };
  // Find the category and add the block to it.
  const category = getCategory(blockCategory);
  if (category) {
    category.contents.push(block);
  }
};

/**
 * Reloads the toolbox
 */
export const reloadToolbox = function () {
  getWorkspace().updateToolbox(currentToolbox);
};
