/**
 * @fileoverview Blocks handling resources for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {Blocks} from 'blockly';

Blocks['uri_from_string'] = {
  /**
   * Block parsing an URI from a string.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('URI')
      .setCheck('String')
      .appendField('URI from string');
    this.setOutput(true, 'URI');
    this.setColour(60);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


