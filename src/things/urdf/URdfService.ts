import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {getThing, removeThing} from '../index.js';
import urdf from 'urdf';
import {throwError} from '../../blast_interpreter.js';

export default class URdfService {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private td: WoT.ThingDescription;

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:Service:URdfService',
    title: 'uRDF Service',
    description:
      'A service employing the uRDF library to run SPARQL queries on RDF Ressources.',
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
              description:
                'The format of the ressource (JSON-LD, Turtle (TriG) or N-Quads).',
            },
            ressource: {
              type: 'string',
              description: 'The URI of the Ressource to query.',
            },
            required: ['query', 'format', 'ressource'],
          },
          output: {
            type: 'object',
            properties: {
              // TODO
            },
          },
        },
      },
    },
  };

  constructor() {
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.exposedThing = this.thing as unknown as ExposedThing;
      this.td = thing.getThingDescription();
      this.setActionHandlers();
      this.thing.expose();
    });
  }

  private setActionHandlers() {
    this.thing?.setActionHandler('runSparqlQuery', async parameters => {
      const {query, format, ressource} = parameters as unknown as {
        query: string;
        format: string;
        ressource: string;
      };
      return this.runSparqlQuery(query, format, ressource);
    });
  }

  public async invokeAction(action: string, parameters: any): Promise<any> {
    while (!this.exposedThing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.exposedThing.invokeAction(action, parameters);
  }

  private async runSparqlQuery(
    query: string,
    format: string,
    uri: string
  ): Promise<any> {
    let res;
    try {
      res = await fetch(uri);

      if (!res.ok) {
        throwError(
          `Failed to get ${uri}, Error: ${res.status} ${res.statusText}`
        );
        return;
      }
      const response = await res.text();
      urdf.clear();
      const opts = {format: format};
      await urdf.load(response, opts);
      res = await urdf.query(query);
    } catch (error) {
      throwError(`Failed to get ${uri}, Error: ${error}`);
    }

    return res;
  }

  public async getThingDescription(): Promise<WoT.ThingDescription> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }

  public async destroy() {
    removeThing(this.td?.id);
    await urdf.clear();
  }
}
