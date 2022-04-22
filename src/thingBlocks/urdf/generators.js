/**
 * @fileoverview Javascript generators for BLAST's properties, actions and events Blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

 'use strict';

 import Blockly from 'blockly';
 import urdf from 'urdf';
 import {
   asyncApiFunctions,
   getInterpreter,
   throwError,
 } from './../../blast_interpreter.js';
 
 const {JavaScript} = Blockly;

 /**
 * Generates JavaScript code for the sparql_query block.
 * @param {Blockly.Block} block the sparql_query block.
 * @returns {String} the generated code.
 */
JavaScript['sparql_query'] = function (block) {
    let query = block.getFieldValue('query');
    const uri = JavaScript.valueToCode(block, 'uri', JavaScript.ORDER_NONE);
    const format = JavaScript.quote_(block.getFieldValue('format')) || '';
  
    // escape " quotes and replace linebreaks (\n) with \ in query
    query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');
  
    const code = `urdfQueryWrapper(${uri}, ${format}, '${query}')`;
  
    return [code, JavaScript.ORDER_NONE];
  };
  
  /**
   * Generates JavaScript code for the sparql_ask block.
   * @param {Blockly.Block} block the sparql_ask block.
   * @returns {String} the generated code.
   */
  JavaScript['sparql_ask'] = function (block) {
    let query = block.getFieldValue('query');
    const format = JavaScript.quote_(block.getFieldValue('format')) || '';
    const uri = JavaScript.valueToCode(block, 'uri', JavaScript.ORDER_NONE);
  
    // escape " quotes and replace linebreaks (\n) with \ in query
    query = query.replace(/"/g, '\\"').replace(/[\n\r]/g, ' ');
  
    const code = `urdfQueryWrapper(${uri}, ${format}, '${query}')`;
  
    return [code, JavaScript.ORDER_NONE];
  };
  
  /**
   * Wrapper for urdf's query function.
   * @param {String} uri URI to query.
   * @param {String} format format of the resource to query
   * @param {String} query Query to execute.
   * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
   * @public
   */
  const urdfQueryWrapper = async function (uri, format, query, callback) {
    let res;
  
    try {
      res = await fetch(uri);
  
      if (!res.ok) {
        throwError(
          `Failed to get ${uri}, Error: ${res.status} ${res.statusText}`
        );
        return;
      }
  
      const response = await res.text();
  
      urdf.clear();
      const opts = {format: format};
      await urdf.load(response, opts);
      res = await urdf.query(query);
    } catch (error) {
      throwError(`Failed to get ${uri}, Error: ${error.message}`);
    }
  
    // if result is a boolean, return it.
    if (typeof res === 'boolean') {
      callback(res);
      return;
    }
  
    // Convert result from array of objects to array of arrays.
    const resultArray = new Array(res.length);
    for (const obj of res) {
      const resultArrayRow = new Array(Object.keys(obj).length);
      for (const value of Object.values(obj)) {
        resultArrayRow.push(value.value);
      }
      resultArray.push(resultArrayRow);
    }
  
    const interpreterObj = getInterpreter().nativeToPseudo(resultArray);
  
    callback(interpreterObj);
  };
  // add urdfQueryWrapper method to the interpreter's API.
  asyncApiFunctions.push(['urdfQueryWrapper', urdfQueryWrapper]);