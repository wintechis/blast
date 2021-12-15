/**
 * @fileoverview Action blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['mac'] = {
  /**
   * Block representing a mac address.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('mac')
        .appendField(new Blockly.FieldTextInput('deadbeef'), 'MAC');
    this.setOutput(true, 'mac');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


Blockly.Blocks['uri'] = {
  /**
   * Block representing a URI.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('URI')
        .appendField(new Blockly.FieldTextInput('https://example.com'), 'URI');
    this.setOutput(true, 'URI');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['uri_from_string'] = {
  /**
   * Block parsing an URI from a string.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('URI')
        .setCheck('String')
        .appendField('URI from string');
    this.setOutput(true, 'URI');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
