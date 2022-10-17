from blast import driver.xiaomiflowercare;

fc = driver.xiaomiflowercare.createThing('00:11:22:33:44');

/**
 * main
 */
async function main() {
    var temp;

    fc.connect();

    // what happens if there is a disconnect in between?
    while (true) {
	await temp = fc.readProperty('temperature');
	console.log('temperature is ', temp);
    }

    fc.disconnect();
}

main();
