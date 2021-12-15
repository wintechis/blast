/**
 * @fileoverview Blocks definitions for BLAST (as a thing) properties, actions and events.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*****************
 * Action blocks.*
 *****************/
 
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
                  ['status', 'status'],
                  ['response', 'body'],
                ],
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
    this.appendDummyInput()
        .appendField('Resource format')
        .appendField(new Blockly.FieldDropdown(
            [
              ['JSON-LD', 'application/ld+json'],
              ['Turtle (TriG)', 'application/trig'],
              ['N-Quads', 'application/n-quads'],
            ]), 'format');
    this.appendDummyInput().appendField(
        new Blockly.FieldMultilineInput(`SELECT *
       WHERE { 
         ?s ?p ?o
       }`),
        'query',
    );
    this.setInputsInline(false);
    this.setColour(0);
    this.setOutput(true, 'Array');
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
    this.appendDummyInput()
        .appendField('Resource format')
        .appendField(new Blockly.FieldDropdown(
            [
              ['JSON-LD', 'application/ld+json'],
              ['Turtle (TriG)', 'application/trig'],
              ['N-Quads', 'application/n-quads'],
            ]), 'format');
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
        .setCheck(['String', 'Number', 'Boolean', 'URI', 'Thing', 'Array'])
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
        .setCheck(['Array'])
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
        .appendField('read signal-strength property of bluetooth device');
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

Blockly.Blocks['write_eddystone_property'] = {
  /**
   * Block for writing a property to an eddystone device.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput('Property')
        .appendField('write')
        .appendField(
            new Blockly.FieldDropdown([
              ['advertised tx power', 'advertisedTxPower'],
              ['advertisement data', 'advertisementData'],
              ['advertising interval', 'advertisingInterval'],
              ['radio tx power', 'radioTxPower'],
            ], this.propertyValidator,
            ), 'Property')
        .appendField('property at slot');
    this.appendValueInput('Slot')
        .setCheck('Number');
    this.appendValueInput('Value')
        .appendField('value');
    this.appendValueInput('Thing')
        .appendField('to eddystone device')
        .setCheck('Thing');
    this.setPreviousStatement(true, null);
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Writes a property to an eddystone device.');
    this.setHelpUrl('https://github.com/google/eddystone/tree/master/configuration-service');
  },
  propertyValidator: function(property) {
    const block = this.getSourceBlock();
    block.removeInput('Value', true);
    block.removeInput('Thing', true);
    if (property == 'advertisementData') {
      block.appendValueInput('Value')
          .setCheck(['String', 'Number', 'URI'])
          .appendField('value');
    } else {
      block.appendValueInput('Value')
          .setCheck('Number')
          .appendField('value');
    }
    block.appendValueInput('Thing')
        .appendField('to eddystone device')
        .setCheck('Thing');
  },
};

// Define inner block XML for the write_eddystone_property block.
const WRITE_EDDYSTONE_PROPERTY_XML = `
<block type="write_eddystone_property">
  <value name="Slot">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
</block>`;

// Add write_eddystone_property block to the toolbox.
Blast.Toolbox.addBlock('write_eddystone_property', 'Properties', WRITE_EDDYSTONE_PROPERTY_XML);

Blockly.Blocks['read_eddystone_property'] = {
  /**
   * Block for reading a property from an eddystone device.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput('Property')
        .appendField('read')
        .appendField(
            new Blockly.FieldDropdown([
              ['advertised tx power', 'advertisedTxPower'],
              ['advertisement data', 'advertisementData'],
              ['advertising interval', 'advertisingInterval'],
              ['lock state', 'lockState'],
              ['public ECDH key', 'publicECDHKey'],
              ['radio tx power', 'radioTxPower'],
            ]), 'Property')
        .appendField('property');
    this.appendValueInput('Slot')
        .setCheck('Number')
        .appendField('at slot');
    this.appendValueInput('Thing')
        .appendField('of eddystone device')
        .setCheck('Thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setInputsInline(true);
    this.setTooltip('Reads a property from an eddystone device.');
    this.setHelpUrl('https://github.com/google/eddystone/tree/master/configuration-service');
  },
};

// Define inner block XML for the read_eddystone_property block.
const READ_EDDYSTONE_PROPERTY_XML = `
<block type="read_eddystone_property">
  <value name="Slot">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
</block>`;

// Add read_eddystone_property block to the toolbox.
Blast.Toolbox.addBlock('read_eddystone_property', 'Properties', READ_EDDYSTONE_PROPERTY_XML);
