/**
 * @fileoverview Initializes Blast UI variables and methods.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {
  getLatestCode,
  getWorkspace,
  onStatusChange,
  runJS,
  setStdIn,
  setStdError,
  setStdInfo,
  setStdOut,
  statusValues,
  stopJS,
} from '../../core/dist/blast_interpreter.js';
import {link, loadXMLFromFile} from '../../core/dist/blast_storage.js';
import {
  addDevice,
  connectWebHidDevice,
  connectedThings,
  implementedThings,
  setDevMode,
  setThingsLog,
  setAudioSelectButtonHandler,
  setVideoSelectButtonHandler,
  setWebBluetoothButtonHandler,
  setWebHidButtonHandler,
} from '../../core/dist/blast_things.js';
import {requestDevice} from '../../core/dist/blast_webBluetooth.js';
import {
  ASTNode,
  BlockSvg,
  constants,
  Events,
  svgResize,
  WorkspaceSvg,
  Xml,
} from '../../core/dist/blast_blockly_interface.js';

/**
 * List of tab names.
 * @type {Array.<string>}
 * @private
 */
export const TABS_ = ['workspace', 'javascript', 'pseudo', 'xml', 'deviceLogs'];

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
 * Sets the messageOutputContainer.
 * @param {HTMLElement} container the container to be set
 */
export const setMessageOutputContainer = function (container) {
  messageOutputContainer = container;
};

/**
 * Container displaying Blast's current status.
 * @type {?HTMLElement}
 * @public
 */
let statusContainer = null;

/**
 * Sets the statusContainer.
 * @param {HTMLElement} container the container to be set
 */
export const setStatusContainer = function (container) {
  statusContainer = container;
};

/**
 * FileSelector for loading from XML files.
 */
let fileSelector = null;

/**
 * Sets the the fileSelector
 * @param {HTMLElement} container the selector to be set
 */
export const setFileSelector = function (container) {
  fileSelector = container;
};

/**
 * Button to start/stop execution of the user's code.
 * @type {?HTMLElement}
 * @public
 */
let runButton = null;

/**
 * Sets the runButton
 * @param {HTMLElement} button the button to be set
 */
export const setRunButton = function (button) {
  runButton = button;
};

/**
 * The workspace used to display the user's code.
 */
let workspace = null;

/**
 * Current version of BLAST.
 * This string will be replaced with the current commit hash,
 * when the application is built.
 */
const rev = '{{commit_hash}}';

/**
 * Bind a function to a button's click event.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func func Event handler to bind.
 * @public
 */
