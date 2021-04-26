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
      contents: [
        {kind: 'BLOCK', type: 'get_temperature'},
        {kind: 'BLOCK', type: 'get_signal_strength'},
        {kind: 'BLOCK', type: 'get_signal_strength_wb'},
      ],
      name: 'Properties',
      colour: '255',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'get_request'},
        {kind: 'BLOCK', type: 'display_text'},
        {kind: 'BLOCK', type: 'switch_lights_ryg'},
        {kind: 'BLOCK', type: 'switch_lights_rgb'},
        {kind: 'BLOCK', type: 'mirobot_pickup'},
        {kind: 'BLOCK', type: 'play_audio'},
      ],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Events',
      custom: 'EVENTS',
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
      ],
      name: 'Strings',
      colour: '160',
    },
    {
      kind: 'CATEGORY',
      contents: [{kind: 'BLOCK', type: 'mac'}],
      name: 'Identifiers',
      colour: '60',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'number_value'},
        {kind: 'BLOCK', type: 'number_arithmetic'},
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
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'show advanced toolbox',
      custom: 'ADVANCEDTOOLBOX',
    },
  ],
};

const advancedToolbox = {
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
      contents: [
        {kind: 'BLOCK', type: 'get_temperature'},
        {kind: 'BLOCK', type: 'get_signal_strength'},
        {kind: 'BLOCK', type: 'get_signal_strength_wb'},
      ],
      name: 'Properties',
      colour: '255',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'get_request'},
        {kind: 'BLOCK', type: 'http_request'},
        {kind: 'BLOCK', type: 'sparql_query'},
        {kind: 'BLOCK', type: 'sparql_ask'},
        {kind: 'BLOCK', type: 'display_text'},
        {kind: 'BLOCK', type: 'display_table'},
        {kind: 'BLOCK', type: 'switch_lights_ryg'},
        {kind: 'BLOCK', type: 'switch_lights_rgb'},
        {kind: 'BLOCK', type: 'mirobot_pickup'},
        {kind: 'BLOCK', type: 'play_audio'},
      ],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Events',
      custom: 'EVENTS',
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
        {kind: 'BLOCK', type: 'uri'},
        {kind: 'BLOCK', type: 'mac'},
      ],
      name: 'Identifiers',
      colour: '60',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'number_value'},
        {kind: 'BLOCK', type: 'number_infinity'},
        {kind: 'BLOCK', type: 'number_arithmetic'},
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
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'show default toolbox',
      custom: 'ADVANCEDTOOLBOX',
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
 * Switches between the default and advanced toolboxes.
 * @public
 */
Blast.switchToolbox = function() {
  let newToolbox = {};
  if (Blast.Toolbox.currentToolbox === defaultToolbox) {
    newToolbox = advancedToolbox;
  } else {
    newToolbox = defaultToolbox;
  }
  Blast.Toolbox.currentToolbox = newToolbox;
  Blast.workspace.updateToolbox(newToolbox);
};

/**
 * Initialize the toolbox
 */
Blast.Toolbox.init = function() {
  // register states category flyout callback
  Blast.workspace.registerToolboxCategoryCallback('EVENTS', Blast.States.flyoutCategory);

  // register advanced toolbox mock button callback
  Blast.workspace.registerToolboxCategoryCallback('ADVANCEDTOOLBOX', Blast.switchToolbox);
};
