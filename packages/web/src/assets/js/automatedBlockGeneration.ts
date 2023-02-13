import {
  Block,
  Blocks,
  Events,
  FieldTextInput,
  FieldDropdown,
  Names,
} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
// eslint-disable-next-line node/no-unpublished-import
import * as WoT from 'wot-typescript-definitions';

import {getWorkspace, eventsInWorkspace} from './interpreter';

export function generateThingBlock(
  deviceName: string,
  deviceDescription: string,
  td: WoT.ThingDescription
) {
  // Generate description depending on available information
  const langTag = getLanguage();
  let description = '';
  if (td.descriptions !== undefined) {
    description += td.descriptions?.[langTag] ?? deviceDescription;
  } else {
    description += deviceDescription;
  }
  if (td.version !== undefined) {
    switch (langTag) {
      case 'de':
        description += ` | Version: ${td.version}`;
        break;
      default:
        description += ` | version: ${td.version}`;
    }
  }
  if (td.created !== undefined) {
    switch (langTag) {
      case 'de':
        description += ` | Erstellt am: ${td.created}`;
        break;
      default:
        description += ` | created on: ${td.created}`;
    }
  }
  if (td.modified !== undefined) {
    switch (langTag) {
      case 'de':
        description += ` | Geändert am: ${td.modified}`;
        break;
      default:
        description += ` | modified on: ${td.modified}`;
    }
  }
  Blocks[`things_${deviceName}`] = {
    /**
     * Block representing a consumed device.
     * @this {Blockly.Block}
     */
    init: function () {
      this.appendDummyInput('name')
        .appendField(deviceName, 'label')
        .appendField(new FieldTextInput('Error getting name'), 'name');
      this.appendDummyInput('id')
        .appendField(new FieldTextInput('Error getting id'), 'id')
        .setVisible(false);
      this.setOutput(true, 'Thing');
      this.setColour(60);
      this.setTooltip(description);
      this.setHelpUrl();
      this.getField('name').setEnabled(false);
    },
  };
}

export function generateThingCode(
  deviceName: string,
  td: WoT.ThingDescription
) {
  JavaScript[`things_${deviceName}`] = function (block: Block) {
    const name = JavaScript.quote_(block.getFieldValue('name'));

    JavaScript.imports_['core'] =
      "const blastCore = await import('../../assets/blast/blast.web.js');";

    JavaScript.definitions_['createThing'] = 'const {createThing} = blastCore;';
    JavaScript.definitions_['things'] = 'const things = new Map();';
    JavaScript.definitions_[
      'things_' + name
    ] = `things.set(${name}, await createThing(${JSON.stringify(td)}))`;

    return [name, JavaScript.ORDER_NONE];
  };
}

export function generateReadPropertyBlock(
  propertyName: string,
  deviceName: string,
  td: WoT.ThingDescription
) {
  const langTag = getLanguage();
  let blockName = '';
  if (td.titles && td.titles?.[langTag]) {
    blockName = `read property '${td.titles?.[langTag]}' of`;
  } else if (td.title) {
    blockName = `read property '${td.title}' of`;
  } else {
    blockName = `read property '${propertyName}' of`;
  }

  Blocks[`${deviceName}_readPropertyBlock_${propertyName}`] = {
    init: function () {
      this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField(blockName, 'label');
      this.setOutput(true, td.properties.type ?? null);
      this.setColour(255);
      this.setTooltip(
        td.descriptions?.[langTag] ??
          td.description ??
          `Read the ${propertyName} property of ${deviceName}`
      );
    },
  };
}

export function generateReadPropertyCode(
  propertyName: string,
  deviceName: string
) {
  JavaScript[`${deviceName}_readPropertyBlock_${propertyName}`] = function (
    block: Block
  ) {
    const name =
      JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

    const code = `await (await things.get(${name}).readProperty('${propertyName}')).value()`;
    return [code, JavaScript.ORDER_NONE];
  };
}

export function generateWritePropertyBlock(
  propertyName: string,
  deviceName: string,
  td: WoT.ThingDescription
) {
  Blocks[`${deviceName}_writePropertyBlock_${propertyName}`] = {
    init: function () {
      if (td.properties[propertyName].enum) {
        const optionsArr = [];
        for (let i = 0; i < td.properties[propertyName].enum.length; i++) {
          optionsArr.push([
            td.properties[propertyName].enum[i].toString(),
            i.toString(),
          ]);
        }
        this.appendValueInput('thing')
          .setCheck('Thing')
          .appendField('write value', 'label')
          .appendField(new FieldDropdown(optionsArr), 'value')
          .appendField(`to '${propertyName}' property of`, 'label');
      } else {
        this.appendValueInput('value')
          .setCheck()
          .appendField('write value', 'label');
        this.appendValueInput('thing')
          .setCheck('Thing')
          .appendField(`to '${propertyName}' property of`, 'label');
      }
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(255);
      this.setTooltip(`Write the ${propertyName} property of ${deviceName}`);
      this.setHelpUrl('');
    },
  };
}

