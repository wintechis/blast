/**
 * @fileoverview Javascript generators for server conncector.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
import express from 'express';
import {asyncApiFunctions} from './../../blast_interpreter.js';
import {apiFunctions} from './../../blast_interpreter.js';

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
 * @param {String} statements_list Code to execute when route is activated.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const addRoute = async function (route, operation, statements_list, callback) {
  console.log(route, operation, statements_list);
  const app = express();
  app.use(express.urlencoded({extended: true}));
  app.use(express.json()); // To parse the incoming requests with JSON payloads
  app.get(route, (req, res) => {
    res.send('Hello World!');
  });

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
  var value_response = Blockly.JavaScript.valueToCode(
    block,
    'response',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `sendResponse(${value_response});\n`;
  return code;
};

/**
 * sends a response
 * @param {String} value Value to send.
 */
const sendResponse = function (value) {
  console.log(value);
};
// Add addRoute function to the interpreter's API.
apiFunctions.push(['sendResponse', sendResponse]);
