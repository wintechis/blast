/**
 * Exports some of the Blockly core functions and constants.
 * TODO find a better way to use blockly in the other packages
 */
import Blockly from 'blockly';

// used in web/index.js
export const {alert, inject} = Blockly;
export const {workspaceCommentOption} = Blockly.ContextMenu;
// used in web/web.js
export const {
  ASTNode,
  BlockSvg,
  constants,
  Events,
  svgResize,
  WorkspaceSvg,
  Xml,
} = Blockly;
// used in web/blocks.js
export const {Blocks} = Blockly;
// used in web/generators.js
export const {JavaScript} = Blockly;
