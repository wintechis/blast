/**
 * @fileoverview Code generators for the streamdeck blocks
 * (https://www.elgato.com/de/stream-deck).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
 
/**
  * Generates JavaScript code for the streamdeck_buttons block.
  * @param {Blockly.Block} block the streamdeck_buttons block.
  * @returns {String} the generated code.
  */
Blockly.JavaScript['streamdeck_buttons'] = function(block) {
  const button1 = block.getFieldValue('button1') == 'TRUE' ? 1 : 0;
  const button2 = block.getFieldValue('button2') == 'TRUE' ? 1 : 0;
  const button3 = block.getFieldValue('button3') == 'TRUE' ? 1 : 0;
  const button4 = block.getFieldValue('button4') == 'TRUE' ? 1 : 0;
  const button5 = block.getFieldValue('button5') == 'TRUE' ? 1 : 0;
  const button6 = block.getFieldValue('button6') == 'TRUE' ? 1 : 0;
  const id = Blockly.JavaScript.valueToCode(
      block,
      'id',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;
    
  const buttonArray = [button1, button2, button3, button4, button5, button6];
  const statements = Blockly.JavaScript.quote_(Blockly.JavaScript.statementToCode(block, 'statements'));

  const handler = `handleStreamdeck(${id}, [${buttonArray}], ${statements});\n`;
  const handlersList = Blockly.JavaScript.definitions_['eventHandlers'] || '';
  Blockly.JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  console.log('foo');

  return '';
};


/**
 * Handles button pushes on an elGato Stream Deck
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {boolean[]} buttonArray array containing pushed buttons.
 * @param {String} statements code to be executed when the buttons are pushed.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 */
const handleStreamdeck = async function(id, buttonArray, statements, callback) {
  // If no things block is attached, return.
  if (!id) {
    Blast.throwError('No streamdeck block set.');
    callback();
    return;
  }
  const type = 'inputreport';

  const device = Blast.Things.webHidDevices.get(id);

  if (!device) {
    Blast.throwError('Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID');
    callback();
    return;
  }

  if (!device.opened) {
    try {
      await device.open();
    } catch (error) {
      console.error(error);
      Blast.throwError('Failed to open device, your browser or OS probably doesn\'t support webHID.');
    }
  }

  // check if device is a Stream Deck
  if (device.vendorId != 4057) {
    Blast.throwError('The connected device is not a Streamdeck.');
    return;
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
            Blast.throwError(`Error executing program:\n ${e}`);
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

// Add streamdeck function to the Interpreter's API
Blast.apiFunctions.push(['handleStreamdeck', handleStreamdeck]);
