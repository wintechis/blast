/**
 * @fileoverview Block definitions for Huskyduino
 *  
 * @author yongxu.ren1996@gmail.com
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['huskylens_choosealgo'] = {
    init: function() {
    this.appendValueInput("Thing")
        .setCheck("Thing")
        .appendField("write")
        .appendField(new Blockly.FieldDropdown([
            ["Face Recognition","face_recognition"], 
            ["Object Tracking","object_tracking"], 
            ["Object Recognition","object_recognition"], 
            ["Line Tracking","line_tracking"], 
            ["Color Recognition","color_recognition"], 
            ["Tag Recognition","tag_recognition"], 
            ["Object Classification","object_classification"]
        ]), "Algorithms")
        .appendField("Algorithm to Huskyduino");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip("Choose the algorithm for Huskylens");
    this.setHelpUrl("");
    },
    onchange: function() {
        // on creating this block check webBluetooth availability, then request LEScan.
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

 // Add read_ruuvi_property block to the toolbox.
Blast.Toolbox.addBlock('write_huskylens_algo', 'Properties');