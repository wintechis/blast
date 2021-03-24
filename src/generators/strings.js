/**
 * @fileoverview Generating JavaScript for strings blocks.
 * @author derwehr@gmail.com (Thomas Wehr)
 */

'use strict';

// Remap blockly blocks to improve naming in xml.
Blockly.JavaScript['string'] = Blockly.JavaScript['text'];
Blockly.JavaScript['string_join'] = Blockly.JavaScript['text_join'];
Blockly.JavaScript['string_length'] = Blockly.JavaScript['text_length'];
Blockly.JavaScript['string_indexOf'] = Blockly.JavaScript['text_indexOf'];
Blockly.JavaScript['string_charAt'] = Blockly.JavaScript['text_charAt'];
Blockly.JavaScript['string_getSubstring'] =
  Blockly.JavaScript['text_getSubstring'];
Blockly.JavaScript['string_changeCase'] = Blockly.JavaScript['text_changeCase'];
Blockly.JavaScript['string_replace'] = Blockly.JavaScript['text_replace'];
