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
    return Blast.BlockMethods.waitForSecondsfunction(timeInSeconds, callback);
  };
  interpreter.setProperty(
      globalObject,
      'waitForSeconds',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for highlighting blocks.
  wrapper = function(cat) {
    return playRandomSoundFromCategory(cat);
  };
  interpreter.setProperty(
      globalObject,
      'playRandomSoundFromCategory',
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
}
