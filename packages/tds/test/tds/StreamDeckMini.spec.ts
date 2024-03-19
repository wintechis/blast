// eslint-disable-next-line node/no-unpublished-import
import {describe, expect, test} from '@jest/globals';
import * as td from '../../src/td/StreamDeckMini.json';
import {parseTD, Thing} from '@node-wot/td-tools';

describe('StreamDeckMini Thing Description', () => {
  let thing: undefined | Thing;
  test('parsing', () => {
    thing = parseTD(JSON.stringify(td));
    expect(thing).toBeDefined();
  });

  describe('properties', () => {
    test('brightness', () => {
      const brightness = thing?.properties?.brightness;
      expect(brightness).toBeDefined();
      expect(brightness.type).toEqual('integer');
      expect(brightness.minimum).toEqual(0);
      expect(brightness.maximum).toEqual(100);
      expect(brightness.observable).toBeFalsy();
      expect(brightness.readOnly).toBeFalsy();
      expect(brightness.writeOnly).toBeTruthy();
      expect(brightness.forms).toHaveLength(1);
      expect(brightness.forms[0].op).toEqual('writeproperty');
      expect(brightness.forms[0].contentType).toEqual(
        'application/octet-stream'
      );
    });
  });
  describe('events', () => {
    test('inputreport', () => {
      const inputreport = thing?.events.inputreport;
      expect(inputreport).toBeDefined();
      expect(inputreport.data.type).toEqual('array');
      expect(inputreport.data['bdo:pattern']).toEqual(
        '{reportid}{button1}{button2}{button3}{button4}{button5}{button6}'
      );
      expect(inputreport.data['bdo:variables']).toBeDefined();
      expect(inputreport.data['bdo:variables'].reportid.type).toEqual(
        'integer'
      );
      expect(
        inputreport.data['bdo:variables'].reportid['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].reportid.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].reportid.maximum).toEqual(255);
      expect(inputreport.data['bdo:variables'].button1.type).toEqual('integer');
      expect(
        inputreport.data['bdo:variables'].button1['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].button1.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].button1.maximum).toEqual(1);
      expect(inputreport.data['bdo:variables'].button2.type).toEqual('integer');
      expect(
        inputreport.data['bdo:variables'].button2['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].button2.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].button2.maximum).toEqual(1);
      expect(inputreport.data['bdo:variables'].button3.type).toEqual('integer');
      expect(
        inputreport.data['bdo:variables'].button3['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].button3.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].button3.maximum).toEqual(1);
      expect(inputreport.data['bdo:variables'].button4.type).toEqual('integer');
      expect(
        inputreport.data['bdo:variables'].button4['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].button4.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].button4.maximum).toEqual(1);
      expect(inputreport.data['bdo:variables'].button5.type).toEqual('integer');
      expect(
        inputreport.data['bdo:variables'].button5['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].button5.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].button5.maximum).toEqual(1);
      expect(inputreport.data['bdo:variables'].button6.type).toEqual('integer');
      expect(
        inputreport.data['bdo:variables'].button6['bdo:bytelength']
      ).toEqual(1);
      expect(inputreport.data['bdo:variables'].button6.minimum).toEqual(0);
      expect(inputreport.data['bdo:variables'].button6.maximum).toEqual(1);
      expect(inputreport.forms).toHaveLength(1);
      expect(inputreport.forms[0].contentType).toEqual(
        'application/x.binary-data-stream'
      );
    });
    describe('actions', () => {
      test('sendReport', () => {
        const sendReport = thing?.actions.sendReport;
        expect(sendReport).toBeDefined();
        expect(sendReport.input).toBeDefined();
        expect(sendReport.input.type).toEqual('string');
        expect(sendReport.input.format).toEqual('hex');
        expect(sendReport.forms).toHaveLength(1);
        expect(sendReport.forms[0].contentType).toEqual(
          'application/x.binary-data-stream'
        );
      });
    });
  });
});
