
Blockly.JavaScript['things'] = function (block) {
  var value_mac = Blockly.JavaScript.valueToCode(block, 'mac', Blockly.JavaScript.ORDER_NONE);

  return [value_mac, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['receiver'] = function (block) {
  var address = Blockly.JavaScript.valueToCode(block, 'address', Blockly.JavaScript.ORDER_NONE);
  code = `queryReceiver("${address}")`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['ibeacon_data'] = function (block) {
  var ibeacon = Blockly.JavaScript.valueToCode(block, 'ibeacon', Blockly.JavaScript.ORDER_NONE);
  var receiver = Blockly.JavaScript.valueToCode(block, 'receiver', Blockly.JavaScript.ORDER_NONE);
  var value = block.getFieldValue('value');

  var code = `getTableCell(${receiver}, 'mac', "${ibeacon}", "${value}")`
  // if(["mac", "proximity", "time"].includes(value)){
  //   code = Blockly.JavaScript.quote_(data[value].value);
  // } else {
  //   code = data[value].value; 
  // }{

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['displayText'] = function (block) {
  var text_msg = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_NONE) || '\'\'';

  var code = `displayText(${text_msg});\n`;
  return code;
};

Blockly.JavaScript['displayTable'] = function (block) {
  var table = Blockly.JavaScript.valueToCode(block, 'table', Blockly.JavaScript.ORDER_NONE)

  code = `displayTable(${table});\n`;
  return code;
}

Blockly.JavaScript['httprequest'] = function (block) {
  var uri = Blockly.JavaScript.valueToCode(block, 'uri', Blockly.JavaScript.ORDER_NONE);
  var method = block.getFieldValue('METHOD');
  var text_headers = block.getFieldValue('HEADERS');
  var output = block.getFieldValue('OUTPUT');
  var body = block.getFieldValue('BODY') || "";

  // escape " quotes in headers
  text_headers = text_headers.replace(/"/g, '\\\"');

  var code = `sendHttpRequest("${uri}","${method}", "${text_headers}","${body}", "${output}")\n`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['sparql_query'] = function (block) {
  var query = block.getFieldValue('query');
  var uri = Blockly.JavaScript.valueToCode(block, 'uri', Blockly.JavaScript.ORDER_NONE);

  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\\"').replace(/[\n\r]/g, ' ');

  var code = `urdfQueryWrapper("${uri}", "${query}")`

  return [code, Blockly.JavaScript.ORDER_NONE];
}

Blockly.JavaScript['sparql_ask'] = function (block) {
  var query = block.getFieldValue('query');
  var uri = Blockly.JavaScript.valueToCode(block, 'uri', Blockly.JavaScript.ORDER_NONE);

  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\\"').replace(/[\n\r]/g, ' ');

  var code = `urdfQueryWrapper("${uri}", "${query}")`

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['switchlights'] = function (block) {
  var cb_red = block.getFieldValue('cb_red') == 'TRUE';
  var cb_yellow = block.getFieldValue('cb_yellow') == 'TRUE';
  var cb_green = block.getFieldValue('cb_green') == 'TRUE';
  var mac = Blockly.JavaScript.valueToCode(block, 'mac', Blockly.JavaScript.ORDER_NONE);

  var code = `switchLights("${mac}", ${cb_red}, ${cb_yellow}, ${cb_green});`;
  return code;
};

Blockly.JavaScript['randomsound'] = function (block) {
  var dropdown_category = block.getFieldValue('category');
  var code = `playRandomSoundFromCategory("${dropdown_category}");\n`;
  return code;
};

Blockly.JavaScript['waitSeconds'] = function(block) {
  var seconds = Number(block.getFieldValue('SECONDS'));
  var code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};

Blockly.JavaScript['event'] = function (block) {
  var measurement = Blockly.JavaScript.valueToCode(block, 'measurement', Blockly.JavaScript.ORDER_NONE);
  var dropdown_startstop = block.getFieldValue('startstop');
  var value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_NONE);

  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };

  var operator = OPERATORS[block.getFieldValue('operator')];
  var negate = dropdown_startstop == "BECOMES" ? "" : "!";

  code = `eventChecker(${measurement}, "${negate}", "${operator}", ${value}, "${block.id}")`

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['uri'] = function (block) {
  var text_uri = block.getFieldValue('URI');
  return [text_uri, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['mac'] = function (block) {
  var text_mac = block.getFieldValue('MAC');
  return [text_mac, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['infinity'] = function (block) {
  return [Infinity, Blockly.JavaScript.ORDER_NONE];
}