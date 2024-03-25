import {
  Block,
  Blocks,
  Events,
  FieldTextInput,
  FieldDropdown,
  inputs,
  Names,
  MenuGenerator,
  utils,
  Xml,
} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import {getWorkspace, eventsInWorkspace} from './interpreter';
import {BlockDelete} from 'blockly/core/events/events_block_delete';
import {Abstract} from 'blockly/core/events/events_abstract';
import {BlockCreate} from 'blockly/core/events/events_block_create';
import {DataSchema, ThingDescription} from 'wot-thing-description-types';

interface NavigatorLanguage {
  userLanguage?: string;
}

const ALIGN_RIGHT = inputs.Align.RIGHT;

const dataTypeMapping: Record<string, string> = {
  integer: 'Number',
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  array: 'Array',
};

export function generateThingBlock(
  deviceName: string,
  deviceDescription: string,
  td: ThingDescription
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
      this.appendDummyInput()
        .appendField(deviceName, 'label')
        .appendField(new FieldTextInput('Error getting name'), 'name');
      this.appendDummyInput()
        .appendField(new FieldTextInput('Error getting id'), 'id')
        .setVisible(false);
      this.setOutput(true, 'Thing');
      this.setColour(60);
      this.setTooltip(description);
      this.getField('name').setEnabled(false);
    },
  };
}

export function generateThingCode(deviceName: string, td: ThingDescription) {
  JavaScript.forBlock[`things_${deviceName}`] = function (
    block: Block
  ): [string, number] {
    const id = JavaScript.quote_(block.getFieldValue('id'));
    const name = JavaScript.quote_(block.getFieldValue('name'));

    JavaScript.imports_['core'] =
      "const blastCore = await import('../../assets/blast/blast.browser.js');";

    JavaScript.priority_['createThing'] = 'const {createThing} = blastCore;';
    JavaScript.things_['things_' + name] = td.base?.includes(
      'gatt://{{MacOrWebBluetoothId}}/'
    )
      ? `things.set(${name}, await createThing(${JSON.stringify(td)}, ${id}))`
      : `things.set(${name}, await createThing(${JSON.stringify(td)}))`;

    return [name, JavaScript.ORDER_NONE];
  };
}

export function generateReadPropertyBlock(
  propertyNames: string[],
  deviceName: string,
  td: ThingDescription
) {
  const propertyDropdown: MenuGenerator = [];

  for (const propertyName of propertyNames) {
    propertyDropdown.push([
      td?.properties?.[propertyName]?.title ?? propertyName,
      propertyName,
    ]);
  }

  Blocks[`${deviceName}_read_property`] = {
    init: function () {
      this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField('read')
        .appendField(
          new FieldDropdown(propertyDropdown, this.validator),
          'property'
        )
        .appendField(`property of ${td.title ?? deviceName}`, 'label');
      this.setColour(255);
      this.setTooltip(td.description ?? `Read the properties of ${deviceName}`);
      this.setOutput(true, null);
    },
    validator: function (property: string) {
      const block = this.getSourceBlock();
      const type = dataTypeMapping[td.properties?.[property].type ?? ''];
      block.setOutput(true, type);
    },
  };
}

export function generateReadPropertyCode(deviceName: string) {
  JavaScript.forBlock[`${deviceName}_read_property`] = function (block: Block) {
    const property = JavaScript.quote_(block.getFieldValue('property'));
    const thing =
      JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

    const code = `await (await things.get(${thing}).readProperty(${property})).value()`;
    return [code, JavaScript.ORDER_NONE];
  };
}

