/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['get_ruuvi_measurement'] = {
  /**
   * Block for the temperature property of a Ruuvi Tag.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('read')
        .appendField(new Blockly.FieldDropdown([
          ['temperature', 'temperature'],
          ['humidity', 'humidity'],
          ['pressure', 'pressure'],
          ['acceleration X', 'accelerationX'],
          ['acceleration Y', 'accelerationY'],
          ['acceleration Z', 'accelerationZ'],
          ['battery voltage', 'batteryVoltage'],
          ['txPower', 'txPower'],
          ['movement counter', 'movementCounter'],
          ['measurement sequence counter', 'measurementSequenceCounter'],
        ]), 'measurement')
        .appendField('property of RuuviTag');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the temperature property of a Ruuvi Tag.');
    this.setHelpUrl('');
    this.firstTime = true;
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

// Add get_ruuvi_measurement block to the toolbox.
Blast.Toolbox.addBlock('get_ruuvi_measurement', 'Properties');