export function generateWritePropertyCode(
  propertyName: string,
  deviceName: string,
  td: WoT.ThingDescription
) {
  JavaScript[`${deviceName}_writePropertyBlock_${propertyName}`] = function (
    block: Block
  ) {
    const name =
      JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

    let value;
    // Without enum
    if (td.properties[propertyName].enum === undefined) {
      value = JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE);
    } else {
      // With enum
      const valueIndex = JavaScript.quote_(block.getFieldValue('value'));
      value =
        td.properties[propertyName].enum[parseInt(valueIndex.split("'")[1])];
    }

    value = JavaScript.quote_(value);

    const code = `await things.get(${name}).writeProperty('${propertyName}', ${value})\n`;

    return code;
  };
}

export function generateInvokeActionBlock(
  actionName: string,
  deviceName: string,
  input: WoT.DataSchema,
  output: WoT.DataSchema
) {
  let inputValueType: string | null;
  if (typeof input !== 'undefined') {
    // Set correct input type check

    switch (input.type) {
      case 'integer':
      case 'number':
        inputValueType = 'Number';
        break;
      case 'boolean':
        inputValueType = 'Boolean';
        break;
      case 'string':
        inputValueType = 'String';
        break;
      case 'array':
        inputValueType = 'Array';
        break;
      case 'object':
        console.error('Objects are currently not supportet');
        break;
      default:
        inputValueType = null;
    }
  }

  Blocks[`${deviceName}_invokeActionBlock_${actionName}`] = {
    init: function () {
      if (typeof input !== 'undefined') {
        this.appendValueInput('value')
          .setCheck(inputValueType)
          .appendField(`invoke action '${actionName}' with value`, 'label');
      }
      this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField(`invoke '${actionName}' action of`, 'label');
      this.setInputsInline(true);
      if (typeof output !== 'undefined') {
        this.setOutput(true, null);
        this.setInputsInline(true);
      } else {
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
      }
      this.setColour(0);
      this.setTooltip(`Invoke the ${actionName} action of`);
      this.setHelpUrl('');
    },
  };
}

export function generateInvokeActionCode(
  actionName: string,
  deviceName: string,
  input: WoT.DataSchema,
  output: WoT.DataSchema
) {
  JavaScript[`${deviceName}_invokeActionBlock_${actionName}`] = function (
    block: Block
  ) {
    const name =
      JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

    let code: string | string[] = '';
    if (typeof input === 'undefined') {
      code = `await things.get(${name}).invokeAction('${actionName}')`;
    } else {
      const value =
        JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;
      code = `await things.get(${name}).invokeAction('${actionName}', ${value})`;
    }

    if (typeof output !== 'undefined') {
      code = `await (${code}).value()`;
      code = [code, JavaScript.ORDER_NONE];
    } else {
      code = `${code};\n`;
    }

    return code;
  };
}

export function generateSubscribeEventBlock(
  eventName: string,
  deviceName: string
) {
  Blocks[`${deviceName}_subscribeEventBlock_${eventName}`] = {
    /**
     * Block for reading a property of a Xiaomi Mijia thermometer.
     * @this {Blockly.Block}
     * @return {null}.
     */
    init: function () {
      this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField(`on ${eventName} events of`);
      this.appendDummyInput()
        .appendField('with variable')
        .appendField(new FieldTextInput('eventVar'), 'eventVar');
      this.appendStatementInput('statements').appendField('do');
      this.setInputsInline(false);
      this.setColour(180);
      this.setTooltip('');
      this.setHelpUrl('');
      this.changeListener = null;
      this.getField('eventVar').setEnabled(false);
    },
    /**
     * Add this block's id to the events array.
     * @return {null}.
     */
    addEvent: async function () {
      eventsInWorkspace.push(this.id);
    },
    onchange: function (event: Event) {
      if (!this.isInFlyout && !this.requested && this.rendered) {
        // Block is newly created
        this.requested = true;
        this.addEvent();
        this.createVars();
      }
      if (event.type === Events.BLOCK_DELETE) {
        // Block is being deleted
        this.removeFromEvents();
      }
    },
    /**
     * Remove this block's id from the events array.
     * @return {null}.
     */
    removeFromEvents: function () {
      // remove this block from the events array.
      const index = eventsInWorkspace.indexOf(this.id);
      if (index !== -1) {
        eventsInWorkspace.splice(index, 1);
      }
    },
    createVars: function () {
      const ws = getWorkspace();
      if (!ws) {
        return;
      }
      const varNames = ['eventVar'];
      for (const varName of varNames) {
        // create legal variable name
        let legalName = JavaScript.nameDB_.getName(
          varName,
          Names.NameType.VARIABLE
        );
        for (let i = 1; ws.getVariable(legalName) !== null; i++) {
          // if name already exists, append a number
          legalName = JavaScript.nameDB_.getName(
            legalName + '-' + i,
            Names.NameType.VARIABLE
          );
        }
        // create variable
        legalName = ws.createVariable(legalName).name;
        // set field value
        this.getField(varName).setValue(legalName);
      }
    },
  };
}

