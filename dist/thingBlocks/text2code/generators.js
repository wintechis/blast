'use strict';
import * as tf from '@tensorflow/tfjs';
import 'babel-polyfill';
import inputWord2idx from './mappings/input-word2idx.js';
import wordContext from './mappings/word-context.js';
import targetWord2idx from './mappings/target-word2idx.js';
import targetIdx2word from './mappings/target-idx2word.js';

import Blockly from 'blockly';
import {asyncApiFunctions, getInterpreter,throwError} from './../../blast_interpreter.js';

  /**
 * Generates JavaScript code for the text_to_code block.
 * @param {Blockly.Block} block the text_to_code block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['text_to_code'] = function(block) {
    // inputText
    let text = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC); // return string
   // parsed code outpt
    //let text = block.getFieldValue('text');
    //const textNew = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_NONE);
    
    console.log(typeof text);
    console.log(text);
    //console.log(typeof textNew);
    //console.log(textNew);

    const code = `textToCode(${text})`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  };


// main funtion takes user input text and return parsed code
const textToCode = async function (text, callback) {
    console.log(typeof text);
    console.log(text);
    const encoder = await tf.loadLayersModel('/src/thingBlocks/text2code/tfjs_model/encoder/model.json')
    const decoder = await tf.loadLayersModel('/src/thingBlocks/text2code/tfjs_model/decoder/model.json')

    let inputText = text;
    //console.log(inputText);
    //console.log(typeof text);
    const inputTensor = convertSentenceToTensor(text);
    const states = encoder.predict(inputTensor);
    decoder.layers[1].resetStates(states);

    let responseTokens = [];
    let terminate = false;
    let nextTokenID = targetWord2idx['<SOS>'];
    let numPredicted = 0;

    while (!terminate) {
        const outputTokenTensor = tf.tidy(() => {
            const input = generateDecoderInputFromTokenID(nextTokenID);
                const prediction = decoder.predict(input);
                return prediction.squeeze().argMax();
        });

        const outputToken = await outputTokenTensor.data();
        outputTokenTensor.dispose();
        nextTokenID = Math.round(outputToken[0]);
        const word = targetIdx2word[nextTokenID];
        numPredicted++;
        console.log(outputToken, nextTokenID, word);

        if (word !== '<EOS>' && word !== '<SOS>') {
            responseTokens.push(word);
        }

        if (word === '<EOS>'
            || numPredicted >= wordContext.decoder_max_seq_length) {
            terminate = true;
        }
        // tf.nextFrame() returns a promise which determines at which a requestAnimationFrame has been terminated.
        await tf.nextFrame();
    }


    states[0].dispose();
    states[1].dispose();

    callback (convertTokensToSentence(responseTokens))
  }


// convert input text into tensors
function convertSentenceToTensor(text) {
    let inputWordIds = [];
    let textArray = text.toString().split(' ');
    console.log(text);
    console.log(typeof text);
    console.log(typeof textArray);

    textArray.map((x) => {
        x = x.toLowerCase();
        let idx = '1'; // '1' index for UNK
        if (x in inputWord2idx) {
            idx = inputWord2idx[x];
        }
        inputWordIds.push(Number(idx));
    });

    if (inputWordIds.length < wordContext.encoder_max_seq_length) {
        inputWordIds =
            Array.concat(
                new Array(
                    wordContext.encoder_max_seq_length - inputWordIds.length + 1)
                    .join('0').split('').map(Number),
                inputWordIds
            ); // '0' index for PAD
    } else {
        inputWordIds = inputWordIds.slice(0, wordContext.encoder_max_seq_length);
    }
    console.log(inputWordIds);
    return tf.tensor2d(inputWordIds, [1, wordContext.encoder_max_seq_length]);
  }

// concantate each predicted tokens into string
function convertTokensToSentence(tokens) {
      return tokens.join(' ');
  }
 
// decoder current token output will be input for next time stamp
function generateDecoderInputFromTokenID(tokenID) {
      const buffer = tf.buffer([1, 1, wordContext.num_decoder_tokens]);
      buffer.set(1, 0, 0, tokenID);
      return buffer.toTensor();
  }
 
  
asyncApiFunctions.push(['textToCode', textToCode]);


