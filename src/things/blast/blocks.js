/**
 * @fileoverview Blocks definitions for BLAST (as a thing) properties, actions and events.
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
// Add get_request block to the toolbox.
Blast.Toolbox.addBlock('get_request', 'Requests and Queries');
 
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
// Add http_request block to the toolbox.
Blast.Toolbox.addBlock('http_request', 'Requests and Queries');
 
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
// Add sparql_query block to the toolbox.
Blast.Toolbox.addBlock('sparql_query', 'Requests and Queries');
 
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
// Add sparql_ask block to the toolbox.
Blast.Toolbox.addBlock('sparql_ask', 'Requests and Queries');
     
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
// Add display_text block to the toolbox.
Blast.Toolbox.addBlock('display_text', 'Actions');
       
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
// Add display_table block to the toolbox.
Blast.Toolbox.addBlock('display_table', 'Actions');
   
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
// Add play_audio block to the toolbox.
Blast.Toolbox.addBlock('play_audio', 'Actions');
 
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
        .appendField('read signal-strength property of thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads the strength of the signal (rssiValue property) sent by a ble device, measured at the at the BLAST client.');
    this.setHelpUrl('');
    this.firstTime = true;
    this.requested = false;
    this.deviceId = '';
  },
  onchange: function() {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!navigator.bluetooth) {
        Blockly.alert(`Webbluetooth is not supported by this browser.\n
        Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
};
// Add get_signal_strength_wb block to the toolbox.
Blast.Toolbox.addBlock('get_signal_strength_wb', 'Properties');
 
