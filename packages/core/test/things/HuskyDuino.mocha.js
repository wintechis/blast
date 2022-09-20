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
        {
          '@language': 'en',
        },
      ],
      '@type': ['Thing'],
      id: 'blast:bluetooth:HuskyDuino',
      title: 'HuskyDuino',
      description: 'A HuskyLens interface running on Arduino',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: ['nosec_sc'],
      properties: {
        algorithm: {
          description: 'The currently active algorithm',
          type: 'number',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003/readNumber',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35d26-f9b0-11eb-9a03-0242ac130003/writeWithoutResponse',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        id: {
          description: 'The ID of the face or object',
          type: 'string',
          observable: false,
          readOnly: false,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003/readText',
              'wbt:id': 'deadbeef',
            },
            {
              op: 'writeproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be35eca-f9b0-11eb-9a03-0242ac130003/writeWithoutResponse',
              'wbt:id': 'deadbeef',
            },
          ],
        },
        location: {
          description: 'The location of the face or object',
          type: 'string',
          observable: false,
          readOnly: true,
          writeOnly: false,
          forms: [
            {
              op: 'readproperty',
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be3628a-f9b0-11eb-9a03-0242ac130003/readText',
              'wbt:id': 'deadbeef',
            },
          ],
        },
      },
      actions: {
        forgetAll: {
          title: 'Forget all faces and objects',
          description: 'Forget all faces and objects',
          idempotent: false,
          input: {
            type: 'null',
          },
          forms: [
            {
              href: 'gatt://5be35d20-f9b0-11eb-9a03-0242ac130003/5be361b8-f9b0-11eb-9a03-0242ac130003/writeWithoutResponse',
              'wbt:id': 'deadbeef',
            },
          ],
          safe: false,
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
