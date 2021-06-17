/**
 * @fileoverview Javascript generators for BLAST's properties, actions and events Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/*****************
 * Action blocks.*
 *****************/

/**
 * Generates JavaScript code for the get_request block.
 * @param {Blockly.Block} block the get_request block.
 * @returns {String} the generated code.
 */
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
 
/**
 * Generates JavaScript code for the http_request block.
 * @param {Blockly.Block} block the http_request block.
 * @returns {String} the generated code.
 */
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
    
/**
 * Generates JavaScript code for the sparql_query block.
 * @param {Blockly.Block} block the sparql_query block.
 * @returns {String} the generated code.
 */
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

/**
 * Generates JavaScript code for the sparql_ask block.
 * @param {Blockly.Block} block the sparql_ask block.
 * @returns {String} the generated code.
 */
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
    
/**
 * Generates JavaScript code for the display_text block.
 * @param {Blockly.Block} block the display_text block.
 * @returns {String} the generated code.
 */
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
    
/**
 * Generates JavaScript code for the display_table block.
 * @param {Blockly.Block} block the display_table block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['display_table'] = function(block) {
  const table = Blockly.JavaScript.valueToCode(
      block,
      'table',
      Blockly.JavaScript.ORDER_NONE,
  );
    
  const code = `displayTable(${table});\n`;
  return code;
};
    
/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['play_audio'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'URI',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `playAudioFromURI(${uri});\n`;
  return code;
};
    
/**
 * Generates JavaScript code for the play_audio block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['text_to_speech'] = function(block) {
  const text = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `textToSpeech(${text});\n`;

  return code;
};

/**
 * Outputs speech command from microphone as a string.
 * @param {Blockly.Block} block the web_speech block.
 * @returns {String} the speech command.
 */
Blockly.JavaScript['web_speech'] = function(block) {
  const code = `webSpeech('${block.id}')`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

/*******************
 * Property blocks.*
 *******************/

/**
 * Generates JavaScript code for the get_signal_strength block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['get_signal_strength_wb'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_ATOMIC,
  );
  const code = `getRSSIWb(${thing})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};
