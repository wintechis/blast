import {dialog, Variables} from 'blockly';
import {addBlock, reloadToolbox} from '../../assets/js/toolbox';
import {connectedThings, getThingsLog, webBluetoothDevices} from './things';
import {
  connectedThingsSlice,
  implementedThing,
} from '../../ThingsStore/connectedThingsReducers';
import {thingsStore} from '../../ThingsStore/ThingsStore';

const BROWSER_SUPPORT = 'bluetooth' in navigator;
export const connectedBluetoothDevices = new Map<string, BluetoothDevice>();

export const getDeviceById = async function (
  id: string
): Promise<BluetoothDevice | undefined> {
  if (BROWSER_SUPPORT) {
    const thingsLog = getThingsLog();
    if (connectedBluetoothDevices.has(id)) {
      return connectedBluetoothDevices.get(id);
    }
    thingsLog('Getting existing devices...', 'Bluetooth');
    const devices = await navigator.bluetooth.getDevices();
    for (const device of devices) {
      if (device.id === id) {
        return device;
      }
    }
    console.error(
      `Bluetooth device <code>${id}</code> wasn't found in paired devices.`
    );
  } else {
    console.error('Web Bluetooth is not supported.');
  }
};

export const pingDevice = async function (id: string) {
  const device = await getDeviceById(id);
  if (device) {
    const thingsLog = getThingsLog();
    const connected = device.gatt?.connected;
    if (connected) {
      thingsLog(`Device <code>${id}</code> is connected`, 'Bluetooth', id);
    } else {
      thingsLog(`Device <code>${id}</code> is disconnected`, 'Bluetooth', id);
    }
    return connected;
  }
  return false;
};

export const connect = async function (id: string) {
  const thingsLog = getThingsLog();
  const device = await getDeviceById(id);
  thingsLog(`Connecting to device <code>${id}</code>`, 'Bluetooth', device?.id);
  const gatt = await device?.gatt?.connect();
  if (gatt) {
    thingsLog(
      `Connected to device <code>${id}</code>`,
      'Bluetooth',
      device?.id
    );
  } else {
    thingsLog(
      `Failed to connect to device <code>${id}</code>`,
      'Bluetooth',
      device?.id
    );
  }
  return gatt;
};

export const requestDevice = async function (thing: implementedThing) {
  const thingsLog = getThingsLog();
  if (BROWSER_SUPPORT) {
    let options: RequestDeviceOptions;
    // if no filters are given, accept all devices
    if (thing.filters) {
      options = {filters: thing.filters as BluetoothLEScanFilter[]};
    } else {
      options = {acceptAllDevices: true};
    }
    if (thing.optionalServices) {
      options.optionalServices = thing.optionalServices;
    }

    try {
      thingsLog(`Requesting device <code>${thing.name}</code>`, 'Bluetooth');
      const device = await navigator.bluetooth.requestDevice(options);
      thingsLog(`Device <code>${thing.name}</code> paired`, 'Bluetooth');
      connect(device.id);
      addWebBluetoothDevice(device, thing);
      return device;
    } catch (error) {
      console.error(error);
    }
  }
};

export const addWebBluetoothDevice = async function (
  device: BluetoothDevice,
  thing: implementedThing
) {
  const name = device.name ?? '';
  const id = device.id;
  // This function needs to be named so it can be called recursively.
  const promptAndCheckWithAlert = (name: string, id: string): void => {
    Variables.promptName(
      'Pair successful! Now give your device a name.',
      name,
      text => {
        if (text) {
          const existing = thingsStore
            .getState()
            .connectedThings.some(thing => thing.id === text);
          if (existing) {
            const msg = `Name ${text} already exists.`;
            dialog.alert(msg, () => promptAndCheckWithAlert(text, id));
          } else {
            // No conflict
            thingsStore.dispatch(
              connectedThingsSlice.actions.add({
                name: text,
                thing,
              })
            );
            connectedBluetoothDevices.set(text, device);
            connectedThings.set(text, thing);
            webBluetoothDevices.set(text, device.id);
            // Add blocks to toolbox
            for (const block of thing.blocks) {
              addBlock(block.type, block.category, block.XML);
            }
            // Add thing to workspace
            reloadToolbox();
          }
        } else {
          const msg = 'Name cannot be empty.';
          dialog.alert(msg, () => promptAndCheckWithAlert(name, id));
        }
      }
    );
  };
  return promptAndCheckWithAlert(name, id);
};
