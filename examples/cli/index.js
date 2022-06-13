/**
 * @fileoverview CLI example for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import Blockly from 'blockly';
import {
  initInterpreter,
  eventsInWorkspace,
} from '../../dist/blast_interpreter.js';
import {getLatestCode} from '../../dist/blast_interpreter.js';
import {runJS} from '../../dist/blast_interpreter.js';
import {getStdInfo} from '../../dist/blast_interpreter.js';

// import block blast files to include them in bundled code.
import '../../dist/blocks/all.js';
import '../../dist/generators/all.js';
import '../../dist/thingBlocks/all.js';

// import server specific block files
import './blocks/all.js';

import * as fs from 'fs';

/**
 * Initialize Blast, generate and execute code.
 * @public
 */
const init = function () {
  const workspace = new Blockly.Workspace();
  const path = './BLAST_SVR.xml';
  const xmlString = readBlocklyXML(path);
  const xml = Blockly.Xml.textToDom(xmlString);
  Blockly.Xml.domToWorkspace(xml, workspace);

  initInterpreter(workspace);

  // Display output hint
  const stdInfo = getStdInfo();
  stdInfo('Generated Code:\n', getLatestCode());

  // Run code
  runJS();
};

function readBlocklyXML(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data;
  } catch (err) {
    console.log(err);
  }
}

init();