export function generateWritePropertyBlock(
  propertyNames: string[],
  deviceName: string,
  td: ThingDescription
) {
  const propertyDropdown: MenuGenerator = [];
  const propertyInputTypes: {[key: string]: string} = {};

  for (const propertyName of propertyNames) {
    propertyDropdown.push([
      td?.properties?.[propertyName]?.title ?? propertyName,
      propertyName,
    ]);
    propertyInputTypes[propertyName] = td.properties?.[propertyName].type ?? '';
  }

  Blocks[`${deviceName}_write_property`] = {
    init: function () {
      this.appendValueInput('value')
        .setCheck(propertyInputTypes)
        .appendField('write')
        .appendField(
          new FieldDropdown(propertyDropdown, this.propertyValidator),
          'property'
        );
      this.appendValueInput('thing')
        .appendField(`property to ${td.title ?? deviceName}`, 'label')
        .setCheck('Thing');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(255);
      this.value = '';
      this.setTooltip(
        td.description ?? `Write the properties of ${deviceName}`
      );
    },
    propertyValidator: function (property: string) {
      const block = this.getSourceBlock();
      const ws = getWorkspace();
      if (!ws) {
        return;
      }
      if (property === block.value) {
        return;
      }
      // delete old input block
      const connection = block.getInput('value')?.connection;
      if (connection) {
        const inputBlock = connection.targetBlock();
        if (inputBlock) {
          inputBlock.dispose();
        }
      }

      block.value = property;
      const type = dataTypeMapping[propertyInputTypes[property]];
      block.getInput('value')?.setCheck(type);
      // attach block of correct type to input
      const inputBlockXml = schemaToXml(td.properties?.[property] ?? {});
      const xml = utils.xml.createElement('xml');
      xml.setAttribute('xmlns', 'https://developers.google.com/blockly/xml');
      xml.appendChild(inputBlockXml);
      const inputBlockId = Xml.appendDomToWorkspace(xml, ws)[0];
      const inputBlock = ws.getBlockById(inputBlockId);
      if (inputBlock) {
        inputBlock.initSvg();
        inputBlock.render();
        connection.connect(inputBlock.outputConnection);
      }
    },
  };
}

export function generateWritePropertyCode(deviceName: string) {
  JavaScript.forBlock[`${deviceName}_write_property`] = function (
    block: Block
  ) {
    const name =
      JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
    const property = JavaScript.quote_(block.getFieldValue('property'));
    const value =
      JavaScript.valueToCode(block, 'value', JavaScript.ORDER_NONE) || null;

    const code = `await things.get(${name}).writeProperty(${property}, ${value});\n`;
    return code;
  };
}

