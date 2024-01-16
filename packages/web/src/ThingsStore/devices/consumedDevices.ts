import {Variables, dialog} from 'blockly';
import {addBlock, reloadToolbox} from '../../BlocklyWorkspace/toolbox';
import {implementedThing} from './../types';
import {thingsStore} from './../ThingsStore';
import {connectedThingsSlice} from './../connectedThingsReducers';
import {connectedThings} from './../things';
import {DataSchema, ThingDescription} from 'wot-thing-description-types';

import {
  generateThingBlock,
  generateThingCode,
  generateReadPropertyBlock,
  generateReadPropertyCode,
  generateWritePropertyBlock,
  generateWritePropertyCode,
  generateInvokeActionBlock,
  generateInvokeActionCode,
  generateSubscribeEventBlock,
  generateSubscribeEventCode,
  generateSecurityBlock,
  generateSecurityCode,
  crawl,
} from '../../assets/js/automatedBlockGeneration';

export const connectedConsumedDevices: Map<string, unknown> = new Map();

export const handleAddConsumedThing = async function (uri: string) {
  // TODO: Check if URI is valid
  // Crawl all referenced Thing Description links
  const foundTDs = await crawl(uri, 3);

  for (const td of foundTDs) {
    addConsumedDevice(td);
  }
};

/**
 * Adds a device to BLAST.
 */
const addConsumedDevice = function (td: ThingDescription) {
  const deviceName = td.title;
  const type = 'consumedDevice';
  // Object to store property names and allowed ops
  const propertiesObj: {
    [key: string]: (string | string[] | undefined)[];
  } = {};
  // Object to store action names and allowed ops
  const actionsObj: {
    [key: string]: (string | string[] | undefined)[];
  } = {};
  // Store all inputs of actions
  const inputObj: {[key: string]: DataSchema} = {};
  // Store all outputs of actions
  const outputObj: {[key: string]: DataSchema} = {};
  // Object to store event names and allowed ops
  const eventObj: {
    [key: string]: (string | string[] | undefined)[];
  } = {};
  // Store "data" of events
  const dataObj: {[key: string]: DataSchema} = {};

  // List of all created Blocks
  const implementedThingsBlockList = [];

  // Generate Thing Block
  if (typeof td.description === 'undefined') {
    generateThingBlock(deviceName, deviceName, td);
  } else {
    generateThingBlock(deviceName, td.description, td);
  }
  generateThingCode(deviceName, td);

  // Supported is only none_sc and basic_sc
  if (td.security === 'basic_sc') {
    generateSecurityBlock();
    generateSecurityCode(td);

    // Add to implementedThingsBlockList
    implementedThingsBlockList.push({
      type: `${deviceName}_SecurityBlock`,
      category: 'Security',
    });
  }
  // get property names and allowed operations
  for (const [propertyName, property] of Object.entries(td.properties ?? {})) {
    propertiesObj[propertyName] = property.forms.map(form => form.op);
  }

  // Generate Property Blocks
  for (const [propertyName, operations] of Object.entries(propertiesObj)) {
    const op = new Set(operations.flat());

    if (op.has('readproperty')) {
      generateReadPropertyBlock(propertyName, deviceName, td);
      generateReadPropertyCode(propertyName, deviceName);

      // Add to implementedThingsBlockList
      implementedThingsBlockList.push({
        type: `${deviceName}_readPropertyBlock_${propertyName}`,
        category: 'Properties',
      });
    }
    if (op.has('writeproperty')) {
      generateWritePropertyBlock(propertyName, deviceName, td);
      generateWritePropertyCode(propertyName, deviceName, td);

      // Add to implementedThingsBlockList
      implementedThingsBlockList.push({
        type: `${deviceName}_writePropertyBlock_${propertyName}`,
        category: 'Properties',
      });
    }
  }

  for (const [actionName, action] of Object.entries(td.actions ?? {})) {
    actionsObj[actionName] = action.forms.map(form => form.op);
    inputObj[actionName] = action.input as DataSchema;
    outputObj[actionName] = action.output as DataSchema;
  }

  // Generate Action Blocks
  for (const [actionName, operations] of Object.entries(actionsObj)) {
    const op = new Set(operations.flat());
    if (op.has('invokeaction')) {
      generateInvokeActionBlock(
        actionName,
        deviceName,
        inputObj[actionName],
        outputObj[actionName],
        td
      );
      generateInvokeActionCode(
        actionName,
        deviceName,
        inputObj[actionName],
        outputObj[actionName]
      );

      // Add to implementedThingsBlockList
      implementedThingsBlockList.push({
        type: `${deviceName}_invokeActionBlock_${actionName}`,
        category: 'Actions',
      });
    }
  }

  for (const [eventName, event] of Object.entries(td.events ?? {})) {
    eventObj[eventName] = event.forms.map(form => form.op);
    dataObj[eventName] = event.data as DataSchema;
  }

  // Generate Event Blocks
  for (const [eventName, operations] of Object.entries(eventObj)) {
    const op = new Set(operations.flat());
    if (op.has('subscribeevent')) {
      generateSubscribeEventBlock(eventName, deviceName);
      generateSubscribeEventCode(eventName, deviceName);

      // Add to implementedThingsBlockList
      implementedThingsBlockList.push({
        type: `${deviceName}_subscribeEventBlock_${eventName}`,
        category: 'Events',
      });
    }
  }

  // Push thing and all created blocks to implemented Things
  const thing: implementedThing = {
    id: deviceName,
    name: deviceName,
    type: type,
    blocks: implementedThingsBlockList,
  };

  // add the devices blocks to the toolbox
  for (const block of thing.blocks) {
    addBlock(block.type, block.category, block.XML);
  }
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = function (name: string, id: string): void {
    Variables.promptName(
      'Device connected! Now give your device a name.',
      name,
      text => {
        if (text) {
          const existing = thingsStore
            .getState()
            .connectedThings.some(thing => thing.id === text);
          if (existing) {
            const msg = `Name ${text} already exists.`;
            dialog.alert(msg, () => {
              promptAndCheckWithAlert(text, id); // Recurse
            });
          } else {
            // No conflict
            thingsStore.dispatch(
              connectedThingsSlice.actions.add({
                name: text,
                thing,
              })
            );
            connectedConsumedDevices.set(text, td);
            connectedThings.set(text, thing as implementedThing);
          }
        } else {
          const msg = 'Name cannot be empty';
          dialog.alert(msg, () => {
            promptAndCheckWithAlert(text ?? '', id); // Recuse
          });
        }
      }
    );
  };
  promptAndCheckWithAlert(deviceName, td.id ?? '');
  reloadToolbox();
};
