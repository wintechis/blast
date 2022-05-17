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
  getInterpreter,
  interruptRunner,
  throwError,
} from './../../blast_interpreter.js';

/**
 * Generates JavaScript code for the add_server block.
 * @param {Blockly.Block} block the add_server block.
 * @returns {String} the generated code.
 */
// eslint-disable-next-line no-unused-vars
JavaScript['add_server_block'] = function (block) {
  const code = `addServerConnector();\n`;
  return code;
};

/**
 * Creates a express API
 * @param {String} route Route to add to express API.
 * @param {String} operation HTTP operation type of added route [get, put, post].
 * @param {String} statements Code to execute when route is activated.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const addServerConnector = function () {
  const app = express();

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());

  // Add App to interpreter
  const scope = getInterpreter().getGlobalScope();
  getInterpreter().setProperty(scope.object, 'app', app);
};
apiFunctions.push(['addServerConnector', addServerConnector]);

/**
 * Generates JavaScript code for the start_server block.
 * @param {Blockly.Block} block the add_server block.
 * @returns {String} the generated code.
 */
JavaScript['start_server'] = function (block) {
  const value_port = JavaScript.valueToCode(
    block,
    'port',
    JavaScript.ORDER_ATOMIC
  );
  const code = `startServer(${value_port}, app);\n`;
  return code;
};

/**
 * starts to listen on port
 * @param {Number} port Port to listen on.
 * @param {Object} app app object of express.js.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
// eslint-disable-next-line no-unused-vars
const startServer = async function (port, app, callback) {
  app.listen(port);
  console.log('Server is up');
};
// Add addRoute function to the interpreter's API.
asyncApiFunctions.push(['startServer', startServer]);

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
  const dropdown_operation = JavaScript.quote_(
    block.getFieldValue('operation')
  );
  const statements_list = JavaScript.quote_(
    JavaScript.statementToCode(block, 'list')
  );

  const code = `addRoute(${value_route}, ${dropdown_operation}, ${statements_list}, app);\n`;
  return code;
};

/**
 * adds a route to the express API
 * @param {String} route New route for the express API.
 * @param {String} operation HTTP operation type of added route [get, put, post].
 * @param {String} statements Code to execute when route is activated.
 */
const addRoute = function (route, operation, statements, app) {
  if (operation === 'get') {
    app.get(route, (req, res) => {
      execute_code(req, res, statements);
    });
  }
};
// Add addRoute function to the interpreter's API.
apiFunctions.push(['addRoute', addRoute]);

/**
 * Generates JavaScript code for the response block.
 * @param {Blockly.Block} block the response block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['response_block'] = function (block) {
  const value_response = JavaScript.valueToCode(
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
function execute_code(req, res, statements) {
  // interrupt BLAST execution
  interruptRunner();

  const interpreter = new Interpreter('');
  // add req and res to the interpreter's global scope
  const scope = getInterpreter().getGlobalScope();
  interpreter.setProperty(scope.object, 'res', res);
  interpreter.setProperty(scope.object, 'req', req);
  interpreter.getStateStack()[0].scope = scope;
  interpreter.appendCode(statements);

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
