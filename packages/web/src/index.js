/**
 * @fileview Core JavaScript library for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

import {inject, workspaceCommentOption} from '../../core/dist//blast_blockly_interface.js';
import {currentToolbox} from '../../core/dist/blast_toolbox.js';
import {downloadScreenshot} from './screenshot.js';
import {statesFlyoutCategory} from '../../core/dist/blast_states.js';
import {initInterpreter} from '../../core/dist/blast_interpreter.js';
import {initUi} from './web.js';
import {link} from '../../core/dist/blast_storage.js';
import {load} from '../../core/dist/blast_storage.js';
import {bindClick} from './web.js';
import {thingsFlyoutCategory} from '../../core/dist/blast_things.js';
import {getStdInfo} from '../../core/dist/blast_interpreter.js';

// import block blast files to include them in bundled code.
import '../../core/dist/blocks/all.js';
import '../../core/dist/generators/all.js';
import '../../core/dist/thingBlocks/all.js';

import '../../core/dist/drivers/all.js';

// import additional block definitions for web example
import './blocks.js';
import './generators.js';

/**
 * Initialize Blast. Called on page load.
 * @public
 */
const init = function () {
  const workspace = inject('content_workspace', {
    comments: true,
    collapse: true,
    disable: true,
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
    horizontalLayout: false,
    maxBlocks: Infinity,
    maxInstances: {test_basic_limit_instances: 3},
    maxTrashcanContents: 256,
    media: 'media/',
    toolbox: currentToolbox,
    toolboxPosition: 'start',
    renderer: 'geras',
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 4,
      minScale: 0.25,
      scaleSpeed: 1.1,
    },
  });
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
      callback: function () {
        downloadScreenshot(workspace);
      },
    };
    menuOptions.push(screenshotOption);

    // // Adds a default-sized workspace comment to the workspace.
    menuOptions.push(workspaceCommentOption(workspace, e));
  }

  initInterpreter(workspace);

  // Initialize UI
  initUi(workspace);

  // Bind load and save buttons
  bindClick('UriLoadButton', load);
  bindClick('UriSaveButton', link);
  // load blocks from URI on Enter
  const uriInput = document.getElementById('loadWorkspace-input');
  uriInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      load();
    }
  });

  // register things category flyout callback
  workspace.registerToolboxCategoryCallback('THINGS', thingsFlyoutCategory);
  // register event category flyout callback
  workspace.registerToolboxCategoryCallback('STATES', statesFlyoutCategory);

  // Display output hint
  const stdInfo = getStdInfo();
  stdInfo('Actionblock output will be displayed here');
};

// initialize blast when page dom is loaded
window.addEventListener('load', init);
