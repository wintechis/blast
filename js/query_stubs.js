// Blockly.JavaScript['list_accesspoints'] = function(block) {
//   var text_from = block.getFieldValue('from');
//   var checkbox_show_name = block.getFieldValue('show_name') == 'TRUE';
//   var checkbox_show_x = block.getFieldValue('show_x') == 'TRUE';
//   var checkbox_show_y = block.getFieldValue('show_y') == 'TRUE';

//   checkboxes = [];
//   checkboxes[0] = checkbox_show_x;
//   checkboxes[1] = checkbox_show_y;

//   var code = "updateAccesspointsQuery('" + text_from + ", [" + checkboxes.toString() + "])";
//   return code;
// };

Blockly.JavaScript['query_bluetooth'] = function (block) {
  var dropdown_standard = block.getFieldValue('standard');
  var text_from = block.getFieldValue('from');
  var statements_query_condition = Blockly.JavaScript.statementToCode(block, 'query_condition');
  var statements_query_true = Blockly.JavaScript.statementToCode(block, 'query_true');
  var statements_query_false = Blockly.JavaScript.statementToCode(block, 'query_false');

  // build sparql beginning
  var sparql = setQuerySelect(dropdown_standard, text_from);
  // add where conditions
  sparql += addQueryFilters(statements_query_condition) + "}";

  code = `sparql = \\\`${sparql}\\\`;\n`;
  code += `actionTrue = \\\`${statements_query_true.trim()};\\\`\n`;
  code += `actionFalse = \\\`${statements_query_false.trim()};\\\`\n`;
  // code += `console.log(sparql);\n`;
  // code += `console.log(actionTrue);\n`

  // code to execute sparql and conditional actions
  code += `urdf.clear();\n`;
  code += `urdf.query(sparql)\n
              .then(result => {
                console.log(result);
                if(result) eval(actionTrue);
                else eval(actionFalse);
              })\n`;

  return code;
};

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
  var value_n = Blockly.JavaScript.valueToCode(block, 'n', Blockly.JavaScript.ORDER_NONE);
  var value_seconds = Blockly.JavaScript.valueToCode(block, 'seconds', Blockly.JavaScript.ORDER_NONE);
  var statements_loop = Blockly.JavaScript.statementToCode(block, 'loop_processes');

  var code = `loop.push(\`${statements_loop.trim()}\`); var loopTime = ${value_seconds}; var loop_n = ${value_n}`;
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

  var code = `insertMessage(${text_msg})\n`;
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

// Blockly.JavaScript['display'] = function (block) {
//   var value_thing = Blockly.JavaScript.statementToCode(block, 'thing');
//   var checkbox_show_rssi = block.getFieldValue('show_rssi') == 'TRUE';
//   var checkbox_show_proximity = block.getFieldValue('show_proximity') == 'TRUE';
//   var checkbox_timestamp = block.getFieldValue('timestamp') == 'TRUE';
//   var checkbox_show_measured_power = block.getFieldValue('show_measured_power') == 'TRUE';
//   var checkbox_show_accuracy = block.getFieldValue('show_accuracy') == 'TRUE';
//   var checkbox_show_major = block.getFieldValue('show_major') == 'TRUE';
//   var checkbox_show_minor = block.getFieldValue('show_minor') == 'TRUE';

//   // checkboxes are booleans for {showRSSI, showResultTime, showAccuracy, 
//   //  showMajor, showMinor, showMeasuredPower, showProximity}
//   checkboxes = [];
//   checkboxes[0] = checkbox_show_rssi;
//   checkboxes[1] = checkbox_timestamp;
//   checkboxes[2] = checkbox_show_accuracy;
//   checkboxes[3] = checkbox_show_major;
//   checkboxes[4] = checkbox_show_minor;
//   checkboxes[5] = checkbox_show_measured_power;
//   checkboxes[6] = checkbox_show_proximity;

//   var url = "";
//   try {
//     url = new URL(value_thing);
//   } catch (error) {
//     if (error.name = "TypeError") {
//       url = new URL(alias.get(text_host));
//     }
//   }

