import {ExposedThing} from '@node-wot/core';
import * as WoT from 'wot-typescript-definitions';
import {getThing, removeThing} from '../index.js';
import {subscribe} from '../../blast_webBluetooth.js';

export default class XiamoiThermometer {
  private thing: WoT.ExposedThing | null = null;
  private exposedThing: ExposedThing | null = null;
  private webBluetoothId: string;
  private td: WoT.ThingDescription;
  private temperature = -1000;
  private humidity = -1000;
  private subscribed = false;
  private xiaomiServiceUUID: BluetoothServiceUUID =
    'ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6';
  private dataCharacteristicUUID: BluetoothCharacteristicUUID =
    'ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6';

  public thingModel: WoT.ThingDescription = {
    '@context': ['https://www.w3.org/2019/wot/td/v1'],
    '@type': ['Thing'],
    id: 'blast:Bluetooth:xiamoiThermometer',
    title: 'Xiaomi Thermometer',
    description:
      'The Xiaomi Thermometer is a temperature and humidity sensor with a Bluetooth Low Energy interface.',
    securityDefinitions: {
      nosec_sc: {
        scheme: 'nosec',
      },
    },
    security: 'nosec_sc',
    properties: {
      temperature: {
        title: 'temperature',
        description: 'The temperature measured by the thermometer.',
        unit: '°C',
        type: 'number',
        readOnly: true,
      },
      humidity: {
        title: 'humidity',
        description: 'The relative humidity measured by the thermometer.',
        unit: '%',
        type: 'number',
        readOnly: true,
      },
    },
    actions: {
      subscribeToSensorData: {
        title: 'subscribeToSensorData',
        description: 'Subscribes to sensor data.',
      },
    },
  };

  constructor(webBluetoothId: string) {
    this.webBluetoothId = webBluetoothId;
    getThing(this.thingModel).then(thing => {
      this.thing = thing;
      this.exposedThing = this.thing as unknown as ExposedThing;
      this.td = thing.getThingDescription();
      this.addPropertyHandlers();
      this.thing.expose();
    });
  }

  private addPropertyHandlers() {
    this.thing?.setPropertyReadHandler('temperature', async () => {
      return this.getTemperature();
    });
    this.thing?.setPropertyReadHandler('humidity', async () => {
      return this.getHumidity();
    });
  }

  private async getTemperature(): Promise<number> {
    if (!this.subscribed) {
      await this.subscribeToSensorData();
    }
    while (this.temperature === -1000) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.temperature;
  }

  private async getHumidity(): Promise<number> {
    if (!this.subscribed) {
      await this.subscribeToSensorData();
    }
    while (this.humidity === -1000) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.humidity;
  }

  private async subscribeToSensorData(): Promise<void> {
    /**
     * Handles characteristicvaluechanged events.
     * @param {Event} event the event.
     * @param {String} property the property to fetch.
     */
    const notificationHandler = (event: BluetoothAdvertisingEvent) => {
      const {value} = event.target as BluetoothRemoteGATTCharacteristic;
      if (value) {
        const sign = value.getUint8(1) & (1 << 7);
        let temp = ((value.getUint8(1) & 0x7f) << 8) | value.getUint8(0);
        if (sign) temp = temp - 32767;
        this.temperature = temp / 100;
        this.humidity = value.getUint8(2);
      }
    };

    subscribe(
      this.webBluetoothId,
      this.xiaomiServiceUUID,
      this.dataCharacteristicUUID,
      notificationHandler
    );
  }

  public destroy() {
    removeThing(this.td?.id);
  }

  public async readProperty(property: string): Promise<any> {
    while (!this.exposedThing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.exposedThing.readProperty(property);
  }

  public async getThingDescription(): Promise<WoT.ThingDescription> {
    while (!this.thing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return this.td;
  }
}
