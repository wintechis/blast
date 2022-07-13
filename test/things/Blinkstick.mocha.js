/* eslint-disable node/no-unpublished-import */
import chai from 'chai';
import sinon from 'sinon';
import Blinkstick from '../../dist/things/Blinkstick.js';

const {expect} = chai;

suite('Blinkstick', function () {
  this.thing = null;

  suiteSetup(async () => {
    // Omit WoT console output
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.thing = await new Blinkstick().init('deadbeef');
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
      id: 'blast:webhid:blinkstick',
      title: 'Blinkstick',
      description:
        'The tulogic Blinkstick is a Smart LED controller with integrated USB firmware.',
      securityDefinitions: {
        nosec_sc: {
          scheme: 'nosec',
        },
      },
      security: ['nosec_sc'],
      properties: {
        colours: {
          title: 'colours',
          description: 'The colour of the LED at the given index',
          observable: false,
          unit: '',
          type: 'object',
          properties: {
            0: {
              title: 'Colour 0',
              description: 'The colour of the LED at index 0',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            1: {
              title: 'Colour 1',
              description: 'The colour of the LED at index 1',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            2: {
              title: 'Colour 2',
              description: 'The colour of the LED at index 2',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            3: {
              title: 'Colour 3',
              description: 'The colour of the LED at index 3',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            4: {
              title: 'Colour 4',
              description: 'The colour of the LED at index 4',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            5: {
              title: 'Colour 5',
              description: 'The colour of the LED at index 5',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            6: {
              title: 'Colour 6',
              description: 'The colour of the LED at index 6',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
            7: {
              title: 'Colour 7',
              description: 'The colour of the LED at index 7',
              unit: '',
              type: 'string',
              writeOnly: true,
            },
          },
          readOnly: false,
          writeOnly: true,
          forms: [
            {
              href: 'hid://sendFeatureReport',
              'wHid:id': 'deadbeef',
            },
          ],
        },
      },
      actions: {},
      events: {},
      links: [],
      observedProperties: {},
      subscribedEvents: {},
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });
});
