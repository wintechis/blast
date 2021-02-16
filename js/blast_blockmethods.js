/**
 * @fileoverview Methods used by Blast's Blocks.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 */
'use strict';

/**
 * Namespace for methods used by Blast's blocks.
 * @name Blast.BlockMethods
 * @namespace
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
  audio.play();
};


