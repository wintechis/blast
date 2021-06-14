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
    this.appendDummyInput()
        .appendField('Streamdeck mini');
    this.appendDummyInput()
        .appendField('when pressing button(s):');
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
    this.device = {};
    this.handlers = [];
    this.keyState = new Array(6).fill(false);
  },
  setDevice: async function() {
    const devices = await navigator.hid.requestDevice({filters: [
      {vendorId: 0x0fd9, productId: 99},
    ]});
    if (devices.length == 0) {
      this.dispose();
    }
    this.device = devices[0];
    Blast.eventInWorkspace.push(this.id);
  },
  onchange: function() {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.requested = true;
      this.setDevice();
      Blast.workspace.addChangeListener((event) => this.onDispose(event));
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
    console.log('REMOVE');
    // remove this block from the events array.
    const index = Blast.eventInWorkspace.indexOf(this.id);
    if (index !== -1) {
      Blast.eventInWorkspace.splice(index, 1);
    }
  },
  /**
   * Adds an event handler for a specific event type.
   * @param {string} type Event type
   * @param {Function} fn Function to call when even type matches
   */
  addEventListener: function(type, fn) {
    console.log('addeventlistenter');
    this.handlers.push({type, fn});
  },
  /**
   * Removes an event handler for a specific event type.
   * @param {string} type Event type
   * @param {Function} fn Function to call when even type matches
   */
  removeEventListener: function(type, fn) {
    this.handlers = this.handlers.filter((item) => {
      if (item.type !== type) {
        return true;
      }
      if (item.fn !== fn) {
        return true;
      }
    });
  },
  /**
   * Dispatch a new custom event.
   * @param {string} type Type of event to dispatch.
   * @param {Object} data Data to add to the details of the event.
   */
  dispatchCustomEvent: function(type, data) {
    const detail = data ? {detail: data} : null;
    this.handlers.forEach((handler) => {
      if (type === handler.type && handler.fn) {
        handler.fn(new CustomEvent(type, detail));
      }
    });
  },
  /**
   * Called when a button on the StreamDeck is pushed/released.
   * @param {ArrayBuffer} buffer Int8 array buffer containing pushed buttons.
   */
  onButtonPushed: function(buffer) {
    const keys = new Int8Array(buffer);
    const start = 0;
    const end = 6;
    const data = Array.from(keys).slice(start, end);
    data.forEach((item, keyIndex) => {
      const keyPressed = data[keyIndex] === 1;
      const stateChanged = keyPressed !== block.keyState[keyIndex];
      if (!stateChanged) {
        return;
      }
      block.keyState[keyIndex] = keyPressed;
      const details = {
        buttonId: keyIndex,
        pushed: keyPressed,
        buttonStates: block.keyState.slice(),
      };
      const evtType = keyPressed ? 'keydown' : 'keyup';
      dispatchCustomEvent(evtType, details);
    });
  },
};
