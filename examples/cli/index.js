/**
 * @fileoverview CLI example for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import Blockly from 'blockly';
import {initInterpreter} from '../../dist/blast_interpreter.js';
import {initStatesInterpreter} from '../../dist/blast_states_interpreter.js';
import {getStdInfo} from '../../dist/blast_interpreter.js';

// import block blast files to include them in bundled code.
import '../../dist/blocks/all.js';
import '../../dist/generators/all.js';
import '../../dist/thingBlocks/all.js';

/**
 * Initialize Blast. Called on page load.
 * @public
 */
const init = function () {
  const workspace = new Blockly.Workspace();
  initInterpreter(workspace);
  initStatesInterpreter(workspace);

  // Display output hint
  const stdInfo = getStdInfo();
  stdInfo('Actionblock output will be displayed here');
};

init();
