/**
 * @fileoverview Code generators for the joycon blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';
import * as WoT from 'wot-typescript-definitions';
import {addCleanUpFunction} from '../../interpreter';
import SwitchPro from './switchPro/SwitchPro.js';
import {JoyConLeft, JoyConRight, GeneralController} from './switchPro/JoyCon';
import {JoyConPacket} from './switchPro/types';
import {getWebHidDevice} from '../../things';

JavaScript.forBlock['things_joycon'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThingWithHandlers'] =
    'const {createThingWithHandlers} = blastCore;';
  JavaScript.priority_['JoyCon'] = 'const {JoyCon} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThingWithHandlers(JoyCon, ${id}, addJoyConHandlers));`;

  return [name, JavaScript.ORDER_NONE];
};

type Joystick = {
  x: number;
  y: number;
  angle: number;
};

/**
 * Generates JavaScript code for the joycon_read_property block.
 */
JavaScript.forBlock['joycon_read_property'] = function (
  block: Block
): [string, number] {
  const property = JavaScript.quote_(block.getFieldValue('property'));
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;

  const code = `await (await things.get(${thing}).readProperty(${property})).value()`;
  return [code, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the joycon_button_events block.
 */
JavaScript.forBlock['joycon_button_events'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const button = JavaScript.quote_(block.getFieldValue('button'));

  const eventHandler = JavaScript.provideFunction_('joycon_buttonHandler', [
    'async function ' +
      JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(interactionOutput) {',
    '  const buttonStatus = await interactionOutput.value();',
    `  if (buttonStatus[${button}]) {`,
    `${statements.replace(/`/g, '\\`')}`,
    '  }',
    '}',
  ]);
  const handler = `await things.get(${thing}).subscribeEvent('button', ${eventHandler});`;
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};

/**
 * Adds WoT event handlers to the JoyCon's ExposedThing instance.
 */
(globalThis as any)['addJoyConHandlers'] = function (
  exposedThing: WoT.ExposedThing
) {
  const id = (exposedThing as any).id;
  const device = getWebHidDevice(id);
  if (!device) {
    throw new Error(`No device with id ${id} found.`);
  }
  let joyCon: JoyConLeft | JoyConRight | GeneralController | null = null;
  if (device.productId === 0x2006) {
    joyCon = new JoyConLeft(device);
  } else if (device.productId === 0x2007) {
    joyCon = new JoyConRight(device);
  } else {
    joyCon = new GeneralController(device);
  }
  if (joyCon === null) {
    throw new Error(`No JoyCon with id ${id} found.`);
  }

  Object.assign(joyCon, {
    pressed: {},
    prevPressed: {},
    accelerometers: {},
    gyroscopes: {},
    actualAccelerometer: {},
    actualGyroscope: {},
    actualOrientation: {},
    actualOrientationQuaternion: {},
    quaternion: {},
  });

  function _shallowEqual(object1: any, object2: any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  const handleInput = function (packet: JoyConPacket) {
    if (!packet || !packet.actualOrientation) {
      return;
    }
    const {
      buttonStatus,
      accelerometers,
      gyroscopes,
      actualAccelerometer,
      actualGyroscope,
      actualOrientation,
      actualOrientationQuaternion,
      quaternion,
    } = packet;
    // write all buttons with buttonStatus true to pressed array
    const pressed: string[] = [];
    if (buttonStatus) {
      for (const button of Object.keys(buttonStatus)) {
        if (buttonStatus[button as keyof typeof buttonStatus]) {
          pressed.push(button);
        }
      }
    }

    // write values to JoyCon
    Object.assign(joyCon as any, {
      pressed,
      accelerometers,
      gyroscopes,
      actualAccelerometer,
      actualGyroscope,
      actualOrientation,
      actualOrientationQuaternion,
      quaternion,
    });

    if (!_shallowEqual(pressed, (joyCon as any).prevPressed)) {
      (joyCon as any).prevPressed = pressed;
      exposedThing.emitEvent('button', buttonStatus);
    }
  };

  joyCon.open();
  (joyCon as any).interval = setInterval(async () => {
    if (!(joyCon as any).eventListenerAttached === true) {
      (joyCon as any).addEventListener('hidinput', (event: any) => {
        handleInput((event as any).detail);
      });
      (joyCon as any).eventListenerAttached = true;
    }
  }, 2000);

  addCleanUpFunction(() => {
    if ((joyCon as any).interval) {
      clearInterval((joyCon as any).interval);
    }
  });

  exposedThing.setPropertyReadHandler('accelerometers', async () => {
    return waitForProperty('accelerometers');
  });
  exposedThing.setPropertyReadHandler('gyroscopes', async () => {
    return waitForProperty('gyroscopes');
  });
  exposedThing.setPropertyReadHandler('actualAccelerometer', async () => {
    return waitForProperty('actualAccelerometer');
  });
  exposedThing.setPropertyReadHandler('actualGyroscope', async () => {
    return waitForProperty('actualGyroscope');
  });
  exposedThing.setPropertyReadHandler('actualOrientation', async () => {
    return waitForProperty('actualOrientation');
  });
  exposedThing.setPropertyReadHandler(
    'actualOrientationQuaternion',
    async () => {
      return waitForProperty('actualOrientationQuaternion');
    }
  );
  exposedThing.setPropertyReadHandler('quaternion', async () => {
    return waitForProperty('quaternion');
  });

  const waitForProperty = async function (property: string) {
    while (Object.keys((joyCon as any)[property]).length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return (joyCon as any)[property];
  };
};

JavaScript.forBlock['things_gamepad_pro'] = function (
  block: Block
): [string, number] {
  const id = JavaScript.quote_(block.getFieldValue('id'));
  const name = JavaScript.quote_(block.getFieldValue('name'));

  JavaScript.imports_['core'] =
    "const blastCore = await import('../../assets/blast/blast.browser.js');";
  JavaScript.imports_['tds'] =
    "const blastTds = await import('../../assets/blast/blast.tds.js');";

  JavaScript.priority_['createThingWithHandlers'] =
    'const {createThingWithHandlers} = blastCore;';
  JavaScript.priority_['GamepadPro'] = 'const {GamepadPro} = blastTds;';
  JavaScript.things_[
    'things' + name
  ] = `things.set(${name}, await createThingWithHandlers(GamepadPro, ${id}, addGamepadHandlers));`;

  return [name, JavaScript.ORDER_NONE];
};

/**
 * Generates JavaScript code for the gamepad_pro_joystick block.
 */
JavaScript.forBlock['gamepad_pro_joystick'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const xName = block.getFieldValue('gp-xName');
  const yName = block.getFieldValue('gp-yName');
  const angleName = block.getFieldValue('gp-angleName');

  const eventHandler = JavaScript.provideFunction_(
    'gamepad_joystickHandler' + block.id,
    [
      'async function ' +
        JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(interactionOutput) {',
      '  const joystick = await interactionOutput.value();',
      `  ${xName} = joystick['x'] || 0;`,
      `  ${yName} = joystick['y'] || 0;`,
      `  ${angleName} = joystick['angle'] || 0;`,
      `${statements.replace(/`/g, '\\`')}`,
      '}',
    ]
  );

  const handler = `await things.get(${thing}).subscribeEvent('joystick', ${eventHandler});`;
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};

/**
 * Generates JavaScript code for the gamepad_pro_button block.
 */
JavaScript.forBlock['gamepad_pro_button'] = function (block: Block): string {
  const thing =
    JavaScript.valueToCode(block, 'thing', JavaScript.ORDER_NONE) || null;
  const statements = JavaScript.statementToCode(block, 'statements');
  const button = JavaScript.quote_(block.getFieldValue('button'));

  const eventHandler = JavaScript.provideFunction_(
    'gamepad_buttonHandler' + block.id,
    [
      'async function ' +
        JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(interactionOutput) {',
      '  const pressed = await interactionOutput.value();',
      `  if (pressed[${button}]) {`,
      `${statements.replace(/`/g, '\\`')}`,
      '  }',
      '}',
    ]
  );

  const handler = `await things.get(${thing}).subscribeEvent('button', ${eventHandler});`;
  JavaScript.handlers['things' + block.id] = handler;

  return '';
};

/**
 * Adds WoT event handlers to the gamepad's ExposedThing instance.
 */
(globalThis as any)['addGamepadHandlers'] = function (
  gamepad: WoT.ExposedThing
) {
  const switchPro = new SwitchPro((gamepad as any).id);
  (switchPro as any).interval = setInterval(
    switchPro.pollGamepads.bind(switchPro),
    50
  );

  const handleJoystick = function (joystick: Joystick) {
    gamepad.emitEvent('joystick', joystick);
  };

  const handleButton = function (pressed: string[]) {
    gamepad.emitEvent('button', pressed);
  };

  switchPro.addListener(handleJoystick);
  switchPro.addListener(handleButton);

  addCleanUpFunction(() => {
    if ((switchPro as any).interval) {
      clearInterval((switchPro as any).interval);
    }
  });
};
