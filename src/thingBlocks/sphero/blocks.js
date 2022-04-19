import {implementedThings} from '../../blast_things.js';
import {
  UUID_SPHERO_SERVICE,
  UUID_SPHERO_SERVICE_INITIALIZE,
  // eslint-disable-next-line node/no-missing-import
} from '../../things/SpheroMini.js';

// Add spheromini blocks to the list of implemented things.
implementedThings.push({
  id: 'spheroMini',
  name: 'SpheroMini',
  type: 'bluetooth',
  blocks: [
    {
      type: '',
      category: 'Actions',
    },
  ],
  infoUrl: 'https://github.com/wintechis/blast/wiki/SpheroMini',
  filters: [
    {
      services: [UUID_SPHERO_SERVICE],
    },
  ],
  optionalServices: [UUID_SPHERO_SERVICE_INITIALIZE],
});
