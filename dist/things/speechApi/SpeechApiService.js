import { throwError } from '../../blast_interpreter.js';
import { getThing, removeThing } from '../index.js';
window.SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;
export default class SpeechApiService {
    constructor() {
        this.thing = null;
        this.exposedThing = null;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Service:SpeechApiService',
            title: 'SpeechApi Service',
            description: 'This service provides a wrapper for operations on the Google cloud Speech API',
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
                                        description: 'The Speech Synthesis Markup Language (SSML) Gender',
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
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.td = thing.getThingDescription();
            this.exposedThing = thing;
            this.setActionHandlers();
            this.thing.expose();
        });
    }
    setActionHandlers() {
        var _a, _b;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setActionHandler('synthesizeText', async (parameters) => {
            const utterance = new SpeechSynthesisUtterance();
            Object.assign(utterance, parameters);
            return this.synthesizeText(utterance);
        });
        (_b = this.thing) === null || _b === void 0 ? void 0 : _b.setActionHandler('recognizeSpeech', async () => {
            return this.recognizeSpeech();
        });
    }
    async synthesizeText(utterance) {
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
    async recognizeSpeech() {
        return new Promise((resolve, reject) => {
            if ('SpeechRecognition' in window) {
                const recognition = new window.SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.continuous = false;
                let transcript = '';
                recognition.onresult = (event) => {
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
            }
            else {
                throwError('SpeechRecognition not supported');
                reject();
            }
        });
    }
    async invokeAction(action, parameters) {
        while (!this.exposedThing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.exposedThing.invokeAction(action, parameters);
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
    async destroy() {
        var _a;
        removeThing((_a = this.td) === null || _a === void 0 ? void 0 : _a.id);
    }
}
//# sourceMappingURL=SpeechApiService.js.map