import Blockly from 'blockly';
import chai from 'chai';
import devTools from '@blockly/dev-tools';

const {expect} = chai;
const {testHelpers} = devTools;
const {runCodeGenerationTestSuites, runSerializationTestSuite} = testHelpers;

suite('things_eddyStoneDevice block', () => {
  /**
   * Asserts that the things_eddyStoneDevice block has the inputs and fields we expect.
   * @param {Blockly.Block} block the things_eddyStoneDevice block.
   */
  const assertEddyStoneDeviceBlockStructure = block => {
    expect(block.type).to.equal('things_eddyStoneDevice');
    expect(block.inputList.length).to.equal(2);
    const nameInput = block.inputList[0];
    expect(nameInput.name).to.equal('name');
    const nameInputLabel = nameInput.fieldRow[0];
    expect(nameInputLabel.name).to.equal('label');
    expect(nameInputLabel.value_).to.equal('Eddystone device');
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
    const block = this.workspace.newBlock('things_eddyStoneDevice');
    assertEddyStoneDeviceBlockStructure(block);
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
              return workspace.newBlock('things_eddyStoneDevice');
            },
          },
          {
            title: 'With name',
            expectedCode: "'Error getting id'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_eddyStoneDevice');
              block.setFieldValue('myName', 'name');
              return block;
            },
          },
          {
            title: 'With id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_eddyStoneDevice');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
          {
            title: 'With name and id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_eddyStoneDevice');
              block.getField('name').setValue('My Eddystone device');
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
   * Test cases for serialization tests
   * @type {Array<SerializationTestCase>}
   */
  const testCases = [
    {
      title: 'Thing id and name unset',
      xml: '<block type="things_eddyStoneDevice" />',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_eddyStoneDevice" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertEddyStoneDeviceBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name unset',
      xml: '<block type="things_eddyStoneDevice"><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_eddyStoneDevice" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertEddyStoneDeviceBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
    {
      title: 'Thing id unset, name set',
      xml: '<block type="things_eddyStoneDevice"><field name="name">My Eddystone device</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_eddyStoneDevice" id="1">\n' +
        '  <field name="name">My Eddystone device</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertEddyStoneDeviceBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My Eddystone device');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name set',
      xml: '<block type="things_eddyStoneDevice"><field name="name">My Eddystone device</field><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_eddyStoneDevice" id="1">\n' +
        '  <field name="name">My Eddystone device</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertEddyStoneDeviceBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My Eddystone device');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('write_eddystone_property block', () => {
  /**
   * Asserts that the write_eddystone_property block has the inputs and fields we expect.
   * @param {Blockly.Block} block The block to test.
   */
  function assertWriteEddystonePropertyBlockStructure(block) {
    expect(block.type).to.equal('write_eddystone_property');
    expect(block.inputList.length).to.equal(5);
    // property input
    const propertyInput = block.inputList[0];
    expect(propertyInput.name).to.equal('property');
    const propertyInputLabel = propertyInput.fieldRow[0];
    expect(propertyInputLabel.name).to.equal('label');
    expect(propertyInputLabel.value_).to.equal('write');
    const propertyInputDropdown = propertyInput.fieldRow[1];
    expect(propertyInputDropdown.name).to.equal('property');
    expect(propertyInputDropdown.menuGenerator_).to.deep.equal([
      ['advertised tx power', 'advertisedTxPower'],
      ['advertisement data', 'advertisementData'],
      ['advertising interval', 'advertisingInterval'],
      ['radio tx power', 'radioTxPower'],
    ]);
    // slot input
    const slotInput = block.inputList[1];
    expect(slotInput.name).to.equal('slot');
    expect(slotInput.connection.check_).to.be.an('array');
    expect(slotInput.connection.check_.length).to.equal(1);
    expect(slotInput.connection.check_[0]).to.equal('Number');
    const slotInputLabel = slotInput.fieldRow[0];
    expect(slotInputLabel.name).to.equal('label');
    expect(slotInputLabel.value_).to.equal('property at slot');
    // frame type input
    const frameTypeInput = block.inputList[2];
    expect(frameTypeInput.name).to.equal('frameType');
    expect(frameTypeInput.visible_).to.be.false;
    const frameTypeInputLabel = frameTypeInput.fieldRow[0];
    expect(frameTypeInputLabel.name).to.equal('label');
    expect(frameTypeInputLabel.value_).to.equal('frame type');
    const frameTypeInputDropdown = frameTypeInput.fieldRow[1];
    expect(frameTypeInputDropdown.name).to.equal('frameType');
    expect(frameTypeInputDropdown.menuGenerator_).to.deep.equal([
      ['UID', 'UID'],
      ['URL', 'URL'],
    ]);
    // value input
    const valueInput = block.inputList[3];
    expect(valueInput.name).to.equal('value');
    expect(valueInput.connection.check_).to.be.an('array');
    expect(valueInput.connection.check_.length).to.equal(1);
    const valueInputLabel = valueInput.fieldRow[0];
    expect(valueInputLabel.name).to.equal('label');
    expect(valueInputLabel.value_).to.equal('value');
    // thing input
    const thingInput = block.inputList[4];
    expect(thingInput.name).to.equal('thing');
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal('to Eddystone device');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('write_eddystone_property');
    assertWriteEddystonePropertyBlockStructure(block);
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
              "await writeEddystoneProperty('', null, null, 'advertisedTxPower', null);\n",
            createBlock: function (workspace) {
              return workspace.newBlock('write_eddystone_property');
            },
          },
          {
            title: 'with input',
            expectedCode:
              /await writeEddystoneProperty\('.*', 'thingId', 3, 'advertisingInterval', 200\);\n/m,
            createBlock: function (workspace) {
              const block = workspace.newBlock('write_eddystone_property');
              // Set property to advertising interval
              block.setFieldValue('advertisingInterval', 'property');
              // Append number block to slot input
              const slotBlock = workspace.newBlock('number_value');
              slotBlock.setFieldValue('3', 'NUM');
              const slotInput = block.getInput('slot');
              slotInput.connection.connect(slotBlock.outputConnection);
              // Append number block to value input
              const valueBlock = workspace.newBlock('number_value');
              valueBlock.setFieldValue('200', 'NUM');
              const valueInput = block.getInput('value');
              valueInput.connection.connect(valueBlock.outputConnection);
              // Append things_eddyStoneDevice block to thing input
              const thingBlock = workspace.newBlock('things_eddyStoneDevice');
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
      title: 'Empty',
      xml: '<block type="write_eddystone_property"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="write_eddystone_property" id="1">\n' +
        '  <field name="property">advertisedTxPower</field>\n' +
        '  <field name="frameType">UID</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertWriteEddystonePropertyBlockStructure(block);
        expect(block.getFieldValue('property')).to.equal('advertisedTxPower');
        expect(block.getFieldValue('frameType')).to.equal('UID');
      },
    },
    {
      title: 'with inputs',
      xml:
        '<block type="write_eddystone_property">' +
        '  <field name="property">advertisingInterval</field>' +
        '  <field name="frameType">UID</field>' +
        '  <value name="slot">' +
        '    <block type="number_value">' +
        '      <field name="NUM">3</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="value">' +
        '    <block type="number_value">' +
        '      <field name="NUM">200</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="thing">' +
        '    <block type="things_eddyStoneDevice">' +
        '      <field name="name">thingName</field>' +
        '      <field name="id">thingId</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="write_eddystone_property" id="1">\n' +
        '  <field name="property">advertisingInterval</field>\n' +
        '  <field name="frameType">UID</field>\n' +
        '  <value name="slot">\n' +
        '    <block type="number_value" id="1">\n' +
        '      <field name="NUM">3</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="value">\n' +
        '    <block type="number_value" id="1">\n' +
        '      <field name="NUM">200</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_eddyStoneDevice" id="1">\n' +
        '      <field name="name">thingName</field>\n' +
        '      <field name="id">thingId</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertWriteEddystonePropertyBlockStructure(block);
        expect(block.getFieldValue('property')).to.equal('advertisingInterval');
        expect(block.getFieldValue('frameType')).to.equal('UID');
        const slotBlock = block.getInputTargetBlock('slot');
        expect(slotBlock.type).to.equal('number_value');
        expect(slotBlock.getFieldValue('NUM')).to.equal(3);
        const valueBlock = block.getInputTargetBlock('value');
        expect(valueBlock.type).to.equal('number_value');
        expect(valueBlock.getFieldValue('NUM')).to.equal(200);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_eddyStoneDevice');
        expect(thingBlock.getFieldValue('name')).to.equal('thingName');
        expect(thingBlock.getFieldValue('id')).to.equal('thingId');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('read_eddystone_property block', () => {
  /**
   * Asserts that the read_eddystone_property block has the correct structure.
   * @param {Block} block The read_eddystone_property block.
   */
  function assertReadEddystonePropertyBlockStructure(block) {
    expect(block.type).to.equal('read_eddystone_property');
    expect(block.outputConnection.check_).to.be.an('array');
    expect(block.outputConnection.check_.length).to.equal(2);
    expect(block.outputConnection.check_).to.deep.include('String');
    expect(block.outputConnection.check_).to.deep.include('Number');
    expect(block.inputList.length).to.equal(3);
    // property input
    const propertyInput = block.inputList[0];
    expect(propertyInput.name).to.equal('property');
    const propertyInputLabel = propertyInput.fieldRow[0];
    expect(propertyInputLabel.name).to.equal('label');
    expect(propertyInputLabel.value_).to.equal('read');
    const propertyInputDropdown = propertyInput.fieldRow[1];
    expect(propertyInputDropdown.name).to.equal('property');
    expect(propertyInputDropdown.menuGenerator_).to.deep.equal([
      ['advertised tx power', 'advertisedTxPower'],
      ['advertised data', 'advertisedData'],
      ['advertising interval', 'advertisingInterval'],
      ['lock state', 'lockState'],
      ['public ECDH key', 'publicECDHKey'],
      ['radio tx power', 'radioTxPower'],
    ]);
    // slot input
    const slotInput = block.inputList[1];
    expect(slotInput.name).to.equal('slot');
    expect(slotInput.connection.check_).to.be.an('array');
    expect(slotInput.connection.check_.length).to.equal(1);
    expect(slotInput.connection.check_[0]).to.equal('Number');
    const slotInputLabel = slotInput.fieldRow[0];
    expect(slotInputLabel.name).to.equal('label');
    expect(slotInputLabel.value_).to.equal('at slot');
    // thing input
    const thingInput = block.inputList[2];
    expect(thingInput.name).to.equal('thing');
    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal('of Eddystone device');
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('read_eddystone_property');
    assertReadEddystonePropertyBlockStructure(block);
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
              "await readEddystoneProperty('', null, null, 'advertisedTxPower')",
            createBlock: function (workspace) {
              return workspace.newBlock('read_eddystone_property');
            },
          },
          {
            title: 'Non-empty',
            expectedCode:
              /await readEddystoneProperty\('.*', 'thingId', 3, 'publicECDHKey'\)/m,
            createBlock: function (workspace) {
              const block = workspace.newBlock('read_eddystone_property');
              // Set the property to publicECDHKey.
              block.setFieldValue('publicECDHKey', 'property');
              // Append number_value block to slot input.
              const slotBlock = workspace.newBlock('number_value');
              slotBlock.setFieldValue('3', 'NUM');
              const slotInput = block.getInput('slot');
              slotInput.connection.connect(slotBlock.outputConnection);
              // Append things_eddyStoneDevice block to thing input.
              const thingBlock = workspace.newBlock('things_eddyStoneDevice');
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
      title: 'Empty',
      xml: '<block type="read_eddystone_property"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="read_eddystone_property" id="1">\n' +
        '  <field name="property">advertisedTxPower</field>\n' +
        '</block>',
      assertBlockStructure: function (block) {
        assertReadEddystonePropertyBlockStructure(block);
        expect(block.getFieldValue('property')).to.equal('advertisedTxPower');
      },
    },
    {
      title: 'Non-empty',
      xml:
        '<block type="read_eddystone_property">' +
        '  <field name="property">publicECDHKey</field>' +
        '  <value name="slot">' +
        '    <block type="number_value">' +
        '      <field name="NUM">3</field>' +
        '    </block>' +
        '  </value>' +
        '  <value name="thing">' +
        '    <block type="things_eddyStoneDevice">' +
        '      <field name="name">thingName</field>' +
        '      <field name="id">thingId</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="read_eddystone_property" id="1">\n' +
        '  <field name="property">publicECDHKey</field>\n' +
        '  <value name="slot">\n' +
        '    <block type="number_value" id="1">\n' +
        '      <field name="NUM">3</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '  <value name="thing">\n' +
        '    <block type="things_eddyStoneDevice" id="1">\n' +
        '      <field name="name">thingName</field>\n' +
        '      <field name="id">thingId</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: function (block) {
        assertReadEddystonePropertyBlockStructure(block);
        expect(block.getFieldValue('property')).to.equal('publicECDHKey');
        const slotBlock = block.getInputTargetBlock('slot');
        expect(slotBlock.type).to.equal('number_value');
        expect(slotBlock.getFieldValue('NUM')).to.equal(3);
        const thingBlock = block.getInputTargetBlock('thing');
        expect(thingBlock.type).to.equal('things_eddyStoneDevice');
        expect(thingBlock.getFieldValue('name')).to.equal('thingName');
        expect(thingBlock.getFieldValue('id')).to.equal('thingId');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('things_bluetoothGeneric block', () => {
  /**
   * Asserts that the things_bluetoothGeneric block has the expected structure.
   * @param {!Blockly.Block} block The things_bluetoothGeneric block.
   */
  function assertThingsBluetoothGenericBlockStructure(block) {
    expect(block.type).to.equal('things_bluetoothGeneric');
    expect(block.outputConnection.check_).to.be.an('array');
    expect(block.outputConnection.check_.length).to.equal(1);
    expect(block.outputConnection.check_[0]).to.equal('Thing');
    expect(block.inputList.length).to.equal(2);
    const nameInput = block.inputList[0];
    expect(nameInput.name).to.equal('name');
    const nameInputLabel = nameInput.fieldRow[0];
    expect(nameInputLabel.name).to.equal('label');
    expect(nameInputLabel.value_).to.equal('generic Bluetooth device');
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
    const block = this.workspace.newBlock('things_bluetoothGeneric');
    assertThingsBluetoothGenericBlockStructure(block);
  });

  suite('Code generation', () => {
    /**
     * Test suites for code generation tests.
     * @type {!Array<!CodeGenerationTestSuite>}
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
              return workspace.newBlock('things_bluetoothGeneric');
            },
          },
          {
            title: 'With name',
            expectedCode: "'Error getting id'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_bluetoothGeneric');
              block.setFieldValue('myName', 'name');
              return block;
            },
          },
          {
            title: 'With id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_bluetoothGeneric');
              block.setFieldValue('thingId', 'id');
              return block;
            },
          },
          {
            title: 'With name and id',
            expectedCode: "'thingId'",
            createBlock: function (workspace) {
              const block = workspace.newBlock('things_bluetoothGeneric');
              block.getField('name').setValue('My Bluetooth device');
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
   * Test cases for serialization tests
   * @type {Array<SerializationTestCase>}
   */
  const testCases = [
    {
      title: 'Thing id and name unset',
      xml: '<block type="things_bluetoothGeneric" />',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bluetoothGeneric" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBluetoothGenericBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name unset',
      xml: '<block type="things_bluetoothGeneric"><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bluetoothGeneric" id="1">\n' +
        '  <field name="name">Error getting name</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBluetoothGenericBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('Error getting name');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
    {
      title: 'Thing id unset, name set',
      xml: '<block type="things_bluetoothGeneric"><field name="name">My Bluetooth device</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bluetoothGeneric" id="1">\n' +
        '  <field name="name">My Bluetooth device</field>\n' +
        '  <field name="id">Error getting id</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBluetoothGenericBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My Bluetooth device');
        expect(block.getFieldValue('id')).to.equal('Error getting id');
      },
    },
    {
      title: 'Thing id set, name set',
      xml: '<block type="things_bluetoothGeneric"><field name="name">My Bluetooth device</field><field name="id">123</field></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="things_bluetoothGeneric" id="1">\n' +
        '  <field name="name">My Bluetooth device</field>\n' +
        '  <field name="id">123</field>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertThingsBluetoothGenericBlockStructure(block);
        expect(block.getFieldValue('name')).to.equal('My Bluetooth device');
        expect(block.getFieldValue('id')).to.equal('123');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});

suite('get_signal_strength_wb block', () => {
  /**
   * Asserts the structure of a get_signal_strength_wb block.
   * @param {!Blockly.Block} block The block to test.
   */
  function assertGetSignalStrengthWbBlockStructure(block) {
    expect(block.type).to.equal('get_signal_strength_wb');
    expect(block.inputList.length).to.equal(1);
    expect(block.outputConnection).to.not.equal(null);
    expect(block.outputConnection.check_).to.be.an('array');
    expect(block.outputConnection.check_.length).to.equal(2);
    expect(block.outputConnection.check_).to.deep.contain('Number');
    expect(block.outputConnection.check_).to.deep.contain('String');
    // Thing input
    const thingInput = block.inputList[0];
    expect(thingInput.name).to.equal('thing');

    expect(thingInput.connection.check_).to.be.an('array');
    expect(thingInput.connection.check_.length).to.equal(1);
    expect(thingInput.connection.check_[0]).to.equal('Thing');
    const thingInputLabel = thingInput.fieldRow[0];
    expect(thingInputLabel.name).to.equal('label');
    expect(thingInputLabel.value_).to.equal(
      'read signal-strength property of Bluetooth device'
    );
  }

  setup(function () {
    this.workspace = new Blockly.Workspace();
  });

  teardown(function () {
    this.workspace.dispose();
  });

  test('Creation', function () {
    const block = this.workspace.newBlock('get_signal_strength_wb');
    assertGetSignalStrengthWbBlockStructure(block);
  });

  suite('Code generation', () => {
    /**
     * Test suites for code generation tests
     * @type {Array<CodeGenerationTestSuite>}
     */
    const testSuites = [
      {
        title: 'JavaScript',
        generator: Blockly.JavaScript,
        testCases: [
          {
            title: 'Empty',
            expectedCode: 'await getRSSIWb(null)',
            createBlock: function (workspace) {
              return workspace.newBlock('get_signal_strength_wb');
            },
          },
          {
            title: 'with input',
            expectedCode: "await getRSSIWb('thingId')",
            createBlock: function (workspace) {
              const block = workspace.newBlock('get_signal_strength_wb');
              const thingBlock = workspace.newBlock('things_bluetoothGeneric');
              thingBlock.setFieldValue('thingId', 'id');
              thingBlock.setFieldValue('thingName', 'name');
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
      title: 'Empty',
      xml: '<block type="get_signal_strength_wb"></block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="get_signal_strength_wb" id="1"></block>',
      assertBlockStructure: block => {
        assertGetSignalStrengthWbBlockStructure(block);
      },
    },
    {
      title: 'With input',
      xml:
        '<block type="get_signal_strength_wb">' +
        '  <value name="thing">' +
        '    <block type="things_bluetoothGeneric">' +
        '      <field name="id">thingId</field>' +
        '      <field name="name">thingName</field>' +
        '    </block>' +
        '  </value>' +
        '</block>',
      expectedXml:
        '<block xmlns="https://developers.google.com/blockly/xml" type="get_signal_strength_wb" id="1">\n' +
        '  <value name="thing">\n' +
        '    <block type="things_bluetoothGeneric" id="1">\n' +
        '      <field name="name">thingName</field>\n' +
        '      <field name="id">thingId</field>\n' +
        '    </block>\n' +
        '  </value>\n' +
        '</block>',
      assertBlockStructure: block => {
        assertGetSignalStrengthWbBlockStructure(block);
        const thingInput = block.getInput('thing');
        const thingBlock = thingInput.connection.targetBlock();
        expect(thingBlock.getFieldValue('id')).to.equal('thingId');
        expect(thingBlock.getFieldValue('name')).to.equal('thingName');
      },
    },
  ];
  runSerializationTestSuite(testCases);
});
