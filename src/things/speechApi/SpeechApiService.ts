import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {throwError} from '../../blast_interpreter.js';
import {getThing, removeThing} from '../index.js';

(<any>window).SpeechRecognition =
  (<any>window).webkitSpeechRecognition || (<any>window).SpeechRecognition;

export default class SpeechApiService {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private td: WoT.ThingDescription;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:Service:SpeechApiService',
    title: 'SpeechApi Service',
    description:
      'This service provides a wrapper for operations on the Google cloud Speech API',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    actions: {
      synthesizeText: {
        title: 'Synthesize text',
        description: 'Synthesize text to speech',
        input: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to synthesize',
            },
            voice: {
              type: 'object',
              properties: {
                languageCode: {
                  type: 'string',
                  description: 'The language code of the voice',
                },
                ssmlGender: {
                  type: 'string',
                  description:
                    'The Speech Synthesis Markup Language (SSML) Gender',
                },
              },
            },
            audioEncoding: {
              type: 'string',
              description: 'The audio encoding to use',
            },
            required: ['text', 'voice', 'audioEncoding'],
          },
        },
        output: {
          type: 'object',
          properties: {
            audioContent: {
              type: 'string',
              description: 'The audio content',
            },
          },
        },
      },
      recognizeSpeech: {
        title: 'Recognize speech',
        description: 'Recognizes speech (Speech to text)',
        input: {
          type: 'object',
          properties: {},
        },
        output: {
          type: 'string',
          description: 'The recognized speech',
        },
      },
    },
  };

  constructor() {
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.td = thing.getThingDescription();
      this.exposedThing = thing as unknown as ExposedThing;
      this.setActionHandlers();
      this.thing.expose();
    });
  }

  private setActionHandlers() {
    this.thing?.setActionHandler('synthesizeText', async parameters => {
      const utterance = new SpeechSynthesisUtterance();
      Object.assign(utterance, parameters);

      return this.synthesizeText(utterance);
    });
    this.thing?.setActionHandler('recognizeSpeech', async () => {
      return this.recognizeSpeech();
    });
  }

  private async synthesizeText(
    utterance: SpeechSynthesisUtterance
  ): Promise<SpeechSynthesisEvent> {
    window.speechSynthesis.speak(utterance);
    // return after speaking has ended
    return await new Promise(resolve => {
      utterance.onend = resolve;
    });
  }

  /**
   * Recognizes speech (speech to text).
   * @returns {Promise<string>} The recognized speech
   */
  public async recognizeSpeech(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if ('SpeechRecognition' in window) {
        const recognition = new (<any>window).SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        let transcript = '';

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript = event.results[i][0].transcript;
            }
          }
        };

        recognition.onend = () => {
          recognition.stop();
          resolve(transcript);
        };

        recognition.start();
      } else {
        throwError('SpeechRecognition not supported');
        reject();
      }
    });
  }

  public async invokeAction(action: string, parameters: any): Promise<any> {
    while (!this.exposedThing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.exposedThing.invokeAction(action, parameters);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }

  public async destroy() {
    removeThing(this.td?.id);
  }
}
