/**
 * @fileoverview Blocks definitions for server connector blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {devBlocks, devCategories} from '../../things.ts';
const {Blocks} = Blockly;

devCategories.push(['Server Connector', 230, 6]);

Blocks['server_add_connector'] = {
  /**
   * Block for adding a server connector on port
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('port')
      .setCheck('Number')
      .appendField('add server on port');
    this.appendStatementInput('list').setCheck(null);
    this.setInputsInline(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
// Add server_connector block to the dev blocks.
devBlocks.push(['server_add_connector', 'Server Connector']);

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
        new Blockly.FieldDropdown([
          ['GET', 'get'],
          ['PUT', 'put'],
          ['POST', 'post'],
          ['DELETE', 'delete'],
        ]),
        'operation'
      );
    this.appendStatementInput('list').setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
// Add server_route block to the dev blocks.
devBlocks.push(['server_route', 'Server Connector']);

Blocks['server_response'] = {
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
// Add server_response block to the dev blocks.
devBlocks.push(['server_response', 'Server Connector']);

Blocks['server_get_body'] = {
  init: function () {
    this.appendDummyInput().appendField('get body');
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
// Add server_get_body block to the dev blocks.
devBlocks.push(['server_get_body', 'Server Connector']);
