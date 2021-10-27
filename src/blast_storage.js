/**
 * @fileoverview Saving and loading block programs
 * to samples folder and local storage.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
 * Namespace for the block storage
 * @name Blast.Storage
 * @namespace
 * @public
 */
goog.provide('Blast.Storage');

/**
 * Http-request error message.
 */
Blast.Storage.HTTPREQUEST_ERROR = 'There was a problem with the request.\n';

/**
 * Save-success alert.
 */
Blast.Storage.LINK_ALERT = 'Load your blocks with this link:\n\n%1';

/**
 * Hash error message.
 */
Blast.Storage.NOT_FOUND_ERROR = 'Sorry, couldn\'t find "%1".';

/**
 * Faulty xml error message.
 */
Blast.Storage.XML_ERROR = 'Could not load your saved file.\n' +
    'Perhaps it was created with a different version of Blast?';

/**
 * Stores the filename when loading programs for saving, default is 'BLAST.xml'.
 */
Blast.Storage.filename = 'BLAST.xml';

/**
  * Save blocks to URI and return a link containing key to XML.
  * @param {boolean=} download optional, if true, save to file.
  */
Blast.Storage.link = function(download) {
  console.log(download);
  const workspace = Blast.workspace;
  let xml = Blockly.Xml.workspaceToDom(workspace, true);
  // Remove x/y coordinates from XML if there's only one block stack.
  if (workspace.getTopBlocks(false).length == 1 && xml.querySelector) {
    const block = xml.querySelector('block');
    if (block) {
      block.removeAttribute('x');
      block.removeAttribute('y');
    }
  }
  // Remove device id from xml.
  xml = Blast.Storage.removeDeviceId_(xml);
  // prettify xml.
  xml = Blockly.Xml.domToPrettyText(xml);

  // Save XML using filesaver.js.
  if (download === true) {
    const blob = new Blob([xml], {type: 'text/xml'});
    saveAs(blob, Blast.Storage.filename);
    return;
  }

  // Save to server.
  let path = document.getElementById('loadWorkspace-input').value;
  if (!path || path.length == 0) {
    path = 'storage/' + Blast.Storage.generatePath();
  }
  const data = Blockly.Xml.domToText(xml);
  Blast.Storage.saveXML_(path, data);
};

/**
 * Replaces device ID with user defined name in all blocks of type
 * things_webBluetooth and webHID in the xml.
 * @param {!Element} xml XML to remove device ids from.
 * @return {!Element} XML with device ids removed.
 * @private
 */
Blast.Storage.removeDeviceId_ = function(xml) {
  const blocks = xml.querySelectorAll('block');

  for (const block of blocks) {
    const type = block.getAttribute('type');
    if (type == 'things_webBluetooth' || type == 'things_webHID') {
      // first child is the device id
      const device = block.firstElementChild;
      if (device) {
        const id = device.textContent;
        const tuples = type == 'things_webBluetooth' ? Blast.Things.getWebBluetoothDevices() : Blast.Things.getWebHIDDevices();
        let name;
        // get the key of the device id
        for (const [key, value] of tuples) {
          if (value === id) {
            name = key;
            break;
          }
        }
        device.textContent = name;
      }
    }
  }
  return xml;
};

/**
 * Save the current workspace to URL defined in input.
 * @param {string} path path to save workspace at.
 * @param {string} xml the xml to save.
 * @private
 */
Blast.Storage.saveXML_ = function(path, xml) {
  Blockly.hideChaff();
  
  // Send put request.
  fetch(path, {
    method: 'PUT',
    body: xml,
  }).then((response) => {
    if (response.ok) {
      location.hash = path;
      Blockly.alert(Blast.Storage.LINK_ALERT.replace('%1', window.location.href));
    } else {
      Blast.throwError(Blast.Storage.HTTPREQUEST_ERROR);
    }
  });
};

Blast.Storage.load = function() {
  const url = document.getElementById('loadWorkspace-input').value;
    
  // if input is empty show warning and return.
  if (url == '') {
    Blockly.alert('Enter a URI first.');
    return;
  }

  // save filename to {@link Blast.Storage.filename}
  const filename = url.split('/').pop();
  if (filename.indexOf('.') > -1) {
    Blast.Storage.filename = filename;
  }

  Blast.Storage.retrieveXML_(url);
};

/**
   * Load XML from a file.
   * @param {Event} event A change event.
   * @return {Promise} A promise that will be resolved when the file is loaded.
   * @private
   */
