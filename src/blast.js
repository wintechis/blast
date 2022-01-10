/**
 * @fileoverview Core JavaScript library for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
 * Top level namespace used to access the Blast library.
 * @name Blast
 * @namespace
 */
goog.module('Blast');
goog.module.declareLegacyNamespace();

const {apiFunctions} = goog.require('Blast.Interpreter');
const {flyoutCategory: eventsFlyoutCategory} = goog.require('Blast.States');
const {initInterpreter} = goog.require('Blast.Interpreter');
const {initStatesInterpreter} = goog.require('Blast.States.Interpreter');
const {initUi} = goog.require('Blast.Ui');
const {link} = goog.require('Blast.Storage');
const {load} = goog.require('Blast.Storage');
const {bindClick} = goog.require('Blast.Ui');
const {flyoutCategory: thingsFlyoutCategory} = goog.require('Blast.Things');
const {getStdInfo} = goog.require('Blast.Interpreter');
const {getWorkspace} = goog.require('Blast.Interpreter');

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
