/**
 * @fileoverview String blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

// Remap blockly blocks to improve naming in xml.
Blockly.Blocks['string'] = Blockly.Blocks['text'];
Blockly.Blocks['string_join'] = Blockly.Blocks['text_join'];
Blockly.Blocks['string_length'] = Blockly.Blocks['text_length'];
Blockly.Blocks['string_indexOf'] = Blockly.Blocks['text_indexOf'];
Blockly.Blocks['string_charAt'] = Blockly.Blocks['text_charAt'];
Blockly.Blocks['string_getSubstring'] = Blockly.Blocks['text_getSubstring'];
Blockly.Blocks['string_changeCase'] = Blockly.Blocks['text_changeCase'];
Blockly.Blocks['string_replace'] = Blockly.Blocks['text_replace'];

// Overwrite Blockly text for the concatenate block
Blockly.Msg['TEXT_JOIN_TITLE_CREATEWITH'] = 'concatenate text';
