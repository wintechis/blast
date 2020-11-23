Blockly.JavaScript['ibeacon_data'] = function (block) {
  var ibeacon = Blockly.JavaScript.valueToCode(block, 'ibeacon', Blockly.JavaScript.ORDER_NONE);
  var receiver = Blockly.JavaScript.valueToCode(block, 'receiver', Blockly.JavaScript.ORDER_NONE);
  var value = block.getFieldValue('value');

  result = resultsMap.get(receiver);
  data = result.get(ibeacon);
  var code;
  // if(["mac", "proximity", "time"].includes(value)){
  //   code = Blockly.JavaScript.quote_(data[value].value);
  // } else {
  //   code = data[value].value; 
  // }{
  code = `resultsMap.get("${receiver}").get("${ibeacon}")["${value}"].value`;

  return [code, Blockly.JavaScript.ORDER_NONE]; 
};

Blockly.JavaScript['and'] = function (block) {
  var statements_and_condition1 = Blockly.JavaScript.statementToCode(block, 'and_condition1');
  var statements_and_condition2 = Blockly.JavaScript.statementToCode(block, 'and_condition2');

  var code = `(${statements_and_condition1} && ${statements_and_condition2})`;
  return code;
};

Blockly.JavaScript['or'] = function (block) {
  var statements_or_condition1 = Blockly.JavaScript.statementToCode(block, 'or_condition1');
  var statements_or_condition2 = Blockly.JavaScript.statementToCode(block, 'or_condition2');

  var code = `(${statements_or_condition1} || ${statements_or_condition2})`;
  return code;
};


Blockly.JavaScript['setup'] = function (block) {
  var statements_onstart = Blockly.JavaScript.statementToCode(block, 'onStart_processes');
  var code = `setup.push(\`${statements_onstart.trim()}\`);`;

  return code;
};

Blockly.JavaScript['loop'] = function (block) {
  var value_seconds = Blockly.JavaScript.valueToCode(block, 'seconds', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_dropdown_mode = block.getFieldValue('dropdown_mode');
  var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_loop = Blockly.JavaScript.statementToCode(block, 'loop_processes');

  if (dropdown_dropdown_mode == "mode_until") {
    value_condition = "!" + value_condition
  }

  var code = `loop.push(\`${statements_loop.trim()}\`); var loopTime = ${value_seconds}; var loopCondition = ${value_condition};`;
  return code;
};

Blockly.JavaScript['infinity'] = function (block) {
  return [Infinity, Blockly.JavaScript.ORDER_NONE];
}

function getOperator(dropdown_operator) {
  var operator = "";

  switch (dropdown_operator) {
    case "equals":
      operator = "=";
      break;
    case "less":
      operator = "<";
      break;
    case "greater":
      operator = ">";
      break;
  }

  return operator;
}

Blockly.JavaScript['ibeaconconditions'] = function (block) {
  var dropdown_ibeaconfield = block.getFieldValue('ibeaconField');
  var dropdown_operator = block.getFieldValue('operator');
  var text_value = block.getFieldValue('value').trim();

  if (dropdown_ibeaconfield == "nick") {
    dropdown_ibeaconfield = "mac"
    text_value = alias.get(text_value);
  }

  var operator = getOperator(dropdown_operator);

  var code = `?${dropdown_ibeaconfield} ${operator} '${text_value}'`;
  return code;
};

Blockly.JavaScript['bleconditions'] = function (block) {
  var dropdown_blefield = block.getFieldValue('bleField');
  var dropdown_operator = block.getFieldValue('operator');
  var text_value = block.getFieldValue('value').trim();

  if (dropdown_blefield == "nick") {
    dropdown_blefield = "mac"
    text_value = text_value.replace(/\s/g, "");
    text_value = `\\\${${text_value}}`
  }

  var operator = getOperator(dropdown_operator);

  var code = `?${dropdown_blefield} ${operator} '${text_value}'`;
  return code;;
};

alias = new Map();

Blockly.JavaScript['alias'] = function (block) {
  var text_mac = block.getFieldValue('mac');
  var text_nick = block.getFieldValue('nick');

  alias.set(text_nick, text_mac);

  var code = "";
  return code;
};

Blockly.JavaScript['message'] = function (block) {
  var text_msg = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE) || '\'\'';

  var code = `displayText(${text_msg})\n`;
  return code;
};


