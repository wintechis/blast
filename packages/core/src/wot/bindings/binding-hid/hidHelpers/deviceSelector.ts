import HID from 'node-hid';
import inquirer from 'inquirer';

export default class DeviceSelector {
  device = null;

  async showSelector() {
    HID.setDriverType('libusb');
    const devices = HID.devices();
    // delete devices without manufacturer and product
    const uniqueDevices = devices.filter(device => {
      return device.manufacturer && device.product;
    });
    const choices = uniqueDevices.map(device => {
      return {
        name: `${device.manufacturer} ${device.product}`,
        value: device,
      };
    });
    const questions = [
      {
        type: 'list',
        name: 'device',
        message: 'Select a device',
        choices: choices,
      },
    ];
    const answers = await inquirer.prompt(questions);
    this.device = answers.device;
  }
}