export const bindClick = function (el, func) {
  if (typeof el === 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * Set the start/stop button and status text.
 * @param {Blast.Interpreter.statusValues} val new Blast status text.
 * @public
 */
export const setStatus = function (val) {
  let icon;
  let func;
  let title;
  if (val === statusValues.RUNNING) {
    func = stopJS;
    icon = stopIcon_;
    title = 'Stop the execution';
  } else {
    func = runJS;
    icon = playIcon_;
    title = 'Run block program';
  }

  // Set start/stop button click event and icon
  runButton.onclick = func;
  runButton.title = title;
  runButton.innerHTML = icon;
  // set status text
  statusContainer.innerHTML = val;
};

/**
 * Reset the UI.
 * @param {Blast.Interpreter.statusValues} val new Blast status text.
 * @public
 */
const resetUi = function (val) {
  // remove highlighting
  workspace.highlightBlock(null);
  // set Blast stauts
  setStatus(val);
};

/**
 * Adds a DOM Element to the {@link messageOutputContainer}.
 * @param {HTMLElement} elem the element to be added
 */
export const addElementToOutputContainer = function (elem) {
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
const addMessage = function (message, type) {
  // Send notification if window is not focused.
  let icon = 'media/logo-512x512.png';

  if (!document.hasFocus()) {
    navigator.serviceWorker.ready.then(registration => {
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

  const displaySystemInformation = function () {
    const debugInfo = document.getElementById('debugModal');
    debugInfo.style.display = 'block';
    const debugTbody = document.getElementById('debug-tbody');
    debugTbody.innerHTML = '';
    // Get current BLAST version
    const revisionRow = document.createElement('tr');
    revisionRow.innerHTML = `<td>BLAST</td><td>${rev}</td>`;
    debugTbody.appendChild(revisionRow);

    // System information
    for (const key in navigator) {
      if (typeof navigator[key] === 'string') {
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
setStdError(message => addMessage(message, 'error'));
setStdInfo(message => addMessage(message, 'info'));
setStdIn(message => prompt(message));
setStdOut(message => addMessage(message));

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 * @private
 */
const tabClick_ = function (clickedName) {
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
  document.getElementById('content_' + clickedName).style.visibility =
    'visible';
  svgResize(workspace);
};

/**
 * Populate the JS pane with pretty printed code generated from the blocks.
 * @private
 */
const renderContent_ = function () {
  // render the xml content.
  const xmlTextarea = document.getElementById('content_xml');
  const xmlDom = Xml.workspaceToDom(workspace);
  const xmlText = Xml.domToPrettyText(xmlDom);
  xmlTextarea.value = xmlText;
  xmlTextarea.focus();

  // render the JavaScript content.
  const content = document.getElementById('content_javascript');

  // remove highlightblock functions from the js code tab
  const code = getLatestCode().replace(/highlightBlock\('.*'\);\n/gm, '');
  // remove 'if (interpreterExecutionExit === true) return();\n' from the js code tabs.
  content.textContent = code.replace(
    /if \(interpreterExecutionExit === true\) return;\n/gm,
    ''
  );

  // Remove the 'prettyprinted' class, so that Prettify will recalculate.
  content.className = content.className.replace('prettyprinted', '');
  if (typeof PR === 'object') {
    PR.prettyPrint();
  }

  // render the pseudo code content.
  const contentPseudo = document.getElementById('content_pseudo');
  const ws = getWorkspace();
  contentPseudo.textContent = ws.toPseudoCode();
};

/**
 * Adds a message to the device log tab.
 * @param {string} msg Text to add to the log.
 * @param {string=} adapter The name of the adapter that generated the message.
 * @param {string=} device The name of the device that generated the message.
 */
const addToLog = function (msg, adapter, device) {
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
  const time =
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
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
setThingsLog((msg, adapter, device) => addToLog(msg, adapter, device));

/**
 * Removes all children from the {@link messageOutputContainer}
 */
const ClearOutputContainer = function () {
  const container = messageOutputContainer;
  while (container.lastChild.id !== 'clearOutputButton') {
    container.removeChild(container.lastChild);
  }
};

/**
 * Removes all children from the device log tab.
 */
const ClearLog = function () {
  const log = document.getElementById('content_deviceLogs');
  while (log.lastChild.id !== 'clearDeviceLogsButton') {
    log.removeChild(log.lastChild);
  }
};

/**
 * Load the Prettify CSS and JavaScript.
 * @public
 */
const importPrettify = function () {
  const script = document.createElement('script');
  script.setAttribute(
    'src',
    'https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js'
  );
  document.head.appendChild(script);
};

const getDevices = async function (kind) {
  await navigator.mediaDevices.getUserMedia({audio: true});
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioDevices = devices.filter(device => device.kind === kind);
  return audioDevices;
};

const openVideoAudioSelectModal = function (kind) {
  // Clear the table
  const tbody = document.getElementById('connect-tbody');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  // request list of audio devices
  getDevices(kind).then(devices => {
    devices.forEach(device => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const name = document.createElement('span');
      name.textContent = device.label;
      nameCell.appendChild(name);
      row.appendChild(nameCell);

      const createCell = document.createElement('td');
      const addButton = document.createElement('input');
      addButton.type = 'button';
      addButton.id = 'addButton-' + device.deviceId;
      addButton.value = 'add';
      addButton.addEventListener('click', () => {
        if (kind === 'audiooutput') {
          addDevice(device.label, device.deviceId, 'audioOutput');
        } else if (kind === 'videoinput') {
          addDevice(device.label, device.deviceId, 'videoInput');
        }
        document.getElementById('addStatus-' + device.deviceId).innerHTML =
          '&#x2714;';
        document.getElementById('addStatus-' + device.deviceId).style.color =
          'green';
      });
      createCell.appendChild(addButton);
      row.appendChild(createCell);

      // create status html
      const statusCell = document.createElement('td');
      const status = document.createElement('span');
      status.id = 'addStatus-' + device.deviceId;

      // Check if output was already created
      let alreadyConnected = false;
      for (const [, t] of connectedThings) {
        if (t.id === device.deviceId) {
          alreadyConnected = true;
          break;
        }
      }
      if (alreadyConnected) {
        status.innerHTML = '&#x2714;';
        status.style.color = 'green';
      } else {
        status.innerHTML = '&#x2718;';
        status.style.color = 'red';
      }
      status.style.fontSize = '20px';
      status.style.fontWeight = 'bold';
      status.style.marginRight = '10px';
      statusCell.appendChild(status);
      row.appendChild(statusCell);
      // add row to table
      tbody.appendChild(row);
    });
    // Show the modal
    document.getElementById('connect-modal').style.display = 'block';
  });
};

const getVideoInputDevices = async function () {
  await navigator.mediaDevices.getUserMedia({video: true});
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  return videoDevices;
};

const openConnectModal = function (type) {
  // Clear the table
  const tbody = document.getElementById('connect-tbody');
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  // Add row for each device
  for (const thing of implementedThings) {
    // Skip Hid devices
    if (thing.type !== type) {
      continue;
    }
    // Add new row
    const row = document.createElement('tr');
    // Generate name cell html
    const nameCell = document.createElement('td');
    const name = document.createElement('span');
    name.textContent = thing.name;
    nameCell.appendChild(name);
    if (thing.infoUrl) {
      const infoUrl = document.createElement('a');
      infoUrl.setAttribute('href', thing.infoUrl);
      infoUrl.setAttribute('target', '_blank');
      infoUrl.innerHTML = '<span class="icon material-icons">info_icon</span>';
      nameCell.appendChild(infoUrl);
    }
    row.appendChild(nameCell);
    // Pair cell html
    const pairCell = document.createElement('td');
    const pairButton = document.createElement('input');
    pairButton.setAttribute('type', 'button');
    pairButton.setAttribute('id', 'pairButton-' + thing.id);
    if (type === 'bluetooth') {
      pairButton.setAttribute('value', 'Pair');
      pairButton.addEventListener('click', async () => {
        const device = await requestDevice(thing);
        if (device) {
          // change pair status to checkmark
          document.getElementById('pairStatus-' + thing.id).innerHTML =
            '&#x2714;';
          document.getElementById('pairStatus-' + thing.id).style.color =
            'green';
        }
      });
    } else if (type === 'hid') {
      pairButton.setAttribute('value', 'Connect');
      pairButton.addEventListener('click', async () => {
        const device = await connectWebHidDevice(thing);
        if (device) {
          // change pair status to checkmark
          document.getElementById('pairStatus-' + thing.id).innerHTML =
            '&#x2714;';
          document.getElementById('pairStatus-' + thing.id).style.color =
            'green';
        }
      });
    }
    pairCell.appendChild(pairButton);
    row.appendChild(pairCell);
    // pair status html
    const statusCell = document.createElement('td');
    const pairStatus = document.createElement('span');
    pairStatus.setAttribute('id', 'pairStatus-' + thing.id);
    // check if thing was already connected before
    let alreadyConnected = false;
    for (const [, t] of connectedThings) {
      if (t.id === thing.id) {
        alreadyConnected = true;
        break;
      }
    }
    if (alreadyConnected) {
      pairStatus.innerHTML = '&#x2714;';
      pairStatus.style.color = 'green';
    } else {
      pairStatus.innerHTML = '&#x2718;';
      pairStatus.style.color = 'red';
    }
    pairStatus.style.fontSize = '20px';
    pairStatus.style.fontWeight = 'bold';
    pairStatus.style.marginRight = '10px';
    statusCell.appendChild(pairStatus);
    row.appendChild(statusCell);
    // add row to table
    tbody.appendChild(row);
  }
  // Show the modal
  document.getElementById('connect-modal').style.display = 'block';
};

/**
 * Initialize the UI by binding onclick events.
 * @param {!Blockly.Workspace} ws The workspace to bind to the UI.
 */
export const initUi = function (ws) {
  // Display current version
  const version = document.getElementById('version');
  version.textContent = version.textContent.replace('{version}', rev);

  // Bind dev mode switch
  const devModeSwitch = document.getElementById('devModeSwitch');
  devModeSwitch.addEventListener('change', event => {
    const value = event.target.checked;
    if (value === true) {
      document.getElementById('runButton').style.display = 'none';
      statusContainer.innerHTML = 'Dev mode enabled';
    } else {
      if (getWorkspace().getAllBlocks().length > 0) {
        const confirm = window.confirm(
          'Disabling dev mode will clear your workspace, continue?'
        );
        if (!confirm) {
          devModeSwitch.checked = true;
          return;
        }
      }
      document.getElementById('runButton').style.display = 'inline-block';
      statusContainer.innerHTML = 'ready';
    }
    setDevMode(value);
  });

  workspace = ws;
  // Set remaining properties.
  runButton = document.getElementById('runButton');
  messageOutputContainer = document.getElementById('msgOutputContainer');
  statusContainer = document.getElementById('statusContainer');
  fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', loadXMLFromFile);

  // Bind onClick events to tabs
  tabClick_(selected_);

  for (const name of TABS_) {
    bindClick(
      'tab_' + name,
      (function (name_) {
        return function () {
          tabClick_(name_);
        };
      })(name)
    );
  }

  // adjust workspace and toolbox on resize
  const onresize = function () {
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
    if (workspace && workspace.getToolbox().width) {
      // Account for the 19 pixel margin and on each side.
      document.getElementById('tab_workspace').style.minWidth =
        workspace.getToolbox().width - 38 + 'px';
    }
    svgResize(workspace);
  };
  window.addEventListener('resize', onresize, false);

  onresize();
  svgResize(workspace);

  // Call renderContent_ on changes to the workspace.
  workspace.addChangeListener(event => {
    if (!(event instanceof Events.Ui)) {
      renderContent_();
    }
  });

  bindClick('saveButton', () => {
    link(true);
  });
  bindClick('clearDeviceLogsButton', ClearLog);
  bindClick('clearOutputButton', ClearOutputContainer);

  // register setStatus to onStatusChange
  onStatusChange.stopped.push(() => setStatus(statusValues.STOPPED));
  onStatusChange.running.push(() => setStatus(statusValues.RUNNING));
  // resetUi to onStatusChange
  onStatusChange.stopped.push(() => resetUi(statusValues.STOPPED));
  onStatusChange.running.push(() => resetUi(statusValues.RUNNING));
  onStatusChange.ready.push(() => resetUi(statusValues.READY));
  onStatusChange.error.push(() => resetUi(statusValues.ERROR));

  setWebBluetoothButtonHandler(() => openConnectModal('bluetooth'));
  setWebHidButtonHandler(() => openConnectModal('hid'));
  setAudioSelectButtonHandler(() => openVideoAudioSelectModal('audiooutput'));
  setVideoSelectButtonHandler(() => openVideoAudioSelectModal('videoinput'));

  // Lazy-load the syntax-highlighting.
  window.setTimeout(importPrettify, 1);

  setStatus(statusValues.READY);
};

/**
 * Converts the workspace to a pseudo code string.
 * @param {string=} opt_emptyToken The placeholder string used to denote an
 *     empty field. If not specified, '?' is used.
 * @return {string} The pseudo code string.
 */
BlockSvg.prototype.toPseudoCode = function (opt_emptyToken) {
  let pseudo = [];
  const emptyFieldPlaceholder = opt_emptyToken || '?';

  // Temporarily set flag to navigate to all fields.
  const prevNavigateFields = ASTNode.NAVIGATE_ALL_FIELDS;
  ASTNode.NAVIGATE_ALL_FIELDS = true;

  let node = ASTNode.createBlockNode(this);

  /**
   * Whether or not to add parentheses around an input.
   * @param {!Connection} connection The connection.
   * @return {boolean} True if we should add parentheses around the input.
   */
  function shouldAddParentheses(connection) {
    let checks = connection.getCheck();
    if (!checks && connection.targetConnection) {
      checks = connection.targetConnection.getCheck();
    }
    return (
      !!checks &&
      (checks.indexOf('Boolean') !== -1 || checks.indexOf('Number') !== -1)
    );
  }

  let scopeDepth = 0;
  // Traverse the AST building up our text string.
  while (node) {
    switch (node.getType()) {
      case ASTNode.types.INPUT: {
        const connection = /** @type {!Connection} */ (node.getLocation());
        if (!node.in()) {
          pseudo.push(emptyFieldPlaceholder);
        } else if (shouldAddParentheses(connection)) {
          pseudo.push('(');
        }
        if (connection.type === 3) {
          pseudo.push('{\n');
          scopeDepth++;
        }
        break;
      }
      case ASTNode.types.FIELD: {
        const field = /** @type {Field} */ (node.getLocation());
        if (field.name !== constants.COLLAPSED_FIELD_NAME) {
          pseudo.push(field.getText());
        }
        break;
      }
    }

    const current = node;
    if (current.getType() === ASTNode.types.NEXT) {
      pseudo.push('\n');
    }
    node = current.in() || current.next();

    if (!node) {
      // Can't go in or next, keep going out until we can go next.
      node = current.out();
      while (node && !node.next()) {
        node = node.out();
        // If we hit an input on the way up, possibly close out parentheses.
        if (node && node.getType() === ASTNode.types.INPUT) {
          const connection = /** @type {!Connection} */ (node.getLocation());
          if (shouldAddParentheses(connection)) {
            pseudo.push(')');
          }
        }
        if (node && node.getType() === ASTNode.types.BLOCK) {
          if (current.getType() === ASTNode.types.NEXT) {
            pseudo.push('}');
            scopeDepth--;
          }
        }
      }
      if (node) {
        node = node.next();
      }
    }
  }

  // Restore state of NAVIGATE_ALL_FIELDS.
  ASTNode.NAVIGATE_ALL_FIELDS = prevNavigateFields;

  // Run through our text array and simplify expression to remove parentheses
  // around single field blocks.
  // E.g. ['repeat', '(', '10', ')', 'times', 'do', '?']
  for (let i = 2; i < pseudo.length; i++) {
    if (pseudo[i - 2] === '(' && pseudo[i] === ')') {
      pseudo[i - 2] = pseudo[i - 1];
      pseudo.splice(i - 1, 2);
    }
  }

  // Join the text array, removing spaces around added parentheses.
  pseudo = pseudo.reduce((acc, value) => {
    return acc + (acc.substr(-1) === '(' || value === ')' ? '' : ' ') + value;
  }, '');
  pseudo = pseudo.trim() || '???';

  while (scopeDepth--) {
    pseudo += '}';
  }

  return pseudo;
};

WorkspaceSvg.prototype.toPseudoCode = function (opt_emptyToken) {
  return this.getTopBlocks()
    .map(block => block.toPseudoCode(opt_emptyToken))
    .join('\n');
};
