import {createThing} from '@blast/node';
const IP = "127.0.0.1:3001"
const td = {
  '@context': [
    'https://www.w3.org/2019/wot/td/v1',
    'https://www.w3.org/2022/wot/td/v1.1',
  ],
  title: 'SimpleCounter',
  description: 'Thing Description af a Simple Counter.',
  securityDefinitions: {
    nosec_sc: {
      scheme: 'nosec',
    },
  },
  '@type': 'Thing',
  security: 'nosec_sc',

  properties: {
    stat: {
      type: 'string',
      observable: false,
      readOnly: false,
      writeOnly: false,
      description: 'The current value of the counter',

      forms: [
        {
          href: `https://${IP}/stat`,
          op: 'readproperty',
          'htv:methodName': 'GET',
        },
      ],
    },
  },
};

let thing = await createThing(td)
console.log(await (await thing.readProperty("stat")).value())
