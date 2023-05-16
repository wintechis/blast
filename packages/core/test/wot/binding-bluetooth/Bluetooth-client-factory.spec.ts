// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import BluetoothClientFactory from '../../../src/wot/bindings/binding-bluetooth/Bluetooth-client-factory';
import ConcreteBluetoothAdapter from '../../../src/wot/bindings/binding-bluetooth/NodeBluetoothAdapter';
import BluetoothClient from '../../../src/wot/bindings/binding-bluetooth/Bluetooth-client';

describe('BluetoothClientFactory', () => {
  describe('getClient', () => {
    test('should return BluetoothClient', () => {
      const adapter = new ConcreteBluetoothAdapter();
      const factory = new BluetoothClientFactory(adapter);
      const client = factory.getClient();
      expect(client).toBeInstanceOf(BluetoothClient);
    });
  });
  describe('destroy', () => {
    test('should call stop on all clients', () => {
      const adapter = new ConcreteBluetoothAdapter();
      const factory = new BluetoothClientFactory(adapter);
      const client1 = factory.getClient();
      jest.spyOn(client1, 'stop');
      const client2 = factory.getClient();
      jest.spyOn(client2, 'stop');
      factory.destroy();
      expect(client1.stop).toHaveBeenCalled();
      expect(client2.stop).toHaveBeenCalled();
    });
  });
});
