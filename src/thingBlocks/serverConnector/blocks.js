/**
 * @fileoverview Blocks definitions for blocks interacting with solid pods.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks, FieldDropdown} from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

Blocks['server_route'] = {
  /**
   * Block for adding a route in the server connector
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('route').setCheck('String').appendField('Add route');
    this.appendDummyInput()
      .appendField('for operation')
      .appendField(
        new FieldDropdown([
          ['GET', '"get"'],
          ['PUT', '"put"'],
          ['POST', '"post"'],
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
addBlock('server_route', 'Actions');
