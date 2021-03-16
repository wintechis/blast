/**
 * @fileoverview JavaScript for the Blast UI and execution.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * Blast application namespace.
 * @name Blast
 * @namespace
 * @public
 */
const Blast = {};

/**
 * Blast's main workspace.
 * @type {Blockly.workspaceSvg}
 * @public
 */
Blast.workspace = null;

/**
 * The currently used toolbox.
 * @type {Blockly.toolbox}
 * @public
 */
Blast.toolbox = defaultToolbox;

/**
 * is block highlighting paused.
 * @type {boolean}
 * @public
 */
Blast.highlightPause = false;

/**
 * latest JavaScript code generated by Blast.
 * @type {string}
 * @public
 */
Blast.latestCode = '';

/**
 * Singleton instance of the JS Interpreter.
 * @type {?Interpreter}
 * @public
 */
Blast.Interpreter = null;

/**
 * Instance of runner function.
 * @type {?function}
 * @private
 */
Blast.runner_ = null;

/**
 * Number of messages in the Message Output Container.
 * @type {number}
 * @private
 */
Blast.messageCounter_ = 0;

/**
 * Message output Container.
 * @type {?HTMLElement}
 * @public
 */
Blast.messageOutputContainer = null;

/**
 * Button to start/stop execution of the user's code.
 * @type {?HTMLElement}
 * @public
 */
Blast.runButton = null;

/**
 * Container displaying Blast's current status.
 * @type {?HTMLElement}
 * @public
 */
Blast.statusContainer = null;

/**
 * Input to defining URIs for safing and loading blocks.
 * @type {?HTMLElement}
 * @public
 */
Blast.uriInput = null;

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
 * Simplified typedef for nodes as returned by urdf.
 * @typedef {Object} node
 * @property {string} value the node's values
 * @property {string} type the node's type
 * @property {string} datatype the node's datatype
 */

/**
 * Simplified typedef for graphs as returned by urdf.
 * @typedef {Object} graph
 * @property {node} subject RDF subject.
 * @property {node} predicate RDF predicate.
 * @property {node} object RDF object.
 */

/**
 * List of tab names.
 * @type {Array.<string>}
 * @private
 */
Blast.TABS_ = ['workspace', 'javascript', 'xml'];

/**
 * Name of currently selected tab.
 * @type {string}
 * @private
 */
Blast.selected_ = 'workspace';

/**
 * Play icon used for the start/stop button.
 * @type {HTMLElement}
 * @private
 */
Blast.playIcon_ = '<svg class="icon icon-play">';
Blast.playIcon_ += '<use xlink:href="media/symbol-defs.svg#icon-play"></use>';
Blast.playIcon_ += '</svg>';

/**
 * Stop icon used for the start/stop button.
 * @type {HTMLElement}
 * @private
 */
Blast.stopIcon_ = '<svg class="icon icon-stop">';
Blast.stopIcon_ += '<use xlink:href="media/symbol-defs.svg#icon-stop">';
Blast.stopIcon_ += '</use></svg>';

/**
 * Load blocks from URI defined in {@link Blast.uriInput}.
 * @public
 */
Blast.loadBlocks = async function() {
  Blockly.hideChaff();
  // stop execution
  Blast.resetInterpreter();
  Blast.resetUi(Blast.status.READY);

  const url = document.getElementById('loadWorkspace-input').value;

  // if input is empty show warning and return.
  if (url == '') {
    Blockly.alert('Enter a URI first.');
    return;
  }

  // send GET request
  fetch(url)
      .then((response) => response.text())
      .then((xmlText) => {
      // clear blocks
        Blast.workspace.clear();

        const xmlDom = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xmlDom, Blast.workspace);
      })
      .catch((error) => {
        Blockly.alert('Error loading workspace, see console for details.');
        console.error(error);
      });
};

/**
 * Save the current workspace to URL defined in input.
 * @public
 */
