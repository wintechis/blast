/* eslint-disable node/no-unpublished-import */
import Blockly from 'blockly';
// import devTools from '@blockly/dev-tools';
import chai from 'chai';
import devTools from '@blockly/dev-tools';
// import the display_text block and its generator
import '../dist/thingBlocks/blast/blocks.js';
import '../dist/thingBlocks/blast/generators.js';

const {assert} = chai;
const {testHelpers} = devTools;
const {runCodeGenerationTestSuites, runSerializationTestSuite} = testHelpers;

suite('display_text block', () => {
  /**
   * Asserts that the display_text block has the inputs and fields we expect.
   * @param {!Blockly.Block} block The display_text block.
   * @param {number=} inputCount The number of inputs we expect.
   */
  function assertDisplayTextBlockStructure(block) {
    assert.equal(block.type, 'display_text');

    assert.equal(block.inputList.length, 1);
    chai.assert.equal(block.inputList[0].name, 'text');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('display_text');
    assertDisplayTextBlockStructure(block);
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
            expectedCode: "displayText('');\n",
            createBlock: function (workspace) {
              return workspace.newBlock('display_text');
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
      title: 'Empty input',
      xml: '<block type="display_text"/>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="display_text" id="1"></block>',
      assertBlockStructure: block => assertDisplayTextBlockStructure(block),
    },
    {
      title: 'With input',
      xml: '<block type="display_text"><value name="text"><block type="text"><field name="TEXT">Hello</field></block></value></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="display_text" id="1">\n'+
        '  <value name="text">\n' +
        '    <block type="text" id="1">\n' +
        '      <field name="TEXT">Hello</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertDisplayTextBlockStructure(block);
        const child = block.getInputTargetBlock('text');
        assert.isNotNull(child);
        assert.equal(child.type, 'text');
        assert.equal(child.getFieldValue('TEXT'), 'Hello');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});
