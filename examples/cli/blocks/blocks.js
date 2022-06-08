/**
 * @fileoverview Blocks definitions for blocks interacting with solid pods.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {Blocks, Events, FieldDropdown} = Blockly;
import {addBlock} from '../../../dist/blast_toolbox.js';
import {
  eventsInWorkspace,
  getWorkspace,
} from '../../../dist/blast_interpreter.js';

Blocks['server_route'] = {
  /**
   * Block for adding a route to the server connector
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('route').setCheck('String').appendField('add route');
    this.appendDummyInput()
      .appendField('for operation')
      .appendField(
        new FieldDropdown([
          ['GET', '"get"'],
          // ['PUT', '"put"'],
          // ['POST', '"post"'],
        ]),
        'operation'
      );
    this.appendStatementInput('list').setCheck(null);
    this.setInputsInline(true);
    this.setColour(230);
    this.setTooltip('Add a route to the server');
    this.setHelpUrl('');
    this.requested = false;
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function () {
    eventsInWorkspace.push(this.id);
    // remove event if block is deleted
    getWorkspace().addChangeListener(event => this.onDispose(event));
  },
  onchange: function () {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.addEvent();
    }
  },
  onDispose: function (event) {
    if (event.type === Events.BLOCK_DELETE) {
      if (
        event.type === Events.BLOCK_DELETE &&
        event.ids.indexOf(this.id) !== -1
      ) {
        // block is being deleted
        this.removeFromEvents();
      }
    }
  },
  /**
   * Remove this block's id from the events array.
   */
  removeFromEvents: function () {
    // remove this block from the events array.
    const index = eventsInWorkspace.indexOf(this.id);
    if (index !== -1) {
      eventsInWorkspace.splice(index, 1);
    }
  },
};
// Add server_connector block to the toolbox.
addBlock('server_route', 'Server Components');

Blocks['response_block'] = {
  /**
   * Block for sending a response
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('response')
      .setCheck(null)
      .appendField('send response');
    this.setPreviousStatement(true, null);
    this.setColour(230);
    this.setTooltip('Send response to sender');
    this.setHelpUrl('');
  },
};
// Add server_connector block to the toolbox.
addBlock('response_block', 'Server Components');
