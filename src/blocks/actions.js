/**
 * @fileoverview Action blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 */

'use strict';

Blockly.Blocks['get_request'] = {
  /**
   * Block for executing http get requests.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('URI')
        .setCheck('URI')
        .appendField('send HTTP-GET request to URI');
    this.appendDummyInput()
        .appendField('headers:')
        .appendField(
            new Blockly.FieldTextInput('"Accept": "text/plain"'),
            'HEADERS',
        );
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['http_request'] = {
  httpRequestValidator: function(newValue) {
    this.getSourceBlock().updateInputs(newValue);
    return newValue;
  },
  
  httpRequestOutputValidator: function(output) {
    this.getSourceBlock().updateOutput(output);
    return output;
  },
  
  /**
   * Block for executing http requests.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('uri')
        .appendField('send HTTP request to URI')
        .setCheck('URI');
    this.appendDummyInput()
        .appendField('output')
        .appendField(
            new Blockly.FieldDropdown(
                [
                  ['status (text)', 'status'],
                  ['response (table)', 'body'],
                ],
                this.httpRequestOutputValidator,
            ),
            'OUTPUT',
        );
    this.appendDummyInput()
        .appendField('method')
        .appendField(
            new Blockly.FieldDropdown(
                [
                  ['GET', 'GET'],
                  ['PUT', 'PUT'],
                  ['POST', 'POST'],
                  ['DELETE', 'DELETE'],
                ],
                this.httpRequestValidator,
            ),
            'METHOD',
        );
    this.appendDummyInput().appendField('headers (comma separated)');
    this.appendDummyInput().appendField(
        new Blockly.FieldTextInput(
            '"Content-Type": "application/json", "Accept": "application/json"',
        ),
        'HEADERS',
    );
    this.setOutput(true, 'String');
    this.setColour(0);
  },
  
  updateInputs: function(newValue) {
    this.removeInput('BODYINPUT', /* no error */ true);
  
    if (newValue != 'GET') {
      this.appendDummyInput('BODYINPUT').appendField('body').appendField(
          new Blockly.FieldMultilineInput(`{
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
  }`),
          'BODY',
      );
    }
  },
  
  updateOutput: function(outputValue) {
    if (outputValue == 'status') {
      this.outputConnection.setCheck('String');
    } else if (outputValue == 'body') {
      this.outputConnection.setCheck('table');
    }
  },
};
  
Blockly.Blocks['sparql_query'] = {
  /**
     * Block for executing sparql queries.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendValueInput('uri')
        .appendField('run SPARQL Query from URI')
        .setCheck('URI');
    this.appendDummyInput().appendField(
        new Blockly.FieldMultilineInput(`SELECT *
    WHERE { 
      ?s ?p ?o
    }`),
        'query',
    );
    this.setInputsInline(false);
    this.setColour(0);
    this.setOutput(true, 'table');
  },
};

Blockly.Blocks['sparql_ask'] = {
  /**
   * Block for executing sparql ask queries.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('uri')
        .appendField('run SPARQL ASK Query from URI')
        .setCheck('URI');
    this.appendDummyInput().appendField(
        new Blockly.FieldMultilineInput(`PREFIX sosa: <http://www.w3.org/ns/sosa/>
  ASK 
  WHERE {
    ?node sosa:hasSimpleResult ?rssiValue 
    FILTER (?rssiValue > -40)
  }`),
        'query',
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(0);
  },
};
  
Blockly.Blocks['display_text'] = {
  /**
     * Block for outputting text.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendValueInput('text')
        .setCheck(['String', 'Number', 'Boolean', 'URI'])
        .appendField('display text:');
    this.setColour(0);
    this.setTooltip('Add text output to the container on the right.');
    this.setHelpUrl('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};
    
Blockly.Blocks['display_table'] = {
  /**
     * Block for outputting data tables (rdf graphs).
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendValueInput('table')
        .setCheck(['table'])
        .appendField('display table:');
    this.setColour(0);
    this.setTooltip('Add data output to the container on the right.');
    this.setHelpUrl('');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.Blocks['switch_lights'] = {
  /**
   * Block for switchling lights using a WoT interface.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('switch lights with mac');
    this.appendValueInput('mac')
        .setCheck('mac');
    this.appendDummyInput()
        .appendField('red')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_red')
        .appendField('yellow')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_yellow')
        .appendField('green')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'cb_green');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['mirobot_pickup'] = {
  /**
   * Block for controlling the mirobot.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('Robot-arm, pick up')
        .appendField(
            new Blockly.FieldDropdown([
              ['blue', 'BLUE'],
              ['red', 'RED'],
              ['yellow', 'YELLOW'],
              ['green', 'GREEN'],
            ]),
            'box',
        )
        .appendField('box');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
  
Blockly.Blocks['play_audio'] = {
  /**
     * Block for playing audio from URIs.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendValueInput('URI')
        .appendField('play audio from URI')
        .setCheck('URI');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