export function generateInvokeActionBlock(
  actionName: string,
  deviceName: string,
  input: DataSchema,
  output: DataSchema,
  td: ThingDescription
) {
  Blocks[`${deviceName}_invokeActionBlock_${actionName}`] = {
    init: function () {
      this.appendValueInput('thing')
        .appendField('invoke action')
        .appendField(new FieldTextInput(actionName), 'action')
        .appendField(`of ${deviceName}`, 'label')
        .setCheck('Thing');
      this.getField('action').setEnabled(false);
      if (input?.type) {
        if (dataTypeMapping[input.type]) {
          this.appendValueInput('value')
            .setCheck(dataTypeMapping[input.type])
            .appendField('with value', 'label')
            .setAlign(ALIGN_RIGHT);
        } else {
          this.appendValueInput('value')
            .appendField('with value', 'label')
            .setAlign(ALIGN_RIGHT);
        }
      }
      if (typeof output !== 'undefined') {
        this.setOutput(true, null);
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
  input: DataSchema,
  output: DataSchema
) {
  JavaScript.forBlock[`${deviceName}_invokeActionBlock_${actionName}`] =
    function (block: Block) {
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
  deviceName: string,
  td: ThingDescription
) {
  const event = td.events?.[eventName];
  let varType = event?.data?.type ?? '';
  varType = varType.charAt(0).toUpperCase() + varType.slice(1);

  Blocks[`${deviceName}_subscribeEventBlock_${eventName}`] = {
    /**
     * Block for reading a property of a Xiaomi Mijia thermometer.
     * @this {Blockly.Block}
     * @return {null}.
     */
    init: function () {
      this.appendValueInput('thing')
        .setCheck('Thing')
        .appendField('on')
        .appendField(new FieldTextInput(eventName), 'event')
        .appendField(`event of ${deviceName}`);
      if (varType.length > 0) {
        this.appendDummyInput()
          .appendField('uses variable')
          .appendField(new FieldTextInput(eventName + varType), 'eventVar');
      }
      this.appendStatementInput('statements').appendField('do');
      this.setInputsInline(false);
      this.setColour(180);
      this.setTooltip('');
      this.setHelpUrl('');
      this.getField('event').setEnabled(false);
      this.getField('eventVar').setEnabled(false);
    },
    /**
     * Add this block's id to the events array.
     */
    addEvent: function () {
      eventsInWorkspace.push(this.id);
    },
    /**
     * Remove this block's id from the events array.
     */
    removeFromEvents: function () {
      JavaScript.handlers['things' + this.id] = undefined;
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
      const varName = this.getFieldValue('eventVar');
      // create legal variable name
      let legalName = JavaScript.nameDB_.getName(
        varName,
        Names.NameType.VARIABLE
      );
      for (let i = 1; ws.getVariable(legalName) !== null; i++) {
        // if name already exists, append a number
        legalName = JavaScript.nameDB_.getName(
          varName + '-' + i,
          Names.NameType.VARIABLE
        );
      }
      // create variable
      legalName = ws.createVariable(legalName).name;
      // set field value
      this.getField('eventVar').setValue(legalName);
    },
    onchange: function (event: Abstract) {
      if (!this.workspace || this.workspace.isFlyout) {
        // Block is deleted or is in a flyout.
        return;
      }
      if (!event.recordUndo) {
        // Events not generated by user. Skip handling.
        return;
      }
      if (
        event.type === Events.BLOCK_CREATE &&
        (event as BlockCreate).ids?.indexOf(this.id) !== -1
      ) {
        this.addEvent();
        if (this.childBlocks_.length === 0) {
          this.createVars();
        }
      } else if (event.type === Events.BLOCK_DELETE) {
        this.removeFromEvents();
      }
    },
  };
}

export function generateSubscribeEventCode(
  eventName: string,
  deviceName: string
) {
  JavaScript.forBlock[`${deviceName}_subscribeEventBlock_${eventName}`] =
    function (block: Block) {
      const thing =
        JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
      const statements = JavaScript.statementToCode(block, 'statements');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const varName = block.getFieldValue('eventVar') ?? '';

      const eventHandler = JavaScript.provideFunction_(
        'handleGenericEvent' + block.id,
        [
          'async function ' +
            JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
            '(interactionOutput) {',
          `  const ${varName} = await interactionOutput.value();`,
          `  ${statements.replace(/`/g, '\\`')}`,
          '}',
        ]
      );

      const handler = `await things.get(${thing}).subscribeEvent('${eventName}', ${eventHandler});\n`;
      JavaScript.handlers['things' + block.id] = handler;

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

export function generateSecurityCode(td: ThingDescription) {
  JavaScript.forBlock['SecurityBlock'] = function (block: Block) {
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
      "const blastCore = await import('../../assets/blast/blast.browser.js');";

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
  const lang =
    navigator.language || (navigator as NavigatorLanguage).userLanguage || 'en';
  const langTag = lang.split('-')[0];
  return langTag;
};

/**
 * Parses a TD and its links, returning all links until maxDepth is reached
 * @returns a Set of all TDs that have been found
 */
export async function crawl(startUri: string, maxDepth: number) {
  // Contains all TDs that have been found
  const TDs = new Set<ThingDescription>();
  // Queue with Uris that have yet to be visited
  const queue = new Set<string>();
  // Uris that have been visited
  const visited = new Set<string>();
  let depth = 0;
  // get start TD and its links
  const [startTD, startTDLinks] = await fetchTD(startUri);
  TDs.add(startTD);
  startTDLinks.forEach(link => queue.add(link));
  while (queue.size > 0 && depth < maxDepth) {
    // Fetch all TDs in queue in parallel, if not already visited
    const promises = Array.from(queue).map(async uri => {
      if (!visited.has(uri)) {
        const [td, tdLinks] = await fetchTD(uri);
        TDs.add(td);
        tdLinks.forEach(link => queue.add(link));
        visited.add(uri);
      }
    });
    // Wait for all promises to finish
    await Promise.all(promises);
    depth++;
  }
  return TDs;
}
/**
 * Fetches a Thing Description and all links to other TDs.
 * @returns A tuple with the TD and an array of links to other TDs.
 */
async function fetchTD(uri: string): Promise<[ThingDescription, string[]]> {
  const res = await fetch(uri);
  if (res.ok) {
    const nextTDLinks: string[] = [];
    // Get TD
    const td = (await res.json()) as ThingDescription;
    if (td.links) {
      // find type of link and get href
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, value] of Object.entries(td.links)) {
        // If content type is application/td+json add td
        if (
          typeof value?.type !== 'undefined' &&
          value.type === 'application/td+json'
        ) {
          nextTDLinks.push(value.href);
          continue;
        }
        // Use head request to follow link and get content type
        const response = await fetch(value.href, {
          method: 'HEAD',
        });
        const contentType: string | null = response.headers.get('Content-Type');
        if (contentType?.includes('application/td+json')) {
          nextTDLinks.push(value.href);
          continue;
        }
      }
    }
    return [td, nextTDLinks];
  } else {
    throw new Error('Could not fetch TD');
  }
}

function primitiveTypeToXml(type: string) {
  const blockXml = utils.xml.createElement('block');
  const fieldNode = utils.xml.createElement('field');
  let textNode;
  switch (type) {
    case 'integer':
    case 'number':
      blockXml.setAttribute('type', 'number_value');
      fieldNode.setAttribute('name', 'NUM');
      textNode = utils.xml.createTextNode('0');
      fieldNode.appendChild(textNode);
      blockXml.appendChild(fieldNode);
      break;
    case 'boolean':
      blockXml.setAttribute('type', 'logic_boolean');
      fieldNode.setAttribute('name', 'BOOL');
      textNode = utils.xml.createTextNode('TRUE');
      fieldNode.appendChild(textNode);
      blockXml.appendChild(fieldNode);
      break;
    case 'string':
    default:
      blockXml.setAttribute('type', 'string');
      fieldNode.setAttribute('name', 'TEXT');
      textNode = utils.xml.createTextNode('');
      fieldNode.appendChild(textNode);
      blockXml.appendChild(fieldNode);
  }
  return blockXml;
}

/**
 * Returns a default block for the given data schema.
 * @param schema The data schema to generate a block for.
 */
export function schemaToXml(schema: DataSchema) {
  const type = schema.type ?? 'string';
  if (type !== 'object') {
    return primitiveTypeToXml(type);
  }
  let properties = schema.properties ?? {};
  // filter properties with default values and const values
  properties = Object.fromEntries(
    Object.entries(properties).filter(
      ([_, value]) => value.default === undefined && value.const === undefined
    )
  );
  const propertyNames = Object.keys(properties);
  const blockNode = utils.xml.createElement('block');
  blockNode.setAttribute('type', 'object_create');

  const mutationNode = utils.xml.createElement('mutation');
  mutationNode.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  mutationNode.setAttribute('num_fields', propertyNames.length.toString());

  propertyNames.forEach(propertyName => {
    const fieldNode = utils.xml.createElement('field');
    fieldNode.setAttribute('name', propertyName);
    mutationNode.appendChild(fieldNode);
  });

  blockNode.appendChild(mutationNode);

  propertyNames.forEach((propertyName, index) => {
    const fieldNode = utils.xml.createElement('field');
    fieldNode.setAttribute('name', `field${index + 1}`);
    fieldNode.textContent = propertyName;
    blockNode.appendChild(fieldNode);
  });

  propertyNames.forEach((propertyName, index) => {
    const valueNode = utils.xml.createElement('value');
    valueNode.setAttribute('name', `field_input${index + 1}`);
    const inputBlock = schemaToXml(properties[propertyName]);
    valueNode.appendChild(inputBlock);
    blockNode.appendChild(valueNode);
  });

  return blockNode;
}
