/**
 * @fileoverview Extends the default Blockly JavaScript generator.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPLv3
 */
'use strict';

/**
 * Prepend the generated code with variable definitions and event handlers
 * @param {string} code Generated code
 * @return {string} Completed code.
 */
Blockly.JavaScript.finish = function(code) {
  // Convert the definitions dictionary into a list.
  const definitions = Blockly.utils.object.values(Blockly.JavaScript.definitions_);
  // Call Blockly.Generator's finish.
  code = Object.getPrototypeOf(Blockly.JavaScript).finish.call(Blockly.JavaScript, code);
  Blockly.JavaScript.isInitialized = false;

  if (!Blockly.JavaScript.nameDB_) {
    Blockly.JavaScript.nameDB_ = new Blockly.Names(Blockly.JavaScript.RESERVED_WORDS_);
  } else {
    Blockly.JavaScript.nameDB_.reset();
  }
  return definitions.join('\n\n') + '\n\n\n' + code;
};
