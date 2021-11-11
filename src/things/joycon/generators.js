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
  if (device.vendorId !== 1406 || device.productId !== 8198) {
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
