/**
 * @fileoverview Javascript generators for server conncector.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {JavaScript} = Blockly;
//import express from 'express';
import {asyncApiFunctions} from './../../blast_interpreter.js';

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
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const addRoute = async function (route, operation, statements_list, callback) {
  console.log(route, operation, statements_list);
  /*const app = express();
  app.use(express.json());
  app.use(express.urlencoded({extendet: true}));

  app.get('route', (req, res) => {
    res.send('Hello World!');
  });

  app.post('/test', (req, res) => {
    console.log(req.body);
    res.json(req.body);
  });

  app.listen(8000);
  console.log('Server is up'); */

  callback();
};
// Add addRoute function to the interpreter's API.
asyncApiFunctions.push(['addRoute', addRoute]);
