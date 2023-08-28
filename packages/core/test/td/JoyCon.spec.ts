// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/JoyCon.json';
import {Thing} from '@node-wot/td-tools';

describe('JoyCon Thing Description', () => {
  const thing = td as unknown as Thing;
  describe('properties', () => {
    test('accelerometers', () => {
      const accelerometers = thing.properties?.accelerometers;
      expect(accelerometers).toBeDefined();
      expect(accelerometers.type).toEqual('object');
      const accelerometer1 = accelerometers.properties[1];
      expect(accelerometer1).toBeDefined();
      expect(accelerometer1.type).toEqual('object');
      expect(accelerometer1.properties.x).toBeDefined();
      expect(accelerometer1.properties.x.type).toEqual('number');
      expect(accelerometer1.properties.y).toBeDefined();
      expect(accelerometer1.properties.y.type).toEqual('number');
      expect(accelerometer1.properties.z).toBeDefined();
      expect(accelerometer1.properties.z.type).toEqual('number');
      const accelerometer2 = accelerometers.properties[2];
      expect(accelerometer2).toBeDefined();
      expect(accelerometer2.type).toEqual('object');
      expect(accelerometer2.properties.x).toBeDefined();
      expect(accelerometer2.properties.x.type).toEqual('number');
      expect(accelerometer2.properties.y).toBeDefined();
      expect(accelerometer2.properties.y.type).toEqual('number');
      expect(accelerometer2.properties.z).toBeDefined();
      expect(accelerometer2.properties.z.type).toEqual('number');
      const accelerometer3 = accelerometers.properties[3];
      expect(accelerometer3).toBeDefined();
      expect(accelerometer3.type).toEqual('object');
      expect(accelerometer3.properties.x).toBeDefined();
      expect(accelerometer3.properties.x.type).toEqual('number');
      expect(accelerometer3.properties.y).toBeDefined();
      expect(accelerometer3.properties.y.type).toEqual('number');
      expect(accelerometer3.properties.z).toBeDefined();
      expect(accelerometer3.properties.z.type).toEqual('number');
    });
    test('actualAccelerometer', () => {
      const actualAccelerometer = thing.properties?.actualAccelerometer;
      expect(actualAccelerometer).toBeDefined();
      expect(actualAccelerometer.type).toEqual('object');
      expect(actualAccelerometer.properties.x).toBeDefined();
      expect(actualAccelerometer.properties.x.type).toEqual('number');
      expect(actualAccelerometer.properties.y).toBeDefined();
      expect(actualAccelerometer.properties.y.type).toEqual('number');
      expect(actualAccelerometer.properties.z).toBeDefined();
      expect(actualAccelerometer.properties.z.type).toEqual('number');
    });
    test('actualGyroscope', () => {
      const actualGyroscope = thing.properties?.actualGyroscope;
      expect(actualGyroscope).toBeDefined();
      expect(actualGyroscope.type).toEqual('object');
      expect(actualGyroscope.properties.rps).toBeDefined();
      expect(actualGyroscope.properties.rps.type).toEqual('object');
      expect(actualGyroscope.properties.rps.properties.x).toBeDefined();
      expect(actualGyroscope.properties.rps.properties.x.type).toEqual(
        'number'
      );
      expect(actualGyroscope.properties.rps.properties.y).toBeDefined();
      expect(actualGyroscope.properties.rps.properties.y.type).toEqual(
        'number'
      );
      expect(actualGyroscope.properties.rps.properties.z).toBeDefined();
      expect(actualGyroscope.properties.rps.properties.z.type).toEqual(
        'number'
      );
      expect(actualGyroscope.properties.dps).toBeDefined();
      expect(actualGyroscope.properties.dps.type).toEqual('object');
      expect(actualGyroscope.properties.dps.properties.x).toBeDefined();
      expect(actualGyroscope.properties.dps.properties.x.type).toEqual(
        'number'
      );
      expect(actualGyroscope.properties.dps.properties.y).toBeDefined();
      expect(actualGyroscope.properties.dps.properties.y.type).toEqual(
        'number'
      );
      expect(actualGyroscope.properties.dps.properties.z).toBeDefined();
      expect(actualGyroscope.properties.dps.properties.z.type).toEqual(
        'number'
      );
    });
    test('actualOrientation', () => {
      const actualOrientation = thing.properties?.actualOrientation;
      expect(actualOrientation).toBeDefined();
      expect(actualOrientation.type).toEqual('object');
      expect(actualOrientation.properties.alpha).toBeDefined();
      expect(actualOrientation.properties.alpha.type).toEqual('number');
      expect(actualOrientation.properties.beta).toBeDefined();
      expect(actualOrientation.properties.beta.type).toEqual('number');
      expect(actualOrientation.properties.gamma).toBeDefined();
      expect(actualOrientation.properties.gamma.type).toEqual('number');
    });
    test('actualOrientationQuaternion', () => {
      const actualOrientationQuaternion =
        thing.properties?.actualOrientationQuaternion;
      expect(actualOrientationQuaternion).toBeDefined();
      expect(actualOrientationQuaternion.type).toEqual('object');
      expect(actualOrientationQuaternion.properties.alpha).toBeDefined();
      expect(actualOrientationQuaternion.properties.alpha.type).toEqual(
        'number'
      );
      expect(actualOrientationQuaternion.properties.beta).toBeDefined();
      expect(actualOrientationQuaternion.properties.beta.type).toEqual(
        'number'
      );
      expect(actualOrientationQuaternion.properties.gamma).toBeDefined();
      expect(actualOrientationQuaternion.properties.gamma.type).toEqual(
        'number'
      );
    });
    test('gyroscopes', () => {
      const gyroscopes = thing.properties?.gyroscopes;
      expect(gyroscopes).toBeDefined();
      expect(gyroscopes.type).toEqual('object');
      const gyroscope0 = gyroscopes.properties[0];
      expect(gyroscope0).toBeDefined();
      expect(gyroscope0).toBeDefined();
      expect(gyroscope0.type).toEqual('object');
      expect(gyroscope0.properties.rps).toBeDefined();
      expect(gyroscope0.properties.rps.type).toEqual('object');
      expect(gyroscope0.properties.rps.properties.x).toBeDefined();
      expect(gyroscope0.properties.rps.properties.x.type).toEqual('number');
      expect(gyroscope0.properties.rps.properties.y).toBeDefined();
      expect(gyroscope0.properties.rps.properties.y.type).toEqual('number');
      expect(gyroscope0.properties.rps.properties.z).toBeDefined();
      expect(gyroscope0.properties.rps.properties.z.type).toEqual('number');
      expect(gyroscope0.properties.dps).toBeDefined();
      expect(gyroscope0.properties.dps.type).toEqual('object');
      expect(gyroscope0.properties.dps.properties.x).toBeDefined();
      expect(gyroscope0.properties.dps.properties.x.type).toEqual('number');
      expect(gyroscope0.properties.dps.properties.y).toBeDefined();
      expect(gyroscope0.properties.dps.properties.y.type).toEqual('number');
      expect(gyroscope0.properties.dps.properties.z).toBeDefined();
      expect(gyroscope0.properties.dps.properties.z.type).toEqual('number');
      const gyroscope1 = gyroscopes.properties[1];
      expect(gyroscope1).toBeDefined();
      expect(gyroscope1.type).toEqual('object');
      expect(gyroscope1.properties.rps).toBeDefined();
      expect(gyroscope1.properties.rps.type).toEqual('object');
      expect(gyroscope1.properties.rps.properties.x).toBeDefined();
      expect(gyroscope1.properties.rps.properties.x.type).toEqual('number');
      expect(gyroscope1.properties.rps.properties.y).toBeDefined();
      expect(gyroscope1.properties.rps.properties.y.type).toEqual('number');
      expect(gyroscope1.properties.rps.properties.z).toBeDefined();
      expect(gyroscope1.properties.rps.properties.z.type).toEqual('number');
      expect(gyroscope1.properties.dps).toBeDefined();
      expect(gyroscope1.properties.dps.type).toEqual('object');
      expect(gyroscope1.properties.dps.properties.x).toBeDefined();
      expect(gyroscope1.properties.dps.properties.x.type).toEqual('number');
      expect(gyroscope1.properties.dps.properties.y).toBeDefined();
      expect(gyroscope1.properties.dps.properties.y.type).toEqual('number');
      expect(gyroscope1.properties.dps.properties.z).toBeDefined();
      expect(gyroscope1.properties.dps.properties.z.type).toEqual('number');
      const gyroscope2 = gyroscopes.properties[2];
      expect(gyroscope2).toBeDefined();
      expect(gyroscope2.type).toEqual('object');
      expect(gyroscope2.properties.rps).toBeDefined();
      expect(gyroscope2.properties.rps.type).toEqual('object');
      expect(gyroscope2.properties.rps.properties.x).toBeDefined();
      expect(gyroscope2.properties.rps.properties.x.type).toEqual('number');
      expect(gyroscope2.properties.rps.properties.y).toBeDefined();
      expect(gyroscope2.properties.rps.properties.y.type).toEqual('number');
      expect(gyroscope2.properties.rps.properties.z).toBeDefined();
      expect(gyroscope2.properties.rps.properties.z.type).toEqual('number');
      expect(gyroscope2.properties.dps).toBeDefined();
      expect(gyroscope2.properties.dps.type).toEqual('object');
      expect(gyroscope2.properties.dps.properties.x).toBeDefined();
    });
    test('quaternion', () => {
      const quaternion = thing.properties?.quaternion;
      expect(quaternion).toBeDefined();
      expect(quaternion.type).toEqual('object');
      expect(quaternion.properties.w).toBeDefined();
      expect(quaternion.properties.w.type).toEqual('number');
      expect(quaternion.properties.x).toBeDefined();
      expect(quaternion.properties.x.type).toEqual('number');
      expect(quaternion.properties.y).toBeDefined();
      expect(quaternion.properties.y.type).toEqual('number');
      expect(quaternion.properties.z).toBeDefined();
      expect(quaternion.properties.z.type).toEqual('number');
    });
  });
  describe('events', () => {
    test('button', () => {
      const button = thing.events?.button;
      expect(button).toBeDefined();
      const data = button?.data;
      expect(data).toBeDefined();
      expect(data?.type).toEqual('array');
    });
  });
});
