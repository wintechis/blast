/**
 * @fileoverview Blocks definitions for BBC micro:bit.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {
  Blocks,
  dialog,
  Events,
  FieldDropdown,
  FieldTextInput,
  Variables,
} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {eventsInWorkspace, getWorkspace} from '../../interpreter';
import {implementedThings} from '../../../../ThingsStore/things';
import {BlockDelete} from 'blockly/core/events/events_block_delete';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';

Blocks['things_microbit'] = {
  /**
   * Block representing the micro:bit.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput()
      .appendField('micro:bit')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput()
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A BBC micro:bit.');
    this.setHelpUrl('https://github.com/wintechis/blast/wiki/BBC-microbit');
    this.getField('name').setEnabled(false);
    getWorkspace()?.addChangeListener((e: Abstract) => {
      if (
        e.type === Events.BLOCK_CREATE &&
        (e as BlockCreate).blockId === this.id
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

implementedThings.push({
  id: 'microbit',
  name: 'BBC micro:bit',
  type: 'bluetooth',
  blocks: [],
  infoUrl: 'https://github.com/wintechis/blast/wiki/BBC-microbit',
});

Blocks['microbit_read_property'] = {
  /**
   * Block to read a property of the micro:bit.
   * @this Blockly.Block
   */
  init: function () {
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('read')
      .appendField(
        new FieldDropdown([
          ['appearance', 'Appearance'],
          ['button a', 'ButtonAState'],
          ['button b', 'ButtonBState'],
          ['accelerometer period', 'AccelerometerPeriod'],
          ['accelerometer x', 'accelerometer_x'],
          ['accelerometer y', 'accelerometer_y'],
          ['accelerometer z', 'accelerometer_z'],
          ['client event', 'ClientEvent'],
          ['compass heading', 'compass_heading'],
          ['Device name', 'DeviceName'],
          ['LED text', 'LedText'],
          ['LED matrix state', 'LedMatrixState'],
          ['scrolling delay', 'ScrollingDelay'],
          ['temperature', 'Temperature'],
          ['temperature period', 'TemperaturePeriod'],
          ['light level', 'light_level'],
          ['sound level', 'sound_level'],
        ]),
        'property'
      )
      .appendField('property of BBC micro:bit');
  },
};
