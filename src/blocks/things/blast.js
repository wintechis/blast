/**
 * @fileoverview Blocks definitions for BLAST properties, actions and events.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*****************
 * Action blocks.*
 *****************/

Blockly.Blocks['get_request'] = {
  /**
   * Block for executing http get requests, returns body as text.
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
    this.setTooltip('Invokes a HTTP GET request, returns body as text.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['http_request'] = {
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
    this.setTooltip('Invokes a HTTP request.');
    this.setColour(0);
  },

  httpRequestValidator: function(newValue) {
    this.getSourceBlock().updateInputs(newValue);
    return newValue;
  },
    
  httpRequestOutputValidator: function(output) {
    this.getSourceBlock().updateOutput(output);
    return output;
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
    this.setTooltip('Executes a sparql query');
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
    this.setTooltip('executes a sparql ASK query');
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
        .setCheck(['String', 'Number', 'Boolean', 'URI', 'Thing'])
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
    this.setTooltip('Plays an audio file from URI.');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['text_to_speech'] = {
  init: function() {
    this.appendValueInput('text')
        .appendField('Text to Speech')
        .setCheck('String');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['web_speech'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('speech to text');
    this.setOutput(true, 'String');
    this.setColour(0);
    this.setTooltip('outputs speech command from microphone as a string');
    this.setHelpUrl('');
    this.firstTime = true;
    this.recognition = null;
  },
  onchange: function() {
    // on creating this block check speech API availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!('webkitSpeechRecognition' in window)) {
        Blockly.alert(`Web Speech API is not supported by this browser.
        Upgrade to <a href="//www.google.com/chrome">Chrome</a>
        version 25 or later.`);
        this.dispose();
      } else {
        // eslint-disable-next-line new-cap
        this.recognition = new webkitSpeechRecognition();
      }
    }
  },
};

/*******************
 * Property blocks.*
 *******************/
 
Blockly.Blocks['get_signal_strength_wb'] = {
  /**
    * Block for reading the strength of the signal (rssiValue property) sent by a ble device,
    * measured at the sc-ble-adapter.
    * @this {Blockly.Block}
    */
  init: function() {
    this.appendValueInput('Thing')
        .setCheck('Thing')
        .appendField('get signal-strength of thing at this machine');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the strength of the signal (rssiValue property) sent by a ble device, measured at the at the BLAST client.');
    this.setHelpUrl('');
    this.requested = false;
    this.deviceId = '';
  },
};
