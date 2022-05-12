/**
 * @fileoverview Javascript generators for server conncector.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import express from 'express';
// eslint-disable-next-line node/no-unpublished-import
import Interpreter from 'js-interpreter';
import {
  apiFunctions,
  asyncApiFunctions,
  continueRunner,
  interruptRunner,
  throwError,
} from './../../blast_interpreter.js';

/**
 * Generates JavaScript code for the server_route block.
 * @param {Blockly.Block} block the server_route block.
 * @returns {String} the generated code.
 */
JavaScript['server_route'] = function (block) {
  const value_route = JavaScript.valueToCode(
    block,
    'route',
    JavaScript.ORDER_ATOMIC
  );
  const dropdown_operation = block.getFieldValue('operation');
  const statements_list = JavaScript.quote_(
    JavaScript.statementToCode(block, 'list')
  );

  const code = `addRoute(${value_route}, ${dropdown_operation}, ${statements_list});\n`;
  return code;
};

/**
 * creates an EXPRESS.js API
 * @param {String} route Route to add to express API.
 * @param {String} operation HTTP operation type of added route [get, put, post].
 * @param {String} statements Code to execute when route is activated.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const addRoute = async function (route, operation, statements, callback) {
  const app = express();

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  if (operation === 'get') {
    app.get(route, (req, res) => {
      execute_code(req, res, statements, callback);
    });
  }

  /*
  app.post('/test', (req, res) => {
    console.log(req.body);
    res.json(req.body);
  });
  */

  app.listen(8000);
  console.log('Server is up');
};
// Add addRoute function to the interpreter's API.
asyncApiFunctions.push(['addRoute', addRoute]);

/**
 * Generates JavaScript code for the response block.
 * @param {Blockly.Block} block the response block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['response_block'] = function (block) {
  const value_response = Blockly.JavaScript.valueToCode(
    block,
    'response',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `sendResponse(${value_response}, res);\n`;
  return code;
};

/**
 * sends a response
 * @param {String} value Value to send.
 * @param {Object} res Response object.
 */
const sendResponse = function (value, res) {
  res.send(value);
};
// Add addRoute function to the interpreter's API.
apiFunctions.push(['sendResponse', sendResponse]);

/**
 * executes code in new interpreter
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {String} statements Code to execute.
 */
// eslint-disable-next-line no-unused-vars
function execute_code(req, res, statements, callback) {
  // interrupt BLAST execution
  interruptRunner();

  const initFunc = function (interpreter, globalObject) {
    // Add functions of {@link apiFunctions} to the new interpreter.
    for (const f of apiFunctions) {
      // Add function to global scope.
      interpreter.setProperty(
        globalObject,
        f[0], // the function name
        interpreter.createNativeFunction(f[1]) // the function
      );
    }

    // Add functions of {@link asyncApiFunctions} to the new interpreter.
    for (const f of asyncApiFunctions) {
      interpreter.setProperty(
        globalObject,
        f[0], // the function name
        interpreter.createAsyncFunction(f[1]) // the function
      );
    }

    // Add req and res object to new interpreter
    interpreter.setProperty(globalObject, 'req', Object(req));
    interpreter.setProperty(globalObject, 'res', Object(res));
  };

  const interpreter = new Interpreter(statements, initFunc);

  const interruptRunner_ = function () {
    try {
      const hasMore = interpreter.step();
      if (hasMore) {
        setTimeout(interruptRunner_, 5);
      } else {
        // Continue BLAST execution.
        continueRunner();
      }
    } catch (error) {
      throwError(`Error executing program:\n ${error}`);
      console.error(error);
    }
  };
  interruptRunner_();
}