//   var baseUrl = url.protocol + "//" + url.host;
//   var path = url.pathname;

//   var query = `
//   BASE <${baseUrl}>
//   PREFIX scp: <https://github.com/aharth/supercool/>
//   PREFIX sosa: <http://www.w3.org/ns/sosa/>
//   PREFIX qudt: <http://qudt.org/1.1/schema/qudt#>
  
//   SELECT ?mac ?rssi ?resultTime ?accuracy ?major ?minor ?measuredPower ?proximity
//   FROM <${path}>
//   WHERE
//   {
//     ?ble sosa:madeBySensor ?apfull .
//     BIND(substr(?apfull, 7,1) AS ?ap) .
//     ?ble sosa:hasResult ?sensor .
//     ?sensor scp:MacAddress ?mac .
//     `;

//   for (var i = 0; i < checkboxes.length; i++) {
//     if (checkboxes[i]) query += fields[i];
//   }

//   query += `
//   }
//   ORDER BY ?mac`;

//   code = `addTable(\\\`${query}\\\`)\n`;

//   return code;
// };

Blockly.JavaScript['display'] = function (block) {
  var value_thing = Blockly.JavaScript.valueToCode(block, 'thing', Blockly.JavaScript.ORDER_NONE);
  var checkbox_show_rssi = block.getFieldValue('show_rssi') == 'TRUE';
  var checkbox_show_proximity = block.getFieldValue('show_proximity') == 'TRUE';
  var checkbox_timestamp = block.getFieldValue('timestamp') == 'TRUE';
  var checkbox_show_measured_power = block.getFieldValue('show_measured_power') == 'TRUE';
  var checkbox_show_accuracy = block.getFieldValue('show_accuracy') == 'TRUE';
  var checkbox_show_major = block.getFieldValue('show_major') == 'TRUE';
  var checkbox_show_minor = block.getFieldValue('show_minor') == 'TRUE';

  // checkboxes are booleans for {showRSSI, showResultTime, showAccuracy, 
  //  showMajor, showMinor, showMeasuredPower, showProximity}
  checkboxes = ["mac"];
  if(checkbox_show_rssi) checkboxes.push("rssi");
  if(checkbox_show_proximity) checkboxes.push("proximity");
  if(checkbox_timestamp) checkboxes.push("resultTime");
  if(checkbox_show_measured_power) checkboxes.push("measuredPower");
  if(checkbox_show_accuracy) checkboxes.push("accuracy");
  if(checkbox_show_major) checkboxes.push("major");
  if(checkbox_show_minor) checkboxes.push("minor");

  code = `displayTable("${value_thing}", ['${checkboxes.join("','")}']);`;
  return code;
}

Blockly.JavaScript['ibeacon_get'] = function (block) {
  var thingName = block.getFieldValue('thing');
  var ibeacons = Blockly.Things.thingsMap.get("iBeacon");
  var thing = ibeacons.get(thingName);
  
  return [thing.address.trim(), Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['receiver_get'] = function (block) {
  var thingName = block.getFieldValue('thing');
  var receiver = Blockly.Things.thingsMap.get("receiver");
  var thing = receiver.get(thingName);

  return [thing.address.trim(), Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['event'] = function(block) {
  var ibeacon = Blockly.JavaScript.valueToCode(block, 'ibeacon', Blockly.JavaScript.ORDER_NONE);
  var receiver = Blockly.JavaScript.valueToCode(block, 'receiver', Blockly.JavaScript.ORDER_NONE);
  var value = block.getFieldValue('value');
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

if ((!(prevResultsMap.get("http://testserver.local:3000/ibeacon/").get("f0346fbf4875")["rssi"].value < -50)) &&
     (resultsMap.get("http://testserver.local:3000/ibeacon/").get("f0346fbf4875")["rssi"].value < -50)) {
    insertMessage('ja')
  } else {
    insertMessage('nein')
  }