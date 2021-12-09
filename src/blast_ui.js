/**
 * @fileoverview Blast UI variables and methods.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * The top level namespace used to access the Blast library.
 * @name Blast.Ui
 * @namespace
 */
goog.provide('Blast.Ui');

/**
 * List of tab names.
 * @type {Array.<string>}
 * @private
 */
Blast.Ui.TABS_ = ['workspace', 'javascript', 'xml'];

/**
 * Name of currently selected tab.
 * @type {string}
 * @private
 */
Blast.Ui.selected_ = 'workspace';

/**
 * Play icon used for the start/stop button.
 * @type {HTMLElement}
 * @private
 */
Blast.Ui.playIcon_ = '<span class="icon material-icons">play_arrow</span>';

/**
 * Stop icon used for the start/stop button.
 * @type {HTMLElement}
 * @private
 */
Blast.Ui.stopIcon_ = '<span class="icon material-icons">stop</span>';

/**
 * Number of messages in the Message Output Container.
 * @type {number}
 * @private
 */
Blast.Ui.messageCounter_ = 0;

/**
 * Message output Container.
 * @type {?HTMLElement}
 * @public
 */
Blast.Ui.messageOutputContainer = null;

/**
 * Container displaying Blast's current status.
 * @type {?HTMLElement}
 * @public
 */
Blast.Ui.statusContainer = null;

/**
 * Input to defining URIs for safing and loading blocks.
 * @type {?HTMLElement}
 * @public
 */
Blast.Ui.uriInput = null;

/**
 * Button to start/stop execution of the user's code.
 * @type {?HTMLElement}
 * @public
 */
Blast.Ui.runButton = null;

/**
 * Adds a DOM Element to the {@link Blast.Ui.messageOutputContainer}.
 * @param {HTMLElement} elem the element to be added
 */
Blast.Ui.addElementToOutputContainer = function(elem) {
  // Limit elements to 100
  if (Blast.Ui.messageCounter_ > 100) {
    Blast.Ui.messageOutputContainer.firstChild.remove();
  }

  // insert new element
  Blast.Ui.messageOutputContainer.appendChild(elem, Blast.Ui.messageOutputContainer.firstChild);

  // scroll to bottom of container
  Blast.Ui.messageOutputContainer.scrollTop = Blast.Ui.messageOutputContainer.scrollHeight;
};

/**
 * Creates a message element and adds it to the {@link Blast.Ui.messageOutputContainer}.
 * @param {string} message the message to be added
 * @param {string=} type optional, type of the message, can be 'error', 'warning', or 'info'
 * @public
 */
Blast.Ui.addMessage = function(message, type) {
  // Send notification if window is not focused.
  let icon = 'media/logo-512x512.png';
  if (window.location.href.includes('mobile')) {
    icon = '../' + icon;
  }
  if (!document.hasFocus()) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.showNotification('Blast', {
        body: message,
        icon: icon,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
      });
    });
  }

  // container for the new message
  const msg = document.createElement('div');
  msg.classList.add('message');
  if (type) {
    msg.classList.add(`${type}-message`);
  }
  msg.id = 'message-' + Blast.Ui.messageCounter_++;

  const textNode = document.createTextNode(message);
  msg.appendChild(textNode);

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('time');
  timeSpan.innerHTML = new Date().toLocaleTimeString();
  msg.appendChild(timeSpan);

  if (type === 'error') {
    const debugInfo = document.createElement('span');
    debugInfo.classList.add('debug-info');
    const openDebugInfo = document.createElement('a');
    openDebugInfo.innerHTML = 'show debug info';
    openDebugInfo.href = '#';
    openDebugInfo.onclick = Blast.Ui.displaySystemInformation;
    debugInfo.appendChild(openDebugInfo);
    msg.appendChild(debugInfo);
  }

  Blast.Ui.addElementToOutputContainer(msg);
};

