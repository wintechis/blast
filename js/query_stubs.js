Blockly.JavaScript['things'] = function(block) {
  const mac = Blockly.JavaScript.valueToCode(
      block,
      'mac',
      Blockly.JavaScript.ORDER_NONE,
  );

  return [mac, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['receiver'] = function(block) {
  const address = Blockly.JavaScript.valueToCode(
      block,
      'address',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `queryReceiver("${address}")`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

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

  const code = `getTableCell(${receiver}, 'mac', "${ibeacon}", "${value}")`;
  // if(["mac", "proximity", "time"].includes(value)){
  //   code = Blockly.JavaScript.quote_(data[value].value);
  // } else {
  //   code = data[value].value;
  // }{

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

Blockly.JavaScript['displayText'] = function(block) {
  const message =
    Blockly.JavaScript.valueToCode(
        block,
        'text',
        Blockly.JavaScript.ORDER_NONE,
    ) || '\'\'';

  const code = `displayText(${message});\n`;
  return code;
};

Blockly.JavaScript['displayTable'] = function(block) {
  const table = Blockly.JavaScript.valueToCode(
      block,
      'table',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `displayTable(${table});\n`;
  return code;
};

Blockly.JavaScript['httprequest'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );
  const method = block.getFieldValue('METHOD');
  const headers = block.getFieldValue('HEADERS');
  const output = block.getFieldValue('OUTPUT');
  const body = block.getFieldValue('BODY') || null;


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

Blockly.JavaScript['switchlights'] = function(block) {
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

Blockly.JavaScript['randomsound'] = function(block) {
  const dropdownCategory = block.getFieldValue('category');
  const code = `playRandomSoundFromCategory("${dropdownCategory}");\n`;
  return code;
};

Blockly.JavaScript['waitSeconds'] = function(block) {
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

Blockly.JavaScript['infinity'] = function(block) {
  return [Infinity, Blockly.JavaScript.ORDER_NONE];
};
