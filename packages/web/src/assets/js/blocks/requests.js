/**
 * @fileoverview Block definitions for the blocks in the `requests` category.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
import {addBlock} from '../../../BlocklyWorkspace/toolbox.ts';

const {FieldDropdown, Blocks} = Blockly;

Blocks['http_request'] = {
  /**
   * Block for executing http requests.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('uri')
      .appendField('send HTTP request to URI')
      .setCheck('URI');
    this.appendDummyInput()
      .appendField('output')
      .appendField(
        new FieldDropdown([
          ['status', 'status'],
          ['response', 'body'],
        ]),
        'OUTPUT'
      );
    this.appendDummyInput()
      .appendField('method')
      .appendField(
        new FieldDropdown(
          [
            ['GET', 'GET'],
            ['PUT', 'PUT'],
            ['POST', 'POST'],
            ['DELETE', 'DELETE'],
          ],
          this.httpRequestValidator
        ),
        'METHOD'
      );
    this.appendValueInput('headers').appendField('headers').setCheck('String');
    this.appendValueInput('body')
      .appendField('body')
      .setCheck('String')
      .setVisible(false);
    this.setOutput(true, 'String');
    this.setTooltip('Invokes a HTTP request.');
    this.setColour(0);
  },

  httpRequestValidator: function (newValue) {
    this.getSourceBlock().updateInputs(newValue);
    return newValue;
  },

  updateInputs: function (newValue) {
    const bodyInput = this.getInput('body');
    if (newValue === 'GET') {
      bodyInput.setVisible(false);
    } else {
      bodyInput.setVisible(true);
    }
  },
};
// Define http_request default xml.
const HTTP_REQUEST_XML = `
  <block type="http_request">
    <value name="uri">
      <block type="uri_from_string">
        <value name="URI">
          <block type="string">
            <field name="TEXT">https://example.com</field>
          </block>
        </value>
      </block>
    </value>
    <value name="headers">
      <block type="string">
        <field name="TEXT">"Content-Type": "application/json", "Accept": "application/json"</field>
      </block>
    </value>
    <value name="body">
      <block type="string_multiline">
        <field name="TEXT">
  {
    "object": {
      "a": "b",
      "c": "d",
      "e": "f"
    },
    "array": [
      1,
      2
    ],
    "string": "Hello World"
  }
        </field>
      </block>
    </value>
  </block>`;

// Add http_request block to the toolbox.
addBlock('http_request', 'Requests', HTTP_REQUEST_XML);
