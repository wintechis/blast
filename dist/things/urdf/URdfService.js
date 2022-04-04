import { getThing, removeThing } from '../index.js';
import urdf from 'urdf';
import { throwError } from '../../blast_interpreter.js';
export default class URdfService {
    constructor() {
        this.thing = null;
        this.exposedThing = null;
        this.td = null;
        this.thingModel = {
            '@context': ['https://www.w3.org/2019/wot/td/v1'],
            '@type': ['Thing'],
            id: 'blast:Service:URdfService',
            title: 'uRDF Service',
            description: 'A service employing the uRDF library to run SPARQL queries on RDF Ressources.',
            securityDefinitions: {
                nosec_sc: {
                    scheme: 'nosec',
                },
            },
            security: 'nosec_sc',
            actions: {
                runSparqlQuery: {
                    title: 'Run SPARQL Query',
                    description: 'Runs a SPARQL query on the RDF Ressource.',
                    input: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'The SPARQL query to run.',
                            },
                            format: {
                                type: 'string',
                                description: 'The format of the ressource (JSON-LD, Turtle (TriG) or N-Quads).',
                            },
                            ressource: {
                                type: 'string',
                                description: 'The URI of the Ressource to query.',
                            },
                        },
                    },
                    output: {
                        type: 'object',
                        properties: {
                        // TODO
                        },
                    },
                    forms: [
                        {
                            href: '',
                        },
                    ],
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
        (_a = this.thing) === null || _a === void 0 ? void 0 : _a.setActionHandler('runSparqlQuery', async (parameters) => {
            const { query, format, ressource } = parameters;
            return this.runSparqlQuery(query, format, ressource);
        });
    }
    async invokeAction(action, parameters) {
        while (!this.exposedThing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.exposedThing.invokeAction(action, parameters);
    }
    async runSparqlQuery(query, format, uri) {
        let res;
        try {
            res = await fetch(uri);
            if (!res.ok) {
                throwError(`Failed to get ${uri}, Error: ${res.status} ${res.statusText}`);
                return;
            }
            const response = await res.text();
            urdf.clear();
            const opts = { format: format };
            await urdf.load(response, opts);
            res = await urdf.query(query);
        }
        catch (error) {
            throwError(`Failed to get ${uri}, Error: ${error}`);
        }
        return res;
    }
    async getThingDescription() {
        while (!this.thing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.td;
    }
    async destroy() {
        if (this.td) {
            await removeThing(this.td);
        }
        await urdf.clear();
    }
}
//# sourceMappingURL=URdfService.js.map