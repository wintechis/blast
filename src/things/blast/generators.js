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
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;
  const method = block.getFieldValue('METHOD');
  const headers = Blockly.JavaScript.valueToCode(
      block,
      'header',
      Blockly.JavaScript.ORDER_NONE,
  );
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

  console.log(headersString);
  const headersJSON = JSON.parse(headersString);
  console.log(headersJSON);
  const requestOptions = {
    method: method,
    headers: new Headers(headersJSON),
  };

  if (body) {
    console.log(body);
    requestOptions.body = body;
  }

  try {
    const res = await fetch(uri, requestOptions);

    if (!res.ok) {
      Blast.throwError(`Failed to get ${uri}, Error: ${res.status} ${res.statusText}`);
      return;
    }

    if (output == 'status') {
      callback(res.status);
    }

    const response = await res.text();
    callback(response);
  } catch (error) {
    Blast.throwError(`Failed to get ${uri}, Error: ${error.message}`);
  }
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
  const format = Blockly.JavaScript.quote_(block.getFieldValue('format')) || '';
    
  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');
    
  const code = `urdfQueryWrapper(${uri}, ${format}, '${query}')`;
    
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the sparql_ask block.
 * @param {Blockly.Block} block the sparql_ask block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['sparql_ask'] = function(block) {
  let query = block.getFieldValue('query');
  const format = Blockly.JavaScript.quote_(block.getFieldValue('format')) || '';
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'uri',
      Blockly.JavaScript.ORDER_NONE,
  );
    
  // escape " quotes and replace linebreaks (\n) with \ in query
  query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');
    
  const code = `urdfQueryWrapper(${uri}, ${format}, '${query}')`;
    
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Wrapper for urdf's query function.
 * @param {String} uri URI to query.
 * @param {String} format format of the resource to query
 * @param {String} query Query to execute.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
