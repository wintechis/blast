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
 * Sends a HTTP request to URI returning the status or the response
 * depending on the output parameter.
 * @param {string} uri URI to request.
 * @param {string} method HTTP request method.
 * @param {string} headersString JSON string containing headers.
 * @param {string=} body JSON string containing body, optional.
 * Not needed when method is GET.
 * @param {string} output Output can be status or response.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {string} the response status code or body, depending on output parameter.
 * @private
 */
const sendHttpRequest = async function(
    uri, method, headersString, body, output, callback) {
  if (uri == null || uri == undefined || uri == '') {
    Blast.throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: method,
    headers: new Headers(headersJSON),
  };

  if (body) {
    requestOptions.body = body;
  }

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then(async(res) => {
        if (output == 'status') {
          callback(res.status);
        }
        const response = await res.text();
        callback(response);
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};
// add sendHTTPRequest method to the interpreter's API.
Blast.asyncApiFunctions.push(['sendHttpRequest', sendHttpRequest]);

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
 * Wrapper for urdf's query function.
 * @param {*} uri URI to query.
 * @param {*} query Query to execute.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const urdfQueryWrapper = async function(uri, query, callback) {
  urdf.clear();

  // write uri into FROM clause of the query as a workaround for
  // https://github.com/vcharpenay/uRDF.js/issues/21#issuecomment-802860330
  const fromClause = `\n FROM <${uri}>\n`;
  query = query.slice(0, query.indexOf('WHERE')) + fromClause + query.slice(query.indexOf('WHERE'));

  urdf.query(query)
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        console.error(error);
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};
// add urdfQueryWrapper method to the interpreter's API.
Blast.asyncApiFunctions.push(['urdfQueryWrapper', urdfQueryWrapper]);

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
 * Add a text message to the {@link Blast.Ui.messageOutputContainer}.
 * @param {string} text text message to output.
 * @public
 */
const displayText = function(text) {
  Blast.Ui.addMessage(text);
};
// Add displayText method to the interpreter's API.
Blast.apiFunctions.push(['displayText', displayText]);
    
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
 * Generates an HTML Table from a sparql query result.
 * and add it to {@link Blast.Ui.messageOutputContainer}.
 * @param {graph} graph graph to output.
 * @public
 */
const displayTable = function(graph) {
  // display message if table is empty
  if (graph.length == 0) {
    Blast.Ui.addMessage('empty table');
    return;
  }
  // deal with missing values
  const vars = graph.reduce((list, res) => {
    for (const v in res) {
      if (list.indexOf(v) === -1) list.push(v);
    }
    return list;
  }, []);
  // Element for new table
  let html = '<tr>';
  vars.forEach((v) => (html += '<th>' + v + '</th>'));
  html += '</tr>';

  graph.forEach((res) => {
    html += '<tr>';
    vars.forEach((v) => (html += '<td>' + (res[v] ? res[v].value : '') + '</td>'));
    html += '</tr>';
  });

  const table = document.createElement('table');
  table.classList.add('output_table');
  table.innerHTML = html;
  // Insert new table
  Blast.Ui.addElementToOutputContainer(table);
};
// Add displayTable method to the interpreter's API.
Blast.apiFunctions.push(['displayTable', displayTable]);
    
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
  const code = `playAudio(${uri});\n`;
  return code;
};

/**
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @returns {Promise} resolves on end of audio playback.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const playAudio = async function(uri, callback) {
  await new Promise((resolve, reject) => {
    const audio = new Audio(uri);
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.onerror = ((error) => {
      Blast.throwError(`Error trying to play audio from \n${uri}\n See console for details`);
      console.error(error);
      reject(error);
    });
    audio.onended = resolve;
  });
  callback();
};
// add playAudio method to the interpreter's API.
Blast.asyncApiFunctions.push(['playAudio', playAudio]);

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
      Blockly.JavaScript.ORDER_NONE);
  const code = `getRSSIWb(${thing})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Get the RSSI of a bluetooth device, using webBluetooth.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const getRSSIWb = async function(webBluetoothId, callback) {
  const devices = await navigator.bluetooth.getDevices();
  let device = null;

  for (const d of devices) {
    if (d.id === webBluetoothId) {
      device = d;
      break;
    }
  }
  if (device == null) {
    Blast.throwError('Error pairing with Bluetooth device.');
  }

  const abortController = new AbortController();

  device.addEventListener('advertisementreceived', async(evt) => {
    console.log(evt.rssi);
    // Stop watching advertisements
    abortController.abort();
    // Advertisement data can be read from |evt|.
    callback(evt.rssi);
  });

  await device.watchAdvertisements({signal: abortController.signal});
};
// add getRSSIWb method to the interpreter's API.
Blast.asyncApiFunctions.push(['getRSSIWb', getRSSIWb]);
