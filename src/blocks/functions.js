/**
 * @fileoverview Function blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

goog.module('Blast.blocks.functions');

Blockly.Blocks['procedures_defeval'] = {
  /**
   * Block for defining a procedure with a return value.
   * @this {Blockly.Block}
   */
  init: function() {
    const initName = Blockly.Procedures.findLegalName('', this);
    const nameField = new Blockly.FieldTextInput(initName,
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg['PROCEDURES_DEFRETURN_TITLE'])
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.appendDummyInput()
        .appendField(new Blockly.FieldMultilineInput('return 2 + 2;'), 'STACK');
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    if ((this.workspace.options.comments ||
         (this.workspace.options.parentWorkspace &&
          this.workspace.options.parentWorkspace.options.comments)) &&
        Blockly.Msg['PROCEDURES_DEFRETURN_COMMENT']) {
      this.setCommentText(Blockly.Msg['PROCEDURES_DEFRETURN_COMMENT']);
    }
    this.setStyle('procedure_blocks');
    this.setTooltip(Blockly.Msg['PROCEDURES_DEFRETURN_TOOLTIP']);
    this.setHelpUrl(Blockly.Msg['PROCEDURES_DEFRETURN_HELPURL']);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.statementConnection_ = null;
  },
  updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
  mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
  /**
   * Parse XML to restore the argument inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function(xmlElement) {
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        const varName = childNode.getAttribute('name');
        const varId = childNode.getAttribute('varid') || childNode.getAttribute('varId');
        this.arguments_.push(varName);
        const variable = Blockly.Variables.getOrCreateVariablePackage(
            this.workspace, varId, varName, '');
        if (variable != null) {
          this.argumentVarModels_.push(variable);
        } else {
          console.log('Failed to create a variable with name ' + varName + ', ignoring.');
        }
      }
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this);
  },
  decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function(containerBlock) {
    // Parameter list.
    this.arguments_ = [];
    this.paramIds_ = [];
    this.argumentVarModels_ = [];
    let paramBlock = containerBlock.getInputTargetBlock('STACK');
    while (paramBlock && !paramBlock.isInsertionMarker()) {
      const varName = paramBlock.getFieldValue('NAME');
      this.arguments_.push(varName);
      const variable = this.workspace.getVariable(varName, '');
      this.argumentVarModels_.push(variable);

      this.paramIds_.push(paramBlock.id);
      paramBlock = paramBlock.nextConnection &&
            paramBlock.nextConnection.targetBlock();
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this);
  },
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES have a return value.
   * @this {Blockly.Block}
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, true];
  },
  getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
  getVarModels: Blockly.Blocks['procedures_defnoreturn'].getVarModels,
  renameVarById: Blockly.Blocks['procedures_defnoreturn'].renameVarById,
  updateVarName: Blockly.Blocks['procedures_defnoreturn'].updateVarName,
  displayRenamedVar_: Blockly.Blocks['procedures_defnoreturn'].displayRenamedVar_,
  customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
  callType_: 'procedures_callreturn',
};

Blockly.Blocks['procedures_calleval'] = {
  /**
     * Block for calling a procedure with a return value.
     * @this {Blockly.Block}
     */
  init: function() {
    this.appendDummyInput('TOPROW')
        .appendField('', 'NAME');
    this.setOutput(true);
    this.setStyle('procedure_blocks');
    // Tooltip is set in domToMutation.
    this.setHelpUrl(Blockly.Msg['PROCEDURES_CALLRETURN_HELPURL']);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousEnabledState_ = true;
  },
  
  getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
  renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
  setProcedureParameters_:
        Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters_,
  updateShape_: Blockly.Blocks['procedures_callnoreturn'].updateShape_,
  mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
  getVars: Blockly.Blocks['procedures_callnoreturn'].getVars,
  getVarModels: Blockly.Blocks['procedures_callnoreturn'].getVarModels,
  onchange: Blockly.Blocks['procedures_callnoreturn'].onchange,
  customContextMenu:
        Blockly.Blocks['procedures_callnoreturn'].customContextMenu,
  defType_: 'procedures_defeval',
};

// Override some of Blockly Procedures functions to include procedures_defeval block.

/**
 * Find all user-created procedure definitions in a workspace.
 * @param {!Blockly.Workspace} root Root workspace.
 * @return {!Array<!Array<!Array<!Array>>>} Triple of arrays, the
 *     first contains procedures without return variables, the second with
 *    return variables, and the third with eval procedures.
 *     Each procedure is defined by a three-element list of name, parameter
 *     list, and return value boolean.
 */
