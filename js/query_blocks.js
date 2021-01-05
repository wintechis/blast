Blockly.defineBlocksWithJsonArray([
  {
    type: 'display_text',
    message0: 'display text: %1',
    args0: [
      {
        type: 'input_value',
        name: 'text',
        check: ['String', 'Number', 'Boolean', 'URI'],
      },
    ],
    previousStatement: ['state', 'config', 'action'],
    nextStatement: ['state', 'config', 'action'],
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'ibeacon_data',
    message0: 'get %3 of MAC %1 at URI %2',
    args0: [
      {
        type: 'input_value',
        name: 'MAC',
        check: 'mac',
      },
      {
        type: 'input_value',
        name: 'URI',
        check: 'URI',
      },
      {
        type: 'field_dropdown',
        name: 'value',
        options: [
          // ['mac address', 'mac'],
          ['rssi', 'rssi'],
          ['resultTime', 'resultTime'],
        ],
      },
    ],
    output: ['String', 'Number'],
    colour: 330,
    inputsInline: true,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'event',
    message0: '%1 %2 %3 %4 %5',
    args0: [
      {
        type: 'input_value',
        name: 'measurement',
        check: ['Number', 'String'],
      },
      {
        type: 'field_dropdown',
        name: 'startstop',
        options: [
          ['becomes', 'BECOMES'],
          ['stops being', 'STOPS'],
        ],
      },
      {
        type: 'field_dropdown',
        name: 'operator',
        options: [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['\u200F<', 'LT'],
          ['\u200F\u2264', 'LTE'],
          ['\u200F>', 'GT'],
          ['\u200F\u2265', 'GTE'],
        ],
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'value',
        check: ['Number', 'String'],
      },
    ],
    inputsInline: true,
    output: 'Boolean',
    colour: 210,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'display_table',
    message0: 'display table %1',
    args0: [
      {
        type: 'input_value',
        name: 'table',
        check: 'table',
      },
    ],
    previousStatement: 'action',
    nextStatement: 'action',
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'number_infinity',
    message0: 'infinity',
    output: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'switch_lights',
    message0: 'switch lights with mac: %1 %2 red %3 yellow %4 green %5',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'mac',
        check: 'mac',
      },
      {
        type: 'field_checkbox',
        name: 'cb_red',
        checked: true,
      },
      {
        type: 'field_checkbox',
        name: 'cb_yellow',
        checked: true,
      },
      {
        type: 'field_checkbox',
        name: 'cb_green',
        checked: true,
      },
    ],
    previousStatement: 'action',
    nextStatement: 'action',
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'random_sound',
    message0: 'play random sound %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'category',
        options: [
          ['happy', 'happy'],
          ['sad', 'sad'],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'uri',
    message0: 'URI %1',
    args0: [
      {
        type: 'field_input',
        name: 'URI',
        text: 'http://dwpi4.local/ble/current',
      },
    ],
    output: 'URI',
    colour: 160,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'mac',
    message0: 'mac %1',
    args0: [
      {
        type: 'field_input',
        name: 'MAC',
        text: 'deadbeef',
      },
    ],
    output: 'mac',
    colour: 160,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'wait_seconds',
    message0: ' wait %1 seconds',
    args0: [
      {
        type: 'field_number',
        name: 'SECONDS',
        min: 0,
        max: 600,
        value: 1,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '%{BKY_LOOPS_HUE}',
  },
]);

Blockly.Blocks['loops_repeat'] = Blockly.Blocks['controls_repeat_ext'];
Blockly.Blocks['loops_while_until'] = Blockly.Blocks['controls_whileUntil'];
Blockly.Blocks['loops_for'] = Blockly.Blocks['controls_for'];
Blockly.Blocks['break_continue'] = Blockly.Blocks['controls_flow_statements'];
Blockly.Blocks['conditional_statement'] = Blockly.Blocks['controls_if'];
Blockly.Blocks['number_value'] = Blockly.Blocks['math_number'];
Blockly.Blocks['number_arithmetic'] = Blockly.Blocks['math_arithmetic'];
Blockly.Blocks['number_random'] = Blockly.Blocks['math_random_int'];

Blockly.Constants.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.LOOP_TYPES.push(
    'loops_repeat',
    'loops_while_until',
    'loops_for',
);

Blockly.Blocks['sparql_query'] = {
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
  init: function() {
    this.appendValueInput('uri')
        .appendField('run SPARQL ASK Query from URI')
        .setCheck('URI');
    this.appendDummyInput().appendField(
        new Blockly.FieldMultilineInput(`PREFIX sosa: <http://www.w3.org/ns/sosa/>
ASK 
WHERE {
  ?node sosa:hasSimpleResult ?rssiValue 
} HAVING (?rssiValue > -40)`),
        'query',
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(0);
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
