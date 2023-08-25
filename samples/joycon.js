import {createThingWithHandlers} from '../packages/core/dist/blast.node.js';
import {JoyCon as td} from '../packages/core/dist/blast.tds.js';
import {HidHelpers} from '../packages/core/dist/blast.hidHelpers.js';
import JoyCon from '../packages/web/src/assets/js/things/joycon/switchPro/JoyCon.js'

const device = await HidHelpers.selectDevice();
const thing = await createThingWithHandlers(td, device.path, addJoyConHandlers);

const addJoyConHandlers = function (exposedThing) {
  const joyCon = new JoyCon();
  joyCon.interval = setInterval(
    joyCon.pollGamepads.bind(joyCon),
    200
  );

  const handleJoystick = function (joystick) {
    exposedThing.emitEvent('joystick', joystick);
  };

  const handleButton = function (pressed) {
    exposedThing.emitEvent('button', pressed);
  };

  joyCon.addListener(handleJoystick);
  joyCon.addListener(handleButton);
}

// TODO