Blast.Ui.displaySystemInformation = function() {
  const debugInfo = document.getElementById('debugModal');
  debugInfo.style.display = 'block';
  const debugTbody = document.getElementById('debug-tbody');
  debugTbody.innerHTML = '';
  // Get current BLAST revision
  const revisionRow = document.createElement('tr');
  revisionRow.innerHTML = `<td>BLAST</td><td>${rev}</td>`;
  debugTbody.appendChild(revisionRow);

  // System information
  for (const key in navigator) {
    if (typeof(navigator[key]) === 'string') {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.innerHTML = key;
      td2.innerHTML = navigator[key];
      tr.appendChild(td1);
      tr.appendChild(td2);
      debugTbody.appendChild(tr);
    }
  }
};

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 * @private
 */
Blast.Ui.tabClick_ = function(clickedName) {
  // Deselect all tabs and hide all panes.
  for (const name of Blast.Ui.TABS_) {
    const tab = document.getElementById('tab_' + name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Blast.Ui.selected_ = clickedName;
  const selectedTab = document.getElementById('tab_' + clickedName);
  selectedTab.classList.remove('taboff');
  selectedTab.classList.add('tabon');
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility = 'visible';
  Blockly.svgResize(Blast.workspace);
};

/**
 * Populate the JS pane with pretty printed code generated from the blocks.
 * @private
 */
Blast.Ui.renderContent_ = function() {
  // render the xml content.
  const xmlTextarea = document.getElementById('content_xml');
  const xmlDom = Blockly.Xml.workspaceToDom(Blast.workspace);
  const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  xmlTextarea.value = xmlText;
  xmlTextarea.focus();

  // render the JavaScript content.
  const content = document.getElementById('content_javascript');

  // remove highlightblock functions from the js code tab
  content.textContent = Blast.latestCode.replace(/highlightBlock\('.*'\);\n/gm, '');
  // Remove the 'prettyprinted' class, so that Prettify will recalculate.
  content.className = content.className.replace('prettyprinted', '');
  if (typeof PR == 'object') {
    PR.prettyPrint();
  }
};

/**
 * Set the start/stop button and status text.
 * @param {Blast.status} status new Blast status text.
 * @public
 */
Blast.Ui.setStatus = function(status) {
  let icon;
  let func;
  let title;
  if (status === Blast.status.RUNNING) {
    func = Blast.stopJS;
    icon = Blast.Ui.stopIcon_;
    title = 'Stop the execution';
  } else {
    func = Blast.runJS;
    icon = Blast.Ui.playIcon_;
    title = 'Run block program';
  }

  // Set start/stop button click event and icon
  Blast.Ui.runButton.onclick = func;
  Blast.Ui.runButton.title = title;
  Blast.Ui.runButton.innerHTML = icon;
  // set status text
  Blast.Ui.statusContainer.innerHTML = status;
};

/**
 * Initialize the UI by binding onclick events.
 */
Blast.Ui.init = function() {
  // Set remaining properties.
  Blast.Ui.uriInput = document.getElementById('loadWorkspace-input');
  Blast.Ui.runButton = document.getElementById('runButton');
  Blast.Ui.messageOutputContainer = document.getElementById('msgOutputContainer');
  Blast.Ui.statusContainer = document.getElementById('statusContainer');

  // mobile website has its own tab system
  if (window.location.href.includes('mobile')) {
    return;
  }

  // Bind onClick events to tabs
  Blast.Ui.tabClick_(Blast.Ui.selected_);

  for (const name of Blast.Ui.TABS_) {
    Blast.bindClick(
        'tab_' + name,
        (function(name_) {
          return function() {
            Blast.Ui.tabClick_(name_);
          };
        })(name),
    );
  }

  Blast.bindClick('UriLoadButton', Blast.Storage.load);
  Blast.bindClick('UriSaveButton', Blast.Storage.link);
  Blast.bindClick('saveButton', () => {
    Blast.Storage.link(true);
  });

  // load blocks from URI on Enter
  Blast.Ui.uriInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      Blast.Storage.load();
    }
  });
};
