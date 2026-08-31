import {createThing} from '@blast/node';

const td = await (await fetch('http://localhost:3001/things/editor-thing')).json();
console.log(td);
