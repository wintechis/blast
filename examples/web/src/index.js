/**
 * @fileoverview Core JavaScript library for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import Blockly from 'blockly';
import {apiFunctions} from '../../../src/blast_interpreter.js';
import {currentToolbox} from '../../../src/blast_toolbox.js';
import {downloadScreenshot} from './screenshot.js';
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

// import additional block definitions for web example
import './blocks.js';
import './generators.js';

/**
 * Initialize Blast. Called on page load.
 * @public
 */
const init = function() {
  const workspace = Blockly.inject('content_workspace',
      {
        comments: true,
        collapse: true,
        disable: true,
        grid:
        {
          spacing: 25,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        horizontalLayout: false,
        maxBlocks: Infinity,
        maxInstances: {'test_basic_limit_instances': 3},
        maxTrashcanContents: 256,
        media: 'media/',
        toolbox: currentToolbox,
        toolboxPosition: 'start',
        renderer: 'geras',
        zoom:
        {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 4,
          minScale: 0.25,
          scaleSpeed: 1.1,
        },
      },
  );
  workspace.configureContextMenu = configureContextMenu;

  /**
    * Adds 'download screenshot' and 'add comment' to the context menu.
    * @param {!ContextMenuRegistry.ContextMenuOption} menuOptions the context menu options.
    * @param {!Event} e The right-click mouse event.
    */
  function configureContextMenu(menuOptions, e) {
    const screenshotOption = {
      text: 'Download Screenshot',
      enabled: workspace.getTopBlocks().length,
      callback: function() {
        downloadScreenshot(workspace);
      },
    };
    menuOptions.push(screenshotOption);

    // // Adds a default-sized workspace comment to the workspace.
    // menuOptions.push(Blockly.ContextMenu.workspaceCommentOption(workspace, e));
  }

  initInterpreter(workspace);
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
