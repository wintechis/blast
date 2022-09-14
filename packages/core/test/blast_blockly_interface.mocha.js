import {inject} from '../dist/blast_blockly_interface.js';
import {workspaceCommentOption} from '../dist/blast_blockly_interface.js';
import {ASTNode} from '../dist/blast_blockly_interface.js';
import {BlockSvg} from '../dist/blast_blockly_interface.js';
import {constants} from '../dist/blast_blockly_interface.js';
import {Events} from '../dist/blast_blockly_interface.js';
import {svgResize} from '../dist/blast_blockly_interface.js';
import {WorkspaceSvg} from '../dist/blast_blockly_interface.js';
import {Xml} from '../dist/blast_blockly_interface.js';
import {Blocks} from '../dist/blast_blockly_interface.js';
import {JavaScript} from '../dist/blast_blockly_interface.js';

import chai from 'chai';

const {expect} = chai;

suite('Blast Blockly interface', () => {
  test('Blockly is defined', () => {
    expect(inject).to.exist;
  });
  test('workspaceCommentOption is defined', () => {
    expect(workspaceCommentOption).to.exist;
  });
  test('ASTNode is defined', () => {
    expect(ASTNode).to.exist;
  });
  test('BlockSvg is defined', () => {
    expect(BlockSvg).to.exist;
  });
  test('constants is defined', () => {
    expect(constants).to.exist;
  });
  test('Events is defined', () => {
    expect(Events).to.exist;
  });
  test('svgResize is defined', () => {
    expect(svgResize).to.exist;
  });
  test('WorkspaceSvg is defined', () => {
    expect(WorkspaceSvg).to.exist;
  });
  test('Xml is defined', () => {
    expect(Xml).to.exist;
  });
  test('Blocks is defined', () => {
    expect(Blocks).to.exist;
  });
  test('JavaScript is defined', () => {
    expect(JavaScript).to.exist;
  });
});
