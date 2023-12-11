import {createThing} from '../packages/core/dist/blast.node.cjs';
import {XiaomiFlowerCare} from '../packages/core/dist/blast.tds.cjs';

const mac = 'C47C8D6D36BB';

const thing = await createThing(XiaomiFlowerCare, mac);

// First enable readMode
console.log('activating read mode...');
await thing.invokeAction('readMode', 'A01F');

// Read byte string
console.log('reading measurements...');
const byteString = await thing.readProperty('valueString');

// Get result Array
const measurmentArray = await byteString.value();

// Print result and unit from TD
console.log('Temperature:', measurmentArray[0], XiaomiFlowerCare.properties.valueString['bdo:variables'].temp.unit);
console.log('Brightness:', measurmentArray[1], XiaomiFlowerCare.properties.valueString['bdo:variables'].brightness.unit);
console.log('Moisture:', measurmentArray[2], XiaomiFlowerCare.properties.valueString['bdo:variables'].moisture.unit);
console.log('Conductivity:', measurmentArray[3], XiaomiFlowerCare.properties.valueString['bdo:variables'].conduct.unit);
