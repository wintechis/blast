/**
 * @fileoverview Blocks definitions for Nintendo JoyCon controllers.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['joycon_read_property'] = {
  /**
     * Block to read a property of a JoyCon.
     * @this Blockly.Block
     */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('read')
        .appendField(new Blockly.FieldDropdown([
          ['accelerometers', 'accelerometers'],
          ['actual accelerometer', 'actualAccelerometer'],
          ['actual gyroscope', 'actualGyroscope'],
          ['actual orientation', 'actualOrientation'],
          ['actual orientation quaternion', 'actualOrientationQuaternion'],
          ['gyroscopes', 'gyroscopes'],
          ['quaternion', 'quaternion'],
        ], this.propertyValidator), 'property')
        .appendField('property of Nintendo JoyCon');
    this.setInputsInline(false);
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a property of a Nintendo JoyCon controller.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  propertyValidator: function(option) {
    this.getSourceBlock().updateInputs(option);
    return option;
  },
  /**
   * Adds dropdowns for property sub values based on the selected property.
   * @param {String} property The property to add dropdowns for.
   */
  updateInputs: function(property) {
    this.removeInput('propertySubValue', true);
    this.removeInput('propertySubValue2', true);
    this.removeInput('propertySubValue3', true);

    if (property === 'accelerometers') {
      this.appendDummyInput('propertySubValue')
          .appendField('accelerometer')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
          ]), 'propertySubValue');
      this.appendDummyInput('propertySubValue2')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue2');
    }
    if (property === 'actualAccelerometer') {
      this.appendDummyInput('propertySubValue')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue');
    }
    if (property === 'actualGyroscope') {
      this.appendDummyInput('propertySubValue')
          .appendField('unit')
          .appendField(new Blockly.FieldDropdown([
            ['rps', 'rps'],
            ['dps', 'dps'],
          ]), 'propertySubValue');
      this.appendDummyInput('propertySubValue2')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue2');
    }
    if (property === 'actualOrientation') {
      this.appendDummyInput('propertySubValue')
          .appendField('degrees')
          .appendField(new Blockly.FieldDropdown([
            ['alpa', 'alpha'],
            ['beta', 'beta'],
            ['gamma', 'gamma'],
          ]), 'propertySubValue');
    }
    if (property === 'actualOrientationQuaternion') {
      this.appendDummyInput('propertySubValue')
          .appendField('degrees')
          .appendField(new Blockly.FieldDropdown([
            ['alpa', 'alpha'],
            ['beta', 'beta'],
            ['gamma', 'gamma'],
          ]), 'propertySubValue');
    }
    if (property === 'gyroscopes') {
      this.appendDummyInput('propertySubValue')
          .appendField('gyroscope')
          .appendField(new Blockly.FieldDropdown([
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
          ]), 'propertySubValue');
      this.appendDummyInput('propertySubValue2')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['x', '0'],
            ['y', '1'],
            ['z', '2'],
          ]), 'propertySubValue2');
      this.appendDummyInput('propertySubValue3')
          .appendField('unit')
          .appendField(new Blockly.FieldDropdown([
            ['dps', 'dps'],
            ['rps', 'rps'],
          ]), 'propertySubValue3');
    }
    if (property === 'quaternion') {
      this.appendDummyInput('propertySubValue')
          .appendField('axis')
          .appendField(new Blockly.FieldDropdown([
            ['w', 'w'],
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
          ]), 'propertySubValue');
    }
  },
};

// Add joycon_read_property block to the toolbox.
Blast.Toolbox.addBlock('joycon_read_property', 'Properties');
