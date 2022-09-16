'use strict';
import * as tf from '@tensorflow/tfjs';
import 'babel-polyfill';
import inputWord2idx from './mappings/input-word2idx.js';
import wordContext from './mappings/word-context.js';
import targetWord2idx from './mappings/target-word2idx.js';
import targetIdx2word from './mappings/target-idx2word.js';

import Blockly from 'blockly';

/**
 * Generates JavaScript code for the text_to_code block.
 * @param {Blockly.Block} block the text_to_code block.
 * @returns {String} the generated code.
 */
Blockly.JavaScript['text_to_code'] = function (block) {
  const text = Blockly.JavaScript.valueToCode(
    block,
    'text',
    Blockly.JavaScript.ORDER_ATOMIC
  );

  const code = `await textToCode(${text})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code from text input.
 * @param {String} text the text input
 * @returns {String} the generated code.
 */
globalThis['textToCode'] = async function (text) {
  const encoder = await tf.loadLayersModel(
    '../core/src/thingBlocks/text2code/tfjs_model/encoder/model.json'
  );
  const decoder = await tf.loadLayersModel(
    '../core/src/thingBlocks/text2code/tfjs_model/decoder/model.json'
  );

  const inputTensor = convertSentenceToTensor(text);
  const states = encoder.predict(inputTensor);
  decoder.layers[1].resetStates(states);

  const responseTokens = [];
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

    if (word !== '<EOS>' && word !== '<SOS>') {
      responseTokens.push(word);
    }

    if (
      word === '<EOS>' ||
      numPredicted >= wordContext.decoder_max_seq_length
    ) {
      terminate = true;
    }

    await tf.nextFrame();
  }

  states[0].dispose();
  states[1].dispose();

  const sentence = convertTokensToSentence(responseTokens);
  return sentence;
};

/**
 * Converts a sentence to a tensor.
 * @param {String} sentence the sentence.
 * @returns {tf.Tensor} the tensor.
 */
function convertSentenceToTensor(sentence) {
  let inputWordIds = [];
  const textArray = sentence.toString().split(' ');

  textArray.map(x => {
    x = x.toLowerCase();
    let idx = '1'; // '1' index for UNK
    if (x in inputWord2idx) {
      idx = inputWord2idx[x];
    }
    inputWordIds.push(Number(idx));
  });

  if (inputWordIds.length < wordContext.encoder_max_seq_length) {
    inputWordIds = Array.concat(
      new Array(wordContext.encoder_max_seq_length - inputWordIds.length + 1)
        .join('0')
        .split('')
        .map(Number),
      inputWordIds
    ); // '0' index for PAD
  } else {
    inputWordIds = inputWordIds.slice(0, wordContext.encoder_max_seq_length);
  }

  return tf.tensor2d(inputWordIds, [1, wordContext.encoder_max_seq_length]);
}

/**
 * Converts tokens to a sentence, by concatenating them.
 * @param {String[]} tokens the tokens.
 * @returns {String} the sentence.
 */
function convertTokensToSentence(tokens) {
  return tokens.join(' ');
}

/**
 * Generates decoder input from a token ID.
 * @param {Number} tokenID the token ID.
 * @returns {tf.Tensor} the tensor.
 */
function generateDecoderInputFromTokenID(tokenID) {
  const buffer = tf.buffer([1, 1, wordContext.num_decoder_tokens]);
  buffer.set(1, 0, 0, tokenID);
  return buffer.toTensor();
}
