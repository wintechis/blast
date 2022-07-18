/* eslint-disable node/no-unpublished-import */
import BleRgbController from '../../dist/things/BleRgbController.js';
import Blockly from 'blockly';
import chai from 'chai';
import devTools from '@blockly/dev-tools';
import sinon from 'sinon';

import '../../dist/thingBlocks/ble_rgb_led_controller/blocks.js';
import '../../dist/thingBlocks/ble_rgb_led_controller/generators.js';

const {expect} = chai;
const {testHelpers} = devTools;
const {runCodeGenerationTestSuites, runSerializationTestSuite} = testHelpers;

suite('things_bleLedController block', () => {
  /**
   * Asserts that the things_bleLedController block has the inputs and fields we expect.
   * @param {!Blockly.Block} block The things_bleLedController block.
   */
  function assertThingsBleLedControllerBlockStructure(block) {
    expect(block.type).to.equal('things_bleLedController');
    expect(block.inputList.length).to.equal(2);
    const nameInput = block.inputList[0];
    expect(nameInput.name).to.equal('name');
    const nameInputLabel = nameInput.fieldRow[0];
    expect(nameInputLabel.name).to.equal('label');
    expect(nameInputLabel.value_).to.equal('BLE LED controller');
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
    const block = this.workspace.newBlock('things_bleLedController');
    assertThingsBleLedControllerBlockStructure(block);
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
              return workspace.newBlock('things_bleLedController');
            },
          },
          {
            title: 'With name',
            expectedCode: "'Error getting id'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_bleLedController');
              block.setFieldValue('myName', 'name');
              return block;
            },
          },
          {
            title: 'With id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_bleLedController');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
          {
            title: 'With name and id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_bleLedController');
              block.setFieldValue('myName', 'name');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
        ],
      },
    ];
    runCodeGenerationTestSuites(testSuites);
  });

  /** Test cases for serialization tests
   * @type {Array<SerializationTestCase>}
   */
  const testCases = [
    {
      title: 'Thing id and name unset',
      xml: '<block type="things_bleLedController"/>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bleLedController" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBleLedControllerBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name unset',
      xml: '<block type="things_bleLedController"><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bleLedController" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBleLedControllerBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
    {
      title: 'Thing id unset, name set',
      xml: '<block type="things_bleLedController"><field name="name">My Thing</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bleLedController" id="1">\n' +
        '  <field name="name">My Thing</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBleLedControllerBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My Thing');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name set',
      xml: '<block type="things_bleLedController"><field name="id">123</field><field name="name">My LED</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bleLedController" id="1">\n' +
        '  <field name="name">My LED</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBleLedControllerBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My LED');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('switch_lights_rgb block', () => {
  /**
   * Asserts that the switch_lights_rgb block has the inputs and fields we expect.
   * @param {!Blockly.Block} block The switch_lights_rgb block.
   */
  function assertSwitchLightsRgbBlockStructure(block) {
    expect(block.type).to.equal('switch_lights_rgb');
    expect(block.inputList.length).to.equal(2);
    const colourInput = block.inputList[0];
    expect(colourInput.name).to.equal('colour');
    expect(colourInput.connection.check_).to.be.an('array');
    expect(colourInput.connection.check_.length).to.equal(1);
    expect(colourInput.connection.check_[0]).to.equal('Colour');
    const colourInputLabel = colourInput.fieldRow[0];
    expect(colourInputLabel.name).to.equal('label');
    expect(colourInputLabel.value_).to.equal('write colour property');
    const thingInput = block.inputList[1];
    expect(thingInput.name).to.equal('thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal('to LED controller');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('switch_lights_rgb');
    assertSwitchLightsRgbBlockStructure(block);
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
              "await bleLedController_switchLights('', null, '#000000');\n",
            createBlock: function (workspace) {
              return workspace.newBlock('switch_lights_rgb');
            },
          },
          {
            title: 'Non-empty',
            expectedCode:
              /await bleLedController_switchLights\('.*', 'thingId', '#ffffff'\);\n/m,
            createBlock: function (workspace) {
              const block = workspace.newBlock('switch_lights_rgb');
              // Append colour picker block
              const colourBlock = workspace.newBlock('colour_picker');
              colourBlock.setFieldValue('#ffffff', 'COLOUR');
              const colourInput = block.getInput('colour');
              colourInput.connection.connect(colourBlock.outputConnection);
              // Append things_bleLedController block
              const thingBlock = workspace.newBlock('things_bleLedController');
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

  /** Test cases for serialization tests
   * @type {Array<SerializationTestCase>}
   */
  const testCases = [
    {
      title: 'Thing id and colour unset',
      xml: '<block type="switch_lights_rgb"/>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="switch_lights_rgb" id="1"></block>',
      assertBlockStructure: block => {
        assertSwitchLightsRgbBlockStructure(block);
      },
    },
    {
      title: 'Thing id set, colour unset',
      xml:
        '<block type="switch_lights_rgb">' +
        '  <value name="thing">' +
        '    <block type="things_bleLedController">' +
        '      <field name="name">ELK-BLEDOM</field>' +
        '      <field name="id">BLE LED Controller</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="switch_lights_rgb" id="1">\n' +
        '  <value name="thing">\n' +
        '    <block type="things_bleLedController" id="1">\n' +
        '      <field name="name">ELK-BLEDOM</field>\n' +
        '      <field name="id">BLE LED Controller</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertSwitchLightsRgbBlockStructure(block);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_bleLedController');
        expect(thingBlock.getFieldValue('id')).to.equal('BLE LED Controller');
      },
    },
    {
      title: 'Thing id unset, colour set',
      xml:
        '<block type="switch_lights_rgb">' +
        '  <value name="colour">' +
        '    <block type="colour_picker">' +
        '      <field name="COLOUR">#000000</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="switch_lights_rgb" id="1">\n' +
        '  <value name="colour">\n' +
        '    <block type="colour_picker" id="1">\n' +
        '      <field name="COLOUR">#000000</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertSwitchLightsRgbBlockStructure(block);
        const colourBlock = block.getInputTargetBlock('colour');
        expect(colourBlock.type).to.equal('colour_picker');
        expect(colourBlock.getFieldValue('COLOUR')).to.equal('#000000');
      },
    },
    {
      title: 'Thing id and colour set',
      xml:
        '<block type="switch_lights_rgb">' +
        '  <value name="colour">' +
        '    <block type="colour_picker">' +
        '      <field name="COLOUR">#000000</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="thing">' +
        '    <block type="things_bleLedController">' +
        '      <field name="name">ELK-BLEDOM</field>' +
        '      <field name="id">BLE LED Controller</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="switch_lights_rgb" id="1">\n' +
        '  <value name="colour">\n' +
        '    <block type="colour_picker" id="1">\n' +
        '      <field name="COLOUR">#000000</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_bleLedController" id="1">\n' +
        '      <field name="name">ELK-BLEDOM</field>\n' +
        '      <field name="id">BLE LED Controller</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertSwitchLightsRgbBlockStructure(block);
        const colourBlock = block.getInputTargetBlock('colour');
        expect(colourBlock.type).to.equal('colour_picker');
        expect(colourBlock.getFieldValue('COLOUR')).to.equal('#000000');
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_bleLedController');
        expect(thingBlock.getFieldValue('id')).to.equal('BLE LED Controller');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('BLE RGB Controller', function () {
  this.thing = null;

  suiteSetup(async () => {
    sinon.stub(console);
  });

  suiteTeardown(() => {
    sinon.restore();
  });

  setup(async function () {
    this.workspace = new Blockly.Workspace();
    this.thing = await new BleRgbController().init('deadbeef');
  });

  teardown(function () {
    this.thing = null;
  });

  test('Thing description', async function () {
    const actualTd = this.thing.getThingDescription();
    const expectedTd = {
      '@context': ['https://www.w3.org/2019/wot/td/v1', {'@language': 'en'}],
      '@type': ['Thing'],
      id: 'blast:Bluetooth:ledController',
      title: 'BLE RGB Controller',
      description:
        'A Bluetooth Low Energy (BLE) controller that can be used to control RGB LED lights.',
      securityDefinitions: {nosec_sc: {scheme: 'nosec'}},
      security: ['nosec_sc'],
      properties: {
        colour: {
          title: 'colour',
          description: 'The colour of the LED light.',
          unit: '',
          type: 'string',
          readOnly: false,
          writeOnly: true,
          observable: false,
          forms: [
            {
              href: 'gatt://0000fff0-0000-1000-8000-00805f9b34fb/0000fff3-0000-1000-8000-00805f9b34fb/writeWithoutResponse',
              'wbt:id': 'deadbeef',
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