Blockly.Procedures.allProcedures = function(root) {
  const proceduresNoReturn = root.getBlocksByType('procedures_defnoreturn', false)
      .map(function(block) {
        return /** @type {!Blockly.Procedures.ProcedureBlock} */ (block).getProcedureDef();
      });
  const proceduresReturn = root.getBlocksByType('procedures_defreturn', false).map(function(block) {
    return /** @type {!Blockly.Procedures.ProcedureBlock} */ (block).getProcedureDef();
  });

  // Add procedures eval blocks to proceduresRetun Array
  const proceduresEval = root.getBlocksByType('procedures_defeval', false).map(function(block) {
    return /** @type {!Blockly.Procedures.ProcedureBlock} */ (block).getProcedureDef();
  });

  proceduresNoReturn.sort(Blockly.Procedures.procTupleComparator_);
  proceduresReturn.sort(Blockly.Procedures.procTupleComparator_);
  proceduresEval.sort(Blockly.Procedures.procTupleComparator_);
  return [proceduresNoReturn, proceduresReturn, proceduresEval];
};

/**
 * Construct the blocks required by the flyout for the procedure category.
 * @param {!Blockly.Workspace} workspace The workspace containing procedures.
 * @return {!Array<!Element>} Array of XML block elements.
 */
Blockly.Procedures.flyoutCategory = function(workspace) {
  const xmlList = [];
  if (Blockly.Blocks['procedures_defnoreturn']) {
    // <block type="procedures_defnoreturn" gap="16">
    //     <field name="NAME">do something</field>
    // </block>
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_defnoreturn');
    block.setAttribute('gap', 16);
    const nameField = Blockly.utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(Blockly.utils.xml.createTextNode(
        Blockly.Msg['PROCEDURES_DEFNORETURN_PROCEDURE']));
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (Blockly.Blocks['procedures_defreturn']) {
    // <block type="procedures_defreturn" gap="16">
    //     <field name="NAME">do something</field>
    // </block>
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_defreturn');
    block.setAttribute('gap', 16);
    const nameField = Blockly.utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(Blockly.utils.xml.createTextNode(
        Blockly.Msg['PROCEDURES_DEFRETURN_PROCEDURE']));
    block.appendChild(nameField);
    xmlList.push(block);
  }
  if (Blockly.Blocks['procedures_ifreturn']) {
    // <block type="procedures_ifreturn" gap="16"></block>
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_ifreturn');
    block.setAttribute('gap', 16);
    xmlList.push(block);
  }
  // Add procedures_defeval block to flyout
  if (Blockly.Blocks['procedures_defeval']) {
    // <block type="procedures_defeval" gap="16"></block>
    const block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'procedures_defeval');
    block.setAttribute('gap', 16);
    const nameField = Blockly.utils.xml.createElement('field');
    nameField.setAttribute('name', 'NAME');
    nameField.appendChild(Blockly.utils.xml.createTextNode(
        Blockly.Msg['PROCEDURES_DEFRETURN_PROCEDURE']));
    block.appendChild(nameField);
    xmlList.push(block);
  }

  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute('gap', 24);
  }
  
  /**
   * Creates a function block for each procedure in procedureList.
   * @param {string[]} procedureList Array containing procedures.
   * @param {string} templateName Name of block template.
   */
  function populateProcedures(procedureList, templateName) {
    for (const proc of procedureList) {
      const name = proc[0];
      const args = proc[1];
      // <block type="procedures_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x"></arg>
      //   </mutation>
      // </block>
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', templateName);
      block.setAttribute('gap', 16);
      const mutation = Blockly.utils.xml.createElement('mutation');
      mutation.setAttribute('name', name);
      block.appendChild(mutation);
      for (const a of args) {
        const arg = Blockly.utils.xml.createElement('arg');
        arg.setAttribute('name', a);
        mutation.appendChild(arg);
      }
      xmlList.push(block);
    }
  }
  
  const triple = Blockly.Procedures.allProcedures(workspace);
  populateProcedures(triple[0], 'procedures_callnoreturn');
  populateProcedures(triple[1], 'procedures_callreturn');
  populateProcedures(triple[2], 'procedures_calleval');
  return xmlList;
};

/**
 * Find the definition block for the named procedure.
 * @param {string} name Name of procedure.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {?Blockly.Block} The procedure definition block, or null not found.
 */
Blockly.Procedures.getDefinition = function(name, workspace) {
  // Do not assume procedure is a top block. Some languages allow nested
  // procedures. Also do not assume it is one of the built-in blocks. Only
  // rely on getProcedureDef.
  const blocks = workspace.getAllBlocks(false);
  for (const block of blocks) {
    if (block.getProcedureDef) {
      const procedureBlock = /** @type {!Blockly.Procedures.ProcedureBlock} */ (block);
      const tuple = procedureBlock.getProcedureDef();
      if (tuple && Blockly.Names.equals(tuple[0], name)) {
        return block;  // Can't use procedureBlock var due to type check.
      }
    }
  }
  return null;
};

Blockly.Blocks['procedures_ifreturn'].FUNCTION_TYPES.push('procedures_defeval');
