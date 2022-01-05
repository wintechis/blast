/**
 * @fileoverview Blast UI variables and methods.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

/**
 * The namespace used to access the Blast library.
 * @name Blast.Ui
 * @namespace
 */
goog.module('Blast.Ui');
goog.module.declareLegacyNamespace();

/**
 * List of tab names.
 * @type {Array.<string>}
 * @private
 */
const TABS_ = ['workspace', 'javascript', 'xml', 'deviceLogs'];

/**
 * Name of currently selected tab.
 * @type {string}
 * @private
 */
let selected_ = 'workspace';

/**
 * Play icon used for the start/stop button.
 * @type {HTMLElement}
 * @private
 */
const playIcon_ = '<span class="icon material-icons">play_arrow</span>';

/**
 * Stop icon used for the start/stop button.
 * @type {HTMLElement}
 * @private
 */
const stopIcon_ = '<span class="icon material-icons">stop</span>';

/**
 * Number of messages in the Message Output Container.
 * @type {number}
 * @private
 */
let messageCounter_ = 0;

/**
 * Message output Container.
 * @type {?HTMLElement}
 * @public
 */
let messageOutputContainer = null;

/**
 * Container displaying Blast's current status.
 * @type {?HTMLElement}
 * @public
 */
let statusContainer = null;

/**
 * Input to defining URIs for safing and loading blocks.
 * @type {?HTMLElement}
 * @public
 */
let uriInput = null;

/**
 * Button to start/stop execution of the user's code.
 * @type {?HTMLElement}
 * @public
 */
let runButton = null;

/**
 * Adds a DOM Element to the {@link messageOutputContainer}.
 * @param {HTMLElement} elem the element to be added
 */
const addElementToOutputContainer = function(elem) {
  // Limit elements to 100
  if (messageCounter_ > 100) {
    messageOutputContainer.firstChild.remove();
  }

  // insert new element
  messageOutputContainer.appendChild(elem, messageOutputContainer.firstChild);

  // scroll to bottom of container
  messageOutputContainer.scrollTop = messageOutputContainer.scrollHeight;
};

/**
 * Creates a message element and adds it to the {@link messageOutputContainer}.
 * @param {string} message the message to be added
 * @param {string=} type optional, type of the message, can be 'error', 'warning', or 'info'
 * @public
 */
