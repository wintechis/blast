/**
 * @fileoverview Blocks definitions for blocks interacting with solid pods.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {Blocks, FieldDropdown} = Blockly;
import {addBlock} from './../../blast_toolbox.js';

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
