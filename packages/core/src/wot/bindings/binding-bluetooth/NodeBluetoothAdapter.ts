import {BluetoothAdapter} from './BluetoothAdapter';
import {
  AttErrors,
  BleManager,
  Connection,
  GattClientCharacteristic,
  GattClientService,
} from 'ble-host';
import HciSocket from 'hci-socket';

import {createLoggers} from '@node-wot/core';

const {debug} = createLoggers('binding-bluetooth', 'NodeBluetoothAdapter');

const transport = new HciSocket(); // connects to the first hci device on the computer, for example hci0
const options = {
  // optional properties go here
};

class ChangeEvent<T> extends Event {
  target: EventTarget;
  constructor(message: string, target: EventTarget) {
    super(message);
    this.target = target;
  }
}

export default class ConcreteBluetoothAdapter implements BluetoothAdapter {
  bleManager: BleManager | undefined = undefined;
  connectedDevices: Map<string, Connection> = new Map();
  async getBleManager() {
    if (this.bleManager === undefined) {
      this.bleManager = await new Promise<BleManager>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (BleManager as any).create(
          transport,
          options,
          (err: AttErrors, manager: BleManager) => {
            if (err) {
              reject(err);
            } else {
              resolve(manager);
            }
          }
        );
      });
    }
    return this.bleManager;
  }

  async getCharacteristic(
    deviceId: string,
    serviceID: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    debug(`getCharacteristic ${deviceId} ${serviceID} ${characteristicId}`);
    const manager = await this.getBleManager();

    // add : to mac address
    if (deviceId.length === 12) {
      deviceId = deviceId
        .match(/.{1,2}/g)!
        .join(':')
        .toUpperCase();
    }
    // upper case uuids
    serviceID = (serviceID as string).toUpperCase();
    characteristicId = (characteristicId as string).toUpperCase();

    debug(`Connecting to ${deviceId}`);

    const connection =
      this.connectedDevices.get(deviceId) ??
      (await new Promise<Connection>((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 4000);
        manager.connect(
          'public',
          deviceId,
          {
            /* options */
          },
          (conn: Connection) => {
            this.connectedDevices.set(deviceId, conn);
            conn.on('disconnect', () => {
              this.connectedDevices.delete(deviceId);
            });
            resolve(conn);
          }
        );
        manager.connect(
          'random',
          deviceId,
          {
            /* options */
          },
          (conn: Connection) => {
            this.connectedDevices.set(deviceId, conn);
            conn.on('disconnect', () => {
              this.connectedDevices.delete(deviceId);
            });
            resolve(conn);
          }
        );
      }));

    debug(`Connected to ${deviceId}`);

    const service = await new Promise<GattClientService>((resolve, reject) => {
      connection.gatt.discoverServicesByUuid(serviceID, 1, services => {
        if (services.length === 0) {
          reject(
            new Error(`Service ${serviceID} not found on device ${deviceId}`)
          );
        }
        const service = services[0];
        debug(`Found service ${serviceID}`);
        resolve(service);
      });
    });

    const characteristic = await new Promise<GattClientCharacteristic>(
      (resolve, reject) => {
        service.discoverCharacteristics(characteristics => {
          const characteristic = characteristics.find(
            c => c.uuid === characteristicId
          );
          if (characteristic) {
            debug(`Found characteristic ${characteristicId}`);
            resolve(characteristic);
          } else {
            reject(
              new Error(
                `Characteristic ${characteristicId} not found on service ${serviceID}`
              )
            );
          }
        });
      }
    );

    return this.wrap(characteristic);
  }

  async observeGAP(
    deviceId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (event: any) => void
  ): Promise<void> {
    const manager = await this.getBleManager();
    const scanner = manager.startScan({});
    if (deviceId.length === 12) {
      deviceId = deviceId
        .match(/.{1,2}/g)!
        .join(':')
        .toUpperCase();
    }
    scanner.on('report', eventData => {
      if (eventData.address === deviceId) {
        const evt = {
          target: {
            address: eventData.address,
            rssi: eventData.rssi,
            txPower: eventData.parsedDataItems.txPowerLevel,
            manufacturerData:
              eventData.parsedDataItems.manufacturerSpecificData,
            serviceData: eventData.parsedDataItems.serviceData,
            serviceUuids: eventData.parsedDataItems.serviceUuids,
          },
        };
        handler(evt);
      }
    });
  }

  wrap(
    characteristic: GattClientCharacteristic
  ): BluetoothRemoteGATTCharacteristic {
    const char = {
      service: {} as BluetoothRemoteGATTService,
      uuid: characteristic.uuid,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties: characteristic.properties as any,
      value: undefined,
      readValue: () => {
        return new Promise((resolve, reject) => {
          debug('readValue');
          characteristic.read((err, value) => {
            if (err || value === undefined) {
              reject(err);
            } else {
              debug('readValue done', value);
              const arrayBuffer = new Uint8Array(value).buffer;
              resolve(new DataView(arrayBuffer));
            }
          });
        });
      },
      writeValue: async (value: BufferSource) => {
        return new Promise<void>((resolve, reject) => {
          debug('writeValue', value);
          characteristic.write(
            Buffer.from(value as ArrayBuffer),
            (err: AttErrors) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      },
      writeValueWithoutResponse: async (value: BufferSource) => {
        return new Promise<void>((resolve, reject) => {
          debug('writeValueWithoutResponse', value);
          characteristic.writeWithoutResponse(
            Buffer.from(value as ArrayBuffer),
            undefined,
            (err: AttErrors) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      },
      writeValueWithResponse: async (value: BufferSource) => {
        return new Promise<void>((resolve, reject) => {
          debug('writeValueWithResponse', value);
          characteristic.write(
            Buffer.from(value as ArrayBuffer),
            (err: AttErrors) => {
              if (err) {
                reject(err);
              } else {
                debug('writeValueWithResponse done');
                resolve();
              }
            }
          );
        });
      },
      startNotifications: () => {
        return new Promise((resolve, reject) => {
          characteristic.writeCCCD(true, false, err => {
            if (err) {
              reject(err);
            } else {
              resolve(char);
            }
          });
        });
      },
      stopNotifications: () => {
        return new Promise((resolve, reject) => {
          characteristic.writeCCCD(false, false, err => {
            if (err) {
              reject(err);
            } else {
              resolve(char);
            }
          });
        });
      },
      addEventListener: (
        type: 'characteristicvaluechanged',
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions
      ) => {
        characteristic.on(
          'change',
          (value: Buffer, isIndication: boolean, callback: Function) => {
            if (listener) {
              debug(
                'characteristicvaluechanged event received with value ',
                value
              );
              const arrayBuffer = new Uint8Array(value).buffer;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (char.value as any) = new DataView(arrayBuffer);
              debug('calling listener with value ', char.value);
              (listener as EventListener)(
                new ChangeEvent(
                  'characteristicvaluechanged',
                  char as unknown as EventTarget
                )
              );
            }
          }
        );
      },
      removeEventListener: (
        type: 'characteristicvaluechanged',
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | EventListenerOptions
      ) => {
        characteristic.removeEventListener('change', listener as EventListener);
      },
    };
    return char as BluetoothRemoteGATTCharacteristic;
  }
}
