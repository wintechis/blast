import {BluetoothAdapter} from "../../src/bindings/binding-bluetooth/BluetoothAdapter";

class CharacteristicMock
  extends EventTarget
  implements BluetoothRemoteGATTCharacteristic
{
  public value: DataView;
  public properties = {
    authenticatedSignedWrites: false,
    broadcast: false,
    indicate: false,
    notify: false,
    read: false,
    reliableWrite: false,
    writableAuxiliaries: false,
    write: false,
    writeWithoutResponse: false,
  };

  constructor(
    public service: BluetoothRemoteGATTService,
    public uuid: string,
    value?: DataView
  ) {
    super();
    this.value = value ?? new DataView(new ArrayBuffer(0));
  }

  public startNotifications(): Promise<BluetoothRemoteGATTCharacteristic> {
    return Promise.resolve(this);
  }

  public stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic> {
    return Promise.resolve(this);
  }

  public readValue() {
    return Promise.resolve(this.value);
  }

  public writeValue(value: ArrayBuffer) {
    this.value = new DataView(new Uint8Array(value).buffer);
    return Promise.resolve();
  }

  public writeValueWithResponse(value: ArrayBuffer) {
    return this.writeValue(value);
  }

  public writeValueWithoutResponse(value: ArrayBuffer) {
    return this.writeValue(value);
  }

  public getDescriptor() {
    return Promise.reject(new Error('Not implemented'));
  }

  public getDescriptors() {
    return Promise.reject(new Error('Not implemented'));
  }

  public oncharacteristicvaluechanged(
    this: BluetoothRemoteGATTCharacteristic,
    ev: Event
  ) {
    return null;
  }
}

export default class BluetoothAdapterMock extends BluetoothAdapter {
  private characteristics: BluetoothRemoteGATTCharacteristic[] = [];

  public addCharacteristic(characteristicId: string, value?: DataView) {
    const char = new CharacteristicMock(
      null as unknown as BluetoothRemoteGATTService,
      characteristicId,
      value
    );
    this.characteristics.push(char);
    return char;
  }

  public getCharacteristic(
    deviceId: string,
    serviceID: BluetoothServiceUUID,
    characteristicId: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic> {
    const characteristic = this.characteristics.find(
      c => c.uuid === characteristicId
    );
    if (characteristic) {
      return Promise.resolve(characteristic);
    } else {
      return Promise.reject(new Error('Characteristic not found'));
    }
  }

  public setCharacteristicValue(uuid: string, value: ArrayBuffer) {
    const characteristic = this.characteristics.find(c => c.uuid === uuid);
    if (characteristic) {
      (characteristic as CharacteristicMock).value = new DataView(value);
    }
  }

  public observeGAP(
    deviceId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (event: any) => void
  ): Promise<void> {
    return Promise.resolve();
  }
}
