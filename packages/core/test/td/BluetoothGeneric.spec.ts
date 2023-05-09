// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/BluetoothGeneric.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('BluetoothGeneric Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('barometricPressureTrend', () => {
      const barometricPressureTrend = thing?.properties.barometricPressureTrend;
      expect(barometricPressureTrend).toBeDefined();
      expect(barometricPressureTrend.type).toEqual('number');
      expect(barometricPressureTrend.readOnly).toBeTruthy();
      expect(barometricPressureTrend.writeOnly).toBeFalsy();
      expect(barometricPressureTrend.observable).toBeFalsy();
      expect(barometricPressureTrend.forms).toHaveLength(1);
      expect(barometricPressureTrend.forms[0].op).toEqual('readproperty');
      expect(barometricPressureTrend.forms[0]['sbo:methodName']).toEqual(
        'sbo:read'
      );
      expect(barometricPressureTrend.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('batteryLevel', () => {
      const batteryLevel = thing?.properties.batteryLevel;
      expect(batteryLevel).toBeDefined();
      expect(batteryLevel.type).toEqual('number');
      expect(batteryLevel.readOnly).toBeTruthy();
      expect(batteryLevel.writeOnly).toBeFalsy();
      expect(batteryLevel.observable).toBeFalsy();
      expect(batteryLevel.forms).toHaveLength(1);
      expect(batteryLevel.forms[0].op).toEqual('readproperty');
      expect(batteryLevel.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(batteryLevel.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('deviceName', () => {
      const deviceName = thing?.properties.deviceName;
      expect(deviceName).toBeDefined();
      expect(deviceName.type).toEqual('string');
      expect(deviceName.readOnly).toBeFalsy();
      expect(deviceName.writeOnly).toBeFalsy();
      expect(deviceName.observable).toBeFalsy();
      expect(deviceName.forms).toHaveLength(2);
      expect(deviceName.forms[0].op).toEqual('readproperty');
      expect(deviceName.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(deviceName.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
      expect(deviceName.forms[1].op).toEqual('writeproperty');
      expect(deviceName.forms[1]['sbo:methodName']).toEqual(
        'sbo:write-without-response'
      );
      expect(deviceName.forms[1].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('elevation', () => {
      const elevation = thing?.properties.elevation;
      expect(elevation).toBeDefined();
      expect(elevation.type).toEqual('number');
      expect(elevation.readOnly).toBeTruthy();
      expect(elevation.writeOnly).toBeFalsy();
      expect(elevation.observable).toBeFalsy();
      expect(elevation.forms).toHaveLength(1);
      expect(elevation.forms[0].op).toEqual('readproperty');
      expect(elevation.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(elevation.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('firmwareRevision', () => {
      const firmwareRevision = thing?.properties.firmwareRevision;
      expect(firmwareRevision).toBeDefined();
      expect(firmwareRevision.type).toEqual('string');
      expect(firmwareRevision.readOnly).toBeTruthy();
      expect(firmwareRevision.writeOnly).toBeFalsy();
      expect(firmwareRevision.observable).toBeFalsy();
      expect(firmwareRevision.forms).toHaveLength(1);
      expect(firmwareRevision.forms[0].op).toEqual('readproperty');
      expect(firmwareRevision.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(firmwareRevision.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('hardwareRevision', () => {
      const hardwareRevision = thing?.properties.hardwareRevision;
      expect(hardwareRevision).toBeDefined();
      expect(hardwareRevision.type).toEqual('string');
      expect(hardwareRevision.readOnly).toBeTruthy();
      expect(hardwareRevision.writeOnly).toBeFalsy();
      expect(hardwareRevision.observable).toBeFalsy();
      expect(hardwareRevision.forms).toHaveLength(1);
      expect(hardwareRevision.forms[0].op).toEqual('readproperty');
      expect(hardwareRevision.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(hardwareRevision.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('humidity', () => {
      const humidity = thing?.properties.humidity;
      expect(humidity).toBeDefined();
      expect(humidity.type).toEqual('number');
      expect(humidity.readOnly).toBeTruthy();
      expect(humidity.writeOnly).toBeFalsy();
      expect(humidity.observable).toBeFalsy();
      expect(humidity.forms).toHaveLength(1);
      expect(humidity.forms[0].op).toEqual('readproperty');
      expect(humidity.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(humidity.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('irradiance', () => {
      const irradiance = thing?.properties.irradiance;
      expect(irradiance).toBeDefined();
      expect(irradiance.type).toEqual('number');
      expect(irradiance.readOnly).toBeTruthy();
      expect(irradiance.writeOnly).toBeFalsy();
      expect(irradiance.observable).toBeFalsy();
      expect(irradiance.forms).toHaveLength(1);
      expect(irradiance.forms[0].op).toEqual('readproperty');
      expect(irradiance.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(irradiance.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('intermediateTemperature', () => {
      const intermediateTemperature = thing?.properties.intermediateTemperature;
      expect(intermediateTemperature).toBeDefined();
      expect(intermediateTemperature.type).toEqual('number');
      expect(intermediateTemperature.readOnly).toBeTruthy();
      expect(intermediateTemperature.writeOnly).toBeFalsy();
      expect(intermediateTemperature.observable).toBeFalsy();
      expect(intermediateTemperature.forms).toHaveLength(1);
      expect(intermediateTemperature.forms[0].op).toEqual('readproperty');
      expect(intermediateTemperature.forms[0]['sbo:methodName']).toEqual(
        'sbo:read'
      );
      expect(intermediateTemperature.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('manufacturerName', () => {
      const manufacturerName = thing?.properties.manufacturerName;
      expect(manufacturerName).toBeDefined();
      expect(manufacturerName.type).toEqual('string');
      expect(manufacturerName.readOnly).toBeTruthy();
      expect(manufacturerName.writeOnly).toBeFalsy();
      expect(manufacturerName.observable).toBeFalsy();
      expect(manufacturerName.forms).toHaveLength(1);
      expect(manufacturerName.forms[0].op).toEqual('readproperty');
      expect(manufacturerName.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(manufacturerName.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('modelNumber', () => {
      const modelNumber = thing?.properties.modelNumber;
      expect(modelNumber).toBeDefined();
      expect(modelNumber.type).toEqual('string');
      expect(modelNumber.readOnly).toBeTruthy();
      expect(modelNumber.writeOnly).toBeFalsy();
      expect(modelNumber.observable).toBeFalsy();
      expect(modelNumber.forms).toHaveLength(1);
      expect(modelNumber.forms[0].op).toEqual('readproperty');
      expect(modelNumber.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(modelNumber.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('movementCounter', () => {
      const movementCounter = thing?.properties.movementCounter;
      expect(movementCounter).toBeDefined();
      expect(movementCounter.type).toEqual('number');
      expect(movementCounter.readOnly).toBeTruthy();
      expect(movementCounter.writeOnly).toBeFalsy();
      expect(movementCounter.observable).toBeFalsy();
      expect(movementCounter.forms).toHaveLength(1);
      expect(movementCounter.forms[0].op).toEqual('readproperty');
      expect(movementCounter.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(movementCounter.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('pressure', () => {
      const pressure = thing?.properties.pressure;
      expect(pressure).toBeDefined();
      expect(pressure.type).toEqual('number');
      expect(pressure.readOnly).toBeTruthy();
      expect(pressure.writeOnly).toBeFalsy();
      expect(pressure.observable).toBeFalsy();
      expect(pressure.forms).toHaveLength(1);
      expect(pressure.forms[0].op).toEqual('readproperty');
      expect(pressure.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(pressure.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('serialNumber', () => {
      const serialNumber = thing?.properties.serialNumber;
      expect(serialNumber).toBeDefined();
      expect(serialNumber.type).toEqual('string');
      expect(serialNumber.readOnly).toBeTruthy();
      expect(serialNumber.writeOnly).toBeFalsy();
      expect(serialNumber.observable).toBeFalsy();
      expect(serialNumber.forms).toHaveLength(1);
      expect(serialNumber.forms[0].op).toEqual('readproperty');
      expect(serialNumber.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(serialNumber.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('softwareRevision', () => {
      const softwareRevision = thing?.properties.softwareRevision;
      expect(softwareRevision).toBeDefined();
      expect(softwareRevision.type).toEqual('string');
      expect(softwareRevision.readOnly).toBeTruthy();
      expect(softwareRevision.writeOnly).toBeFalsy();
      expect(softwareRevision.observable).toBeFalsy();
      expect(softwareRevision.forms).toHaveLength(1);
      expect(softwareRevision.forms[0].op).toEqual('readproperty');
      expect(softwareRevision.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(softwareRevision.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('temperature', () => {
      const temperature = thing?.properties.temperature;
      expect(temperature).toBeDefined();
      expect(temperature.type).toEqual('number');
      expect(temperature.readOnly).toBeTruthy();
      expect(temperature.writeOnly).toBeFalsy();
      expect(temperature.observable).toBeFalsy();
      expect(temperature.forms).toHaveLength(1);
      expect(temperature.forms[0].op).toEqual('readproperty');
      expect(temperature.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(temperature.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('temperatureMeasurement', () => {
      const temperatureMeasurement = thing?.properties.temperatureMeasurement;
      expect(temperatureMeasurement).toBeDefined();
      expect(temperatureMeasurement.type).toEqual('number');
      expect(temperatureMeasurement.readOnly).toBeTruthy();
      expect(temperatureMeasurement.writeOnly).toBeFalsy();
      expect(temperatureMeasurement.observable).toBeFalsy();
      expect(temperatureMeasurement.forms).toHaveLength(1);
      expect(temperatureMeasurement.forms[0].op).toEqual('readproperty');
      expect(temperatureMeasurement.forms[0]['sbo:methodName']).toEqual(
        'sbo:read'
      );
      expect(temperatureMeasurement.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('temperatureType', () => {
      const temperatureType = thing?.properties.temperatureType;
      expect(temperatureType).toBeDefined();
      expect(temperatureType.type).toEqual('string');
      expect(temperatureType.readOnly).toBeTruthy();
      expect(temperatureType.writeOnly).toBeFalsy();
      expect(temperatureType.observable).toBeFalsy();
      expect(temperatureType.forms).toHaveLength(1);
      expect(temperatureType.forms[0].op).toEqual('readproperty');
      expect(temperatureType.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(temperatureType.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('txPowerLevel', () => {
      const txPowerLevel = thing?.properties.txPowerLevel;
      expect(txPowerLevel).toBeDefined();
      expect(txPowerLevel.type).toEqual('number');
      expect(txPowerLevel.readOnly).toBeTruthy();
      expect(txPowerLevel.writeOnly).toBeFalsy();
      expect(txPowerLevel.observable).toBeFalsy();
      expect(txPowerLevel.forms).toHaveLength(1);
      expect(txPowerLevel.forms[0].op).toEqual('readproperty');
      expect(txPowerLevel.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(txPowerLevel.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    test('weight', () => {
      const weight = thing?.properties.weight;
      expect(weight).toBeDefined();
      expect(weight.type).toEqual('number');
      expect(weight.readOnly).toBeTruthy();
      expect(weight.writeOnly).toBeFalsy();
      expect(weight.observable).toBeFalsy();
      expect(weight.forms).toHaveLength(1);
      expect(weight.forms[0].op).toEqual('readproperty');
      expect(weight.forms[0]['sbo:methodName']).toEqual('sbo:read');
      expect(weight.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
  });
});
