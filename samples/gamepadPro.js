import {createThingWithHandlers, HidHelpers} from '@blast/node';
import {GamepadPro} from '@blast/tds';
import SwitchPro from '../packages/web/src/assets/js/things/joycon/switchPro/SwitchPro.js'

const device = await HidHelpers.selectDevice();
const thing = await createThingWithHandlers(GamepadPro, device.path, addGamepadHandlers);

const addGamepadHandlers = function (exposedThing) {
  const switchPro = new SwitchPro();
  switchPro.interval = setInterval(
    switchPro.pollGamepads.bind(switchPro),
    200
  );

  const handleJoystick = function (joystick) {
    exposedThing.emitEvent('joystick', joystick);
  };

  const handleButton = function (pressed) {
    exposedThing.emitEvent('button', pressed);
  };

  switchPro.addListener(handleJoystick);
  switchPro.addListener(handleButton);
};

const handleButton = function (pressed) {
  console.log('buttons pressed: ', pressed);
}

const handleJoystick = function (joystick) {
  console.log('joystick: ', joystick);
};

thing.subscribeEvent('button', handleButton);
thing.subscribeEvent('joystick', handleJoystick);

while (true) {
  await sleep(1000);
}
