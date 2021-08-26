/**
 * @fileoverview Core JavaScript library for Blast.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * Top level namespace used to access the Blast library.
 * @name Blast
 * @namespace
 */
goog.provide('Blast');

goog.require('Blast.States');
goog.require('Blast.Ui');
goog.require('Blast.Toolbox');

/**
 * Contains configurable parameters of Blast.
 * @property {string} hostAddress - address of the API host.
 */
Blast.config = {};

/**
 * Blast's main workspace.
 * @type {Blockly.workspaceSvg}
 * @public
 */
Blast.workspace = null;

/**
 * is block highlighting paused.
 * @type {boolean}
 * @public
 */
Blast.highlightPause = false;

/**
 * Array of tuples, containg names and functions defined in the things folder,
 * in order to add them to the interpreter API in {@link initAPI}.
 * @type {[string, function][]}
 * @public
 */
Blast.apiFunctions = [];

/**
 * Array of tuples, containg names and asynchronous functions defined in the
 * things folder, in order to add them to the interpreter API in {@link initAPI}.
 * @type {[string, function][]}
 * @public
 */
Blast.asyncApiFunctions = [];

/**
 * latest JavaScript code generated by Blast.
 * @type {string}
 * @public
 */
Blast.latestCode = '';

/**
 * Instance of the JS Interpreter.
 * @type {?Interpreter}
 * @public
 */
Blast.Interpreter = null;

/**
 * Indicates wheter BLAST is current interrupted.
 * @type {boolean}
 * @public
 */
Blast.Interrupted = false;

/**
 * Tracks event blocks currently in the workspace,
 * in order to run indefinately if in case there are any.
 */
Blast.eventInWorkspace = [];

/**
 * Stores event handlers of webHID devices, in order to remove them on code completion.
 */
Blast.deviceEventHandlers = [];

/**
 * Instance of runner function.
 * @type {?function}
 * @private
 */
Blast.runner_ = null;

/**
 * Enum for Blast status
 * @enum {string}
 * @public
 */
Blast.status = {
  READY: 'ready',
  RUNNING: 'running',
  STOPPED: 'stopped',
  ERROR: 'error',
};

/**
 * Bind a function to a button's click event.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func func Event handler to bind.
 * @public
 */
Blast.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 * @public
 */
