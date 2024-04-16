/**
 * @fileoverview Object blocks for Blast.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Blocks, Extensions, FieldTextInput, inputs} from 'blockly';

Blocks['object_from_json'] = {
  init: function () {
    this.appendValueInput('JSON')
      .appendField('get object from JSON text', 'label')
      .setCheck('String');
    this.setOutput(true, 'Object');
    this.setColour('#F99EA3');
    this.setTooltip(
      'Parses a JSON string, constructing the JavaScript value or object described by the string.'
    );
  },
};

Blocks['object_to_json'] = {
  init: function () {
    this.appendValueInput('object')
      .appendField('get JSON text from object', 'label')
      .setCheck('Object');
    this.setOutput(true, 'String');
    this.setColour('#F99EA3');
    this.setTooltip('Converts a JavaScript value to a JSON string.');
  },
};

Blocks['object_keys'] = {
  init: function () {
    this.appendValueInput('object_input')
      .appendField('get keys of object', 'label')
      .setCheck('Object');
    this.setOutput(true, 'Array');
    this.setColour('#F99EA3');
    this.setTooltip(
      "Returns an array of a given object's own enumerable property names."
    );
  },
};

Blocks['object_create'] = {
  init: function () {
    this.jsonInit({
      type: 'object_create',
      message0: 'create object',
      output: 'Object',
      mutator: 'controls_create_mutator',
      colour: '#F99EA3',
      tooltip: 'Creates an object, optionally with any number of properties.',
      helpUrl: '',
    });
  },
};

Blocks['object_get'] = {
  init: function () {
    this.appendValueInput('property_input')
      .appendField('get property', 'label')
      .setCheck('String');
    this.appendValueInput('object_input')
      .appendField('of object', 'label')
      .setCheck('Object');
    this.setOutput(true, null);
    this.setColour('#F99EA3');
    this.setTooltip('Gets the value of a property from an object.');
  },
};

const objectCreateMutator = {
  numFields: 0,
  fields: [],

  domToMutation: function (xmlElement) {
    this.fields = [];
    for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
      if (childNode.nodeName.toLowerCase() === 'field') {
        this.fields.push(childNode.getAttribute('name'));
      }
    }
    this.numFields = this.fields.length;
    this.updateShape();
  },

  mutationToDom: function () {
    if (!this.numFields) {
      return null;
    }
    const container = document.createElement('mutation');
    container.setAttribute('num_fields', '' + this.numFields);
    for (const fieldName of this.fields) {
      const field = document.createElement('field');
      field.setAttribute('name', fieldName);
      container.appendChild(field);
    }
    return container;
  },

  compose: function (topBlock) {
    this.numFields = 0;
    this.fields = [];
    const connections = [];
    let fieldBlock =
      topBlock.nextConnection && topBlock.nextConnection.targetBlock();
    while (fieldBlock) {
      const fieldName = fieldBlock.getFieldValue('name');
      this.fields.push(fieldName);
      this.numFields++;
      connections.push(fieldBlock.savedConnection);
      fieldBlock =
        fieldBlock.nextConnection && fieldBlock.nextConnection.targetBlock();
    }
    this.updateShape();
    // Reconnect any child blocks.
    for (let i = 1; i <= this.numFields; i++) {
      const connection = connections.shift();
      if (connection) {
        connection.connect(this.getInput('field_input' + i).connection);
      }
    }
  },

  decompose: function (workspace) {
    const topBlock = workspace.newBlock('object_create_mutator_top');
    topBlock.initSvg();
    let connection = topBlock.nextConnection;
    for (const field of this.fields) {
      const fieldBlock = workspace.newBlock('object_field');
      fieldBlock.initSvg();
      fieldBlock.setFieldValue(field, 'name');
      connection.connect(fieldBlock.previousConnection);
      connection = fieldBlock.nextConnection;
    }
    return topBlock;
  },

  saveConnections: function (topBlock) {
    let fieldBlock =
      topBlock.nextConnection && topBlock.nextConnection.targetBlock();
    let i = 1;
    while (fieldBlock) {
      const input = this.getInput('field_input' + i);
      fieldBlock.savedConnection = input && input.connection.targetConnection;
      // Set mutator block field name from the corresponding 'real' Object.create block
      if (fieldBlock.getInput('name')) {
        fieldBlock.setFieldValue(topBlock.getFieldValue('field' + i), 'name');
      }
      i++;
      fieldBlock =
        fieldBlock.nextConnection && fieldBlock.nextConnection.targetBlock();
    }
  },

  updateShape: function () {
    // Delete everything.
    if (this.getInput('with')) {
      this.removeInput('with');
    }
    let i = 1;
    while (this.getInput('field_input' + i)) {
      this.removeInput('field_input' + i);
      i++;
    }
    // Rebuild block.
    if (this.numFields > 0) {
      this.appendDummyInput('with')
        .setAlign(inputs.ALIGN_RIGHT)
        .appendField('with fields');
    }
    for (let i = 1; i <= this.numFields; i++) {
      const fieldName = this.fields[i - 1];
      this.appendValueInput('field_input' + i)
        .setCheck(null)
        .setAlign(inputs.ALIGN_RIGHT)
        .appendField(new FieldTextInput(fieldName), 'field' + i);
    }
  },
};

Extensions.registerMutator(
  'controls_create_mutator',
  objectCreateMutator,
  null,
  ['object_field']
);

// Internally used in SWITCH_CASE block mutator (so not available in the toolbox)
Blocks['object_field'] = {
  init: function () {
    this.appendDummyInput('name')
      .appendField('field', 'label')
      .appendField(new FieldTextInput('name'), 'name');
    this.setPreviousStatement(true, 'object_field');
    this.setNextStatement(true, 'object_field');
    this.setColour('#F99EA3');
    this.setInputsInline(true);
  },
};

// Internally used in SWITCH_CASE block mutator (so not available in the toolbox)
Blocks['object_create_mutator_top'] = {
  init: function () {
    this.appendDummyInput().appendField('object');
    this.setNextStatement(true);
    this.setColour('#F99EA3');
    this.setTooltip('');
    this.contextMenu = false;
  },
};
