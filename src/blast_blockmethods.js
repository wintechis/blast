/**
 * @fileoverview Methods used by Blast's Blocks.
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
goog.require('Blast.Things.ConsumedThing.BLE_RGB_LED_controller');

/**
 * Add a text message to the {@link Blast.Ui.messageOutputContainer}.
 * @param {string} text text message to output.
 * @public
 */
Blast.BlockMethods.displayText = function(text) {
  Blast.Things.ConsumedThing.Blast.blast.invokeAction('displayText', [text]);
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
  Blast.Things.ConsumedThing.Blast.blast.invokeAction('displayTable', [text]);
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
Blast.BlockMethods.sendHttpRequest = async function(
    uri, method, headersString, body, output, callback) {
  const retValue = await Blast.Things.ConsumedThing.Blast.blast.invokeAction(
      'sendHttpRequest', [uri, method, headersString, body, output, callback],
  );
  callback(retValue);
};

// temporary method for the th-praxistag works for getting integer values only
// TODO remove or fix after praxistag
Blast.BlockMethods.getRequest = async function(uri, headersString, callback) {
  const retValue = await Blast.Things.ConsumedThing.Blast.blast.invokeAction(
      'getRequest', [uri, headersString],
  );
  callback(retValue);
};

/**
 * Wrapper for urdf's query function.
 * @param {*} uri URI to query.
 * @param {*} query Query to execute.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.urdfQueryWrapper = async function(uri, query, callback) {
  const retValue = await Blast.Things.ConsumedThing.Blast.blast.invokeAction(
      'queryRDF', [uri, query],
  );
  callback(retValue);
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
Blast.BlockMethods.switchLights = async function(mac, r, y, g, callback) {
  // create value byte with checkboxes
  const redByte = r ? 'ff' : '00';
  const yellowByte = y ? 'ff' : '00';
  const greenByte = g ? 'ff' : '00';
  const value = '7e000503' + redByte + greenByte + yellowByte + '00ef';

  const light = new Blast.Things.ConsumedThing.BLE_RGB_LED_controller(mac);

  await light.switchLights(value);

  callback();
};

/**
 * Fetches the current temperature of the xiaomi bluetooth thermomether
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.getTemperature = async function(webBluetoothId, callback) {
  const devices = await navigator.bluetooth.getDevices();
  let device = null;

  for (const d of devices) {
    if (d.id == deviceId) {
      device = d;
      break;
    }
  }
  if (device == null) {
    Blast.throwError('Error pairing with Bluetooth device.');
  }

  device.gatt.connect()
      .then((server) => {
        return server.getPrimaryService('6e400001-b5a3-f393-e0A9-e50e24dcca9e');
      })
      .then((service) => {
        return service.getCharacteristic('');
      })
      .then((characteristic) => {
        return characteristic.readValue();
      })
      .then((value) => {
        callback(value);
      })
      .catch((error) => {
        Blast.throwError(error.message);
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
Blast.BlockMethods.getRSSI = async function(mac, callback) {
  const uri = `${Blast.config.hostAddress}current`;

  const scBleAdapter = new Blast.Things.ConsumedThing.sc_ble_adapter(uri);
  
  const rssi = await scBleAdapter.readProperty('rssiValue', {'mac': mac});

  callback(rssi);
};

/**
 * Get the RSSI of a bluetooth device, using webBluetooth.
 * @param {BluetoothDevice.id} webBluetoothId A DOMString that uniquely identifies a device.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.getRSSIWb = async function(webBluetoothId, callback) {
  const devices = await navigator.bluetooth.getDevices();
  let device = null;

  for (const d of devices) {
    if (d.id === webBluetoothId) {
      device = d;
      break;
    }
  }
  if (device == null) {
    Blast.throwError('Error pairing with Bluetooth device.');
  }

  await device.watchAdvertisements();

  device.addEventListener('advertisementreceived', async(evt) => {
    // Advertisement data can be read from |evt|.
    callback(evt.rssi);
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
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.playAudioFromURI = async function(uri, callback) {
  await Blast.Things.ConsumedThing.Blast.blast.invokeAction(
      'playAudioFromURI', [uri],
  );
  callback();
};

/**
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.textToSpeech = async function(uri, callback) {
  await Blast.Things.ConsumedThing.Blast.blast.invokeAction(
      'textToSpeech', [uri],
  );
  callback();
};

/**
 * Outputs speech input as string.
 * @param {Blockly.Block.id} blockId id of the webSpeech block.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */
Blast.BlockMethods.webSpeech = async function(blockId, callback) {
  const block = Blast.workspace.getBlockById(blockId);
  const recognition = block.recognition;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  let finalTranscript = '';

  recognition.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
  };

  recognition.onend = function() {
    callback(finalTranscript);
  };

  recognition.start();
};

/**
 * Generates and returns a random integer between a and b, inclusively.
 * @param {number} a lower limit.
 * @param {number} b upper limit.
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

/**
 * Adds handler for button pushes on an elGato Stream Deck
 * @param {Blockly.Block.id} blockId id of the streamdeck block.
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {boolean[]} buttonArray array containing pushed buttons.
 * @param {String} statements .
 */
Blast.BlockMethods.handleStreamdeck = async function(blockId, id, buttonArray, statements) {
  const type = 'inputreport';

  const device = Blast.Things.webHidDevices.get(id);
  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      Blast.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  const fn = function(event) {
    if (event.reportId === 0x01) {
      const keys = new Int8Array(event.data.buffer);
      const start = 0;
      const end = 6;
      const data = Array.from(keys).slice(start, end);
       
      // convert jsInterpreter Object to numbers array.
      buttonArray = buttonArray.toString().split(',').map(Number);
      // check if defined buttons are pushed.
      if (data.every((val, index) => val === buttonArray[index])) {
        // interrupt BLAST execution.
        Blast.Interrupted = true;
        
        const interpreter = new Interpreter('');
        interpreter.stateStack[0].scope = Blast.Interpreter.globalScope;
        interpreter.appendCode(statements);

        const interruptRunner_ = function() {
          try {
            const hasMore = interpreter.step();
            if (hasMore) {
              setTimeout(interruptRunner_, 5);
            } else {
              // Continue BLAST execution.
              Blast.Interrupted = false;
            }
          } catch (error) {
            Blockly.alert('Error executing program:\n%e'.replace('%e', error));
            Blast.Ui.setStatus(Blast.status.ERROR);
            Blast.resetInterpreter();
            console.error(error);
          }
        };
        interruptRunner_();
      }
    }
  };
  Blast.deviceEventHandlers.push({device: device, type: type, fn: fn});
  device.addEventListener(type, fn);
};
