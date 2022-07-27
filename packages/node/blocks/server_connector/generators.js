/**
 * @fileoverview Javascript generators for server conncector.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript} from './../../../core/dist/blast_blockly_interface.js';
import express from 'express';
// eslint-disable-next-line node/no-unpublished-import

// Add express lib to the global scope
globalThis['express'] = express;

/**
 * Generates JavaScript code for the server_add_connector block.
 * @param {Blockly.Block} block the server_add_connector block.
 * @returns {String} the generated code.
 */
JavaScript['server_add_connector'] = function (block) {
  const value_port = Blockly.JavaScript.valueToCode(
    block,
    'port',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const statements_list = JavaScript.statementToCode(block, 'list');
  // addServer; statements_list -> addRoutes; startServer
  const code = `const app = addServerConnector();\n ${statements_list} startServer(${value_port}, app);`;
  return code;
};

/**
 * Creates an express API and adds 'app' object to interpreter
 */
globalThis['addServerConnector'] = function () {
  const app = express();

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  return app;
};

/**
 * start to listen on port
 * @param {Number} port Port to listen on.
 * @param {Object} app app object of express.js.
 */
globalThis['startServer'] = function (port, app) {
  app.listen(port);
  console.log(`Server is up on port ${port}`);
};

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
 * @param {Object} app app object of express.js.
 */
globalThis['addRoute'] = function (route, operation, statements, app) {
  if (operation === 'get') {
    app.get(route, (req, res) => {
      eval(statements);
    });
  }
  if (operation === 'put') {
    app.put(route, (req, res) => {
      eval(statements);
    });
  }
  if (operation === 'post') {
    app.post(route, (req, res) => {
      eval(statements);
    });
  }
  if (operation === 'delete') {
    app.delete(route, (req, res) => {
      eval(statements);
    });
  }
};

/**
 * Generates JavaScript code for the server_response block.
 * @param {Blockly.Block} block the server_response block.
 * @returns {String} the generated code.
 */
JavaScript['server_response'] = function (block) {
  const value_response = JavaScript.valueToCode(
    block,
    'response',
    JavaScript.ORDER_ATOMIC
  );
  const code = `sendResponse(${value_response}, res);\n`;
  return code;
};

/**
 * sends a response
 * @param {String} value Value to send.
 * @param {Object} res Response object.
 */
globalThis['sendResponse'] = function (value, res) {
  res.send(value);
};

// eslint-disable-next-line no-unused-vars
JavaScript['server_get_body'] = function (block) {
  const code = 'getBody(req)';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, JavaScript.ORDER_NONE];
};

/**
 * returns the body of a request
 * @param {Object} req request object of express.js.
 */
globalThis['getBody'] = function (req) {
  return req.body;
};
