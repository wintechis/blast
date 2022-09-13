import Blockly from 'blockly';
import chai from 'chai';
import devTools from '@blockly/dev-tools';

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
  }

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
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
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
    ]);
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
            expectedCode: "await huskyduino_chooseAlgo('', '0x01');\n",
            createBlock: function (workspace) {
              return workspace.newBlock('huskylens_choose_algo');
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
      title: 'Empty',
      xml: '<block type="huskylens_choose_algo"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_choose_algo" id="1">\n' +
        '  <field name="algorithm">0x01</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertHuskylensChooseAlgoBlockStructure(block);
        expect(block.getFieldValue('algorithm')).to.equal('0x01');
        expect(block.getFieldValue('thing')).to.be.null;
      },
    },
    {
      title: 'non-empty',
      xml:
        '<block type="huskylens_choose_algo">' +
        '  <field name="algorithm">0x02</field>' +
        '  <value name="thing">' +
        '    <block type="things_HuskyDuino">' +
        '      <field name="id">123</field>' +
        '      <field name="name">My Thing</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_choose_algo" id="1">\n' +
        '  <field name="algorithm">0x02</field>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_HuskyDuino" id="1">\n' +
        '      <field name="name">My Thing</field>\n' +
        '      <field name="id">123</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertHuskylensChooseAlgoBlockStructure(block);
        expect(block.getFieldValue('algorithm')).to.equal('0x02');
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_HuskyDuino');
        expect(thingBlock.getFieldValue('name')).to.equal('My Thing');
        expect(thingBlock.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('huskylens_write_id block', () => {
  /**
   * Asserts that the given block has the correct structure for a huskylens_write_id block.
   * @param {Blockly.Block} block The block to assert.
   */
  function assertHuskylensWriteIdBlockStructure(block) {
    expect(block.type).to.equal('huskylens_write_id');
    expect(block.inputList.length).to.equal(2);
    const idInput = block.inputList[0];
    expect(idInput.name).to.equal('id');
    expect(idInput.connection.check_).to.be.an('array');
    expect(idInput.connection.check_.length).to.equal(1);
    expect(idInput.connection.check_[0]).to.equal('Number');
    const idInputLabel = idInput.fieldRow[0];
    expect(idInputLabel.name).to.equal('label');
    expect(idInputLabel.value_).to.equal('write id property');
    const thingInput = block.inputList[1];
    expect(thingInput.name).to.equal('thing');
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal('to HuskyDuino');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('huskylens_write_id');
    assertHuskylensWriteIdBlockStructure(block);
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
            expectedCode: "await huskyduino_learnId('', '0x0');\n",
            createBlock: function (workspace) {
              return workspace.newBlock('huskylens_write_id');
            },
          },
          {
            title: 'Non-empty',
            expectedCode: "await huskyduino_learnId('', '0x7b');\n",
            createBlock: function (workspace) {
              const block = workspace.newBlock('huskylens_write_id');
              // append number_value block
              const numberInputBlock = workspace.newBlock('number_value');
              numberInputBlock.setFieldValue('123', 'NUM');
              const idInput = block.getInput('id');
              idInput.connection.connect(numberInputBlock.outputConnection);
              // append things_huskyduino block
              const thingsHuskyduinoBlock =
                workspace.newBlock('things_HuskyDuino');
              const thingInput = block.getInput('thing');
              thingInput.connection.connect(
                thingsHuskyduinoBlock.outputConnection
              );

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
      title: 'Empty',
      xml: '<block type="huskylens_write_id"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_write_id" id="1"></block>',
      assertBlockStructure: block => {
        assertHuskylensWriteIdBlockStructure(block);
        expect(block.getFieldValue('id')).to.be.null;
        expect(block.getInputTargetBlock('thing')).to.be.null;
      },
    },
    {
      title: 'non-empty',
      xml:
        '<block type="huskylens_write_id">' +
        '  <value name="id">' +
        '    <block type="number_value">' +
        '      <field name="NUM">42</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="thing">' +
        '    <block type="things_HuskyDuino">' +
        '      <field name="name">My Thing</field>' +
        '      <field name="id">123</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_write_id" id="1">\n' +
        '  <value name="id">\n' +
        '    <block type="number_value" id="1">\n' +
        '      <field name="NUM">42</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_HuskyDuino" id="1">\n' +
        '      <field name="name">My Thing</field>\n' +
        '      <field name="id">123</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertHuskylensWriteIdBlockStructure(block);
        const numberBlock = block.getInputTargetBlock('id');
        expect(numberBlock.type).to.equal('number_value');
        expect(numberBlock.getFieldValue('NUM')).to.equal(42);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_HuskyDuino');
        expect(thingBlock.getFieldValue('name')).to.equal('My Thing');
        expect(thingBlock.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('huskylens_write_forget_flag block', () => {
  /**
   * Asserts that a huskylens_write_forget_flag block has the expected structure.
   * @param {!Blockly.Block} block The block to assert the structure of.
   */
  function assertHuskylensWriteForgetFlagBlockStructure(block) {
    expect(block.type).to.equal('huskylens_write_forget_flag');
    expect(block.inputList.length).to.equal(2);
    const flagInput = block.inputList[0];
    expect(flagInput.name).to.equal('forgetFlag');
    expect(flagInput.connection.check_).to.be.an('array');
    expect(flagInput.connection.check_.length).to.equal(1);
    expect(flagInput.connection.check_[0]).to.equal('Boolean');
    const flagInputLabel = flagInput.fieldRow[0];
    expect(flagInputLabel.name).to.equal('label');
    expect(flagInputLabel.value_).to.equal('write forget flag property');
    const thingInput = block.inputList[1];
    expect(thingInput.name).to.equal('thing');
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal('to HuskyDuino');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('huskylens_write_forget_flag');
    assertHuskylensWriteForgetFlagBlockStructure(block);
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
            expectedCode: "await huskyduino_forgetAll('');\n",
            createBlock: function (workspace) {
              return workspace.newBlock('huskylens_write_forget_flag');
            },
          },
          {
            title: 'non-empty',
            expectedCode: "await huskyduino_forgetAll('');\n",
            createBlock: function (workspace) {
              const block = workspace.newBlock('huskylens_write_forget_flag');
              const thingsHuskyduinoBlock =
                workspace.newBlock('things_HuskyDuino');
              thingsHuskyduinoBlock.setFieldValue('thingId', 'id');
              const thingInput = block.getInput('thing');
              thingInput.connection.connect(
                thingsHuskyduinoBlock.outputConnection
              );

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
      title: 'empty',
      xml: '<block type="huskylens_write_forget_flag"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_write_forget_flag" id="1"></block>',
      assertBlockStructure: assertHuskylensWriteForgetFlagBlockStructure,
    },
    {
      title: 'non-empty',
      xml:
        '<block type="huskylens_write_forget_flag">' +
        '  <value name="forgetFlag">' +
        '    <block type="logic_boolean">' +
        '      <field name="BOOL">TRUE</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="thing">' +
        '    <block type="things_HuskyDuino">' +
        '      <field name="name">My Thing</field>' +
        '      <field name="id">123</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_write_forget_flag" id="1">\n' +
        '  <value name="forgetFlag">\n' +
        '    <block type="logic_boolean" id="1">\n' +
        '      <field name="BOOL">TRUE</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_HuskyDuino" id="1">\n' +
        '      <field name="name">My Thing</field>\n' +
        '      <field name="id">123</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertHuskylensWriteForgetFlagBlockStructure(block);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_HuskyDuino');
        expect(thingBlock.getFieldValue('name')).to.equal('My Thing');
        expect(thingBlock.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('huskylens_read_id block', () => {
  /**
   * Asserts that a huskylens_read_id block has the expected structure.
   * @param {!Blockly.Block} block The block to assert the structure of.
   */
  function assertHuskylensReadIdBlockStructure(block) {
    expect(block.type).to.equal('huskylens_read_id');
    expect(block.inputList.length).to.equal(1);
    const thingInput = block.inputList[0];
    expect(thingInput.name).to.equal('thing');
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal(
      'read ID property of object(s) in HuskyDuino'
    );
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('huskylens_read_id');
    assertHuskylensReadIdBlockStructure(block);
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
            expectedCode: "await huskyduino_readId('')",
            createBlock: function (workspace) {
              return workspace.newBlock('huskylens_read_id');
            },
          },
          {
            title: 'non-empty',
            expectedCode: "await huskyduino_readId('')",
            createBlock: function (workspace) {
              const block = workspace.newBlock('huskylens_read_id');
              const thingsHuskyduinoBlock =
                workspace.newBlock('things_HuskyDuino');
              thingsHuskyduinoBlock.setFieldValue('thingId', 'id');
              const thingInput = block.getInput('thing');
              thingInput.connection.connect(
                thingsHuskyduinoBlock.outputConnection
              );

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
      title: 'empty',
      xml: '<block type="huskylens_read_id"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_read_id" id="1"></block>',
      assertBlockStructure: assertHuskylensReadIdBlockStructure,
    },
    {
      title: 'non-empty',
      xml:
        '<block type="huskylens_read_id">' +
        '  <value name="thing">' +
        '    <block type="things_HuskyDuino">' +
        '      <field name="name">My Thing</field>' +
        '      <field name="id">123</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_read_id" id="1">\n' +
        '  <value name="thing">\n' +
        '    <block type="things_HuskyDuino" id="1">\n' +
        '      <field name="name">My Thing</field>\n' +
        '      <field name="id">123</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertHuskylensReadIdBlockStructure(block);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_HuskyDuino');
        expect(thingBlock.getFieldValue('name')).to.equal('My Thing');
        expect(thingBlock.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('huskylens_read_location block', () => {
  /**
   * Asserts that a huskylens_read_location block has the expected structure.
   * @param {!Blockly.Block} block The block to assert the structure of.
   */
  function assertHuskylensReadLocationBlockStructure(block) {
    expect(block.type).to.equal('huskylens_read_location');
    expect(block.inputList.length).to.equal(1);
    const thingInput = block.inputList[0];
    expect(thingInput.name).to.equal('thing');
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal(
      'read location property of one object in HuskyDuino'
    );
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('huskylens_read_location');
    assertHuskylensReadLocationBlockStructure(block);
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
            expectedCode: "await huskyduino_readLoc('')",
            createBlock: function (workspace) {
              return workspace.newBlock('huskylens_read_location');
            },
          },
          {
            title: 'non-empty',
            expectedCode: "await huskyduino_readLoc('')",
            createBlock: function (workspace) {
              const block = workspace.newBlock('huskylens_read_location');
              const thingsHuskyduinoBlock =
                workspace.newBlock('things_HuskyDuino');
              thingsHuskyduinoBlock.setFieldValue('thingId', 'id');
              const thingInput = block.getInput('thing');
              thingInput.connection.connect(
                thingsHuskyduinoBlock.outputConnection
              );

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
      title: 'empty',
      xml: '<block type="huskylens_read_location"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_read_location" id="1"></block>',
      assertBlockStructure: assertHuskylensReadLocationBlockStructure,
    },
    {
      title: 'non-empty',
      xml:
        '<block type="huskylens_read_location">' +
        '  <value name="thing">' +
        '    <block type="things_HuskyDuino">' +
        '      <field name="name">My Thing</field>' +
        '      <field name="id">123</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="huskylens_read_location" id="1">\n' +
        '  <value name="thing">\n' +
        '    <block type="things_HuskyDuino" id="1">\n' +
        '      <field name="name">My Thing</field>\n' +
        '      <field name="id">123</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertHuskylensReadLocationBlockStructure(block);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_HuskyDuino');
        expect(thingBlock.getFieldValue('name')).to.equal('My Thing');
        expect(thingBlock.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});
