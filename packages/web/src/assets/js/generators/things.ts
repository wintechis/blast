/**
 * @fileoverview Generating JavaScript for blocks in the things category.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

// eslint-disable-next-line no-unused-vars
JavaScript.forBlock['generic_thing'] = function (
  block: Block
): [string, number] {
  return ['deadbeef', JavaScript.ORDER_NONE];
};
