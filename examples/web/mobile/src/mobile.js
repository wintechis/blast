'use strict';

import {apiFunctions, generateCode, getStdInfo, getWorkspace, initInterpreter, setWorkspace, statusValues, throwError} from '../../../../src/blast_interpreter.js';
import {initStatesInterpreter} from '../../../../src/blast_states_interpreter.js';
import {load, loadXML} from '../../../../src/blast_storage.js';
import {setFileSelector, setMessageOutputContainer, setRunButton, setStatus, setStatusContainer} from '../../src/web.js';

// import block blast files to include them in bundled code.
import '../../../../src/blocks/all.js';
import '../../../../src/generators/all.js';
import '../../../../src/things/all.js';

// Add service worker to the page
window.addEventListener('load', function() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('../sw.js', {scope: '../'});
  }
});

const getBBox_ = function(element) {
  const height = element.offsetHeight;
  const width = element.offsetWidth;
  let x = 0;
  let y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y,
  };
};
      
export const init = function() {
  // request NOTIFICATION permission
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  const runButton = document.getElementById('runButton');
  setRunButton(runButton);
  const messageOutputContainer = document.getElementById('msgOutputContainer');
  setMessageOutputContainer(messageOutputContainer);
  const statusContainer = document.getElementById('statusContainer');
  setStatusContainer(statusContainer);
  const fileSelector = document.getElementById('file-selector');
  setFileSelector(fileSelector);

  const input = document.querySelector('#load-content .mdc-text-field__input');
  const fileInput = document.querySelector('#loadWorkspace-file');
  // early return if both inputs are empty
  if (input.value === '' && fileInput.value === '') {
    return;
  }

  // adjust workspace and toolbox on resize
  const container = document.getElementById('content_workspace');
  const onresize = function() {
    const bBox = getBBox_(container);
    container.style.top = bBox.y + 'px';
    container.style.left = bBox.x + 'px';
    // Height and width need to be set, read back, then set again to
    // compensate for scrollbars.
    container.style.height = bBox.height + 'px';
    container.style.height = 2 * bBox.height - container.offsetHeight + 'px';
    container.style.width = bBox.width + 'px';
    container.style.width = 2 * bBox.width - container.offsetWidth + 'px';
  };
  window.addEventListener('resize', onresize, false);

  const workspace = Blockly.inject('content_workspace', {
    // grid: {spacing: 25, length: 3, colour: '#ccc', snap: true},
    media: 'media/',
    readOnly: true,
  });

  // Load the interpreter now, and upon future changes.
  generateCode();
  workspace.addChangeListener(function(event) {
    if (!(event instanceof Blockly.Events.Ui)) {
    // Something changed. Parser needs to be reloaded.
      generateCode();
    }
  });

  setWorkspace(workspace);

  onresize();
  Blockly.svgResize(workspace);

  initStatesInterpreter(workspace);

  setStatus(statusValues.READY);

  // Display output hint
  const stdInfo = getStdInfo();
  stdInfo('Actionblock output will be displayed here');

  // load the workspace
  if (input.value.length > 0) {
    load();
  } else if (fileInput.files.length > 0) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      loadXML(e.target.result);
    };
    fileReader.onerror = function(evt) {
      reject(throwError('Error reading file.'));
    };
    fileReader.readAsText(fileInput.files[0]);
  }

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
};
// execute init after page load
window.addEventListener('load', init);
