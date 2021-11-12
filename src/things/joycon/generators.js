/**
 * @fileoverview Code generators for the joycon blocks.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
/**
  * Generates JavaScript code for the joycon_read_property block.
  * @param {Blockly.Block} block the joycon_read_property block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['joycon_read_property'] = function(block) {
  const property = block.getFieldValue('property');
  const sub = block.getFieldValue('propertySubValue') || '';
  const sub2 = block.getFieldValue('propertySubValue2') || '';
  const sub3 = block.getFieldValue('propertySubValue3') || '';
  const id = Blockly.JavaScript.valueToCode(
      block,
      'Thing',
      Blockly.JavaScript.ORDER_NONE,
  );

  const code = `readJoyConProperty(${id}, '${property}', '${sub}', '${sub2}', '${sub3}')`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Reads a property of a Joy-Con.
 * @param {string} id the id of the Joy-Con.
 * @param {string} property the property to read.
 * @param {string} subValue first sub level of the property.
 * @param {string} subValue2 second sub level of the property.
 * @param {string} subValue3 third sub level of the property.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @returns {string} the value of the property.
 * @private
 */
const readJoyConProperty = async function(id, property, subValue, subValue2, subValue3, callback) {
  // If no things block is attached, return.
  if (!id) {
    Blast.throwError('No Joy-Con block set.');
    callback();
    return;
  }

  const device = Blast.Things.webHidDevices.get(id);

  if (!device) {
    Blast.throwError('Connected device is not a HID device.\nMake sure you are connecting the JoyCon via webHID');
    callback();
    return;
  }


  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      Blast.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  // Check if device is a Joy-Con.
  if (device.vendorId !== 1406 || (device.productId !== 0x2006 && device.productId !== 0x2007)) {
    Blast.throwError('The connected device is not a Joy-Con.');
    callback();
    return;
  }

  let joyCon;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    joyCon = new JoyConRight(device);
  }
  await joyCon.open();
  await joyCon.enableStandardFullMode();
  await joyCon.enableIMUMode();

  const hidInputHandler = async function(event) {
    const packet = event.detail;
    if (!packet || !packet.actualOrientation) {
      return;
    }
    
    joyCon.removeEventListener('hidinput', hidInputHandler);
    if (subValue2 !== '') {
      if (property === 'accelerometers') {
        callback(packet[property][subValue][subValue2].acc);
      } else if (property === 'gyroscopes') {
        callback(packet[property][subValue][subValue2][subValue3]);
      } else {
        callback(packet[property][subValue][subValue2]);
      }
    } else {
      callback(packet[property][subValue]);
    }
  };

  if (!joyCon.eventListenerAttached) {
    await joyCon.open();
    await joyCon.enableStandardFullMode();
    await joyCon.enableIMUMode();
    await joyCon.enableVibration();
    joyCon.addEventListener('hidinput', hidInputHandler);

    joyCon.eventListenerAttached = true;
  }
};

// add joycon_read_property function to the interpreter's API.
Blast.asyncApiFunctions.push(['readJoyConProperty', readJoyConProperty]);

/**
 * Generates JavaScript code for the joycon_button_events block.
 * @param {Blockly.Block} block the joycon_button_events block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['joycon_button_events'] = function(block) {
  const thing = Blockly.JavaScript.valueToCode(block, 'Thing', Blockly.JavaScript.ORDER_NONE);
  const button = Blockly.JavaScript.quote_(block.getFieldValue('button'));
  const statements = Blockly.JavaScript.quote_(Blockly.JavaScript.statementToCode(block, 'statements'));
  
  const code = `handleJoyConButtons(${thing}, ${button}, ${statements});\n`;
  return code;
};

/**
 * Handles button pushed on a Nintendo JoyCon.
 * @param {string} id identifier of the JoyCon device in {@link Blast.Things.webHidDevices}.
 * @param {string} button the button to handle.
 * @param {string} statements the statements to execute when the button is pushed.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const handleJoyConButtons = async function(id, button, statements, callback) {
  // If no things block is attached, return.
  if (!id) {
    Blast.throwError('No Joy-Con block set.');
    callback();
    return;
  }

  const device = Blast.Things.webHidDevices.get(id);

  if (!device) {
    Blast.throwError('Connected device is not a HID device.\nMake sure you are connecting the JoyCon via webHID');
    callback();
    return;
  }

  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      Blast.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  // Check if device is a Joy-Con.
  if (device.vendorId !== 1406 || (device.productId !== 0x2006 && device.productId !== 0x2007)) {
    Blast.throwError('The connected device is not a Joy-Con.');
    callback();
    return;
  }

  let joyCon;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    joyCon = new JoyConRight(device);
  }
  await joyCon.open();
  await joyCon.enableStandardFullMode();
  await joyCon.enableIMUMode();

  let pushedInLastPacket = false;

  const hidInputHandler = async function(event) {
    const packet = event.detail;
    if (!packet || !packet.actualOrientation) {
      return;
    }

    if (packet.buttonStatus[button]) {
      if (!pushedInLastPacket) {
        pushedInLastPacket = true;
        // interrupt BLAST execution
        Blast.Interrupted = false;

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
            Blast.throwError(`Error executing program:\n ${e}`);
            console.error(error);
          }
        };
        interruptRunner_();
      }
    } else {
      pushedInLastPacket = false;
    }
  };

  Blast.deviceEventHandlers.push({device: joyCon, type: 'hidinput', fn: hidInputHandler});

  if (!joyCon.eventListenerAttached) {
    await joyCon.open();
    await joyCon.enableStandardFullMode();
    await joyCon.enableIMUMode();
    await joyCon.enableVibration();
    joyCon.addEventListener('hidinput', hidInputHandler);

    joyCon.eventListenerAttached = true;
  }
};

// add joycon_button_events function to the interpreter's API.
Blast.apiFunctions.push(['handleJoyConButtons', handleJoyConButtons]);