Blast.Storage.loadXMLFromFile = function(event) {
  return new Promise(function(resolve, reject) {
    // Save filename to {@link Blast.Storage.filename}
    const filename = event.target.files[0].name;
    if (filename.indexOf('.') > -1) {
      Blast.Storage.filename = filename;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      Blast.Storage.loadXML(e.target.result);
      resolve();
    };
    fileReader.onerror = function(evt) {
      reject(evt.target.error);
    };
    fileReader.readAsText(event.target.files[0]);
  });
};

/**
 * Load blocks from URI defined in {@link Blast.Ui.uriInput}.
 * @param {string} path path to the XML to load.
 * @private
 */
Blast.Storage.retrieveXML_ = async function(path) {
  Blockly.hideChaff();
  // stop execution
  Blast.resetInterpreter();
  Blast.resetUi(Blast.status.READY);

  
  // send GET request
  fetch(path)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          Blast.throwError(Blast.Storage.NOT_FOUND_ERROR.replace('%1', path));
        }
      })
      .then(Blast.Storage.loadXML);
};

/**
 * Loads the xml into the workspace.
 * @param {string} xmlString the xml to load.
 * @private
 */
Blast.Storage.loadXML = function(xmlString) {
  let xml;
  // clear blocks
  Blast.workspace.clear();
  try {
    xml = Blockly.Xml.textToDom(xmlString);
  } catch (e) {
    Blast.throwError(Blast.Storage.XML_ERROR + '\nXML: ' + xml);
    return;
  }

  // prompt to WebBluetooth/webHID device connection
  if (xml.querySelector('block[type="things_webBluetooth"]') || xml.querySelector('block[type="things_webHID"]')) {
    xml = Blast.Storage.generatePairButtons(xml);
    // show reconnect modal
    if (document.getElementById('rcModal')) {
      document.getElementById('rcModal').style.display = 'block';
    }
    // return. will continue after reconnecting to devices
    return;
  }
          
  Blockly.Xml.domToWorkspace(xml, Blast.workspace);
  Blast.Storage.monitorChanges_(Blast.workspace);
};

/**
 * Adds pair buttons for each web bluetooth block in xml to the reconnect modal.
 * @param {!Element} xml XML to parse for devices.
 * @private
 */
Blast.Storage.generatePairButtons = function(xml) {
  if (window.location.href.includes('mobile')) {
    window.app.openReconnectDialog();
    this.generatePairButtonsMobile_(xml);
  } else {
    this.generatePairButtonsDesktop_(xml);
  }
};

/**
 * Adds pair buttons for each web bluetooth block in xml to the reconnect modal.
 * @param {!Element} xml XML to parse for devices.
 * @private
 */
Blast.Storage.generatePairButtonsDesktop_ = function(xml) {
  const blocks = xml.querySelectorAll('block');
  const tbody = document.getElementById('rc-tbody');
  // delete all table rows from tbody
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  const blocksAdded = [];
  // add pair button for each web bluetooth block
  for (const block of blocks) {
    const type = block.getAttribute('type');
    if (type == 'things_webBluetooth' || type == 'things_webHID') {
      // get user defined name
      const name = block.firstElementChild.textContent;
      // skip if block was already added
      if (blocksAdded.includes(name)) {
        continue;
      }

      // add new row
      const row = document.createElement('tr');
      // generate name cell html
      const nameCell = document.createElement('td');
      nameCell.appendChild(document.createTextNode(name));
      // pair cell html
      const pairCell = document.createElement('td');
      const pairButton = document.createElement('input');
      pairButton.setAttribute('type', 'button');
      pairButton.setAttribute('id', 'pairButton-' + name);
      pairButton.setAttribute('value', 'Pair');
      // pair status html
      const statusCell = document.createElement('td');
      const pairStatus = document.createElement('span');
      pairStatus.setAttribute('id', 'pairStatus-' + name);
      pairStatus.innerHTML = '&#x2718;';
      pairStatus.style.color = 'red';
      pairStatus.style.fontSize = '20px';
      pairStatus.style.fontWeight = 'bold';
      pairStatus.style.marginRight = '10px';
      // add pair status to status cell
      statusCell.appendChild(pairStatus);

      // pair button click listener
      pairButton.addEventListener('click', async function() {
        if (type == 'things_webBluetooth') {
          // set webbluetooth options
          const options = {};
          options.acceptAllDevices = true;
          options.optionalServices = Blast.Bluetooth.optionalServices;
        
          const device = await Blast.Bluetooth.requestDevice();
          // change pair status to checkmark
          document.getElementById('pairStatus-' + name).innerHTML = '&#x2714;';
          document.getElementById('pairStatus-' + name).style.color = 'green';

          // set block id to device id
          block.firstElementChild.textContent = device.id;
          
          // if all devices have been paired, enable done button
          if (Blast.Storage.allConnectedDesktop_()) {
            document.getElementById('rc-done').disabled = false;
            // add done button click listener
            document.getElementById('rc-done').addEventListener('click', () => Blast.Storage.reconnectDoneHandler_(xml));
          }
        } else if (type == 'things_webHID') {
          const filters = [];
      
          navigator.hid.requestDevice({filters})
              .then((device) => {
                if (device.length === 0) Blast.throwError('Connection failed or cancelled by User.');
                // generate a unique id for the new device
                const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
                // add device to the device map with its uid
                Blast.Things.webHidDevices.set(uid, device[0]);
                Blast.Things.addWebHidDevice(uid, name);
                // change pair status to checkmark
                document.getElementById('pairStatus-' + name).innerHTML = '&#x2714;';
                document.getElementById('pairStatus-' + name).style.color = 'green';

                // set block id to device id
                block.firstElementChild.textContent = uid;
                console.log(block);
                                
                // if all devices have been paired, enable done button
                if (Blast.Storage.allConnectedDesktop_()) {
                  document.getElementById('rc-done').disabled = false;
                  // add done button click listener
                  document.getElementById('rc-done').addEventListener('click', () => Blast.Storage.reconnectDoneHandler_(xml));
                }
              })
              .catch((error) => {
                wHidLog('Argh! ' + error);
              });
        }
      });

      pairCell.appendChild(pairButton);

      // add new cells to row and row to table
      row.appendChild(nameCell);
      row.appendChild(pairCell);
      row.appendChild(statusCell);
      tbody.appendChild(row);
      blocksAdded.push(name);
    }
    // add cancel button click listener
    document.getElementById('rc-cancel').addEventListener('click', () => Blast.Storage.reconnectCancelHandler_());
  }
};

