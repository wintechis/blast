/**
 * @fileoverview Blocks definitions for Use of Huskylens
 * (https://github.com/knight-arturia/Arduino_MKR1010).
 * @author knight.arturia@gmail.com(Yongxu Ren)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */


'use strict';


Blockly.Blocks['huskylens'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('get data from huskylens');
    this.setOutput(true, 'Number');
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

// Add huskylens block to the toolbox.
Blast.Toolbox.addBlock('huskylens', 'Properties');
