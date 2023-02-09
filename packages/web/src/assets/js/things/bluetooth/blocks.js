/**
 * @fileoverview Blocks definitions for (generic) Bluetooth blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks, dialog, FieldDropdown, FieldTextInput} = Blockly;
import {implementedThings} from '../../things.js';
import {getStdWarn} from '../../interpreter.ts';

Blocks['things_eddyStoneDevice'] = {
  /**
   * Block representing an Eddystone device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('Eddystone device', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('An Eddystone device.');
    this.setHelpUrl(
      'https://github.com/wintechis/blast/wiki/Eddystone-Devices'
    );
    this.getField('name').setEnabled(false);
    this.firstTime = true;
  },
};

Blocks['things_bluetoothGeneric'] = {
  /**
   * Block representing a generic Bluetooth device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('name')
      .appendField('generic Bluetooth device', 'label')
      .appendField(new FieldTextInput('Error getting name'), 'name');
    this.appendDummyInput('id')
      .appendField(new FieldTextInput('Error getting id'), 'id')
      .setVisible(false);
    this.setOutput(true, 'Thing');
    this.setColour(60);
    this.setTooltip('A Generic Bluetooth device.');
    this.getField('name').setEnabled(false);
  },
};

Blocks['bluetoothGeneric_get_signal_strength_wb'] = {
  /**
   * Block for reading the strength of the signal (rssiValue property) sent by a ble device,
   * measured at the sc-ble-adapter.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('thing')
      .appendField('read signal-strength property of Bluetooth device', 'label')
      .setCheck('Thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip(
      'Reads the strength of the signal (rssiValue property) sent by a BLE device, measured at the at the BLAST client.'
    );
    this.setHelpUrl('');
    this.firstTime = true;
    this.deviceId = '';
  },
  onchange: function () {
    // on creating this block check webBluetooth availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.checkCompatibility();
      this.firstTime = false;
      if (!navigator.bluetooth) {
        dialog.alert(`Webbluetooth is not supported by this browser.\n
          Upgrade to Chrome version 85 or later.`);
        this.dispose();
      }
    }
  },
  checkCompatibility: function () {
    const isWindows = navigator.platform.toLowerCase().indexOf('win') >= 0;
    const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') >= 0;

    if (!isWindows && !isAndroid) {
      const stdWarn = getStdWarn();
      stdWarn(
        'reading signal strength is only supported on Windows and Android'
      );
    }
  },
};

Blocks['eddyStoneDevice_write_eddystone_property'] = {
  /**
   * Block for writing a property to an eddystone device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('property')
      .appendField('write', 'label')
      .appendField(
        new FieldDropdown(
          [
            ['active slot', 'activeSlot'],
            ['advertised tx power', 'advertisedTxPower'],
            ['advertisement data', 'advertisedData'],
            ['advertising interval', 'advertisingInterval'],
            ['radio tx power', 'radioTxPower'],
          ],
          this.propertyValidator
        ),
        'property'
      )
      .appendField('property', 'label');
    this.appendDummyInput('frameType')
      .appendField('frame type', 'label')
      .appendField(
        new FieldDropdown(
          [
            ['UID', 'UID'],
            ['URL', 'URL'],
          ],
          this.frameTypeValidator
        ),
        'frameType'
      )
      .setVisible(false);
    this.appendValueInput('value')
      .appendField('value', 'label')
      .setCheck('Number');
    this.appendValueInput('thing')
      .appendField('to Eddystone device', 'label')
      .setCheck('Thing');
    this.setPreviousStatement(true, null);
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip('Writes a property to an Eddystone device.');
    this.setHelpUrl(
      'https://github.com/google/eddystone/tree/master/configuration-service'
    );
  },
  propertyValidator: function (property) {
    const block = this.getSourceBlock();
    const frameType = block.getInput('frameType');
    frameType.setVisible(false);
    if (property === 'advertisedData') {
      frameType.setVisible(true);
    } else {
      block.getInput('value').setCheck('Number');
    }
  },
  frameTypeValidator: function (frameType) {
    const block = this.getSourceBlock();
    const frameTypeInput = block.getInput('frameType');
    if (frameTypeInput.visible_ === false) {
      return;
    }
    if (frameType === 'UID') {
      block.getInput('value').setCheck('String');
    } else if (frameType === 'URL') {
      block.getInput('value').setCheck('URI');
    }
  },
};

// Define inner block XML for the eddyStoneDevice_write_eddystone_property block.
const EDDYSTONEDEVICE_WRITE_EDDYSTONE_PROPERTY_XML = `
  <block type="eddyStoneDevice_write_eddystone_property">
    <value name="Slot">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
  </block>`;

Blocks['read_eddystone_property'] = {
  /**
   * Block for reading a property from an eddystone device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput('property')
      .appendField('read', 'label')
      .appendField(
        new FieldDropdown([
          ['advertised tx power', 'advertisedTxPower'],
          ['advertised data', 'advertisedData'],
          ['advertising interval', 'advertisingInterval'],
          ['capabilities', 'capabilities'],
          ['lock state', 'lockState'],
          ['public ECDH key', 'publicEcdhKey'],
          ['radio tx power', 'radioTxPower'],
        ]),
        'property'
      )
      .appendField('property of Eddystone device', 'label');
    this.appendValueInput('thing').setCheck('Thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setInputsInline(true);
    this.setTooltip('Reads a property from an Eddystone device.');
    this.setHelpUrl(
      'https://github.com/google/eddystone/tree/master/configuration-service'
    );
  },
};

// Define inner block XML for the read_eddystone_property block.
const READ_EDDYSTONE_PROPERTY_XML = `
  <block type="read_eddystone_property">
    <value name="Slot">
      <block type="math_number">
        <field name="NUM">0</field>
      </block>
    </value>
  </block>`;

Blocks['read_gatt_characteristic'] = {
  /**
   * Block for reading a predefined characteristic from a bluetooth device.
   */
  init: function () {
    this.appendDummyInput()
      .appendField('read gatt characteristic')
      .appendField(
        new FieldDropdown([
          ['barometric pressure trend', 'barometricPressureTrend'],
          ['battery level', 'batteryLevel'],
          ['device name', 'deviceName'],
          ['elevation', 'elevation'],
          ['firmware revision', 'firmwareRevision'],
          ['hardware revision', 'hardwareRevision'],
          ['humidity', 'humidity'],
          ['irradiance', 'irradiance'],
          ['intermediate temperature', 'intermediateTemperature'],
          ['manufacturer name', 'manufacturerName'],
          ['model number', 'modelNumber'],
          ['movement counter', 'movementCounter'],
          ['pressure', 'pressure'],
          ['serial number', 'serialNumber'],
          ['software revision string', 'softwareRevisionString'],
          ['temperature', 'temperature'],
          ['temperature measurement', 'temperatureMeasurement'],
          ['temperature type', 'temperatureType'],
          ['tx power level', 'txPowerLevel'],
          ['weight', 'weight'],
        ]),
        'characteristic'
      );
    this.appendValueInput('thing')
      .appendField('of Bluetooth device')
      .setCheck('Thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a property from a Bluetooth device.');
  },
};

