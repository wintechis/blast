/**
 * @fileoverview CLI example for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import {Workspace, Xml} from './../core/dist/blast_blockly_interface.js';
import {
  initInterpreter,
  getLatestCode,
  runJS,
  getStdInfo,
} from '../core/dist/blast_interpreter.js';

// import block blast files to include them in bundled code.
import '../core/dist/blocks/all.js';
import '../core/dist/generators/all.js';

// import server specific block files
import './blocks/all.js';

import * as fs from 'fs';

/**
 * Initialize Blast, generate and execute code.
 * @public
 */
const init = function () {
  const stdInfo = getStdInfo();

  // Check number of provided arguments
  if (process.argv.length !== 3) {
    throw new Error(
      'Invalid number of arguments passed.\n The call must be in the form: <node> <index.js> <path-to-file>'
    );
  }

  // Path is third passed argument
  const path = process.argv[2];

  // Check file type, only .xml is supported
  const path_arr = path.split('.');
  const file_type = path_arr[path_arr.length - 1];
  if (file_type !== 'xml') {
    throw new Error("Passed file is not supported. File must end in '.xml'.");
  }

  // Create Environment
  const workspace = new Workspace();
  const xmlString = readXML(path);
  const xml = Xml.textToDom(xmlString);
  Xml.domToWorkspace(xml, workspace);
  initInterpreter(workspace);

  // Display generated code
  stdInfo('Generated Code:');
  stdInfo('===================================');
  stdInfo(getLatestCode());
  stdInfo('===================================');

  // Run generated code
  runJS();
};

/**
 * Function to read XML file.
 * @param {string} path The path to the XML file to load.
 * @returns {string} The XML string.
 */
function readXML(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data;
  } catch (err) {
    console.log(err);
  }
}

init();
