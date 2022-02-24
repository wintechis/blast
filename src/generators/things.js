/**
 * @fileoverview Generating JavaScript for blocks in the things category.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {JavaScript, Variables} from 'blockly';
import {getWebBluetoothDevices, getWebHIDDevices} from '../blast_things.js';
import {getWorkspace} from '../blast_interpreter.js';

JavaScript['things_webBluetooth'] = function (block) {
  const id = block.getFieldValue('id');
  const webBluetoothDevices = getWebBluetoothDevices();
  let name;
  // get the user-defined name of the device
  for (const [key, value] of webBluetoothDevices) {
    if (value === id) {
      name = key;
      break;
    }
  }
  // convert the name to a valid JavaScript variable name
  const workspace = getWorkspace();
  const thingsVar = Variables.getOrCreateVariablePackage(
    workspace,
    null,
    name,
    'Thing'
  );
  name = JavaScript.nameDB_.getName(thingsVar.name, 'Thing');
  // Define a variable for the thing.
  JavaScript.definitions_[id] =
    'var ' + name + ' = ' + JavaScript.quote_(id) + ';';

  return [name, JavaScript.ORDER_NONE];
};

JavaScript['things_webHID'] = function (block) {
  const id = block.getFieldValue('id');
  const webHidDevices = getWebHIDDevices();
  let name;
  // get the user-defined name of the device
  for (const [key, value] of webHidDevices) {
    if (value === id) {
      name = key;
      break;
    }
  }
  // convert the name to a valid JavaScript variable name
  const workspace = getWorkspace();
  const thingsVar = Variables.getOrCreateVariablePackage(
    workspace,
    null,
    name,
    'Thing'
  );
  name = JavaScript.nameDB_.getName(thingsVar.name, 'Thing');
  // Define a variable for the thing.
  JavaScript.definitions_[id] =
    'var ' + name + ' = ' + JavaScript.quote_(id) + ';';

  return [name, JavaScript.ORDER_NONE];
};
