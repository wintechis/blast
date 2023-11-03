import {createThing, createThingWithHandlers} from '../packages/core/dist/blast.node.js';
import {BleRgbController} from '../packages/core/dist/blast.tds.js';

const mac = 'BE5860018744';

const hardWareInterface = await createThing(BleRgbController, mac);

const hexToRGBColors = function (hex) {
  // Check if color is prefiex with #
  if (hex[0] === '#') {
    hex = hex.substr(1);
  }
  // Check if color is shorthand
  if (hex.length === 3) {
    hex = hex.split('').map(function (hex) {
      return hex + hex;
    }).join('');
  }
  // Convert hex to RGB
  const red = parseInt(hex.substr(0, 2), 16);
  const green = parseInt(hex.substr(2, 2), 16);
  const blue = parseInt(hex.substr(4, 2), 16);

  return {R: red, G: green, B: blue};
};

const writeColourHandler = async function (interactionOutput) {
  // get the value of the interaction output
  const colour = await interactionOutput.value();
  // transform the colour to RGB
  const rgbColour = hexToRGBColors(colour);
  // write the colour to the hardware interface
  hardWareInterface.writeProperty('colour', rgbColour);
}

const addHandlers = function (thing) {
  thing.setPropertyWriteHandler('colour', writeColourHandler);
}

const intermediateTd = {
  "@context": [
    "https://www.w3.org/2022/wot/td/v1.1",
    {"@language": "en"}
  ],
  "@type": "",
  "title": "BLE RGB Controller intermediate",
  "base": "gatt://{{MacOrWebBluetoothId}}/",
  "description":
    "An intermediate TD for writing hex colors to a BLE RGB Controller.",
  "securityDefinitions": {
    "nosec_sc": {
      "scheme": "nosec"
    }
  },
  "security": ["nosec_sc"],
  "properties": {
    "colour": {
      "title": "colour",
      "description": "The colour of the LED light.",
      "type": "string",
      "writeOnly": true,
    }
  }
}

const intermediateThing = await createThingWithHandlers(intermediateTd, mac, addHandlers)

intermediateThing.writeProperty('colour', "#00FF00");