/**
 * Adds pair buttons for each web bluetooth block in xml to the mobile reconnect dialog.
 * @param {!Element} xml XML to parse for devices.
 */
Blast.Storage.generatePairButtonsMobile_ = function(xml) {
  const blocks = xml.querySelectorAll('block');
  // empty list
  const list = document.getElementById('rc-list');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  const blocksAdded = [];
  // add pair button for each webBluetooth and webHID block
  for (const block of blocks) {
    const type = block.getAttribute('type');
    if (type == 'things_webBluetooth' || type == 'things_webHID') {
      // get user defined name
      const name = block.firstElementChild.textContent;
      // skip if block was already added
      if (blocksAdded.includes(name)) {
        continue;
      }
      // add new list item
      const item = document.createElement('li');
      item.setAttribute('id', 'rc-item-' + name);
      item.setAttribute('class', 'mdc-list-item');
      // add bluetooth icon to list item
      const icon = document.createElement('span');
      icon.setAttribute('id', 'rc-icon-' + name);
      icon.setAttribute('class', 'mdc-list-item__graphic material-icons');
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = type == 'things_webBluetooth' ? 'bluetooth_disabled' : 'usb_off';
      item.appendChild(icon);
      // add name and status to list item
      const text = document.createElement('span');
      text.setAttribute('class', 'mdc-list-item__text');
      const primaryText = document.createElement('span');
      primaryText.setAttribute('class', 'mdc-list-item__primary-text');
      primaryText.innerHTML = name;
      text.appendChild(primaryText);
      const secondaryText = document.createElement('span');
      secondaryText.setAttribute('class', 'mdc-list-item__secondary-text');
      secondaryText.setAttribute('id', 'rc-status-' + name);
      secondaryText.innerHTML = 'disconnected';
      text.appendChild(secondaryText);
      item.appendChild(text);
      // add click listener to list item
      item.addEventListener('click', async function() {
        if (type == 'things_webBluetooth') {
          // set webbluetooth options
          const options = {};
          options.acceptAllDevices = true;
          options.optionalServices = Blast.Bluetooth.optionalServices;
                
          const device = await Blast.Bluetooth.requestDevice();
          Blast.Things.addWebBluetoothDevice(device.id, name);
          // change pair status to connected
          document.getElementById('rc-status-' + name).innerHTML = 'connected';
          // change icon to bluetooth connected
          document.getElementById('rc-icon-' + name).innerHTML = 'bluetooth';
          // change icon color to blue
          document.getElementById('rc-icon-' + name).style.color = '#0d30b1';

          // set block id to device id
          block.firstElementChild.textContent = device.id;
                  
          // if all devices have been paired, enable done button
          if (Blast.Storage.allConnectedMobile_()) {
            document.getElementById('rc-done').disabled = false;
            // add done button click listener
            document.getElementById('rc-done').addEventListener('click', () => Blast.Storage.reconnectDoneHandler_(xml));
          }
        } else if (type == 'things_webHID') {
          const filters = [];
      
          navigator.hid.requestDevice({filters})
              .then((device) => {
                if (device.length === 0) Blast.throwError('Connection failed or cancelled by User.');
                // generate a unique id for the new device
                const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
                // add device to the device map with its uid
                Blast.Things.webHidDevices.set(uid, device[0]);
                Blast.Things.addWebHidDevice(uid, '');
                // change pair status to connected
                document.getElementById('rc-status-' + name).innerHTML = 'connected';
                // change icon to usb connected
                document.getElementById('rc-icon-' + name).innerHTML = 'usb';
                // change icon color to blue
                document.getElementById('rc-icon-' + name).style.color = '#0d30b1';

                // set block id to device id
                block.firstElementChild.textContent = uid;
                                
                // if all devices have been paired, enable done button
                if (Blast.Storage.allConnectedDesktop_()) {
                  document.getElementById('rc-done').disabled = false;
                  // add done button click listener
                  document.getElementById('rc-done').addEventListener('click', () => Blast.Storage.reconnectDoneHandler_(xml));
                }
              })
              .catch((error) => {
                wHidLog('Argh! ' + error);
              });
        }
      });
      // add list item to list
      list.appendChild(item);
      blocksAdded.push(name);
    }
  }
  // Init material ui list
  window.app.initLists();
};