const addMessage = function(message, type) {
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
  msg.id = 'message-' + messageCounter_++;

  const textNode = document.createTextNode(message);
  msg.appendChild(textNode);

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('time');
  timeSpan.innerHTML = new Date().toLocaleTimeString();
  msg.appendChild(timeSpan);

  const displaySystemInformation = function() {
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

  if (type === 'error') {
    const debugInfo = document.createElement('span');
    debugInfo.classList.add('debug-info');
    const openDebugInfo = document.createElement('a');
    openDebugInfo.innerHTML = 'show debug info';
    openDebugInfo.href = '#';
    openDebugInfo.onclick = displaySystemInformation;
    debugInfo.appendChild(openDebugInfo);
    msg.appendChild(debugInfo);
  }

  addElementToOutputContainer(msg);
};
exports.addMessage = addMessage;

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 * @private
 */
const tabClick_ = function(clickedName) {
  // Deselect all tabs and hide all panes.
  for (const name of TABS_) {
    const tab = document.getElementById('tab_' + name);
    tab.classList.add('taboff');
    tab.classList.remove('tabon');
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  selected_ = clickedName;
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
const renderContent_ = function() {
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
exports.renderContent_ = renderContent_;

/**
 * Adds a message to the device log tab.
 * @param {string} msg Text to add to the log.
 * @param {string=} adapter The name of the adapter that generated the message.
 * @param {string=} device The name of the device that generated the message.
 */
const addToLog = function(msg, adapter, device) {
  const log = document.getElementById('content_deviceLogs');
  // Create a new log item.
  const logItem = document.createElement('div');
  logItem.className = 'logItem';

  // Add adapter and device if specified.
  if (adapter) {
    const adapterName = document.createElement('span');
    adapterName.classList.add('log-adapter');
    if (adapter.toLowerCase() === 'bluetooth') {
      adapterName.textContent = 'Bluetooth';
      adapterName.classList.add('log-bluetooth');
    } else if (adapter.toUpperCase() === 'HID') {
      adapterName.textContent = 'HID';
      adapterName.classList.add('log-hid');
    } else if (adapter.toLowerCase() === 'eddystone') {
      adapterName.textContent = 'Eddystone';
      adapterName.classList.add('log-eddystone');
    } else {
      adapterName.textContent = adapter;
    }
    logItem.appendChild(adapterName);
  }
  if (device) {
    const deviceName = document.createElement('span');
    deviceName.classList.add('log-device');
    deviceName.textContent = device;
    logItem.appendChild(deviceName);
  }

  // Generate timestamp.
  const date = new Date();
  const time = ('0' + date.getHours()).slice(-2) + ':' +
      ('0' + date.getMinutes()).slice(-2) + ':' +
      ('0' + date.getSeconds()).slice(-2);
  const timestamp = '[' + time + '] ';
  const timestampSpan = document.createElement('span');
  timestampSpan.classList.add('log-timestamp');
  timestampSpan.textContent = timestamp;
  logItem.appendChild(timestampSpan);
  // Generate the message
  const msgSpan = document.createElement('span');
  msgSpan.classList.add('log-message');
  msgSpan.innerHTML = msg;
  logItem.appendChild(msgSpan);

  // Add log item to the log.
  log.appendChild(logItem);
  log.scrollTop = log.scrollHeight;
};
exports.addToLog = addToLog;

/**
 * Removes all children from the {@link messageOutputContainer}
 */
const ClearOutputContainer = function() {
  const container = messageOutputContainer;
  while (container.lastChild.id !== 'clearOutputButton') {
    console.log(container.lastChild.id);
    container.removeChild(container.lastChild);
  }
};

/**
 * Removes all children from the device log tab.
 */
const ClearLog = function() {
  const log = document.getElementById('content_deviceLogs');
  while (log.lastChild.id !== 'clearDeviceLogsButton') {
    log.removeChild(log.lastChild);
  }
};

/**
 * Set the start/stop button and status text.
 * @param {Blast.status} status new Blast status text.
 * @public
 */
const setStatus = function(status) {
  let icon;
  let func;
  let title;
  if (status === Blast.status.RUNNING) {
    func = Blast.stopJS;
    icon = stopIcon_;
    title = 'Stop the execution';
  } else {
    func = Blast.runJS;
    icon = playIcon_;
    title = 'Run block program';
  }

  // Set start/stop button click event and icon
  runButton.onclick = func;
  runButton.title = title;
  runButton.innerHTML = icon;
  // set status text
  statusContainer.innerHTML = status;
};
exports.setStatus = setStatus;

/**
 * Initialize the UI by binding onclick events.
 */
const init = function() {
  // Set remaining properties.
  uriInput = document.getElementById('loadWorkspace-input');
  runButton = document.getElementById('runButton');
  messageOutputContainer = document.getElementById('msgOutputContainer');
  statusContainer = document.getElementById('statusContainer');

  // mobile website has its own tab system
  if (window.location.href.includes('mobile')) {
    return;
  }

  // adjust workspace and toolbox on resize
  const onresize = function() {
    for (const tab of TABS_) {
      const el = document.getElementById('content_' + tab);
      el.style.top = '35px';
      el.style.left = '0px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = window.innerHeight - 35 + 'px';
      el.style.width = window.innerWidth - 450 + 'px';
    }
    // Make the 'workspace' tab line up with the toolbox.
    if (Blast.workspace && Blast.workspace.getToolbox().width) {
      document.getElementById('tab_workspace').style.minWidth =
          Blast.workspace.getToolbox().width - 38 + 'px';
      // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener('resize', onresize, false);

  onresize();

  // Bind onClick events to tabs
  tabClick_(selected_);

  for (const name of TABS_) {
    Blast.bindClick(
        'tab_' + name,
        (function(name_) {
          return function() {
            tabClick_(name_);
          };
        })(name),
    );
  }


  setStatus(Blast.status.READY);

  Blast.bindClick('UriLoadButton', Blast.Storage.load);
  Blast.bindClick('UriSaveButton', Blast.Storage.link);
  Blast.bindClick('saveButton', () => {
    Blast.Storage.link(true);
  });
  Blast.bindClick('clearDeviceLogsButton', ClearLog);
  Blast.bindClick('clearOutputButton', ClearOutputContainer);

  // load blocks from URI on Enter
  uriInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      Blast.Storage.load();
    }
  });
};
exports.initUi = init;
