import HuskyDuino from "../../dist/things/HuskyDuino.js";
import Blockly from 'blockly';
import chai from 'chai';
import devTools from '@blockly/dev-tools';
import sinon from 'sinon';

import '../../dist/thingBlocks/huskyduino/blocks.js';
import '../../dist/thingBlocks/huskyduino/generators.js';

const {expect} = chai;
const {testHelpers} = devTools;
const {runCodeGenerationTestSuites, runSerializationTestSuite} = testHelpers;

suite('things_huskyduino block', () => {
    /**
     * Asserts that the given block has the expected structure.
     * @param {Blockly.Block} block The block to test.
     */
    function assertThingsHuskyduinoBlockStructure(block) {
        expect(block.type).to.equal('things_HuskyDuino');
        expect(block.outputConnection.check_).to.be.an('array');
        expect(block.outputConnection.check_.length).to.equal(1);
        expect(block.outputConnection.check_[0]).to.equal('Thing');
        expect(block.inputList.length).to.equal(2);
        const nameInput = block.inputList[0];
        expect(nameInput.name).to.equal('name');
        const nameInputLabel = nameInput.fieldRow[0];
        expect(nameInputLabel.name).to.equal('label');
        expect(nameInputLabel.value_).to.equal('HuskyDuino');
        const nameInputTextInput = nameInput.fieldRow[1];
        expect(nameInputTextInput.name).to.equal('name');
        expect(nameInputTextInput.enabled_).to.equal(false);
        const idInput = block.inputList[1];
        expect(idInput.name).to.equal('id');
        expect(idInput.visible_).to.equal(false);
    };

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
      const block = this.workspace.newBlock('things_HuskyDuino');
        assertThingsHuskyduinoBlockStructure(block);
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
                return workspace.newBlock('things_HuskyDuino');
            },
        },
        {
            title: 'With name',
            expectedCode: "'Error getting id'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_HuskyDuino');
              block.setFieldValue('myName', 'name');
              return block;
            },
          },
          {
            title: 'With id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_HuskyDuino');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
          {
            title: 'With name and id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_HuskyDuino');
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
      xml: '<block type="things_HuskyDuino"/>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_HuskyDuino" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
          assertThingsHuskyduinoBlockStructure(block);
          expect(block.getFieldValue('name')).to.equal('Error getting name');
          expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
        title: 'Thing id set, name unset',
        xml: '<block type="things_HuskyDuino"><field name="id">123</field></block>',
        expectedXml:
          '<block xmlns="https://developers.google.com/blockly/xml" type="things_HuskyDuino" id="1">\n' +
          '  <field name="name">Error getting name</field>\n' +
          '  <field name="id">123</field>\n' +
          '</block>',
        assertBlockStructure: block => {
            assertThingsHuskyduinoBlockStructure(block);
            expect(block.getFieldValue('name')).to.equal('Error getting name');
            expect(block.getFieldValue('id')).to.equal('123');
        },
    },
    {
        title: 'Thing id unset, name set',
        xml: '<block type="things_HuskyDuino"><field name="name">My Thing</field></block>',
        expectedXml:
          '<block xmlns="https://developers.google.com/blockly/xml" type="things_HuskyDuino" id="1">\n' +
          '  <field name="name">My Thing</field>\n' +
          '  <field name="id">Error getting id</field>\n' +
          '</block>',
        assertBlockStructure: block => {
            assertThingsHuskyduinoBlockStructure(block);
            expect(block.getFieldValue('name')).to.equal('My Thing');
            expect(block.getFieldValue('id')).to.equal('Error getting id');
        },
    },
    {
        title: 'Thing id set, name set',
        xml: '<block type="things_HuskyDuino"><field name="id">123</field><field name="name">My LED</field></block>',
        expectedXml:
          '<block xmlns="https://developers.google.com/blockly/xml" type="things_HuskyDuino" id="1">\n' +
          '  <field name="name">My LED</field>\n' +
          '  <field name="id">123</field>\n' +
          '</block>',
        assertBlockStructure: block => {
            assertThingsHuskyduinoBlockStructure(block);
            expect(block.getFieldValue('name')).to.equal('My LED');
            expect(block.getFieldValue('id')).to.equal('123');
        },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('huskylens_choose_algo block', () => {
    /**
     * Asserts that the given block has the correct structure for a huskylens_choose_algo block.
     * @param {Blockly.Block} block The block to assert.
     */
    const assertHuskylensChooseAlgoBlockStructure = block => {
        expect(block.type).to.equal('huskylens_choose_algo');
        expect(block.inputList.length).to.equal(1);
        const thingInput = block.inputList[0];
        expect(thingInput.name).to.equal('thing');
        const thingInputLabel1 = thingInput.fieldRow[0];
        expect(thingInputLabel1.name).to.equal('label');
        expect(thingInputLabel1.value_).to.equal('write algorithm property');
        const algorithmDropdown = thingInput.fieldRow[1];
        expect(algorithmDropdown.name).to.equal('algorithm');
        expect(algorithmDropdown.menuGenerator_).to.deep.equal([
            ['Face Recognition', '0x01'],
            ['Object Tracking', '0x02'],
            ['Object Recognition', '0x03'],
            ['Line Tracking', '0x04'],
            ['Color Recognition', '0x05'],
            ['Tag Recognition', '0x06'],
            ['Object Classification', '0x07'],
        ])
        const thingInputLabel2 = thingInput.fieldRow[2];
        expect(thingInputLabel2.name).to.equal('label');
        expect(thingInputLabel2.value_).to.equal('to HuskyDuino');
    };

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('huskylens_choose_algo');
    assertHuskylensChooseAlgoBlockStructure(block);
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
                "await huskyduino_chooseAlgo('', '0x01');\n",
            createBlock: function(workspace) {
                return workspace.newBlock('huskylens_choose_algo');
            },
          },
        ],
      },
    ];
    runCodeGenerationTestSuites(testSuites);
});
});
