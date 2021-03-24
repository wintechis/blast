/**
 * @fileoverview Methods used by Blast's Blocks.
 * https://github.com/wintechis/blast
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
'use strict';

/**
 * Namespace for methods used by Blast's blocks.
 * @name Blast.BlockMethods
 * @namespace
 */
goog.provide('Blast.BlockMethods');

goog.require('Blast.Ui');
goog.require('Blast.Bluetooth');
goog.require('Blast.States');

/**
 * Add a text message to the {@link Blast.Ui.messageOutputContainer}.
 * @param {string} text text message to output.
 * @public
 */
Blast.BlockMethods.displayText = function(text) {
  Blast.Ui.addMessage(text);
};

/**
 * Generate HTML Table from graph
 * and add it to {@link Blast.Ui.messageOutputContainer}.
 * @param {graph} graph graph to output.
 * @public
 */
Blast.BlockMethods.displayTable = function(graph) {
  // display message if table is empty
  if (graph.length == 0) {
    Blast.Ui.addMessage('empty table');
    return;
  }
  // deal with missing values
  const vars = graph.reduce((list, res) => {
    for (const v in res) {
      if (list.indexOf(v) === -1) list.push(v);
    }
    return list;
  }, []);
  // Element for new table
  let html = '<tr>';
  vars.forEach((v) => (html += '<th>' + v + '</th>'));
  html += '</tr>';

  graph.forEach((res) => {
    html += '<tr>';
    vars.forEach((v) => (html += '<td>' + (res[v] ? res[v].value : '') + '</td>'));
    html += '</tr>';
  });

  const table = document.createElement('table');
  table.classList.add('output_table');
  table.innerHTML = html;
  // insert new table
  Blast.Ui.addElementToOutputContainer(table);
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
Blast.BlockMethods.sendHttpRequest = function(uri, method, headersString, body, output, callback) {
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
          urdf.query('SELECT * WHERE {?subject ?predicate ?object}').then((result) => {
            callback(result);
          });
        });
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};

// temporary method for the th-praxistag works for getting integer values only
// TODO remove or fix after praxistag
Blast.BlockMethods.getRequest = function(uri, headersString, callback) {
  if (uri == null || uri == undefined || uri == '') {
    Blast.throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: 'GET',
    headers: new Headers(headersJSON),
  };

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        console.log(resData);
        callback(parseInt(resData));
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
  urdf.clear();
  urdf.loadFrom(uri).then(() => {
    urdf.query(query).then((result) => {
      callback(result);
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

  const value = '7e000503' + redByte + greenByte + yellowByte + '00ef';
  const type = 'xsd:hexBinary';

  Blast.Bluetooth.connect(mac)
      .then(() => {
        Blast.Bluetooth.gatt_write(mac, '0009', type, value, 1500);
      })
      .then(() => Blast.Bluetooth.disconnect(mac))
      .then(() => callback());
};

/**
 * Fetches the current temperature of the xiaomi bluetooth thermomether
 * @param {string} mac MAC address of the thermometer.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.getTemperature = function(mac, callback) {
  const uri = `${Blast.config.hostAddress}devices/${mac}/current`;
  const requestOptions = {
    method: 'GET',
  };

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        const temp = JSON.parse(resData)['@graph'][1].result.temperature;
        callback(temp);
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
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
 * Get the RSSI of a bluetooth device.
 * @param {string} mac MAC of the Bluetooth device.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.getRSSI = function(mac, callback) {
  const uri = `${Blast.config.hostAddress}current`;
  const requestOptions = {
    method: 'GET',
  };

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        const currentGraph = JSON.parse(resData)['@graph'];
        let found = false;
        for (const node of currentGraph) {
          if (node.id == '#' + mac) {
            found = true;
            callback(node.rssiValue);
          }
        }
        if (!found) {
          Blast.throwError(`${mac} not found.`);
        }
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};

/**
 * Add an event to the Event interpreter.
 * @param {string} conditions the state conditions.
 * @param {string} statements code to be executed if condtions are true.
 * @param {Blockly.Block.id} blockId id of the state defintion block.
 * @public
 */
Blast.BlockMethods.addEvent = function(conditions, statements, blockId) {
  Blast.States.addEvent(conditions, statements, blockId);
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

/**
 * Generates and returns a random integer between a and b, inclusively.
 * @param {number} a lower limit
 * @param {number} b upper limit
 * @return {number} generated random number.
 * @public
 */
Blast.BlockMethods.numberRandom = function(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    const c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
};
