/**
 * @fileoverview Block definitions for the Ruuvi Tag
 * (https://ruuvi.com/ruuvitag/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';
import Blockly from 'blockly';
import { addBlock } from '../../blast_toolbox.js';
import { scanBlocks } from '../../blast_webBluetooth.js';
Blockly.Blocks['read_ruuvi_property'] = {
    /**
     * Block for reading a property of a Ruuvi Tag.
     * @this {Blockly.Block}
     */
    init: function () {
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
            ['measurement sequence number', 'measurementSequenceNumber'],
        ]), 'measurement')
            .appendField('property of RuuviTag');
        this.setOutput(true, ['String', 'Number']);
        this.setColour(255);
        this.setTooltip('Reads a property of a Ruuvi Tag.');
        this.setHelpUrl('');
        this.firstTime = true;
    },
    onchange: function () {
        // on creating this block check webBluetooth availability, then request LEScan.
        if (!this.isInFlyout && this.firstTime && this.rendered) {
            this.firstTime = false;
            if (!navigator.bluetooth) {
                Blockly.dialog.alert(`Webbluetooth is not supported by this browser.\n
        Upgrade to Chrome version 85 or later.`);
                this.dispose();
            }
        }
    },
};
// Add read_ruuvi_property block to the toolbox.
addBlock('read_ruuvi_property', 'Properties');
// Add read_ruuvi_property block to the scanBlocks array.
scanBlocks.push('read_ruuvi_property');
//# sourceMappingURL=blocks.js.map