Blast.importPrettify = function() {
  const script = document.createElement('script');
  script.setAttribute(
      'src',
      'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js',
  );
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Blast.getBBox_ = function(element) {
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

/**
 * Initialize Blast. Called on page load.
 * @public
 */
Blast.init = function() {
  // mobile website has its own init
  if (window.location.href.includes('mobile.html')) {
    return;
  }
  // adjust workspace and toolbox on resize
  const container = document.getElementById('content_area');
  const onresize = function() {
    const bBox = Blast.getBBox_(container);
    for (const tab of Blast.Ui.TABS_) {
      const el = document.getElementById('content_' + tab);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = 2 * bBox.height - el.offsetHeight + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = 2 * bBox.width - el.offsetWidth + 'px';
    }
    // Make the 'workspace' tab line up with the toolbox.
    if (Blast.workspace && Blast.workspace.getToolbox().width) {
      document.getElementById('tab_workspace').style.minWidth =
        Blast.workspace.getToolbox().width - 38 + 'px';
      // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener('resize', onresize, false);

  Blast.workspace = Blockly.inject('content_workspace', {
    // grid: {spacing: 25, length: 3, colour: '#ccc', snap: true},
    media: 'media/',
    toolbox: Blast.Toolbox.currentToolbox,
    zoom: {controls: true, wheel: true},
  });

  // initialize toolbox
  Blast.Toolbox.init();

  onresize();
  Blockly.svgResize(Blast.workspace);

  // Initialize UI
  Blast.Ui.init();
  Blast.Ui.setStatus(Blast.status.READY);

  // Load the interpreter now, and upon future changes.
  Blast.generateCode();
  Blast.workspace.addChangeListener(function(event) {
    if (!(event instanceof Blockly.Events.Ui)) {
      // Something changed. Parser needs to be reloaded.
      Blast.generateCode();
      Blast.States.generateCode();
      Blast.Ui.renderContent_();
    }
  });

  // Display output hint
  Blast.Ui.addMessage('Actionblock output will be displayed here');
  // Lazy-load the syntax-highlighting.
  window.setTimeout(Blast.importPrettify, 1);
};

/**
 * Highlight a block with id id.
 * @param {!Blockly.Block.id} id identifier of the block to be highlighted.
 * @public
 */
Blast.highlightBlock = function(id) {
  Blast.workspace.highlightBlock(id);
  Blast.highlightPause = true;
};

/**
 * Reset the UI.
 * @param {Blast.status} status new Blast status text.
 * @public
 */
Blast.resetUi = function(status) {
  // remove highlighting
  Blast.workspace.highlightBlock(null);
  Blast.highlightPause = false;
  // set Blast stauts
  Blast.Ui.setStatus(status);
};

/**
 * Generate JavaScript Code for the user's block-program.
 * @public
 */
Blast.generateCode = function() {
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  // Generate JavaScript code and parse it.
  Blast.latestCode = '';
  Blast.latestCode = Blockly.JavaScript.workspaceToCode(Blast.workspace);
};

/**
 * Reset the JS Interpreter.
 * @public
 */
Blast.resetInterpreter = function() {
  Blast.Interpreter = null;
  if (Blast.runner_) {
    clearTimeout(Blast.runner_);
    Blast.runner_ = null;
  }
  Blast.Bluetooth.tearDown();
};

/**
 * removes all event handlers of webHID devices from {@link Blast.deviceEventHandlers}
 */
Blast.removeDeviceHandlers = function() {
  for (const handler of Blast.deviceEventHandlers) {
    const device = handler.device;
    device.removeEventListener(handler.type, handler.fn);
  }
  Blast.deviceEventHandlers = [];
};

/**
 * Execute the user's code.
 * @public
 */
Blast.runJS = function() {
  // Reset Ui
  Blast.resetUi(Blast.status.RUNNING);
  if (Blast.Interpreter == null) {
    // Begin execution
    Blast.highlightPause = false;
    Blast.Interpreter = new Interpreter(Blast.latestCode, initApi);

    /**
     * executes {@link Blast.latestCode} using {@link Blast.Interpreter}.
     * @function runner_
     * @memberof Blast#
     */
    Blast.runner_ = function() {
      if (Blast.Interpreter) {
        try {
          if (Blast.Interrupted) {
            // Execution is currently interrupted, try again later.
            setTimeout(Blast.runner_, 5);
          } else {
            const hasMore = Blast.Interpreter.step();
            if (hasMore) {
              // Execution is currently blocked by some async call.
              // Try again later.
              setTimeout(Blast.runner_, 5);
            } else if (Blast.States.Interpreter || Blast.eventInWorkspace.length > 0) {
              // eventChecker is running,
              // dont reset UI until stop button is clicked.
            } else {
              // Program is complete.
              Blast.removeDeviceHandlers();
              Blast.resetUi(Blast.status.READY);
              Blast.resetInterpreter();
            }
          }
        } catch (error) {
          Blockly.alert('Error executing program:\n%e'.replace('%e', error));
          Blast.Ui.setStatus(Blast.status.ERROR);
          Blast.removeDeviceHandlers();
          Blast.resetInterpreter();
          console.error(error);
        }
      }
    };

    Blast.runner_();
  }
};

/**
 * Stop the JavaScript execution.
 * @public
 */
Blast.stopJS = function() {
  Blast.removeDeviceHandlers();
  Blast.resetInterpreter();
  if (Blast.States.Interpreter) {
    clearTimeout(Blast.States.runner_);
    Blast.States.runner_ = null;
  }
  Blast.resetUi(Blast.status.STOPPED);
};

/**
 * Stop execution and adds an error message to the
 * {@link Blast.messageOutputContainer}.
 * @param {string} [text] optional, a custom error text
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
Blast.throwError = function(text) {
  if (!text) {
    text = 'Error executing program - See console for details.';
  }

  Blockly.alert('Error executing program:\n%e'.replace('%e', text));
  Blast.Ui.setStatus(Blast.status.ERROR);
  Blast.removeDeviceHandlers();
  Blast.resetInterpreter();
};

/**
 * Helper function checking fetch's response status.
 * Returns the response object if it was successfull.
 * Otherwise it throws an error.
 * @param {Object} response A fetch response object.
 * @param {string=} message Alert message, optional.
 * @return {Object} the response object
 */
Blast.handleFetchErrors = function(response, message) {
  if (!response.ok) {
    if (!message) {
      Blast.throwError('Error processing HTTP Request.');
    } else {
      Blast.throwError(message);
    }
  }
  return response;
};

// initialize blast when page dom is loaded
window.addEventListener('load', Blast.init);
