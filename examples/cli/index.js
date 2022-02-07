/**
 * @fileoverview CLI example for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import Blockly from 'blockly';
import {initInterpreter} from '../../src/blast_interpreter.js';
import {initStatesInterpreter} from '../../src/blast_states_interpreter.js';
import {getStdInfo} from '../../src/blast_interpreter.js';
 
// import block blast files to include them in bundled code.
import '../../src/blocks/all.js';
import '../../src/generators/all.js';
import '../../src/things/all.js';

/**
 * Initialize Blast. Called on page load.
 * @public
 */
const init = function() {
  const workspace = new Blockly.Workspace();
  initInterpreter(workspace);
  initStatesInterpreter(workspace);
  
  // Display output hint
  const stdInfo = getStdInfo();
  stdInfo('Actionblock output will be displayed here');
};

init();
