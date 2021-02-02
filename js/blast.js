/**
 * @fileoverview JavaScript for Blast (https://github.com/wintechis/blast).
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * Blast application namespace
 * @namespace Blast
 * @public
 */
const Blast = {};

/**
 * Blockly's main workspace.
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
 * Singleton instance of runner function.
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
    toolbox: defaultToolbox,
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

  // Display output hint
  Blast.BlockMethods.displayText('Actionblock output will be displayed here');
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

/**
 * Namespace for methods used by Blast's blocks.
 * @namespace Blast.BlockMethods
 * @public
 */
Blast.BlockMethods = {};

/**
 * Add a text message to the {@link Blast.messageOutputContainer}.
 * @param {string} text text message to output.
 * @public
 */
Blast.BlockMethods.displayText = function(text) {
  // Limit messages to 100
  if (Blast.messageCounter_ > 100) {
    Blast.messageOutputContainer.firstChild.remove();
  }
  // container for the new message
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.id = 'message-' + Blast.messageCounter_++;

  const textNode = document.createTextNode(text);
  msg.appendChild(textNode);

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('time');
  timeSpan.innerHTML = new Date().toLocaleTimeString();
  msg.appendChild(timeSpan);

  // insert new message
  Blast.messageOutputContainer.appendChild(
      msg,
      Blast.messageOutputContainer.firstChild,
  );

  // scroll to bottom
  Blast.messageOutputContainer.scrollTop =
    Blast.messageOutputContainer.scrollHeight;
};

/**
 * Generate HTML Table from graph
 * and add it to {@link Blast.messageOutputContainer}.
 * @param {graph} table table to output.
 * @public
 */
Blast.BlockMethods.displayTable = function(table) {
  // Limit messages to 100
  if (Blast.messageCounter_ > 100) {
    Blast.messageOutputContainer.firstChild.remove();
  }
  // display message if table is empty
  if (table.length == 0) {
    Blast.displayText('empty table');
    return;
  }
  // deal with missing values
  const vars = table.reduce((list, res) => {
    for (const v in res) {
      if (list.indexOf(v) === -1) list.push(v);
    }
    return list;
  }, []);
  // Element for new table
  let html = '<tr>';
  vars.forEach((v) => (html += '<th>' + v + '</th>'));
  html += '</tr>';

  table.forEach((res) => {
    html += '<tr>';
    vars.forEach(
        (v) => (html += '<td>' + (res[v] ? res[v].value : '') + '</td>'),
    );
    html += '</tr>';
  });

  const resultsField = document.createElement('table');
  resultsField.classList.add('output_table');
  resultsField.innerHTML = html;
  // insert new table
  Blast.messageOutputContainer.appendChild(
      resultsField,
      Blast.messageOutputContainer.firstChild,
  );

  // scroll to bottom
  Blast.messageOutputContainer.scrollTop =
    Blast.messageOutputContainer.scrollHeight;
};

