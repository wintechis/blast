/**
 * @fileoverview defines an API for the JS Interpreter (https://github.com/NeilFraser/JS-Interpreter)
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * defines an API for the JS Interpreter.
 * @param {!Interpreter} interpreter interpreter object.
 * @param {!Interpreter.Object} globalObject global scope object.
 */
function initApi(interpreter, globalObject) {
  // Ensure function names do not conflict with letiable names.
  Blockly.JavaScript.addReservedWords(
      'highlightBlock',
      'displayText',
      'displayTable',
      'sendHttpRequest',
      'queryReceiver',
      'getTableCell',
  );

  // API function for highlighting blocks.
  let wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(Blast.highlightBlock(id));
  };
  interpreter.setProperty(
      globalObject,
      'highlightBlock',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the display_text block.
  wrapper = function(text) {
    return Blast.BlockMethods.displayText(text);
  };
  interpreter.setProperty(
      globalObject,
      'displayText',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the display_table block.
  wrapper = function(text) {
    return Blast.BlockMethods.displayTable(text);
  };
  interpreter.setProperty(
      globalObject,
      'displayTable',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the http_request block.
  wrapper = function(uri, method, headersString, body, output, callback) {
    return Blast.BlockMethods.sendHttpRequest(
        uri,
        method,
        headersString,
        body,
        output,
        callback,
    );
  };
  interpreter.setProperty(
      globalObject,
      'sendHttpRequest',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for urdf querying.
  wrapper = function(uri, query, callback) {
    return Blast.BlockMethods.urdfQueryWrapper(uri, query, callback);
  };
  interpreter.setProperty(
      globalObject,
      'urdfQueryWrapper',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the switch_lights block.
  wrapper = function(mac, r, y, g, callback) {
    return Blast.BlockMethods.switchLights(mac, r, y, g, callback);
  };

  interpreter.setProperty(
      globalObject,
      'switchLights',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for waitSeconds block.
  wrapper = function(timeInSeconds, callback) {
    return Blast.BlockMethods.waitForSeconds(timeInSeconds, callback);
  };
  interpreter.setProperty(
      globalObject,
      'waitForSeconds',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for playSound block.
  wrapper = function(uri) {
    return Blast.BlockMethods.playAudioFromURI(uri);
  };
  interpreter.setProperty(
      globalObject,
      'playAudioFromURI',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the ibeacon-data block.
  wrapper = function(address, key, value, retValue, callback) {
    return Blast.BlockMethods.getTableCell(
        address,
        key,
        value,
        retValue,
        callback,
    );
  };

  interpreter.setProperty(
      globalObject,
      'getTableCell',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the event blocks.
  wrapper = function(measurement, negate, operator, value, blockId) {
    return Blast.BlockMethods.eventChecker(
        measurement,
        negate,
        operator,
        value,
        blockId,
    );
  };
  interpreter.setProperty(
      globalObject,
      'eventChecker',
      interpreter.createNativeFunction(wrapper),
  );

  // Temporary dw blocks for demonstration on 22.1.2021
  // API function for the readDw block.
  wrapper = function(mac, callback) {
    const url = `http://192.168.178.22:8000/devices/${mac}/gatt/instruction`;
    let headers = 'Content-Type: application/json';
    const body = {handle: '001f', type: 'ble:Read'};

    headers = headers.split(':');

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader(headers[0].trim(), headers[1].trim());

    xhr.addEventListener('load', (e) => {
      console.log(JSON.parse(xhr.response));
      callback(JSON.parse(xhr.response).result.utf8);
    });

    if (body) {
      console.log(JSON.stringify(body));
      return xhr.send(JSON.stringify(body));
    } else {
      return xhr.send();
    }
  };
  interpreter.setProperty(
      globalObject,
      'getDwValuesOfMac',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the readDw block.
  wrapper = function(mac, value, callback) {
    const url = `http://192.168.178.22:8000/devices/${mac}/gatt/instruction`;
    let headers = 'Content-Type: application/json';
    const body = {
      handle: '001f',
      type: 'ble:Write',
      data: {'@type': 'xsd:string', '@value': value},
    };

    headers = headers.split(':');

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader(headers[0].trim(), headers[1].trim());

    xhr.addEventListener('load', (e) => {
      callback(xhr.status);
    });

    if (body) {
      console.log(JSON.stringify(body));
      return xhr.send(JSON.stringify(body));
    } else {
      return xhr.send();
    }
  };
  interpreter.setProperty(
      globalObject,
      'setDwValuesOfMac',
      interpreter.createAsyncFunction(wrapper),
  );
}
