/**
 * @fileoverview Generating JavaScript for blocks in the things category.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {JavaScript} = Blockly;

// eslint-disable-next-line no-unused-vars
JavaScript['generic_thing'] = function (block) {
  return ['deadbeef', JavaScript.ORDER_NONE];
};
