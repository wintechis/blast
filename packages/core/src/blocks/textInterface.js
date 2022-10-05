/**
 * @fileoverview String blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {Blocks} = Blockly;

// Remap blockly block to improve naming in xml.
Blocks['string_showPrompt'] = Blocks['text_prompt_ext'];
