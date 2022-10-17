import blast;

fc = blast.connect('00:11:22:33:44');

async function main() {
    var temp;
    while (true) {
	await temp = fc.readProperty('temperature');
	console.log('temperature is ', temp);
    }
}

main();
