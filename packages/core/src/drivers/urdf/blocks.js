/**
 * @fileoverview Blocks definitions for µRDF.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {Blocks, FieldDropdown, FieldMultilineInput} = Blockly;
import {addBlock} from '../../blast_toolbox.js';

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
addBlock('sparql_query', 'Queries');

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
addBlock('sparql_ask', 'Queries');
