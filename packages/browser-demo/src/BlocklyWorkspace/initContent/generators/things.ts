/**
 * @fileoverview Generating JavaScript for blocks in the things category.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';


JavaScript.forBlock['generic_thing'] = function (
  _block: Block
): [string, number] {
  return ['deadbeef', JavaScript.ORDER_NONE];
};
