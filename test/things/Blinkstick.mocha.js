/* eslint-disable node/no-unpublished-import */
import chai from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';

const {expect} = chai;

suite('Blinkstick', function () {
  this.thing;
  this.class;

  suiteSetup(async () => {
    // Omit WoT console output
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    // Sets up a mock for the Blinkstick class with stubs for the writeProperty affordance
    this.Blinkstick = await esmock(
      '../../dist/things/blinkstick/Blinkstick.js'
    );
    this.thing = new this.Blinkstick('deadbeef');
    const mockDevice = {
      vendorId: 8352,
      open: async () => {},
      close: async () => {},
      productName: 'productName',
      sendFeatureReport: async () => {},
    };
    sinon.stub(this.thing, 'open').resolves(mockDevice);
    this.thing.opened = true;
  });

  teardown(function () {
    this.thing.destroy();
    this.thing = null;
  });

  test('Creation', function () {
    expect(this.thing).to.be.an.instanceof(this.Blinkstick);
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
      security: 'nosec_sc',
      properties: {
        colours: {
          title: 'Colours',
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
        },
      },
    };
    expect(actualTd).to.deep.equal(expectedTd);
  });

  suite('Thing affordances', () => {
    test('writing a property', async function () {
      const spy = sinon.spy();
      sinon.stub(this.thing, 'setColour').callsFake(spy);
      await this.thing.writeProperty('colours', {
        index: 0,
        red: 255,
        green: 0,
        blue: 0,
      });
      expect(spy.calledOnce).to.be.true;
    });
  });
});
