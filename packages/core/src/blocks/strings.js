/**
 * @fileoverview String blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks, Msg} = Blockly;

// Remap blockly blocks to improve naming in xml.
Blocks['string'] = Blocks['text'];
Blocks['string_multiline'] = Blocks['text_multiline'];
Blocks['string_join'] = Blocks['text_join'];
Blocks['string_length'] = Blocks['text_length'];
Blocks['string_isEmpty'] = Blocks['text_isEmpty'];
Blocks['string_indexOf'] = Blocks['text_indexOf'];
Blocks['string_charAt'] = Blocks['text_charAt'];
Blocks['string_getSubstring'] = Blocks['text_getSubstring'];
Blocks['string_changeCase'] = Blocks['text_changeCase'];
Blocks['string_trim'] = Blocks['text_trim'];
Blocks['string_count'] = Blocks['text_count'];
Blocks['string_replace'] = Blocks['text_replace'];
Blocks['string_reverse'] = Blocks['text_reverse'];
Blocks['string_showPrompt'] = Blocks['text_prompt_ext'];

// Overwrite Blockly text for the concatenate block
Msg['TEXT_JOIN_TITLE_CREATEWITH'] = 'concatenate text';
