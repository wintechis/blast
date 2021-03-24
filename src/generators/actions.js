/**
 * @fileoverview Generating JavaScript for Blast's action blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 */

'use strict';

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
