/**
 * @fileoverview defines an API for the JS Interpreter
 * (https://github.com/NeilFraser/JS-Interpreter)
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
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
      'urdfQueryWrapper',
      'waitForSeconds',
      'addEvent',
      'eventChecker',
      'numberRandom',
  );

  // API function for highlighting blocks.
  let wrapper = function(id) {
    id = id ? id.toString() : '';
    return Blast.highlightBlock(id);
  };
  interpreter.setProperty(
      globalObject,
      'highlightBlock',
      interpreter.createNativeFunction(wrapper),
  );
  
  // API function for setting {@link Blast.Interrupted}.
  wrapper = function(val) {
    Blast.Interrupted = val;
  };
  interpreter.setProperty(
      globalObject,
      'setInterrupt',
      interpreter.createNativeFunction(wrapper),
  );

  // TODO Add all things function to functions array.
  for (const f of Blast.apiFunctions) {
    interpreter.setProperty(
        globalObject,
        f[0], // the function name
        interpreter.createNativeFunction(f[1]), // the function
    );
  }
  
  for (const f of Blast.asyncApiFunctions) {
    interpreter.setProperty(
        globalObject,
        f[0], // the function name
        interpreter.createAsyncFunction(f[1]), // the function
    );
  }

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

  // API function for waitSeconds block.
  wrapper = function(timeInSeconds, callback) {
    return Blast.BlockMethods.waitForSeconds(timeInSeconds, callback);
  };
  interpreter.setProperty(
      globalObject,
      'waitForSeconds',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the event blocks.
  wrapper = function(conditions, statements, blockId) {
    return Blast.BlockMethods.addEvent(conditions, statements, blockId);
  };
  interpreter.setProperty(
      globalObject,
      'addEvent',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the event blocks.
  wrapper = function(blockId, conditions) {
    return Blast.States.eventChecker(blockId, conditions);
  };
  interpreter.setProperty(
      globalObject,
      'eventChecker',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the event blocks.
  wrapper = function() {
    return Blast.States.startEventChecker();
  };
  interpreter.setProperty(
      globalObject,
      'startEventChecker',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the number_random blocks.
  wrapper = function(a, b) {
    return Blast.BlockMethods.numberRandom(a, b);
  };
  interpreter.setProperty(
      globalObject,
      'numberRandom',
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
