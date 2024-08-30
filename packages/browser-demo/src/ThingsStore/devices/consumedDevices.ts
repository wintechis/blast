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
  schemaToXml,
} from '../../BlocklyWorkspace/automatedBlockGeneration';
import {connectDevice} from '.';

export const connectedConsumedDevices: Map<string, unknown> = new Map();

export const handleAddConsumedThing = async function (uri: string) {
  // TODO: Check if URI is valid
  // Crawl all referenced Thing Description links
  const foundTDs = await crawl(uri, 3);

  for (const td of foundTDs) {
    const isBluetooth = JSON.stringify(td).includes('gatt://');
    addConsumedDevice(td, isBluetooth);
  }
};

const xmlSerializer = new XMLSerializer();

/**
 * Adds a device to BLAST.
 */
const addConsumedDevice = function (
  td: ThingDescription,
  isBluetooth: boolean
) {
  const deviceName = td.title;
  const type = isBluetooth ? 'bluetooth' : 'consumedDevice';
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
  const implementedThingsBlockList: implementedThing['blocks'] = [];

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
  const readProps: string[] = [];
  const writeProps: string[] = [];
  // get property names and allowed operations
  for (const [propertyName, property] of Object.entries(td.properties ?? {})) {
    const ops = [];
    for (const form of property.forms) {
      if (Array.isArray(form.op)) {
        ops.push(...form.op);
      } else {
        ops.push(form.op);
      }
    }

    if (ops.includes('readproperty')) {
      readProps.push(propertyName);
    }
    if (ops.includes('writeproperty')) {
      writeProps.push(propertyName);
    }
  }

  if (readProps.length > 0) {
    generateReadPropertyBlock(readProps, deviceName, td);
    generateReadPropertyCode(deviceName);
    implementedThingsBlockList.push({
      type: `${deviceName}_read_property`,
      category: 'Properties',
    });
  }

  if (writeProps.length > 0) {
    generateWritePropertyBlock(writeProps, deviceName, td);
    generateWritePropertyCode(deviceName);
    implementedThingsBlockList.push({
      type: `${deviceName}_write_property`,
      category: 'Properties',
    });
  }

  for (const [actionName, action] of Object.entries(td.actions ?? {})) {
    actionsObj[actionName] = action.forms.map(form => form.op);
    inputObj[actionName] = action.input as DataSchema;
    outputObj[actionName] = action.output as DataSchema;
  }

  // Generate Action Blocks
  for (const [actionName] of Object.entries(actionsObj)) {
    generateInvokeActionBlock(
      actionName,
      deviceName,
      inputObj[actionName],
      outputObj[actionName]
    );
    generateInvokeActionCode(
      actionName,
      deviceName,
      inputObj[actionName],
      outputObj[actionName]
    );

    const xml = `
    <block type="${deviceName}_invokeActionBlock_${actionName}">
      <value name="input">
        ${
          inputObj[actionName]
            ? xmlSerializer.serializeToString(
                schemaToXml(inputObj[actionName])
              )
            : undefined
        }
      </value>
    </block>`;

    // Add to implementedThingsBlockList
    implementedThingsBlockList.push({
      type: `${deviceName}_invokeActionBlock_${actionName}`,
      category: 'Actions',
      XML: xml,
    });
  }

  for (const [eventName, event] of Object.entries(td.events ?? {})) {
    eventObj[eventName] = event.forms.map(form => form.op);
    dataObj[eventName] = event.data as DataSchema;
  }

  // Generate Event Blocks
  for (const [eventName] of Object.entries(eventObj)) {
    generateSubscribeEventBlock(eventName, deviceName, td);
    generateSubscribeEventCode(eventName, deviceName);

    // Add to implementedThingsBlockList
    implementedThingsBlockList.push({
      type: `${deviceName}_subscribeEventBlock_${eventName}`,
      category: 'Events',
    });
  }

  // Push thing and all created blocks to implemented Things
  const thing: implementedThing = {
    id: deviceName,
    name: deviceName,
    type: type,
    blocks: implementedThingsBlockList,
    ...(isBluetooth && {optionalServices: getServices(td)}),
  };

  connectDevice(thing);
};

export const connectConsumedDevice = function (thing: implementedThing) {
  const promptAndCheckWithAlert = function (name: string, id: string): void {
    Variables.promptName(
      'Thing consumed! Now give your Thing a name.',
      name,
      newName => {
        if (newName) {
          const existing = thingsStore
            .getState()
            .connectedThings.some(thing => thing.id === newName);
          if (existing) {
            const msg = `Name ${newName} already exists.`;
            dialog.alert(msg, () => {
              promptAndCheckWithAlert(newName, id); // Recurse
            });
          } else {
            // No conflict
            thingsStore.dispatch(
              connectedThingsSlice.actions.add({
                name: newName,
                thing,
              })
            );
            connectedConsumedDevices.set(newName, id);
            connectedThings.set(newName, thing);
            // Add blocks to toolbox
            for (const block of thing.blocks) {
              addBlock(block.type, block.category, block.XML);
            }
          }
        } else {
          const msg = 'Name cannot be empty';
          dialog.alert(msg, () => {
            promptAndCheckWithAlert(newName ?? '', id); // Recuse
          });
        }
      }
    );
  };
  promptAndCheckWithAlert(thing.name, thing.id);
  reloadToolbox();
};

const getServices = function (td: ThingDescription): string[] {
  // get all json members called 'forms' of properties, actions, and events
  const forms = [
    ...Object.values(td.properties ?? {}).flatMap(property => property.forms),
    ...Object.values(td.actions ?? {}).flatMap(action => action.forms),
    ...Object.values(td.events ?? {}).flatMap(event => event.forms),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deconstructForm = function (form: any) {
    const deconstructedForm: Record<string, string> = {};

    if (form.href.startsWith('gatt://')) {
      // Remove gatt://
      deconstructedForm.path = form.href.split('://')[1];
    } else if (form.href.startsWith('./')) {
      // Remove ./
      deconstructedForm.path = form.href.split('./')[1];
    } else {
      return {};
    }

    // If deviceID contains '/' it gets also split.
    // path string is checked it is a UUID; everything else is added together to deviceID
    const pathElements = deconstructedForm.path.split('/');

    // Extract serviceId
    deconstructedForm.serviceId = pathElements[0];

    // Extract characteristicId
    deconstructedForm.characteristicId = pathElements[1];

    return deconstructedForm;
  };

  // Get all unique serviceIds
  return [...new Set(forms.map(form => deconstructForm(form).serviceId).filter(serviceId => serviceId !== undefined))];
};
