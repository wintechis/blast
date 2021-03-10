Blockly.JavaScript['repeat'] = Blockly.JavaScript['controls_repeat_ext'];
Blockly.JavaScript['while_until'] = Blockly.JavaScript['controls_whileUntil'];
Blockly.JavaScript['for'] = Blockly.JavaScript['controls_for'];
Blockly.JavaScript['break_continue'] =
  Blockly.JavaScript['controls_flow_statements'];
Blockly.JavaScript['conditional_statement'] = Blockly.JavaScript['controls_if'];
Blockly.JavaScript['number_value'] = Blockly.JavaScript['math_number'];
Blockly.JavaScript['string'] = Blockly.JavaScript['text'];
Blockly.JavaScript['string_join'] = Blockly.JavaScript['text_join'];
Blockly.JavaScript['string_length'] = Blockly.JavaScript['text_length'];
Blockly.JavaScript['string_indexOf'] = Blockly.JavaScript['text_indexOf'];
Blockly.JavaScript['string_charAt'] = Blockly.JavaScript['text_charAt'];
Blockly.JavaScript['string_getSubstring'] =
  Blockly.JavaScript['text_getSubstring'];
Blockly.JavaScript['string_changeCase'] = Blockly.JavaScript['text_changeCase'];
Blockly.JavaScript['string_replace'] = Blockly.JavaScript['text_replace'];

