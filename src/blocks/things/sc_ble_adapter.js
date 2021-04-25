/**
 * @fileoverview Blocks definitions for the sc-ble-adapter, see
 * (https://github.com/wintechis/sc-ble-adapter).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Property blocks.*
 *******************/

Blockly.Blocks['get_signal_strength'] = {
  /**
   * Block for reading the strength of the signal (rssiValue property) sent by a ble device,
   * measured at the sc-ble-adapter.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('MAC')
        .setCheck('mac')
        .appendField('get signal-strength of mac at sc-ble-adapter');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the strength of the signal (rssiValue property) sent by a ble device, measured at the ble-adapter.');
    this.setHelpUrl('');
  },
};
