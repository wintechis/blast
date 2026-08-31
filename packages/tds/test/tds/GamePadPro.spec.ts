// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from 'bun:test';
import * as td from '../../src/tds/GamepadPro.json';
import {Thing} from '@node-wot/core';

describe('GamePadPro Thing Description', () => {
  const thing = td as unknown as Thing;
  describe('events', () => {
    test('button', () => {
      const button = thing?.events.button;
      expect(button).toBeDefined();
      expect(button.data.type).toEqual('array');
    });
    test('joystick', () => {
      const joystick = thing?.events.joystick;
      expect(joystick).toBeDefined();
      expect(joystick.data.type).toEqual('object');
    });
  });
});