Blast.saveBlocks = function() {
  Blockly.hideChaff();
  const url = document.getElementById('loadWorkspace-input').value;
  // Generate Block XML
  const xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(xmlDom);

  // Send put request.
  fetch(url, {
    method: 'PUT',
    body: xmlStr,
  }).then((response) => {
    if (response.ok) {
      Blockly.alert('workspace saved!');
    } else {
      Blockly.alert(`Error saving workspace: 
${response.status}: ${response.statusText}`);
    }
  });
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
 * @return {!Object} Contains heightm, width, x, and y properties.
 * @private
 */
Blast.getBox_ = function(element) {
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
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 * @private
 */
Blast.tabClick_ = function(clickedName) {
  // Deselect all tabs and hide all panes.
  for (let i = 0; i < Blast.TABS_.length; i++) {
    const name = Blast.TABS_[i];
    const tab = document.getElementById('tab_' + name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Blast.selected_ = clickedName;
  const selectedTab = document.getElementById('tab_' + clickedName);
  selectedTab.classList.remove('taboff');
  selectedTab.classList.add('tabon');
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
    'visible';
  Blockly.svgResize(Blast.workspace);
};

/**
 * Populate the JS pane with pretty printed code generated from the blocks.
 * @private
 */
Blast.renderContent_ = function() {
  // render the xml content.
  const xmlTextarea = document.getElementById('content_xml');
  const xmlDom = Blockly.Xml.workspaceToDom(Blast.workspace);
  const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  xmlTextarea.value = xmlText;
  xmlTextarea.focus();

  // render the JavaScript content.
  const content = document.getElementById('content_javascript');

  // remove highlightblock functions from the js code tab
  content.textContent = Blast.latestCode.replace(
      /highlightBlock\('.*'\);\n/gm,
      '',
  );
  // Remove the 'prettyprinted' class, so that Prettify will recalculate.
  content.className = content.className.replace('prettyprinted', '');
  if (typeof PR == 'object') {
    PR.prettyPrint();
  }
};

/**
 * Initialize Blast. Called on page load.
 * @public
 */
Blast.init = function() {
  // Set remaining properties
  Blast.messageOutputContainer = document.getElementById('msgOutputContainer');
  Blast.runButton = document.getElementById('runButton');
  Blast.statusContainer = document.getElementById('statusContainer');

  const container = document.getElementById('content_area');
  const onresize = function(e) {
    const bBox = Blast.getBBox_(container);
    for (let i = 0; i < Blast.TABS_.length; i++) {
      const el = document.getElementById('content_' + Blast.TABS_[i]);
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
    toolbox: Blast.toolbox,
    zoom: {controls: true, wheel: true},
  });

  Blast.tabClick_(Blast.selected_);
  Blast.uriInput = document.getElementById('loadWorkspace-input');
  Blast.uriInput.addEventListener('keyup', (event) => {
    // load blocks from URI on Enter
    if (event.keyCode === 13) {
      Blast.loadBlocks();
    }
  });
  Blast.bindClick('loadButton', Blast.loadBlocks);
  Blast.bindClick('saveButton', Blast.saveBlocks);

  for (let i = 0; i < Blast.TABS_.length; i++) {
    const name = Blast.TABS_[i];
    Blast.bindClick(
        'tab_' + name,
        (function(name_) {
          return function() {
            Blast.tabClick_(name_);
          };
        })(name),
    );
  }

  onresize();
  Blockly.svgResize(Blast.workspace);

  // Load the interpreter now, and upon future changes.
  Blast.generateCode();
  Blast.workspace.addChangeListener(function(event) {
    if (!(event instanceof Blockly.Events.Ui)) {
      // Something changed. Parser needs to be reloaded.
      Blast.resetInterpreter();
      Blast.renderContent_();
      Blast.generateCode();
    }
  });

  // register states category flyout callback
  Blast.workspace.registerToolboxCategoryCallback(
      'EVENTS',
      Blast.States.flyoutCategory,
  );

  // register advanced toolbox mock button callback
  Blast.workspace.registerToolboxCategoryCallback(
      'ADVANCEDTOOLBOX',
      Blast.switchToolbox,
  );

  // Display output hint
  Blast.BlockMethods.displayText('Actionblock output will be displayed here');
  // Lazy-load the syntax-highlighting.
  window.setTimeout(Blast.importPrettify, 1);
};

/**
 * Switches between the default and advanced toolboxes.
 * @public
 */
Blast.switchToolbox = function() {
  let newToolbox = {};
  if (Blast.toolbox === defaultToolbox) {
    newToolbox = advancedToolbox;
  } else {
    newToolbox = defaultToolbox;
  }
  Blast.toolbox = newToolbox;
  Blast.workspace.updateToolbox(newToolbox);
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
  Blast.setStatus(status);
};

/**
 * Set the start/stop button and status text.
 * @param {Blast.status} status new Blast status text.
 * @public
 */
Blast.setStatus = function(status) {
  let icon;
  let func;
  let title;
  if (status === Blast.status.RUNNING) {
    func = Blast.stopJS;
    icon = Blast.stopIcon_;
    title = 'Stop the execution';
  } else {
    func = Blast.runJS;
    icon = Blast.playIcon_;
    title = 'Run block program';
  }

  // Set start/stop button click event and icon
  Blast.runButton.onclick = func;
  Blast.runButton.title = title;
  Blast.runButton.innerHTML = icon;
  // set status text
  Blast.statusContainer.innerHTML = status;
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

  Blast.resetUi(Blast.status.READY);
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
          const hasMore = Blast.Interpreter.step();
          if (hasMore) {
            // Execution is currently blocked by some async call.
            // Try again later.
            setTimeout(Blast.runner_, 5);
          } else {
            // Program is complete.
            Blast.resetUi(Blast.status.READY);
            Blast.resetInterpreter();
          }
        } catch (error) {
          Blockly.alert('Error executing program:\n%e'.replace('%e', error));
          Blast.setStatus(Blast.status.ERROR);
          Blast.resetInterpreter();
          console.error(error);
        }
      }
    };

    Blast.runner_();
    return;
  }
};

/**
 * Stop the JavaScript execution.
 * @public
 */
Blast.stopJS = function() {
  Blast.resetInterpreter();
  Blast.resetUi(Blast.status.STOPPED);
};

/**
 * Discard all blocks from the workspace.
 * @public
 */
Blast.discard = function() {
  const count = Blast.workspace.getAllBlocks(false).length;
  if (
    count < 2 ||
    window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))
  ) {
    Blast.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

/**
 * Stop execution and adds an error message to the
 * {@link Blast.messageOutputContainer}.
 * @param {string} [text] optional, a custom error text
 */
Blast.throwError = function(text) {
  if (!text) {
    text = `Error executing program - See console for details.`;
  }

  Blockly.alert('Error executing program:\n%e'.replace('%e', text));
  Blast.setStatus(Blast.status.ERROR);
  Blast.resetInterpreter();
};

/**
 * Helper function checking fetch's response status.
 * Returns the response object if it was successfull.
 * Otherwise it throws an error.
 * @param   {Object} response A fetch response object.
 * @return {Object} the response object
 */
Blast.handleFetchErrors = function(response) {
  if (!response.ok) {
    Blast.throwError(`Error processing HTTP Request.`);
  }
  return response;
};

// initialize blast when page dom is loaded
window.addEventListener('load', Blast.init);
