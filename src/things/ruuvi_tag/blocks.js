/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['get_temperature'] = {
  /**
   * Block for the temperature property of a Ruuvi Tag.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('get temperature of Ruuvi Tag');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the temperature property of a Ruuvi Tag.');
    this.setHelpUrl('');
  },
  onchange: function() {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
        Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};

// Add get_temperature block to the toolbox.
Blast.Toolbox.addBlock('get_temperature', 'Properties');