const urdfQueryWrapper = async function(uri, format, query, callback) {
  let res;
  
  try {
    res = await fetch(uri);
      
    if (!res.ok) {
      Blast.throwError(`Failed to get ${uri}, Error: ${res.status} ${res.statusText}`);
      return;
    }

    const response = await res.text();

    urdf.clear();
    const opts = {format: format};
    await urdf.load(response, opts);
    res = await urdf.query(query);
  } catch (error) {
    Blast.throwError(`Failed to get ${uri}, Error: ${error.message}`);
  }

  // if result is a boolean, return it.
  if (typeof res === 'boolean') {
    callback(res);
    return;
  }

  // Convert result from array of objects to array of arrays.
  const resultArray = new Array(res.length);
  for (const obj of res) {
    const resultArrayRow = new Array(Object.keys(obj).length);
    for (const value of Object.values(obj)) {
      resultArrayRow.push(value.value);
    }
    resultArray.push(resultArrayRow);
  }

  const interpreterObj = Blast.Interpreter.nativeToPseudo(resultArray);

  callback(interpreterObj);
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
 * Generates an HTML Table from a sparql query result (array of arrays).
 * and add it to {@link Blast.Ui.messageOutputContainer}.
 * @param {graph} arr graph to output.
 * @public
 */
const displayTable = function(arr) {
  arr = Blast.Interpreter.pseudoToNative(arr);
  // display message if table is empty
  if (arr.length == 0) {
    Blast.Ui.addMessage('empty table');
    return;
  }
  
  // create table
  const table = document.createElement('table');
  table.classList.add('output_table');

  // insert rows
  for (const row of arr) {
    const tr = document.createElement('tr');
    if (row === undefined) {
      continue;
    }
    for (const value of row) {
      if (value === undefined) {
        continue;
      }
      const td = document.createElement('td');
      td.innerHTML = value;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

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

/**
 * Generates JavaScript code for the capture_image block.
 * @param {Blockly.Block} block the play_audio block.
 * @returns {String} the generated code.
 */
// eslint-disable-next-line no-unused-vars
Blockly.JavaScript['capture_image'] = function(block) {
  const code = 'captureImage()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Captures a snapshot from camera and returns it as a base64 encoded string.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const captureImage = async function(callback) {
  // Create video element.
  const videoElem = document.createElement('video');
  videoElem.id = 'video';
  videoElem.setAttribute('autoplay', 'autoplay');
  videoElem.setAttribute('muted', true);
  videoElem.style.display = 'none';
  document.body.appendChild(videoElem);
  // Request access to the camera.
  const constraints = {
    video: true,
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElem.srcObject = stream;
  // draw stream to canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  // wait for video to load
  await new Promise((resolve, reject) => {
    videoElem.onloadedmetadata = () => {
      canvas.width = videoElem.videoWidth;
      canvas.height = videoElem.videoHeight;
      context.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    video.onerror = ((error) => {
      Blast.throwError('Error trying to capture image from camera. See console for details');
      console.error(error);
      reject(error);
    });
  });
  const data = canvas.toDataURL('image/png');

  // remove canvas and video element
  videoElem.srcObject.getTracks().forEach((track) => track.stop());
  videoElem.remove();
  canvas.remove();

  callback(data);
};

// add capture_image method to the interpreter's API.
Blast.asyncApiFunctions.push(['captureImage', captureImage]);

/**
 * Generates JavaScript code for the capture_image block.
 * @param {Blockly.Block} block the display_image block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['display_image'] = function(block) {
  const image = Blockly.JavaScript.valueToCode(
      block,
      'image',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `displayImage(${image});\n`;
  return code;
};

/**
 * Adds an image to {@link Blast.Ui.messageOutputContainer}.
 * @param {string} image base64 encoded image.
 */
const displayImage = function(image) {
  const img = document.createElement('img');
  img.src = image;
  img.classList.add('output_image');
  Blast.Ui.addElementToOutputContainer(img);
};

// Add displayImage method to the interpreter's API.
Blast.apiFunctions.push(['displayImage', displayImage]);

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
    // Stop watching advertisements
    abortController.abort();
    // Advertisement data can be read from |evt|.
    callback(evt.rssi);
  });

  await device.watchAdvertisements({signal: abortController.signal});
};
// add getRSSIWb method to the interpreter's API.
Blast.asyncApiFunctions.push(['getRSSIWb', getRSSIWb]);

/**
 * Generates JavaScript code for the write_eddystone_property block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['write_eddystone_property'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE) || null;
  const property = Blockly.JavaScript.quote_(block.getFieldValue('Property'));
  const slot = Blockly.JavaScript.valueToCode(
      block,
      'Slot',
      Blockly.JavaScript.ORDER_NONE) || null;
  const value = Blockly.JavaScript.valueToCode(
      block,
      'Value',
      Blockly.JavaScript.ORDER_NONE) || null;
  const frameType = Blockly.JavaScript.quote_(block.getFieldValue('FrameType'));
  
  const code = `writeEddystoneProperty(${thing}, ${slot}, ${property}, ${frameType}, ${value});\n`;
  return code;
};

const eddystoneServiceUUID = 'a3c87500-8ed3-4bdf-8a39-a01bebede295';
Blast.Bluetooth.optionalServices.push(eddystoneServiceUUID);

/**
 * Writes an Eddystone property to a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to write to.
 * @param {String} property The property to write.
 * @param {String} frameType The eddystone frame type to write.
 * @param {String} value The value to write.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const writeEddystoneProperty = async function(
    webBluetoothId, slot, property, frameType, value, callback) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    Blast.throwError('No bluetooth device set.');
    callback();
    return;
  }

  // make sure a slot is set
  if (slot === null || slot === undefined) {
    Blast.throwError('No slot set.');
    callback();
    return;
  }

  // make sure a property is set
  if (!property) {
    Blast.throwError('No property set.');
    callback();
    return;
  }
  
  // Set the active slot.
  await Blast.Bluetooth.Eddystone.setActiveSlot(webBluetoothId, slot);

  // write the property
  switch (property) {
    case 'advertisedTxPower':
      await Blast.Bluetooth.Eddystone.setAdvertisedTxPower(webBluetoothId, value);
      break;
    case 'advertisementData':
      await Blast.Bluetooth.Eddystone.setAdvertisingData(webBluetoothId, frameType, value);
      break;
    case 'advertisingInterval':
      await Blast.Bluetooth.Eddystone.setAdvertisingInterval(webBluetoothId, value);
      break;
    case 'radioTxPower':
      await Blast.Bluetooth.Eddystone.setTxPowerLevel(webBluetoothId, value);
      break;
  }
  callback();
};

// add writeEddystoneProperty method to the interpreter's API.
Blast.asyncApiFunctions.push(['writeEddystoneProperty', writeEddystoneProperty]);

/**
 * Generates JavaScript code for the read_eddystone_property block.
 * @param {Blockly.Block} block the get_signal_strength block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['read_eddystone_property'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE) || null;
  const property = Blockly.JavaScript.quote_(block.getFieldValue('Property'));
  const slot = Blockly.JavaScript.valueToCode(
      block,
      'Slot',
      Blockly.JavaScript.ORDER_NONE) || null;
  const code = `readEddystoneProperty(${thing}, ${slot}, ${property})`;

  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Reads an Eddystone property from a bluetooth device.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {number} slot The slot to read from.
 * @param {String} property The property to read.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const readEddystoneProperty = async function(webBluetoothId, slot, property, callback) {
  // make sure a device block is connected
  if (!webBluetoothId) {
    Blast.throwError('No bluetooth device set.');
    callback();
    return;
  }

  // make sure a slot is set
  if (slot === null || slot === undefined) {
    Blast.throwError('No slot set.');
    callback();
    return;
  }

  // make sure a property is set
  if (!property) {
    Blast.throwError('No property set.');
    callback();
    return;
  }

  // Set the active slot.
  await Blast.Bluetooth.Eddystone.setActiveSlot(webBluetoothId, slot);

  // read the property
  let value = null;
  switch (property) {
    case 'advertisedTxPower':
      value = await Blast.Bluetooth.Eddystone.getAdvertisedTxPower(webBluetoothId);
      break;
    case 'advertisementData':
      value = await Blast.Bluetooth.Eddystone.getAdvertisingData(webBluetoothId);
      break;
    case 'advertisingInterval':
      value = await Blast.Bluetooth.Eddystone.getAdvertisingInterval(webBluetoothId);
      break;
    case 'lockState':
      value = await Blast.Bluetooth.Eddystone.getLockState(webBluetoothId);
      break;
    case 'publicECDHKey':
      value = await Blast.Bluetooth.Eddystone.getPublicECDHKey(webBluetoothId);
      break;
    case 'radioTxPower':
      value = await Blast.Bluetooth.Eddystone.getTxPowerLevel(webBluetoothId);
      break;
  }
  callback(value);
};

// Add readEddystoneProperty method to the interpreter's API.
Blast.asyncApiFunctions.push(['readEddystoneProperty', readEddystoneProperty]);
