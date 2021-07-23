/**
 * @fileoverview JavaScript generators for the miroBot blocks
 * (https://www.wlkata.com/products/wlkata-mirobot-introduction).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * Generates JavaScript code for the mirobot_pickup block.
 * @param {Blockly.Block} block the mirobot_pickup block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['mirobot_pickup'] = function(block) {
  const box = Blockly.JavaScript.quote_(
      block.getFieldValue('box').toLowerCase(),
  );
    
  const code = `mirobotPickUpBox(${box});\n`;
  return code;
};

/**
 * Invokes a pick up action on the Mirobot
 * @param {String} box the box to pick up.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const mirobotPickUp = async function(box, callback) {
  const uri = 'https://bot.rapidthings.eu/thing/action/grab_' + box.toLowerCase();
  const headers = {'Content-Type': 'application/json', 'Accept': 'application/json'};
  const requestOptions = {
    method: 'POST',
    headers: new Headers(headers),
  };

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        callback(res.status);
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};
// add pick-up function to the interpreter's API.
Blast.asyncApiFunctions.push(['mirobot_pickup', mirobotPickUp]);
