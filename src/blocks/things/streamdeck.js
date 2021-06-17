/**
 * @fileoverview Blocks definitions for the ElGato Stream Deck, see
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*******************
 * Event blocks.   *
 *******************/

Blockly.Blocks['streamdeck_buttons'] = {
  init: function() {
    this.appendValueInput('id')
        .setCheck('Thing')
        .appendField('Streamdeck mini');
    this.appendDummyInput()
        .appendField('on button press:');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button1')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button2')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button3');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button4')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button5')
        .appendField(new Blockly.FieldCheckbox('FALSE'), 'button6');
    this.appendDummyInput()
        .appendField('do');
    this.appendStatementInput('statements')
        .setCheck(null);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.requested = false;
    this.keyState = new Array(6).fill(false);
  },
  addEvent: async function() {
    Blast.eventInWorkspace.push(this.id);
    // remove event if block is deleted
    Blast.workspace.addChangeListener((event) => this.onDispose(event));
  },
  onchange: function() {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.addEvent();
    }
  },
  onDispose: function(event) {
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      if (event.type === Blockly.Events.BLOCK_DELETE && event.ids.indexOf(this.id) !== -1) {
        this.removeFromEvents();
      }
    }
  },
  removeFromEvents: function() {
    // remove this block from the events array.
    const index = Blast.eventInWorkspace.indexOf(this.id);
    if (index !== -1) {
      Blast.eventInWorkspace.splice(index, 1);
    }
  },
};
