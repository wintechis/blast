// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, jest, test} from '@jest/globals';
import HidClientFactory from '../../src/bindings/binding-hid/Hid-client-factory';
import HidAdapterMock from '../test-helpers/HidAdapterMock';
import HidClient from '../../src/bindings/binding-hid/Hid-client';

describe('HidClientFactory', () => {
  describe('getClient', () => {
    test('should return HidClient', () => {
      const adapter = new HidAdapterMock();
      const factory = new HidClientFactory(adapter);
      const client = factory.getClient();
      expect(client).toBeInstanceOf(HidClient);
    });
  });

  describe('destroy', () => {
    test('should call stop on all clients', () => {
      const adapter = new HidAdapterMock();
      const factory = new HidClientFactory(adapter);
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
