import {BleRgbControllerFactory} from '@blast/core';


/**
 * main
 */
async function main() {
    let color;

    const bleRgbThing = await new BleRgbControllerFactory.create('00:11:22:33:44');
    bleRgbThing.connect();

    // what happens if there is a disconnect in between?
    while (true) {
	  
	color = await bleRgbThing.readProperty('color');
	console.log('color is ', color);
    }
    bleRgbThing.disconnect();
}

main();
