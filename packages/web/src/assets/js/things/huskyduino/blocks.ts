/**
 * @fileoverview Block definitions for the Huskyduino blocks, see
 * (https://github.com/wintechis/huskyduino) for the interface specification.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, dialog, Events, FieldDropdown, FieldTextInput} from 'blockly';
import {getWorkspace} from '../../interpreter';
import {implementedThings} from '../../../../tabs/Devices/things';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

Blocks['things_Huskylens'] = {
  /**
   * Block representing a HuskyDuino.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('HuskyDuino', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A HuskyDuino.');
    this.getField('name').setEnabled(false);
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

Blocks['huskylens_write_algo_property'] = {
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('activate algorithm', 'label')
      .appendField(
        new FieldDropdown([
          ['Face Recognition', '0x01'],
          ['Object Tracking', '0x02'],
          ['Object Recognition', '0x03'],
          ['Line Tracking', '0x04'],
          ['Color Recognition', '0x05'],
          ['Tag Recognition', '0x06'],
          ['Object Classification', '0x07'],
        ]),
        'algorithm'
      )
      .appendField('on', 'label');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Choose the algorithm of a HuskyDuino');
    this.setHelpUrl('');
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

Blocks['huskylens_write_id_property'] = {
  init: function () {
    this.appendValueInput('id')
      .setCheck('Number')
      .appendField('learn visible object using ID', 'label');
    this.appendValueInput('thing').setCheck('Thing').appendField('on', 'label');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip(
      'Sets the ID of the object currently on camera. ID shoud be a value between 1 and 255'
    );
    this.setHelpUrl('');
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

// Define inner blocks XML for the huskylens_write_face_id block.
const HUSKYLENS_WRITE_ID_PROPERTY_XML = `
<block type="huskylens_write_id_property">
  <value name="ID">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>
`;

Blocks['huskylens_forgetAll_action'] = {
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('forget all learned faces and objects on', 'label');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Forget all values of the currently selected algorithm');
    this.setHelpUrl('');
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

Blocks['huskylens_read_id_property'] = {
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('read ID(s) of visible object(s) on', 'label');
    this.setOutput(true, 'Array');
    this.setColour(255);
    this.setTooltip(
      'returns up to 5 IDs of the objects currently visible to the HuskyLens'
    );
    this.setHelpUrl('');
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

Blocks['huskylens_read_coordinates_property'] = {
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('read coordinates of visible object(s) on', 'label');
    this.setOutput(true, 'Array');
    this.setColour(255);
    this.setTooltip(
      'returns ID and coordinates of one object visible to the HuskyLens'
    );
    this.setHelpUrl('');
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).ids?.includes(this.id)
      ) {
        if (!navigator.bluetooth) {
          dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later and enable Experimental Web Platform features.`);
          this.dispose();
          return;
        }
      }
    });
  },
};

// Add HuskyDuino to the list of implemented things.
implementedThings.push({
  id: 'HuskyDuino',
  name: 'HuskyDuino',
  type: 'bluetooth',
  blocks: [
    {
      type: 'huskylens_write_algo_property',
      category: 'Properties',
    },
    {
      type: 'huskylens_write_id_property',
      category: 'Properties',
      XML: HUSKYLENS_WRITE_ID_PROPERTY_XML,
    },
    {
      type: 'huskylens_forgetAll_action',
      category: 'Actions',
    },
    {
      type: 'huskylens_read_id_property',
      category: 'Properties',
    },
    {
      type: 'huskylens_read_coordinates_property',
      category: 'Properties',
    },
  ],
  filters: [
    {
      services: ['5be35d20-f9b0-11eb-9a03-0242ac130003'],
    },
  ],
  optionalServices: ['5be35d20-f9b0-11eb-9a03-0242ac130003'],
});
