Blockly.defineBlocksWithJsonArray([
  {
    "type": "query_bluetooth",
    "message0": "query Bluetooth devices %1 select standard: %2 %3 from: %4 %5 condition: %6 true: %7 false: %8",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "iBeacon",
            "ibeacon"
          ],
          [
            "BLE",
            "BLE"
          ],
          [
            "option",
            "OPTIONNAME"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "from",
        "text": "http://testserver.raspberry.pi/ibeacon/"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "query_condition",
        "check": [
          "condition",
          "logical_operator"
        ],
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "query_true",
        "check": "action",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "query_false",
        "check": "action",
        "align": "RIGHT"
      }
    ],
    "inputsInline": false,
    "previousStatement": "query",
    "nextStatement": "query",
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "setup",
    "message0": "setup %1 %2",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "onStart_processes",
        "check": [
          "query",
          "config",
          "action"
        ]
      }
    ],
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "loop",
    "message0": "repeat every %1 seconds %2 %3 %4 %5",
    "args0": [
      {
        "type": "input_value",
        "name": "seconds",
        "check": "Number"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "dropdown_mode",
        "options": [
          [
            "while",
            "mode_while"
          ],
          [
            "until",
            "mode_until"
          ]
        ]
      },
      {
        "type": "input_value",
        "name": "condition",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "loop_processes"
      }
    ],
    "inputsInline": true,
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "and",
    "message0": "%1 AND %2 %3",
    "args0": [
      {
        "type": "input_statement",
        "name": "and_condition1",
        "check": [
          "condition",
          "logical_operator"
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "and_condition2",
        "check": [
          "logical_operator",
          "condition"
        ]
      }
    ],
    "previousStatement": "logical_operator",
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "or",
    "message0": "%1 OR %2 %3",
    "args0": [
      {
        "type": "input_statement",
        "name": "or_condition1",
        "check": [
          "condition",
          "logical_operator"
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "or_condition2",
        "check": [
          "condition",
          "logical_operator"
        ]
      }
    ],
    "previousStatement": "logical_operator",
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  },
  // {
  //   "type": "sensorconditions",
  //   "message0": "sensor conditions %1 %2 %3 %4",
  //   "args0": [
  //     {
  //       "type": "input_dummy"
  //     },
  //     {
  //       "type": "field_dropdown",
  //       "name": "sensorField",
  //       "options": [
  //         [
  //           "battery level",
  //           "battery"
  //         ],
  //         [
  //           "rssi",
  //           "rssi"
  //         ],
  //         [
  //           "luminosity",
  //           "lux"
  //         ],
  //         [
  //           "temperature",
  //           "temp"
  //         ],
  //         [
  //           "barometric pressure",
  //           "pressure"
  //         ],
  //         [
  //           "humidity",
  //           "humidity"
  //         ],
  //         [
  //           "gyroscope x",
  //           "gyro_x"
  //         ],
  //         [
  //           "gyroscope y",
  //           "gyro_y"
  //         ],
  //         [
  //           "gyroscope z",
  //           "gyro_z"
  //         ],
  //         [
  //           "accelerometer x",
  //           "accel_x"
  //         ],
  //         [
  //           "accelerometer y",
  //           "accel_y"
  //         ],
  //         [
  //           "accelerometer z",
  //           "accel_z"
  //         ],
  //         ["magnetometer x",
  //           "magnet_x"
  //         ],
  //         ["magnetometer y",
  //           "magnet_y"
  //         ],
  //         ["magnetometer z",
  //           "magnet_z"
  //         ]
  //       ]
  //     },
  //     {
  //       "type": "field_dropdown",
  //       "name": "operator",
  //       "options": [
  //         [
  //           "=",
  //           "equals"
  //         ],
  //         [
  //           "<",
  //           "less"
  //         ],
  //         [
  //           ">",
  //           "greater"
  //         ]
  //       ]
  //     },
  //     {
  //       "type": "field_input",
  //       "name": "value",
  //       "text": "0"
  //     }
  //   ],
  //   "previousStatement": null,
  //   "colour": 180,
  //   "tooltip": "",
  //   "helpUrl": ""
  // },
  {
    "type": "ibeacon_get",
    "message0": "iBeacon %1",
    "args0": [
      {
        "type": "input_dummy",
        "name": "INPUT"
      }
    ],
    "extensions": ["dynamic_ibeacon_menu_extension"],
    "output": "ibeacon",
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "receiver_get",
    "message0": "receiver %1",
    "args0": [
      {
        "type": "input_dummy",
        "name": "INPUT"
      }
    ],
    "extensions": ["dynamic_receiver_menu_extension"],
    "output": "receiver",
    "colour": 270,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "conditions",
    "message0": "conditions %1 %2 %3 %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "ibeaconField",
        "options": [
          [
            "mac address",
            "mac"
          ],
          [
            "nickname",
            "nick"
          ],
          [
            "rssi",
            "rssi"
          ],
          [
            "proximity",
            "proximity"
          ],
          [
            "timestamp",
            "time"
          ],
          [
            "measured power",
            "measured"
          ],
          [
            "accuracy",
            "accuracy"
          ],
          [
            "major",
            "major"
          ],
          [
            "minor",
            "minor"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "operator",
        "options": [
          [
            "=",
            "equals"
          ],
          [
            "<",
            "less"
          ],
          [
            ">",
            "greater"
          ]
        ]
      },
      {
        "type": "field_input",
        "name": "value",
        "text": "ENTER A VALUE"
      }
    ],
    "previousStatement": "condition",
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "ibeacon_data",
    "message0": "beacon %1 %2 data at receiver %3 %4 value %5",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "ibeacon",
        "check": "ibeacon"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "receiver",
        "check": "receiver"
      },
      {
        "type": "field_dropdown",
        "name": "value",
        "options": [
          [
            "mac address",
            "mac"
          ],
          [
            "rssi",
            "rssi"
          ],
          [
            "proximity",
            "proximity"
          ],
          [
            "timestamp",
            "time"
          ],
          [
            "measured power",
            "measured"
          ],
          [
            "accuracy",
            "accuracy"
          ],
          [
            "major",
            "major"
          ],
          [
            "minor",
            "minor"
          ]
        ]
      },
    ],
    "inputsInline": true,
    "output": [
      "String",
      "Number"
    ],
    "colour": 330,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "bleconditions",
    "message0": "ble conditions %1 %2 %3 %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "bleField",
        "options": [
          [
            "mac address",
            "mac"
          ],
          [
            "rssi",
            "rssi"
          ],
          [
            "timestamp",
            "time"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "operator",
        "options": [
          [
            "=",
            "equals"
          ],
          [
            "<",
            "less"
          ],
          [
            ">",
            "greater"
          ]
        ]
      },
      {
        "type": "field_input",
        "name": "value",
        "text": "ENTER A VALUE"
      }
    ],
    "previousStatement": "condition",
    "colour": 180,
    "tooltip": "",
    "helpUrl": ""
  },
  // {
  //   "type": "ap_filter",
  //   "message0": "Accesspoints:  %1 (Comma separated list)",
  //   "args0": [
  //     {
  //       "type": "field_input",
  //       "name": "ap",
  //       "text": "a, b"
  //     }
  //   ],
  //   "inputsInline": false,
  //   "output": "ap_filter",
  //   "colour": 210,
  //   "tooltip": "",
  //   "helpUrl": ""
  // },
  // {
  //   "type": "mac_filter",
  //   "message0": "MAC-Addresses %1 (Comma separated list)",
  //   "args0": [
  //     {
  //       "type": "field_input",
  //       "name": "mac",
  //       "text": "dcba4b9f9b16"
  //     }
  //   ],
  //   "inputsInline": false,
  //   "output": "mac_filter",
  //   "colour": 210,
  //   "tooltip": "",
  //   "helpUrl": ""
  // },
  {
    "type": "message",
    "message0": "display text: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NAME",
        "check": [
          "String",
          "Number"
        ]
      }
    ],
    "previousStatement": [
      "state",
      "config",
      "action"
    ],
    "nextStatement": [
      "state",
      "config",
      "action"
    ],
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "alias",
    "lastDummyAlign0": "RIGHT",
    "message0": "set nickname for mac- or host-adress: %1 identifier: %2 %3 nickname: %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "mac",
        "text": "deadbeef"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_input",
        "name": "nick",
        "text": "Yellow Container"
      }
    ],
    "previousStatement": [
      "state",
      "config",
      "action"
    ],
    "nextStatement": [
      "state",
      "config",
      "action"
    ],
    "colour": 60,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "event",
    "message0": "%1 %2 %3 %4 %5",
    "args0": [
      {
        "type": "input_value",
        "name": "measurement",
        "check": [
          "Number",
          "String"
        ]
      },
      {
        "type": "field_dropdown",
        "name": "startstop",
        "options": [
          [
            "becomes",
            "BECOMES"
          ],
          [
            "stops being",
            "STOPS"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "operator",
        "options": [
          ["=", "EQ"],
          ["\u2260", "NEQ"],
          ["\u200F<", "LT"],
          ["\u200F\u2264", "LTE"],
          ["\u200F>", "GT"],
          ["\u200F\u2265", "GTE"]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "NAME",
        "check": [
          "Number",
          "String"
        ]
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "display",
    "message0": "display data received at %1",
    "args0": [
      {
        "type": "input_value",
        "name": "thing",
        "check": "receiver"
      }
    ],
    "previousStatement": "action",
    "nextStatement": "action",
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "infinity",
    "message0": "infinity",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "switchlights",
    "message0": "switch lights of: %1 %2 red %3 yellow %4 green %5",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "light",
        "check": "ibeacon"
      },
      {
        "type": "field_checkbox",
        "name": "cb_red",
        "checked": true
      },
      {
        "type": "field_checkbox",
        "name": "cb_yellow",
        "checked": true
      },
      {
        "type": "field_checkbox",
        "name": "cb_green",
        "checked": true
      }
    ],
    "previousStatement": "action",
    "nextStatement": "action",
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "randomsound",
    "message0": "play random sound %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "category",
        "options": [
          [
            "happy",
            "happy"
          ],
          [
            "sad",
            "sad"
          ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "halt",
    "message0": "stop execution",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "httprequest",
    "message0": "send HTTP request %1 method %2 %3 headers %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": [
          [
            "GET",
            "GET"
          ],
          [
            "PUT",
            "PUT"
          ],
          [
            "POST",
            "POST"
          ],
          [
            "DELETE",
            "DELETE"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_input",
        "name": "HEADERS",
        "text": ""
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  }
])

Blockly.Blocks['sparql_query'] = {
  init: function () {
    this.appendDummyInput()
      .appendField("run a SPARQL query:");
    this.appendDummyInput()
      .appendField(new Blockly.FieldMultilineInput(`
SELECT *
FROM <>
WHERE { 
  ?s ?p ?o
}`), "query");
    this.setOutput(false);
    this.setColour(0);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['httprequest'] = {

  httpRequestValidator: function (newValue) {
    this.getSourceBlock().updateInputs(newValue);
    return newValue;
  },

  init: function () {
    this.appendDummyInput()
      .appendField("send HTTP request");
    this.appendDummyInput()
      .appendField("URI")
      .appendField(new Blockly.FieldTextInput('http://example.com'),
        'URL');
    this.appendDummyInput()
      .appendField("method")
      .appendField(new Blockly.FieldDropdown([
        ['GET', 'GET'],
        ['PUT', 'PUT'],
        ['POST', 'POST'],
        ['DELETE', 'DELETE']
      ], this.httpRequestValidator), 'METHOD')
      .appendField('show response body:')
      .appendField(new Blockly.FieldCheckbox(true), 'print');
    this.appendDummyInput()
      .appendField("headers (comma separated)")
      .appendField(new Blockly.FieldTextInput('"Content-Type: application/json", "Accept: application/json"'),
        'HEADERS');
    this.setOutput(false);
    this.setColour(0);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },

  updateInputs: function (newValue) {
    this.removeInput('BODYINPUT',  /* no error */ true);

    if (newValue != 'GET') {
      this.appendDummyInput("BODYINPUT")
        .appendField("body")
        .appendField(new Blockly.FieldMultilineInput(`{
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
}`
        ), 'BODY');
    }
  }
}