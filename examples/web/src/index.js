/**
 * @fileoverview Core JavaScript library for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import {apiFunctions} from '../../../src/blast_interpreter.js';
import {eventsFlyoutCategory} from '../../../src/blast_states.js';
import {initInterpreter} from '../../../src/blast_interpreter.js';
import {initStatesInterpreter} from '../../../src/blast_states_interpreter.js';
import {initUi} from './web.js';
import {link} from '../../../src/blast_storage.js';
import {load} from '../../../src/blast_storage.js';
import {bindClick} from './web.js';
import {thingsFlyoutCategory} from '../../../src/blast_things.js';
import {getStdInfo} from '../../../src/blast_interpreter.js';
import {getWorkspace} from '../../../src/blast_interpreter.js';

// import block blast files to include them in bundled code.
import '../../../src/blocks/all.js';
import '../../../src/generators/all.js';
import '../../../src/things/all.js';

/**
 * Initialize Blast. Called on page load.
 * @public
 */
const init = function() {
  // mobile website has its own init
  if (window.location.href.includes('mobile')) {
    return;
  }

  initInterpreter();
  const workspace = getWorkspace();
  initStatesInterpreter(workspace);

  // Initialize UI
  initUi(workspace);

  // Bind load and save buttons
  bindClick('UriLoadButton', load);
  bindClick('UriSaveButton', link);
  // load blocks from URI on Enter
  const uriInput = document.getElementById('loadWorkspace-input');
  uriInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      load();
    }
  });

  // register things category flyout callback
  workspace.registerToolboxCategoryCallback('THINGS', thingsFlyoutCategory);
  // register event category flyout callback
  workspace.registerToolboxCategoryCallback('STATES', eventsFlyoutCategory);

  // Display output hint
  const stdInfo = getStdInfo();
  stdInfo('Actionblock output will be displayed here');
};

/**
 * Highlight a block with id id.
 * @param {!Blockly.Block.id} id identifier of the block to be highlighted.
 * @public
 */
const highlightBlock = function(id) {
  const workspace = getWorkspace();
  workspace.highlightBlock(id);
};
// Add highlightBlock function to interpreter api
apiFunctions.push(['highlightBlock', highlightBlock]);

// initialize blast when page dom is loaded
window.addEventListener('load', init);
