import * as tf from '@tensorflow/tfjs';
import inputWord2idx from './mappings/input-word2idx.js';
import wordContext from './mappings/word-context.js';
import targetWord2idx from './mappings/target-word2idx.js';
import targetIdx2word from './mappings/target-idx2word.js';

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

/**
 * Generates JavaScript code for the text_to_code block.
 */
JavaScript['text_to_code'] = function (block: Block): [string, number] {
  const text = JavaScript.valueToCode(block, 'text', JavaScript.ORDER_ATOMIC);

  const code = `await textToCode(${text})`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code from text input.
 */
(globalThis as any)['textToCode'] = async function (text: string) {
  const encoder = await tf.loadLayersModel(
    '../core/src/drivers/text2code/tfjs_model/encoder/model.json'
  );
  const decoder = await tf.loadLayersModel(
    '../core/src/drivers/text2code/tfjs_model/decoder/model.json'
  );

  const inputTensor = convertSentenceToTensor(text);
  const states = encoder.predict(inputTensor);
  decoder.layers[1].resetStates();

  const responseTokens = [];
  let terminate = false;
  let nextTokenID = targetWord2idx['<SOS>'];
  let numPredicted = 0;

  while (!terminate) {
    const outputTokenTensor = tf.tidy(() => {
      const input = generateDecoderInputFromTokenID(nextTokenID);
      const prediction = decoder.predict(input);
      return (prediction as any).squeeze().argMax();
    });

    const outputToken = await outputTokenTensor.data();
    outputTokenTensor.dispose();
    nextTokenID = Math.round(outputToken[0]);
    const word = (targetIdx2word as any)[nextTokenID];
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

  (states as any)[0].dispose();
  (states as any)[1].dispose();

  const sentence = convertTokensToSentence(responseTokens);
  return sentence;
};

/**
 * Converts a sentence to a tensor.
 */
function convertSentenceToTensor(sentence: string): tf.Tensor {
  let inputWordIds: number[] = [];
  const textArray = sentence.toString().split(' ');

  textArray.map(x => {
    x = x.toLowerCase();
    let idx = '1'; // '1' index for UNK
    if (x in inputWord2idx) {
      idx = (inputWord2idx as any)[x];
    }
    inputWordIds.push(Number(idx));
  });

  if (inputWordIds.length < wordContext.encoder_max_seq_length) {
    inputWordIds = new Array(
      wordContext.encoder_max_seq_length - inputWordIds.length + 1
    )
      .join('0')
      .split('')
      .map(Number)
      .concat(inputWordIds);
  } else {
    inputWordIds = inputWordIds.slice(0, wordContext.encoder_max_seq_length);
  }

  return tf.tensor2d(inputWordIds, [1, wordContext.encoder_max_seq_length]);
}

/**
 * Converts tokens to a sentence, by concatenating them.
 */
function convertTokensToSentence(tokens: string[]): string {
  return tokens.join(' ');
}

/**
 * Generates decoder input from a token ID.
 */
function generateDecoderInputFromTokenID(tokenID: number): tf.Tensor {
  const buffer = tf.buffer([1, 1, wordContext.num_decoder_tokens]);
  buffer.set(1, 0, 0, tokenID);
  return buffer.toTensor();
}
