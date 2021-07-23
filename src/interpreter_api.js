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
      'eventChecker',
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
}
