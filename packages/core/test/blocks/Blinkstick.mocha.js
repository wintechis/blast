/* eslint-disable node/no-unpublished-import */
import Blinkstick from '../../dist/things/Blinkstick.js';
import Blockly from 'blockly';
import chai from 'chai';
import devTools from '@blockly/dev-tools';
import sinon from 'sinon';

import '../../dist/thingBlocks/blinkstick/blocks.js';
import '../../dist/thingBlocks/blinkstick/generators.js';
import '../../dist/blocks/numbers.js';
import '../../dist/generators/numbers.js';

const {expect} = chai;
const {testHelpers} = devTools;
const {runCodeGenerationTestSuites, runSerializationTestSuite} = testHelpers;

suite('Blinkstick', () => {
  /**
   * Asserts that the things_blinkstick block has the inputs and fields we expect.
   * @param {Blockly.Block} block The things_blinkstick block.
   */
  function assertThingsBlinkstickBlockStructure(block) {
    expect(block.type).to.equal('things_blinkstick');
    expect(block.outputConnection.check_).to.be.an('array');
    expect(block.outputConnection.check_.length).to.equal(1);
    expect(block.outputConnection.check_[0]).to.equal('Thing');
    expect(block.inputList.length).to.equal(2);
    const nameInput = block.inputList[0];
    expect(nameInput.name).to.equal('name');
    const nameInputLabel = nameInput.fieldRow[0];
    expect(nameInputLabel.name).to.equal('label');
    expect(nameInputLabel.value_).to.equal('BlinkStick');
    const nameInputTextInput = nameInput.fieldRow[1];
    expect(nameInputTextInput.name).to.equal('name');
    expect(nameInputTextInput.enabled_).to.equal(false);
    const idInput = block.inputList[1];
    expect(idInput.name).to.equal('id');
    expect(idInput.visible_).to.equal(false);
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('things_blinkstick');
    assertThingsBlinkstickBlockStructure(block);
  });

  suite('Code generation', () => {
    /**
     * Test suites for code generation tests.
     * @type {Array<CodeGenerationTestSuite>}
     */
    const testSuites = [
      {
        title: 'JavaScript',
        generator: Blockly.JavaScript,
        testCases: [
          {
            title: 'Empty',
            expectedCode: "'Error getting id'",
            createBlock: function (workspace) {
              return workspace.newBlock('things_blinkstick');
            },
          },
          {
            title: 'With name',
            expectedCode: "'Error getting id'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_blinkstick');
              block.setFieldValue('myName', 'name');
              return block;
            },
          },
          {
            title: 'With id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_blinkstick');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
          {
            title: 'With name and id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_blinkstick');
              block.setFieldValue('name', 'name');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
        ],
      },
    ];
    runCodeGenerationTestSuites(testSuites);
  });

  /**
   * Test cases for serialization tests.
   * @type {Array<SerializationTestCase>}
   */
  const testCases = [
    {
      title: 'Thing id and name unset',
      xml: '<block type="things_blinkstick"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_blinkstick" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBlinkstickBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name unset',
      xml: '<block type="things_blinkstick"><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_blinkstick" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBlinkstickBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
    {
      title: 'Thing id unset, name set',
      xml: '<block type="things_blinkstick"><field name="name">My BlinkStick</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_blinkstick" id="1">\n' +
        '  <field name="name">My BlinkStick</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBlinkstickBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My BlinkStick');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name set',
      xml: '<block type="things_blinkstick"><field name="name">My BlinkStick</field><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_blinkstick" id="1">\n' +
        '  <field name="name">My BlinkStick</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBlinkstickBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My BlinkStick');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('blinkstick_set_colors block', () => {
  /**
   * Asserts that the blinkstick_set_colors block has the inputs and fields we expect.
   * @param {Blockly.Block} block The blinkstick_set_colors block.
   */
  function assertBlinkstickSetColorsBlockStructure(block) {
    expect(block.type).to.equal('blinkstick_set_colors');
    expect(block.inputList.length).to.equal(3);
    const colourInput = block.inputList[0];
    expect(colourInput.name).to.equal('colour');
    const colourInputLabel = colourInput.fieldRow[0];
    expect(colourInputLabel.name).to.equal('label');
    expect(colourInputLabel.value_).to.equal('write colour property');
    expect(colourInput.connection.check_).to.be.an('array');
    expect(colourInput.connection.check_.length).to.equal(1);
    expect(colourInput.connection.check_[0]).to.equal('Colour');
    const indexInput = block.inputList[1];
    expect(indexInput.name).to.equal('index');
    expect(indexInput.connection.check_).to.be.an('array');
    expect(indexInput.connection.check_.length).to.equal(1);
    expect(indexInput.connection.check_[0]).to.equal('Number');
    const indexInputLabel = indexInput.fieldRow[0];
    expect(indexInputLabel.name).to.equal('label');
    expect(indexInputLabel.value_).to.equal('of LED #');
    const thingInput = block.inputList[2];
    expect(thingInput.name).to.equal('thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal('to BlinkStick');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('blinkstick_set_colors');
    assertBlinkstickSetColorsBlockStructure(block);
  });

  suite('Code generation', () => {
    /**
     * Test suites for code generation tests.
     * @type {Array<CodeGenerationTestSuite>}
     */
    const testSuites = [
      {
        title: 'JavaScript',
        generator: Blockly.JavaScript,
        testCases: [
          {
            title: 'Empty',
            expectedCode:
              "await blinkstick_setColors('', null, 0, '#000000');\n",
            createBlock: function (workspace) {
              return workspace.newBlock('blinkstick_set_colors');
            },
          },
          {
            title: 'Non-empty',
            expectedCode:
              /await blinkstick_setColors\('.*', 'thingId', 2, '#ffffff'\);\n/m,
            createBlock: function (workspace) {
              const block = workspace.newBlock('blinkstick_set_colors');
              // Append colour_picker block
              const colourBlock = workspace.newBlock('colour_picker');
              colourBlock.setFieldValue('#ffffff', 'COLOUR');
              const colourInput = block.getInput('colour');
              colourInput.connection.connect(colourBlock.outputConnection);
              // Append number_input block
              const indexBlock = workspace.newBlock('number_value');
              indexBlock.setFieldValue(2, 'NUM');
              const indexInput = block.getInput('index');
              indexInput.connection.connect(indexBlock.outputConnection);
              // Append things_blinkstick block
              const thingBlock = workspace.newBlock('things_blinkstick');
              thingBlock.setFieldValue('thingId', 'id');
              const thingInput = block.getInput('thing');
              thingInput.connection.connect(thingBlock.outputConnection);

              return block;
            },
          },
        ],
      },
    ];
    runCodeGenerationTestSuites(testSuites);
  });

  /**
   * Test cases for serialization tests.
   * @type {Array<SerializationTestCase>}
   */
  const testCases = [
    {
      title: 'Thing id, index and colour unset',
      xml: '<block type="blinkstick_set_colors"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="blinkstick_set_colors" id="1"></block>',
      assertBlockStructure: block => {
        assertBlinkstickSetColorsBlockStructure(block);
      },
    },
    {
      title: 'Thing id, index and colour set',
      xml:
        '<block type="blinkstick_set_colors">' +
        '  <value name="colour">' +
        '    <block type="colour_picker">' +
        '      <field name="COLOUR">#ffffff</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="index">' +
        '    <block type="number_value">' +
        '      <field name="NUM">2</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="thing">' +
        '    <block type="things_blinkstick">' +
        '      <field name="name">Blinkstick</field>' +
        '      <field name="id">thingId</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="blinkstick_set_colors" id="1">\n' +
        '  <value name="colour">\n' +
        '    <block type="colour_picker" id="1">\n' +
        '      <field name="COLOUR">#ffffff</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="index">\n' +
        '    <block type="number_value" id="1">\n' +
        '      <field name="NUM">2</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_blinkstick" id="1">\n' +
        '      <field name="name">Blinkstick</field>\n' +
        '      <field name="id">thingId</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertBlinkstickSetColorsBlockStructure(block);
        const colourBlock = block.getInputTargetBlock('colour');
        expect(colourBlock.type).to.equal('colour_picker');
        expect(colourBlock.getFieldValue('COLOUR')).to.equal('#ffffff');
        const indexBlock = block.getInputTargetBlock('index');
        expect(indexBlock.type).to.equal('number_value');
        expect(indexBlock.getFieldValue('NUM')).to.equal(2);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_blinkstick');
        expect(thingBlock.getFieldValue('name')).to.equal('Blinkstick');
        expect(thingBlock.getFieldValue('id')).to.equal('thingId');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('Blinkstick', function () {
  this.thing = null;

  suiteSetup(async () => {
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.workspace = new Blockly.Workspace();
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
              'wHid:reportId': 5,
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
