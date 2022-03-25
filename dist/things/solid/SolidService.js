import { getThing, removeThing } from '../index.js';
import { throwError } from '../../blast_interpreter.js';
import { saveFileInContainer } from '@inrupt/solid-client';
export default class SolidService {
    constructor() {
        this.thing = null;
        this.exposedThing = null;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Service:SolidService',
            title: 'Solid Service',
            description: 'This service provides a wrapper operations on Solid Pods',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            actions: {
                uploadImage: {
                    title: 'Upload an image',
                    description: 'Upload an image to a Solid Pod',
                    input: {
                        type: 'object',
                        properties: {
                            image: {
                                type: 'string',
                                description: 'The image to upload as data URI',
                            },
                            uri: {
                                type: 'string',
                                description: 'URI of the solid container',
                            },
                            required: ['image', 'uri'],
                        },
                    },
                },
            },
        };
        getThing(this.thingModel).then(thing => {
            this.thing = thing;
            this.exposedThing = this.thing;
            this.td = thing.getThingDescription();
            this.setActionHandlers();
            this.thing.expose();
        });
    }
    setActionHandlers() {
        var _a;
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setActionHandler('uploadImage', async (parameters) => {
            const { image, uri } = parameters;
            return this.uploadImage(image, uri);
        });
    }
    async uploadImage(image, uri) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        // eslint-disable-next-line no-undef
        const byteString = atob(image.split(',')[1]);
        // seperate out the mime component
        const mimeString = image.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // eslint-disable-next-line no-undef
        const blob = new Blob([ia], { type: mimeString });
        try {
            await saveFileInContainer(uri, blob);
        }
        catch (e) {
            throwError(e);
            console.error(e);
        }
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
//# sourceMappingURL=SolidService.js.map