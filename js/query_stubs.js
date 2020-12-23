Blockly.JavaScript['loops_repeat'] = Blockly.JavaScript['controls_repeat_ext'];
Blockly.JavaScript['loops_while_until'] =
  Blockly.JavaScript['controls_whileUntil'];
Blockly.JavaScript['loops_for'] = Blockly.JavaScript['controls_for'];
Blockly.JavaScript['break_continue'] =
  Blockly.JavaScript['controls_flow_statements'];
Blockly.JavaScript['conditional_statement'] = Blockly.JavaScript['controls_if'];
Blockly.JavaScript['number_value'] = Blockly.JavaScript['math_number'];
Blockly.JavaScript['number_arithmetic'] = Blockly.JavaScript['math_arithmetic'];
Blockly.JavaScript['number_random'] = Blockly.JavaScript['math_random_int'];

Blockly.JavaScript['ibeacon_data'] = function(block) {
  const ibeacon = Blockly.JavaScript.valueToCode(
      block,
      'ibeacon',
      Blockly.JavaScript.ORDER_NONE,
  );
  const receiver = Blockly.JavaScript.valueToCode(
      block,
      'receiver',
      Blockly.JavaScript.ORDER_NONE,
  );
  const value = block.getFieldValue('value');
  const code = `getTableCell(${receiver}, 'mac', ${ibeacon}, '${value}')`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

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
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );
  const method = block.getFieldValue('METHOD');
  const headers = block.getFieldValue('HEADERS');
  const output = block.getFieldValue('OUTPUT');
  const body = JSON.stringify(block.getFieldValue('BODY')) || null;

  const code = `sendHttpRequest(${uri},'${method}', 
  '{${headers}}', ${body}, '${output}')\n`;
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

  const code = `urdfQueryWrapper(${uri}, "${query}")`;

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
  const checkboxRed = block.getFieldValue('cb_red') == 'TRUE';
  const checkboxYellow = block.getFieldValue('cb_yellow') == 'TRUE';
  const checkboxGreen = block.getFieldValue('cb_green') == 'TRUE';
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `switchLights(${mac}, ${checkboxRed}, 
  ${checkboxYellow}, ${checkboxGreen});`;
  return code;
};

Blockly.JavaScript['random-sound'] = function(block) {
  const dropdownCategory = block.getFieldValue('category');
  const code = `playRandomSoundFromCategory("${dropdownCategory}");\n`;
  return code;
};

Blockly.JavaScript['wait_seconds'] = function(block) {
  const seconds = Number(block.getFieldValue('SECONDS'));
  const code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};

Blockly.JavaScript['event'] = function(block) {
  const measurement = Blockly.JavaScript.valueToCode(
      block,
      'measurement',
      Blockly.JavaScript.ORDER_NONE,
  );
  const dropdownStartsStops = block.getFieldValue('startstop');
  const value = Blockly.JavaScript.valueToCode(
      block,
      'value',
      Blockly.JavaScript.ORDER_NONE,
  );

  const OPERATORS = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>=',
  };

  const operator = OPERATORS[block.getFieldValue('operator')];
  const negate = dropdownStartsStops == 'BECOMES' ? '' : '!';

  const code = `eventChecker(${measurement}, "${negate}", 
  "${operator}", ${value}, "${block.id}")`;

  return [code, Blockly.JavaScript.ORDER_NONE];
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
