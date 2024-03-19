import {createThing} from '@blast/node';
import {RuuviTag} from '@blast/tds';
import {existsSync, appendFileSync, writeFileSync} from 'fs';

// where is the error handler?
import {XiaomiFlowerCare} from '@blast/tds';

// assets
const rtmac = 'C43B4FC3FECA';
const rtthing = await createThing(RuuviTag, rtmac);
const fcmac = 'c47c8d6d362d';
const fcthing = await createThing(XiaomiFlowerCare, fcmac);

// handler for ruuvi tag GAP messages
const handler = async (d) => {
    let data = await d.value();

    let timestamp = new Date().toISOString();
    data.timestamp = timestamp;

    let json = JSON.stringify(data, null, '\t');

    console.log(`Got data from RuuviTag ${rtmac}:\n${json}`);

    // should be really a xsd:duration and the date should include the timezone (in ISO8601 format)
    let date = timestamp.substring(0, 10);

    let csv = `./ruuvi-${rtmac}-${date}.csv`;
    if (!existsSync(csv)) {
	let header = 'date';
	for (let key in data) {
	    header = header + ',' + key;
	}
	appendFileSync(csv, header + '\n');
    }

    let row = date;
    for (let key in data) {
	row = row + ',' + data[key];
    }

    appendFileSync(csv, row + '\n');

    // store current temperature and humidity to /tmp/ruuvi.txt
    let s = `${data['temp'].toFixed(1)}C ${data['humidity'].toFixed(0)}%`;
    writeFileSync('/tmp/ruuvi.txt', s);
};

// read flowercare
// async function read() {
//     // First enable readMode
//     //console.log('activating read mode...');
//     await fcthing.invokeAction('readMode', 'A01F');

//     // Read byte string
//     //console.log('reading measurements...');
//     const byteString = await fcthing.readProperty('valueString');

//     // Get result array
//     const measurementArray = await byteString.value();

//     let data = { 'temperature': measurementArray[0],
// 		 'brightness': measurementArray[1],
// 		 'moisture': measurementArray[2],
// 		 'conductivity': measurementArray[3]
// 	       };

//     let timestamp = new Date().toISOString();
//     data.timestamp = timestamp;

//     let json = JSON.stringify(data, null, '\t');
//     console.log(json);

//     // should be really a xsd:duration and the date should include the timezone (in ISO8601 format)
//     let date = timestamp.substring(0, 10);

//     let csv = `./flowercare-${fcmac}-${date}.csv`;
//     if (!existsSync(csv)) {
// 	let header = 'date';
// 	for (let key in data) {
// 	    header = header + ',' + key;
// 	}
// 	appendFileSync(csv, header + '\n');
//     }

//     let row = date;
//     for (let key in data) {
// 	row = row + ',' + data[key];
//     }

//     appendFileSync(csv, row + '\n');
// }

rtthing.subscribeEvent('UART data', handler);

// await read();
// await sleep(1000);
// await read();
// process.exit(0);
