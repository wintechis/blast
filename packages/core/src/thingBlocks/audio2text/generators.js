'use strict';
import 'babel-polyfill';
import Blockly from 'blockly';
import {asyncApiFunctions, getInterpreter,throwError} from '../../blast_interpreter.js';

/**
 * Generates Javascript code for the web_speech block.
 * Outputs speech command from microphone as a string.
 * @param {Blockly.Block} block the web_speech block.
 * @returns {String} the speech command.
 */

// eslint-disable-next-line no-unused-vars
Blockly.JavaScript['audio_to_text'] = function (block) {

    const code = `audioToText()`;

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

/**
 * Outputs speech input as string.
 * @param {Blockly.Block.id} blockId id of the speechToText block.
 * @param {JSInterpreter.AsyncCallback} callback JS Interpreter callback.
 * @public
 */

const audioToText = async function() {
  const tf = require('@tensorflow/tfjs');
  const speechCommands = require('@tensorflow-models/speech-commands');

  const recognizer = speechCommands.create("BROWSER_FFT");

  await recognizer.ensureModelLoaded();



  const wordList = new Map([
      ["zero", 0],
      ["one", 1],
      ["two", 2],
      ["three", 3],
      ["four", 4],
      ["five", 5],
      ["six", 6],
      ["seven", 7],
      ["eight", 8],
      ["nine", 9],
      ["up", "up" ],
      ["down", "down"],
      ["left", "left"],
      ["right", "right"],
      ["go", "go" ],
      ["stop", "stop" ],
      ["yes", "yes" ],
      ["no", "no" ]
      ]);

  const audioWords = Array.from(wordList.keys());

  // show array of words that the recognizer is trained to recognize.
  console.log(recognizer.wordLabels());

  recognizer.listen(result => {
    // - result.scores contains the probability scores that correspond to
    //   recognizer.wordLabels().
    // - result.spectrogram contains the spectrogram of the recognized word.
  }, {
    includeSpectrogram: true,
    probabilityThreshold: 0.75
  });
}

  // add block speechToText to the interpreter's API.
asyncApiFunctions.push(['audioToText', audioToText]);
