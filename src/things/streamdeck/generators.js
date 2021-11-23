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
  const upDown = Blockly.JavaScript.quote_(block.getFieldValue('upDown'));
  const id = Blockly.JavaScript.valueToCode(
      block,
      'id',
      Blockly.JavaScript.ORDER_NONE,
  ) || null;
    
  const buttons = Blockly.JavaScript.quote_(
      `${button1}${button2}${button3}${button4}${button5}${button6}`,
  );
  const statements = Blockly.JavaScript.quote_(Blockly.JavaScript.statementToCode(block, 'statements'));

  const handler = `handleStreamdeck(${id}, ${buttons}, ${upDown}, ${statements});\n`;
  const handlersList = Blockly.JavaScript.definitions_['eventHandlers'] || '';
  Blockly.JavaScript.definitions_['eventHandlers'] = handlersList + handler;

  return '';
};


/**
 * Handles button pushes on an elGato Stream Deck
 * @param {String} id identifier of the streamdeck device in {@link Blast.Things.webHidDevices}.
 * @param {String} buttons string containing pushed buttons seperated by whitespaces.
 * @param {String} upDown string containing the direction of the button push.
 * @param {String} statements code to be executed when the buttons are pushed.
 */
const handleStreamdeck = async function(id, buttons, upDown, statements) {
  // If no things block is attached, return.
  if (id === null) {
    Blast.throwError('No streamdeck block set.');
    callback();
    return;
  }


  const device = Blast.Things.webHidDevices.get(id);

  if (!device) {
    Blast.throwError('Connected device is not a HID device.\nMake sure you are connecting the Streamdeck via webHID');
    callback();
    return;
  }

  let streamdeck;
  
  try {
    streamdeck = await StreamDeck.openDevice(device);
  } catch (e) {
    // if InvalidStateError error, device is probably already opened
    if (e.name == 'InvalidStateError') {
      device.close();
      streamdeck = await StreamDeck.openDevice(device);
    } else {
      Blast.throwError(e);
      callback();
      return;
    }
  }

  let button;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons.indexOf(i) === 1) {
      button = i;
      break;
    }
  }
  
  if (button === undefined) {
    callback();
    return;
  }

  streamdeck.on(upDown, (keyIndex) => {
    if (keyIndex === button) {
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
  });

  Blast.cleanUpFunctions.push(() => {
    streamdeck.close();
    streamdeck.removeAllListeners();
  },
  );
};

// Add streamdeck function to the Interpreter's API
Blast.apiFunctions.push(['handleStreamdeck', handleStreamdeck]);