export function generateSubscribeEventCode(
  eventName: string,
  deviceName: string
) {
  JavaScript[`${deviceName}_subscribeEventBlock_${eventName}`] = function (
    block: Block
  ) {
    const thing =
      JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
    const statements = JavaScript.statementToCode(block, 'statements');
    const eventVar = block.getFieldValue('eventVar');

    const eventHandler = JavaScript.provideFunction_('handleGenericEvent', [
      'async function ' +
        JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(interactionOutput) {',
      `  const ${eventVar} = await interactionOutput.value();`,
      `  ${statements.replace(/`/g, '\\`')}`,
      '}',
    ]);

    const handler = `await things.get(${thing}).subscribeEvent('${eventName}', ${eventHandler});\n`;
    const handlersList = JavaScript.definitions_['eventHandlers'] || '';
    // Event handlers need to be executed first, so they're added to JavaScript.definitions
    JavaScript.definitions_['eventHandlers'] = handlersList + handler;

    return '';
  };
}

// TODO: Automaticall add string inputs
// Generate only one block even if 2 Things with basic auth are connected
export function generateSecurityBlock() {
  Blocks['SecurityBlock'] = {
    init: function () {
      this.appendValueInput('username')
        .setCheck('String')
        .appendField('Set username');
      this.appendValueInput('password')
        .setCheck('String')
        .appendField('and password');
      this.appendValueInput('thing').setCheck('Thing').appendField('to device');
      this.setInputsInline(false);
      this.setColour(40);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  };
}

export function generateSecurityCode(td: WoT.ThingDescription) {
  JavaScript['SecurityBlock'] = function (block: Block) {
    const username = JavaScript.valueToCode(
      block,
      'username',
      JavaScript.ORDER_NONE
    );
    const password = JavaScript.valueToCode(
      block,
      'password',
      JavaScript.ORDER_NONE
    );

    const id = td.id;
    JavaScript.imports_['core'] =
      "const blastCore = await import('../../assets/blast/blast.web.js');";

    JavaScript.definitions_['getServient'] = 'const {getServient} = blastCore;';
    const functionSetPassword = JavaScript.provideFunction_(
      'setCredentials',
      `
      function ${JavaScript.FUNCTION_NAME_PLACEHOLDER_}(id, user, pwd) {
        const servient = getServient();
        const credentials = {};
        credentials[id] = {
          username: user,
          password: pwd,
        };
        servient.addCredentials(credentials);
    }`
    );

    const code = `${functionSetPassword}(${JavaScript.quote_(
      id
    )}, ${username}, ${password});\n`;
    return code;
  };
}

const getLanguage = function () {
  // Get browser language tag -> currently de and en supported
  const lang = navigator.language || (navigator as any).userLanguage;
  const langTag = lang.split('-')[0];
  return langTag;
};

export async function crawl(startUri: string) {
  // Found Thing Descriptions
  const foundTDs = new Set();
  // Visited URIs
  const visited = new Set();
  // URIs to visit
  const todo = new Set<string>();

  // add start uri
  todo.add(startUri);

  // iterate over todo set until empty
  for (const uriElement = todo.values().next().value; todo.size > 0; ) {
    // If already visited delete
    if (visited.has(uriElement)) {
      todo.delete(uriElement);
      continue;
    }
    // Fetch TD and extract links to linksets in TD
    const [newTD, newURIs] = await fetchTD(uriElement);

    // Add TD to found TDs
    foundTDs.add(newTD);

    // Add TD uri to visited
    visited.add(uriElement);

    // Remove form todo set
    todo.delete(uriElement);

    // Add new found links in linkset to todos
    for (const tmpUri of newURIs) {
      todo.add(tmpUri);
    }
  }
  // Return set of found TDs
  return foundTDs;
}

// Fetch Thing Description
async function fetchTD(uri: string): Promise<[WoT.ThingDescription, string[]]> {
  const res = await fetch(uri);

  if (res.ok) {
    const nextTDLinks: string[] = [];
    // Get TD
    const td: WoT.ThingDescription = await res.json();

    if (td.links) {
      // find type of link and get href
      for (const [_, value] of Object.entries(td.links) as [
        _: unknown,
        value:
          | WoT.ThingDescription['LinkElement']
          | WoT.ThingDescription['IconLinkElement']
      ][]) {
        if (value.rel === 'next') {
          nextTDLinks.push(value.href);
        }
      }
    }

    return [td, nextTDLinks];
  } else {
    throw new Error('Could not fetch TD');
  }
}