Blocks['write_gatt_characteristic'] = {
  /**
   * Block for writing a predefined characteristic to a bluetooth device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput().appendField('write value');
    this.appendValueInput('value').setCheck(['String', 'Number']);
    this.appendDummyInput()
      .appendField('to gatt characteristic')
      .appendField(
        new FieldDropdown([['device name', 'deviceName']]),
        'characteristic'
      )
      .appendField('of Bluetooth device');
    this.appendValueInput('thing').setCheck('Thing');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(255);
    this.setTooltip('Writes a property to a Bluetooth device.');
  },
};

Blocks['read_characteristic'] = {
  /**
   * Block for reading a characteristic from a bluetooth device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('characteristic')
      .appendField('read characteristic', 'label')
      .setCheck('String');
    this.appendValueInput('service')
      .appendField('of service', 'label')
      .setCheck('String');
    this.appendDummyInput('format')
      .appendField('in format', 'label')
      .appendField(
        new FieldDropdown([
          ['Hexadecimal', 'hex'],
          ['UTF-8', 'utf8'],
          ['Decimal', 'decimal'],
        ]),
        'format'
      );
    this.appendValueInput('thing')
      .appendField('of Bluetooth device', 'label')
      .setCheck('Thing');
    this.setOutput(true, ['String', 'Number']);
    this.setColour(255);
    this.setTooltip('Reads a characteristic from a Bluetooth device.');
  },
};

Blocks['write_characteristic'] = {
  /**
   * Block for writing a characteristic to a bluetooth device.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('value')
      .setCheck(['String', 'Number'])
      .appendField('write value', 'label');
    this.appendValueInput('characteristic')
      .setCheck('String')
      .appendField('to characteristic', 'label');
    this.appendValueInput('Service')
      .setCheck('String')
      .appendField('of service', 'label');
    this.appendValueInput('thing')
      .setCheck('Thing')
      .appendField('of Bluetooth device', 'label');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(255);
    this.setTooltip('Writes a property to a Bluetooth device.');
  },
};

// Add Eddystone device to the list of implemented things
implementedThings.push({
  id: 'eddyStoneDevice',
  name: 'Eddystone device',
  type: 'bluetooth',
  blocks: [
    {
      type: 'eddyStoneDevice_write_eddystone_property',
      category: 'Properties',
      XML: EDDYSTONEDEVICE_WRITE_EDDYSTONE_PROPERTY_XML,
    },
    {
      type: 'read_eddystone_property',
      category: 'Properties',
      XML: READ_EDDYSTONE_PROPERTY_XML,
    },
  ],
  optionalServices: ['a3c87500-8ed3-4bdf-8a39-a01bebede295'],
  infoUrl: 'https://github.com/wintechis/blast/wiki/Eddystone-Devices',
});

const characteristics = {
  barometricPressureTrend: {
    service: '00001802-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1c-0000-1000-8000-00805f9b34fb',
  },
  batteryLevel: {
    service: '0000180f-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a19-0000-1000-8000-00805f9b34fb',
  },
  deviceName: {
    service: '00001800-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a00-0000-1000-8000-00805f9b34fb',
  },
  elevation: {
    service: '00001803-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6c-0000-1000-8000-00805f9b34fb',
  },
  firmwareRevision: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a26-0000-1000-8000-00805f9b34fb',
  },
  hardwareRevision: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a27-0000-1000-8000-00805f9b34fb',
  },
  humidity: {
    service: '00001803-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6f-0000-1000-8000-00805f9b34fb',
  },
  irradiance: {
    service: '00001803-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a77-0000-1000-8000-00805f9b34fb',
  },
  intermediateTemperature: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1e-0000-1000-8000-00805f9b34fb',
  },
  manufacturerName: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a29-0000-1000-8000-00805f9b34fb',
  },
  modelNumber: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a24-0000-1000-8000-00805f9b34fb',
  },
  movementCounter: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a56-0000-1000-8000-00805f9b34fb',
  },
  pressure: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6d-0000-1000-8000-00805f9b34fb',
  },
  serialNumber: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a25-0000-1000-8000-00805f9b34fb',
  },
  softwareRevision: {
    service: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a28-0000-1000-8000-00805f9b34fb',
  },
  temperature: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a6e-0000-1000-8000-00805f9b34fb',
  },
  temperatureMeasurement: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1c-0000-1000-8000-00805f9b34fb',
  },
  temperatureType: {
    service: '00001809-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a1d-0000-1000-8000-00805f9b34fb',
  },
  txPowerLevel: {
    service: '00001804-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a07-0000-1000-8000-00805f9b34fb',
  },
  weight: {
    service: '00001808-0000-1000-8000-00805f9b34fb',
    characteristic: '00002a9d-0000-1000-8000-00805f9b34fb',
  },
};

const optionalServices = [];
// Add all services to optionalServices.
for (const characteristic in characteristics) {
  if (!optionalServices.includes(characteristics[characteristic].service)) {
    optionalServices.push(characteristics[characteristic].service);
  }
}

implementedThings.push({
  id: 'bluetoothGeneric',
  name: 'Generic Bluetooth device',
  type: 'bluetooth',
  blocks: [
    {
      type: 'read_gatt_characteristic',
      category: 'Properties',
    },
    {
      type: 'write_gatt_characteristic',
      category: 'Properties',
    },
    {
      type: 'read_characteristic',
      category: 'Properties',
    },
    {
      type: 'write_characteristic',
      category: 'Properties',
    },
  ],
  optionalServices: optionalServices,
});
