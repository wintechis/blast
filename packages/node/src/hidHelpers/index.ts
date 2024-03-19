import DeviceSelector from './deviceSelector';

async function selectDevice() {
  const deviceSelector = new DeviceSelector();
  await deviceSelector.showSelector();
  return deviceSelector.device;
}

export const HidHelpers = {
  selectDevice,
};
