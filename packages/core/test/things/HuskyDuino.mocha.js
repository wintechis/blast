import HuskyDuino from '../../dist/drivers/huskyduino/HuskyDuino.js';
import Blockly from 'blockly';
import chai from 'chai';
import sinon from 'sinon';

import '../../dist/drivers/huskyduino/blocks.js';
import '../../dist/drivers/huskyduino/generators.js';
import '../../dist/blocks/numbers.js';
import '../../dist/generators/numbers.js';

const {expect} = chai;

suite('HuskyDuino', function () {
  this.thing = null;

  suiteSetup(async () => {
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.workspace = new Blockly.Workspace();
    this.thing = await new HuskyDuino().init('deadbeef');
  });

  teardown(function () {
    this.thing = null;
  });

  test('Thing description', async function () {
    const actualTd = await this.thing.getThingDescription();
    const expectedTd = {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        'https://www.w3.org/2022/wot/td/v1.1',
        {
          sbo: 'http://example.org/simple-bluetooth-ontology#',
          bdo: 'http://example.org/binary-data-ontology#',
        },
        {'@language': 'en'},
      ],
      title: 'HuskyDuino',
      description: 'A HuskyLens interface running on Arduino.',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      '@type': 'Thing',
      security: ['nosec_sc'],

      'sbo:hasGAPRole': 'sbo:Peripheral',
      'sbo:isConnectable': true,
      'sbo:hasAdvertisingIntervall': {
        'qudt:numericValue': 200,
        'qutdUnit:unit': 'qudtUnit:MilliSEC',
      },

      properties: {
        algorithm: {
          type: 'integer',
          observable: false,
          readOnly: false,
          writeOnly: false,
          description: 'The currently active algorithm',

          minimum: 1,
          maximum: 7,

          'bdo:bytelength': 1,
          forms: [
            {
              href: 'ble-web+gatt://deadbeef/5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003',
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
            {
              href: 'ble-web+gatt://deadbeef/5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003',
              op: 'writeproperty',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        id: {
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          description: 'The ID of the face or object',

          forms: [
            {
              href: 'ble-web+gatt://deadbeef/5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003',
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
        location: {
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          description: 'The location of the face or object',

          forms: [
            {
              href: 'ble-web+gatt://deadbeef/5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003',
              op: 'readproperty',
              'sbo:methodName': 'sbo:read',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
      },
      actions: {
        forgetAll: {
          description: 'Forget all faces and objects',
          idempotent: false,
          input: {
            type: 'string',
            enum: ['true'],
          },
          safe: false,
          forms: [
            {
              href: 'ble-web+gatt://deadbeef/5be35d20-f9b0-11eb-9a03-0242ac130003/5be361b8-f9b0-11eb-9a03-0242ac130003',
              op: 'invokeaction',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },

        learn: {
          description: 'Learn a new face or object.',
          idempotent: false,
          safe: false,
          input: {
            type: 'integer',
            minimum: 0,
            maximum: 255,
            'bdo:bytelength': 1,
            description: 'The ID of the face or object to learn.',
          },
          forms: [
            {
              href: 'ble-web+gatt://deadbeef/5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003',
              op: 'invokeaction',
              'sbo:methodName': 'sbo:write-without-response',
              contentType: 'application/x.binary-data-stream',
            },
          ],
        },
      },
      events: {},
      links: [],
      observedProperties: {},
      subscribedEvents: {},
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });
});