/**
 * Sends a HTTP request to URI returning the status or the response
 * depending on the output parameter.
 * @param {string} uri URI to request.
 * @param {string} method HTTP request method.
 * @param {string} headersString JSON string containing headers.
 * @param {string=} body JSON string containing body, optional.
 * Not needed when method is GET.
 * @param {string} output Output can be status or response.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.sendHttpRequest = function(
    uri,
    method,
    headersString,
    body,
    output,
    callback,
) {
  if (uri == null || uri == undefined || uri == '') {
    Blast.throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: method,
    headers: new Headers(headersJSON),
  };

  if (body) {
    requestOptions.body = body;
  }

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        if (output == 'status') {
          callback(res.status);
        }
        return res.text();
      })
      .then((resData) => {
        urdf.clear();
        urdf.load(resData).then(() => {
          urdf
              .query('SELECT * WHERE {?subject ?predicate ?object}')
              .then((result) => {
                callback(result);
              });
        });
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};

/**
 * Wrapper for urdf's query function.
 * @param {*} uri URI to query.
 * @param {*} query Query to execute.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.urdfQueryWrapper = function(uri, query, callback) {
  fetch(uri)
      .then((res) => {
        return res.text();
      })
      .then((graph) => {
        urdf.clear();
        urdf.load(graph).then(() => {
          urdf.query(query).then((result) => {
            callback(result);
          });
        });
      });
};

/**
 * Switches the LEDs of a LED strip controller (https://github.com/arduino12/ble_rgb_led_strip_controller) on or off.
 * @param {string} mac MAC address of the LED Strip controller.
 * @param {boolean} r defines wether to switch the red LED on.
 * @param {boolean} y defines wether to switch the yellow LED on.
 * @param {boolean} g defines wether to switch the green LED on.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.switchLights = function(mac, r, y, g, callback) {
  const redByte = r ? 'ff' : '00';
  const yellowByte = y ? 'ff' : '00';
  const greenByte = g ? 'ff' : '00';
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const data = {
    type: 'ble:Write',
    handle: '0009',
    data: {
      '@value': '7e000503' + redByte + greenByte + yellowByte + '00ef',
      '@type': 'xsd:hexBinary',
    },
  };

  (async () => {
    console.log(1);
    await fetch(`http://192.168.178.22:8000/devices/${mac}/instruction`, {
      method: 'PUT',
      headers: headers,
      body: '{ "type": "ble:Connect" }',
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(2);
    await fetch(`http://192.168.178.22:8000/devices/${mac}/gatt/instruction`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
    });
    console.log(3);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await fetch(`http://192.168.178.22:8000/devices/${mac}/instruction`, {
      method: 'PUT',
      headers: headers,
      body: '{ "type": "ble:Disconnect" }',
    });
    console.log(4);
    callback();
  })();

  // fetch(`http://192.168.178.22:8000/devices/${mac}/instruction`, {
  //   method: 'PUT',
  //   headers: headers,
  //   body: '{ "type": "ble:Connect" }',
  // }).then((res) => {
  //   console.log(res.text());
  //   fetch(`http://192.168.178.22:8000/devices/${mac}/gatt/instruction`, {
  //     method: 'PUT',
  //     headers: headers,
  //     body: JSON.stringify(data),
  //   }).then((res2) => {
  //     console.log(res2.text());
  //     fetch(`http://192.168.178.22:8000/devices/${mac}/instruction`, {
  //       method: 'PUT',
  //       headers: headers,
  //       body: '{ "type": "ble:Disconnect" }',
  //     }).then((res3) => {
  //       console.log(res3.text());
  //       callback();
  //     });
  //   });
  // });
};

/**
 * Sets a timeout of timeInSeconds.
 * @param {*} timeInSeconds time in seconds to wait
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.waitForSeconds = function(timeInSeconds, callback) {
  setTimeout(callback, timeInSeconds * 1000);
};

/**
 * Get table cell in column retValue where key.value = value.
 * @param {string} address URI to get table from.
 * @param {string} key column searched for value.
 * @param {string} value identifier row.
 * @param {string} retValue column to return.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.getTableCell = function(
    address,
    key,
    value,
    retValue,
    callback,
) {
  const url = new URL(address);
  const baseUrl = url.protocol + '//' + url.host;
  const path = url.pathname;
  const query = `BASE <${baseUrl}>
      PREFIX sosa: <http://www.w3.org/ns/sosa/>

      SELECT ?mac ?rssi ?resultTime
      FROM <${path}>
      WHERE {
        ?obs sosa:hasSimpleResult ?rssi .
        ?obs sosa:resultTime ?resultTime .
        BIND (STRLEN(?obs) AS ?URILEN)
        BIND (substr(?obs, ?URILEN - 12, 12) AS ?mac)
      }`;

  urdf.clear();
  urdf.query(query).then((result) => {
    let cbValue = null;
    for (const row of result) {
      if (row[key].value == value) {
        cbValue = row[retValue].value;
      }
    }
    callback(cbValue);
  });
};

/**
 * Map containing previous values (as graph) for events identified by Block IDs.
 * @type {Map<!Blockly.Block.id, graph>}
 * @public
 */
Blast.BlockMethods.eventValues = new Map();

/**
 * Checks wether a comparison becomes or stops being true.
 * @param {string} measurement the current measurement.
 * @param {string} negate '!' if checking for stops being true, '' otherwise.
 * @param {string} operator compare operator.
 * @param {string} value the value to compare to.
 * @param {Blockly.Block.id} blockId
 * @public
 * @return {boolean} true if the event condition is true, false otherwise
 */
Blast.BlockMethods.eventChecker = function(
    measurement,
    negate,
    operator,
    value,
    blockId,
) {
  const prevMeasurement = Blast.BlockMethods.eventValues.get(blockId);

  // The first time eventblock with id blockId is executed,
  // there's no stored values so return undefined
  if (prevMeasurement != undefined) {
    const wasNotBefore = `!(${prevMeasurement} ${operator} ${value})`;
    const isNow = `${negate} (${measurement} ${operator} ${value}`;
    const s = `${negate}(${wasNotBefore}) && ${isNow})`;
    const event = eval(s);
    Blast.BlockMethods.eventValues.set(blockId, measurement);

    return event;
  } else {
    Blast.BlockMethods.eventValues.set(blockId, measurement);
    return undefined;
  }
};

/**
 * Plays an audio file provided by URI
 * @param {string} uri URI of the audio file to play
 * @public
 */
Blast.BlockMethods.playAudioFromURI = function(uri) {
  const audio = new Audio(uri);
  audio.setOrigin
  audio.play();
};