Blockly.JavaScript['ibeacon_data'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `getRSSI(${mac})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['display_text'] = function(block) {
  const message =
    Blockly.JavaScript.valueToCode(
        block,
        'text',
        Blockly.JavaScript.ORDER_NONE,
    ) || '\'\'';

  const code = `displayText(${message});\n`;
  return code;
};

Blockly.JavaScript['display_table'] = function(block) {
  const table = Blockly.JavaScript.valueToCode(
      block,
      'table',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `displayTable(${table});\n`;
  return code;
};

Blockly.JavaScript['http_request'] = function(block) {
  const uri =
    Blockly.JavaScript.valueToCode(
        block,
        'uri',
        Blockly.JavaScript.ORDER_NONE,
    ) || null;
  const method = block.getFieldValue('METHOD');
  const headers = block.getFieldValue('HEADERS');
  const output = block.getFieldValue('OUTPUT');
  const body = JSON.stringify(block.getFieldValue('BODY')) || null;

  const code = `sendHttpRequest(${uri},'${method}', 
  '{${headers}}', ${body}, '${output}')\n`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['http_request_new'] = function(block) {
  const uri =
    Blockly.JavaScript.valueToCode(
        block,
        'uri',
        Blockly.JavaScript.ORDER_NONE,
    ) || null;
  const method = block.getFieldValue('METHOD');
  const headers = block.getFieldValue('HEADERS');
  const output = block.getFieldValue('OUTPUT');
  const body = Blockly.JavaScript.valueToCode(
      block,
      'body',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `sendHttpRequest(${uri},'${method}', 
  '{${headers}}', ${body}, '${output}')\n`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['get_request'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'URI',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const headers = block.getFieldValue('HEADERS');

  const code = `getRequest(${uri}, '{${headers}}')`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sparql_query'] = function(block) {
  let query = block.getFieldValue('query');
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );

  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');

  const code = `urdfQueryWrapper(${uri}, '${query}')`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sparql_ask'] = function(block) {
  let query = block.getFieldValue('query');
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );

  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');

  const code = `urdfQueryWrapper(${uri}, "${query}")`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['switch_lights'] = function(block) {
  const cbRed = block.getFieldValue('cb_red') == 'TRUE';
  const cbYellow = block.getFieldValue('cb_yellow') == 'TRUE';
  const cbGreen = block.getFieldValue('cb_green') == 'TRUE';
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `switchLights(${mac}, ${cbRed}, ${cbYellow}, ${cbGreen});\n`;
  return code;
};

Blockly.JavaScript['switch_lights'] = function(block) {
  const cbRed = block.getFieldValue('cb_red') == 'TRUE';
  const cbYellow = block.getFieldValue('cb_yellow') == 'TRUE';
  const cbGreen = block.getFieldValue('cb_green') == 'TRUE';
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `switchLights(${mac}, ${cbRed}, ${cbYellow}, ${cbGreen});\n`;
  return code;
};

Blockly.JavaScript['get_temperature'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getTemperature(${mac})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['mirobot_pickup'] = function(block) {
  const box = Blockly.JavaScript.quote_(
      block.getFieldValue('box').toLowerCase(),
  );

  const code = `mirobotPickUpBox(${box});\n`;
  return code;
};

Blockly.JavaScript['play_audio'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'URI',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `playAudioFromURI(${uri});\n`;
  return code;
};

Blockly.JavaScript['wait_seconds'] = function(block) {
  const seconds = Number(block.getFieldValue('SECONDS'));
  const code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};

Blockly.JavaScript['number_random'] = function(block) {
  // Random integer between [X] and [Y].
  const argument0 =
    Blockly.JavaScript.valueToCode(
        block,
        'FROM',
        Blockly.JavaScript.ORDER_NONE,
    ) || '0';
  const argument1 =
    Blockly.JavaScript.valueToCode(
        block,
        'TO',
        Blockly.JavaScript.ORDER_NONE,
    ) || '0';

  const code = `numberRandom(${argument0}, ${argument1})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['number_arithmetic'] = function(block) {
  // Basic arithmetic operators, and modulo and power.
  const OPERATORS = {
    ADD: [' + ', Blockly.JavaScript.ORDER_ADDITION],
    MINUS: [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
    MULTIPLY: [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
    DIVIDE: [' / ', Blockly.JavaScript.ORDER_DIVISION],
    MODULO: [' % ', Blockly.JavaScript.ORDER_DIVISION],
    POWER: [null, Blockly.JavaScript.ORDER_NONE], // Handle power separately.
  };
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
  const argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  let code;
  // Power in JavaScript requires a special case since it has no operator.
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.JavaScript['uri'] = function(block) {
  const uri = Blockly.JavaScript.quote_(block.getFieldValue('URI'));
  return [uri, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['mac'] = function(block) {
  const mac = Blockly.JavaScript.quote_(block.getFieldValue('MAC'));
  return [mac, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['number_infinity'] = function(block) {
  return [Infinity, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['state_definition'] = function(block) {
  const name = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('NAME'),
      Blockly.PROCEDURE_CATEGORY_NAME,
  );
  const condition = Blockly.JavaScript.valueToCode(
      block,
      'state_condition',
      Blockly.JavaScript.ORDER_ATOMIC,
  );

  Blast.States['%' + name] = condition;
  return null;
};

Blockly.JavaScript['event'] = function(block) {
  const entersExits = block.getFieldValue('entersExits');
  const stateName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('NAME'),
      Blockly.PROCEDURE_CATEGORY_NAME,
  );
  const statements = Blockly.JavaScript.statementToCode(block, 'statements');

  const negate = entersExits == 'enters' ? '!' : '';
  console.log(stateName);
  const conditions = negate + Blast.States['%' + stateName];
  console.log(conditions);

  Blast.States.addEvent(conditions, statements, block.id);
  Blockly.JavaScript.definitions_['eventChecker'] = 'startEventChecker()';

  return null;
};

// TEMPORARY dw blocks for demonstration on 22.1.2021
Blockly.JavaScript['readdw'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_NONE,
  );
  // TODO: Assemble JavaScript into code variable.
  const code = `getDwValuesOfMac(${mac})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['writedw'] = function(block) {
  const value = Blockly.JavaScript.valueToCode(
      block,
      'value',
      Blockly.JavaScript.ORDER_NONE,
  );
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'MAC',
      Blockly.JavaScript.ORDER_NONE,
  );
  // TODO: Assemble JavaScript into code variable.
  const code = `setDwValuesOfMac(${mac}, ${value})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};
