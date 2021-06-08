/**
 * @fileoverview Blocks handling thing instances for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['things_webBluetooth'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('webBluetooth device')
        .appendField(new Blockly.FieldDropdown(Blast.Things.getWebBluetoothDevices), 'id');
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
