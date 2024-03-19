import {createThingWithHandlers, HidHelpers} from '@blast/node';
import {JoyCon as td} from '@blast/tds';
import {JoyConLeft, JoyConRight, GeneralController} from '../packages/web/src/assets/js/things/joycon/switchPro/JoyCon.js'

const device = await HidHelpers.selectDevice();
const thing = await createThingWithHandlers(td, device.path, addJoyConHandlers);

const addJoyConHandlers = function (exposedThing) {
  const id = (exposedThing).id;
  const device = getWebHidDevice(id);
  if (!device) {
    throw new Error(`No device with id ${id} found.`);
  }
  let joyCon = null;
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

  function _shallowEqual(object1, object2) {
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

  const handleInput = function (packet) {
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
    const pressed = [];
    if (buttonStatus) {
      for (const button of Object.keys(buttonStatus)) {
        if (buttonStatus[button]) {
          pressed.push(button);
        }
      }
    }

    // write values to JoyCon
    Object.assign(joyCon, {
      pressed,
      accelerometers,
      gyroscopes,
      actualAccelerometer,
      actualGyroscope,
      actualOrientation,
      actualOrientationQuaternion,
      quaternion,
    });

    if (!_shallowEqual(pressed, (joyCon).prevPressed)) {
      (joyCon).prevPressed = pressed;
      exposedThing.emitEvent('button', buttonStatus);
    }
  };

  joyCon.open();
  (joyCon).interval = setInterval(async () => {
    if (!(joyCon).eventListenerAttached === true) {
      (joyCon).addEventListener('hidinput', (event) => {
        handleInput((event).detail);
      });
      (joyCon).eventListenerAttached = true;
    }
  }, 2000);

  addCleanUpFunction(() => {
    if ((joyCon).interval) {
      clearInterval((joyCon).interval);
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

  const waitForProperty = async function (property) {
    while (Object.keys((joyCon)[property]).length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return (joyCon)[property];
  };
};

// TODO
