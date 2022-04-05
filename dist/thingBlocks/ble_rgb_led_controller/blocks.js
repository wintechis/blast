/**
 * @fileoverview Blocks definitions for a BLE RGB LED controller
 * (https://github.com/arduino12/ble_rgb_led_strip_controller).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks, dialog, FieldTextInput} from 'blockly';
// eslint-disable-next-line node/no-missing-import
import BleRgbController from './../../things/bleRgbController/BleRgbController.js';
import {implementedThings} from '../../blast_things.js';

Blocks['things_bleLedController'] = {
  /**
   * Block representing a BLE RGB LED controller.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput()
      .appendField('BLE LED controller')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A BLE LED controller.');
    this.setHelpUrl(
      'https://github.com/wintechis/blast/wiki/Bluetooth-LED-controller'
    );
    this.getField('name').setEnabled(false);
    this.firstTime = true;
    this.webBluetoothId = '';
    this.thing = null;
  },
  onchange: function () {
    // on creating this block initialize new instance of BleRgbController
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.webBluetoothId = this.getFieldValue('id');
      this.firstTime = false;
      new BleRgbController().init(this.webBluetoothId).then(thing => {
        this.thing = thing;
      });
    }
  },
};

Blocks['switch_lights_rgb'] = {
  /**
   * Block for switchling rgb lights.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('colour')
      .setCheck('Colour')
      .appendField('write colour property');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('to LED controller');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Switches checked lights on and unchecked ones off.');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  onchange: function () {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
        Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
        this.dispose();
      }
    }
  },
};

// Define inner block XML for the switch_lights_rgb block.
const SWITCH_LIGHTS_RGB_XML = `
<block type="switch_lights_rgb">
  <value name="colour">
    <block type="colour_picker">
      <field name="COLOUR">#ff0000</field>
    </block>
  </value>
</block>`;

// Add LED Controller block to the list of implemented things.
implementedThings.push({
  id: 'bleLedController',
  name: 'LED Controller',
  type: 'bluetooth',
  blocks: [
    {
      type: 'switch_lights_rgb',
      category: 'Properties',
      XML: SWITCH_LIGHTS_RGB_XML,
    },
  ],
  filters: [
    {
      namePrefix: 'ELK-',
    },
    // Service is not advertised so we can not filter for it.
    //{
    //     services: ['0000fff0-0000-1000-8000-00805f9b34fb'],
    //},
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Bluetooth-LED-controller',
  optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb'],
});
