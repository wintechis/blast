/**
 * @fileoverview Properties blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['get_temperature'] = {
  init: function() {
    this.appendValueInput('MAC')
        .setCheck('mac')
        .appendField('get temperature of thermometer with mac');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['get_signal_strength'] = {
  init: function() {
    this.appendValueInput('MAC')
        .setCheck('mac')
        .appendField('get signal-strength of mac');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
  
