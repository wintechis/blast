/**
 * @fileoverview Blocks definitions for BLAST (as a thing) properties, actions and events.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks, FieldDropdown, FieldMultilineInput} from 'blockly';
import {addBlock} from './../../blast_toolbox.js';

/*****************
 * Action blocks.*
 *****************/

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
addBlock('http_request', 'Requests and Queries', HTTP_REQUEST_XML);

Blocks['sparql_query'] = {
  /**
   * Block for executing sparql queries.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('uri')
      .appendField('run SPARQL query from URI')
      .setCheck('URI');
    this.appendDummyInput()
      .appendField('resource format')
      .appendField(
        new FieldDropdown([
          ['JSON-LD', 'application/ld+json'],
          ['Turtle (TriG)', 'application/trig'],
          ['N-Quads', 'application/n-quads'],
        ]),
        'format'
      );
    this.appendDummyInput().appendField(
      new FieldMultilineInput(`SELECT *
       WHERE { 
         ?s ?p ?o
       }`),
      'query'
    );
    this.setInputsInline(false);
    this.setColour(0);
    this.setOutput(true, 'Array');
    this.setTooltip('Executes a sparql query');
  },
};
// Add sparql_query block to the toolbox.
addBlock('sparql_query', 'Requests and Queries');

Blocks['sparql_ask'] = {
  /**
   * Block for executing sparql ask queries.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('uri')
      .appendField('run SPARQL ASK query from URI')
      .setCheck('URI');
    this.appendDummyInput()
      .appendField('resource format')
      .appendField(
        new FieldDropdown([
          ['JSON-LD', 'application/ld+json'],
          ['Turtle (TriG)', 'application/trig'],
          ['N-Quads', 'application/n-quads'],
        ]),
        'format'
      );
    this.appendDummyInput().appendField(
      new FieldMultilineInput(`PREFIX sosa: <http://www.w3.org/ns/sosa/>
     ASK 
     WHERE {
       ?node sosa:hasSimpleResult ?rssiValue 
       FILTER (?rssiValue > -40)
     }`),
      'query'
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setTooltip('executes a sparql ASK query');
    this.setColour(0);
  },
};
// Add sparql_ask block to the toolbox.
addBlock('sparql_ask', 'Requests and Queries');

Blocks['display_text'] = {
  /**
   * Block for outputting text.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('text')
      .setCheck(['String', 'Number', 'Boolean', 'URI', 'Thing', 'Array'])
      .appendField('display text');
    this.setColour(0);
    this.setTooltip('Add text output to the container on the right.');
    this.setHelpUrl('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};
// Add display_text block to the toolbox.
addBlock('display_text', 'Actions');

Blocks['play_audio'] = {
  /**
   * Block for playing audio from URIs.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('URI')
      .appendField('play audio from URI')
      .setCheck('URI');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('Plays an audio file from URI.');
    this.setHelpUrl('');
  },
};
// Add play_audio block to the toolbox.
addBlock('play_audio', 'Actions');

Blocks['capture_image'] = {
  /**
   * Block for capturing an image from a camera.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput().appendField('capture image from camera');
    this.setOutput(true, 'Image');
    this.setColour(0);
    this.setTooltip('Captures an image from a camera.');
    this.setHelpUrl('');
  },
  onChange: function () {
    // Check if browser supports camera.
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.setWarningText('Your browser does not support mediaDevices.');
    }
  },
};

// Add capture_image block to the toolbox.
addBlock('capture_image', 'Actions');