// saving checkboxes into SPARQL strings
// used by displayBlock function
// lineBreaks are for readability only
fields = [];
var queryRSSI = '?sensor qudt:numericValue ?rssi .\n';
fields.push(queryRSSI);
var queryResultTime = '?sensor sosa:resultTime ?resultTime .\n';
fields.push(queryResultTime);
var queryAccuracy = '?sensor scp:accuracy ?accuracy .\n';
fields.push(queryAccuracy);
var queryMajor = '?sensor scp:major ?major .\n';
fields.push(queryMajor);
var queryMinor = '?sensor scp:major ?minor .\n';
fields.push(queryMinor);
var queryMeasuredPower = '?sensor scp:measuredPower ?measuredPower .\n';
fields.push(queryMeasuredPower);
var queryProximity = '?sensor scp:proximity ?proximity .\n';
fields.push(queryProximity);

Blockly.JavaScript['display'] = function (block) {
  var value_thing = Blockly.JavaScript.valueToCode(block, 'thing', Blockly.JavaScript.ORDER_NONE);

  code = `displayData(${value_thing});`;
  return code;
}

Blockly.JavaScript['things_get'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  
  return [value_name, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['receiver_get'] = function(block) {
  var value_address = Blockly.JavaScript.valueToCode(block, 'address', Blockly.JavaScript.ORDER_ATOMIC);
  
  return [value_address, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['event'] = function (block) {
  ibeaconBlock = block.getInputTargetBlock('measurement');
  var measurement = Blockly.JavaScript.valueToCode(block, 'measurement', Blockly.JavaScript.ORDER_NONE);
  var ibeacon = Blockly.JavaScript.valueToCode(ibeaconBlock, 'ibeacon', Blockly.JavaScript.ORDER_NONE);
  var receiver = Blockly.JavaScript.valueToCode(ibeaconBlock, 'receiver', Blockly.JavaScript.ORDER_NONE);
  var value = ibeaconBlock.getFieldValue('value');
  var dropdown_startstop = block.getFieldValue('startstop');
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);

  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };

  var operator = OPERATORS[block.getFieldValue('operator')];
  var order = (operator == '==' || operator == '!=') ?
    Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;

  var negate = dropdown_startstop == "BECOMES" ? "" : "!";

  var code =
    `${negate}(!(prevResultsMap.get("${receiver}").get("${ibeacon}")["${value}"].value ${operator} ${value_name})) &&
  ${negate} (resultsMap.get("${receiver}").get("${ibeacon}")["${value}"].value ${operator} ${value_name})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['switchlights'] = function (block) {
  var cb_red = block.getFieldValue('cb_red') == 'TRUE';
  var cb_yellow = block.getFieldValue('cb_yellow') == 'TRUE';
  var cb_green = block.getFieldValue('cb_green') == 'TRUE';
  var ibeacon = Blockly.JavaScript.valueToCode(block, 'light', Blockly.JavaScript.ORDER_NONE);

  var code = `switchLights("${ibeacon}", ${cb_red}, ${cb_yellow}, ${cb_green});`;
  return code;
};

Blockly.JavaScript['randomsound'] = function (block) {
  var dropdown_category = block.getFieldValue('category');
  var code = `playRandomSoundFromCategory("${dropdown_category}");\n`;
  return code;
};

Blockly.JavaScript['halt'] = function (block) {
  var code = 'stopCode("finished");\n';
  return code;
};

Blockly.JavaScript['sparql_query'] = function (block) {
  var query = block.getFieldValue('query');

  var code = (`sparqlQuery(\\\`${query}\\\`)`)

  return code;
}

Blockly.JavaScript['httprequest'] = function(block) {
  var url = block.getFieldValue('URL');
  var method = block.getFieldValue('METHOD');
  var text_headers = block.getFieldValue('HEADERS');
  var print = block.getFieldValue('print') == 'TRUE';
  
  var headers = text_headers.split(',');

  var code = `sendHttpRequest("${url}","${method}",[${headers}],"${body}",${print})`;
  return code;
};

Blockly.JavaScript['uri'] = function(block) {
  var text_uri = block.getFieldValue('URI');
  return [text_uri, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['mac'] = function(block) {
  var text_mac = block.getFieldValue('MAC');
  return [text_mac, Blockly.JavaScript.ORDER_NONE];
};