/**
 * Checks if all devices from the reconnect modal have been paired.
 * @return {boolean} true if all devices have been paired.
 * @private
 */
Blast.Storage.allConnectedDesktop_ = function() {
  const blocks = document.getElementById('rc-tbody').querySelectorAll('tr');
  for (const block of blocks) {
    const pairStatus = document.getElementById('pairStatus-' + block.firstElementChild.textContent);
    console.log(pairStatus.innerHTML);
    if (pairStatus.innerHTML == '✘') {
      return false;
    }
  }
  return true;
};

/**
 * Checks if all devices from the reconnect modal have been paired.
 * @returns {boolean} true if all devices have been paired.
 */
Blast.Storage.allConnectedMobile_ = function() {
  const blocks = document.getElementById('rc-list').querySelectorAll('[id=rc-status-]');
  for (const block of blocks) {
    const pairStatus = document.getElementById('rc-status-' + block.textContent);
    if (pairStatus.innerHTML == 'disconnected') {
      return false;
    }
  }
  return true;
};

/**
 * Continues loading blocks after reconnecting to web bluetooth devices.
 * @param {!Element} xml XML to load into the workspace.
 * @private
 */
Blast.Storage.reconnectDoneHandler_ = function(xml) {
  if (window.location.href.includes('mobile')) {
    // hide reconnect dialog
    document.getElementById('rc-dialog').style.display = 'none';
  } else {
    // hide reconnect modal
    document.getElementById('rcModal').style.display = 'none';
  }
  // rebuild workspace from xml
  Blockly.Xml.domToWorkspace(xml, Blast.workspace);
  Blast.Storage.monitorChanges_(Blast.workspace);
};

/**
 * Cancels the reconnect modal.
 */
Blast.Storage.reconnectCancelHandler_ = function() {
  // hide reconnect modal
  document.getElementById('rcModal').style.display = 'none';
};
 
/**
  * Start monitoring the workspace. If a change is made that changes the XML,
  * clear the key from the URL. Stop monitoring the workspace once such a
  * change is detected.
  * @param {!Blockly.WorkspaceSvg} workspace Workspace.
  * @private
  */
Blast.Storage.monitorChanges_ = function(workspace) {
  const startXmlDom = Blockly.Xml.workspaceToDom(workspace);
  const startXmlText = Blockly.Xml.domToText(startXmlDom);
  /**
   * Monitors the workspace for changes to the xml
   */
  function change() {
    const xmlDom = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xmlDom);
    if (startXmlText != xmlText) {
      window.location.hash = '';
      workspace.removeChangeListener(change);
    }
  }
  workspace.addChangeListener(change);
};

/**
 * Generates a random filename and returns its path.
 * @returns {string} path to the random filename
 * @public
 * */
Blast.Storage.generatePath = function() {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 12; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *
 charactersLength)));
  }
  return result.join('');
};
 
window.addEventListener('load', function() {
  // get anchor
  const anchor = window.location.hash;
  if (anchor) {
    // remove the #.
    const path = anchor.substring(1);
    // try loading.
    try {
      Blast.Storage.retrieveXML_(path);
    } catch (e) {
      console.log(e);
    }
  }
});
