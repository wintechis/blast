/**
 * @fileoverview Control flow blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import {addBlock} from './../blast_toolbox.js';
import Blockly from 'blockly';

// Remap blockly blocks to improve naming in xml.
Blockly.Blocks['repeat'] = Blockly.Blocks['controls_repeat_ext'];
Blockly.Blocks['for'] = Blockly.Blocks['controls_for'];
Blockly.Blocks['while_until'] = Blockly.Blocks['controls_whileUntil'];
Blockly.Blocks['break_continue'] = Blockly.Blocks['controls_flow_statements'];

// add changed names to Loops constant to ensure correct execution.
// Blockly.Constants.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.LOOP_TYPES.push(
//     'repeat',
//     'while_until',
//     'for',
// );
// This is blocked by google/blockly#5910 (fixed, included in the next quarterly release).

// Define inner block XML for the repeat block.
const REPEAT_XML = `
<block type="repeat">
  <value name="TIMES">
    <block type="math_number">
      <field name="NUM">10</field>
    </block>
  </value>
</block>`;

// Add repeat block to the block library.
addBlock('repeat', 'Control Flow', REPEAT_XML);

// Define inner block XML for the for block.
const FOR_XML = `
<block type="for">
  <value name="FROM">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
  </value>
  <value name="TO">
    <block type="math_number">
      <field name="NUM">5</field>
    </block>
  </value>
  <value name="BY">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>`;

// Add for block to the toolbox.
addBlock('for', 'Control Flow', FOR_XML);

Blockly.Blocks['conditional_statement'] = {
  /**
   * Block representing a conditional statement.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendValueInput('IF0')
        .appendField('%{BKY_CONTROLS_IF_MSG_IF}')
        .setCheck('Boolean');
    this.appendStatementInput('DO0')
        .appendField('%{BKY_CONTROLS_IF_MSG_THEN}');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl('%{BKY_CONTROLS_IF_HELPURL}');
    this.setColour(120);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif', 'controls_if_else']));
    this.setTooltip(function() {
      if (!this.elseifCount_ && !this.elseCount_) {
        return Blockly.Msg['CONTROLS_IF_TOOLTIP_1'];
      } else if (!this.elseifCount_ && this.elseCount_) {
        return Blockly.Msg['CONTROLS_IF_TOOLTIP_2'];
      } else if (this.elseifCount_ && !this.elseCount_) {
        return Blockly.Msg['CONTROLS_IF_TOOLTIP_3'];
      } else if (this.elseifCount_ && this.elseCount_) {
        return Blockly.Msg['CONTROLS_IF_TOOLTIP_4'];
      }
      return '';
    }.bind(this));
  },

  elseifCount_: 0,
  elseCount_: 0,

  /**
   * Don't automatically add STATEMENT_PREFIX and STATEMENT_SUFFIX to generated
   * code.  These will be handled manually in this block's generators.
   */
  suppressPrefixSuffix: true,

  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    const container = Blockly.utils.xml.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
    this.rebuildShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function(workspace) {
    const containerBlock = workspace.newBlock('controls_if_if');
    containerBlock.initSvg();
    let connection = containerBlock.nextConnection;
    for (let i = 1; i <= this.elseifCount_; i++) {
      const elseifBlock = workspace.newBlock('controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      const elseBlock = workspace.newBlock('controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function(containerBlock) {
    let clauseBlock = containerBlock.nextConnection.targetBlock();
    // Count number of inputs.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    const valueConnections = [null];
    const statementConnections = [null];
    let elseStatementConnection = null;
    while (clauseBlock && !clauseBlock.isInsertionMarker()) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case 'controls_if_else':
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw new TypeError('Unknown block type: ' + clauseBlock.type);
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Reconnect any child blocks.
    this.reconnectChildBlocks_(valueConnections, statementConnections,
        elseStatementConnection);
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function(containerBlock) {
    let clauseBlock = containerBlock.nextConnection.targetBlock();
    let i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          // eslint-disable-next-line no-case-declarations
          const inputIf = this.getInput('IF' + i);
          // eslint-disable-next-line no-case-declarations
          let inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw new TypeError('Unknown block type: ' + clauseBlock.type);
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Reconstructs the block with all child blocks attached.
   * @this {Blockly.Block}
   */
  rebuildShape_: function() {
    const valueConnections = [null];
    const statementConnections = [null];
    let elseStatementConnection = null;

    if (this.getInput('ELSE')) {
      elseStatementConnection = this.getInput('ELSE').connection.targetConnection;
    }
    let i = 1;
    while (this.getInput('IF' + i)) {
      const inputIf = this.getInput('IF' + i);
      const inputDo = this.getInput('DO' + i);
      valueConnections.push(inputIf.connection.targetConnection);
      statementConnections.push(inputDo.connection.targetConnection);
      i++;
    }
    this.updateShape_();
    this.reconnectChildBlocks_(valueConnections, statementConnections,
        elseStatementConnection);
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @this {Blockly.Block}
   * @private
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('ELSE')) {
      this.removeInput('ELSE');
    }
    let i = 1;
    while (this.getInput('IF' + i)) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
      i++;
    }
    // Rebuild block.
    for (i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSEIF']);
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg['CONTROLS_IF_MSG_THEN']);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg['CONTROLS_IF_MSG_ELSE']);
    }
  },
  /**
   * Reconnects child blocks.
   * @param {!Array.<?Blockly.RenderedConnection>} valueConnections List of
   * value connections for 'if' input.
   * @param {!Array.<?Blockly.RenderedConnection>} statementConnections List of
   * statement connections for 'do' input.
   * @param {?Blockly.RenderedConnection} elseStatementConnection Statement
   * connection for else input.
   * @this {Blockly.Block}
   */
  reconnectChildBlocks_: function(valueConnections, statementConnections,
      elseStatementConnection) {
    for (let i = 1; i <= this.elseifCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
  },
};

Blockly.Blocks['wait_seconds'] = {
  /**
     * Block for executing a sleep/timeout command.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendValueInput('SECONDS')
        .appendField('wait')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('seconds');
    this.setColour(120);
    this.setTooltip('Wait x seconds before executing the next block.');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl('');
  },
};

// Define inner block XML for the wait_seconds block
const WAIT_SECONDS_XML = `
<block type="wait_seconds">
  <value name="SECONDS">
    <block type="math_number">
      <field name="NUM">1</field>
    </block>
  </value>
</block>
`;

// Add the wait_seconds block to the toolbox
addBlock('wait_seconds', 'Control Flow', WAIT_SECONDS_XML);

// Mutator blocks.
Blockly.Blocks['controls_if_if'] = {
  /**
   * Block representing a the if statement in the controls_if mutator.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('%{BKY_CONTROLS_IF_IF_TITLE_IF}');
    this.setNextStatement(true, null);
    this.contextMenu = false;
    this.setColour(120);
    this.setTooltip('%{BKY_CONTROLS_IF_IF_TOOLTIP}');
  },
};

Blockly.Blocks['controls_if_elseif'] = {
  /**
   * Block representing a the else-if statement in the controls_if mutator.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('%{BKY_CONTROLS_IF_ELSEIF_TITLE_ELSEIF}');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.contextMenu = false;
    this.setColour(120);
    this.setTooltip('%{BKY_CONTROLS_IF_ELSEIF_TOOLTIP}');
  },
};

Blockly.Blocks['controls_if_else'] = {
  /**
   * Block representing a the else statement in the controls_if mutator.
   * @this {Blockly.Block}
   */
  init: function() {
    this.appendDummyInput()
        .appendField('%{BKY_CONTROLS_IF_ELSE_TITLE_ELSE}');
    this.setPreviousStatement(true, null);
    this.contextMenu = false;
    this.setColour(120);
    this.setTooltip('%{BKY_CONTROLS_IF_ELSE_TOOLTIP}');
  },
};
