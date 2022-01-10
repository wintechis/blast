/**
 * @fileoverview Event blocks for Blast.
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

Blockly.Blocks['state_definition'] = {
  /**
     * Block for defining a state.
     * @this {Blockly.Block}
     */
  init: function() {
    const initName = Blast.States.findLegalName('', this);
    const nameField = new Blockly.FieldTextInput(initName, Blast.States.rename);
    nameField.setSpellcheck(false);
    this.appendValueInput('state_condition')
        .setCheck('Boolean')
        .appendField('define state')
        .appendField(nameField, 'NAME')
        .appendField('condition');
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  /**
     * Return the name and condition of this state.
     * @return {!Array} Tuple containing two elements:
     *    - the name of the defined state,
     *    - this state's conditions.
     * @this {Blockly.Block}
     */
  getStateDef: function() {
    const conditions = this.getFieldValue('state_condition');
    return [this.getFieldValue('NAME'), conditions];
  },
  /**
     * Return this state's conditions.
     * @return {string} state conditions.
     * @this {Blockly.Block}
     */
  getConditions: function() {
    return this.getFieldValue('state_condition');
  },
};
  
Blockly.Blocks['event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('when blast')
        .appendField(
            new Blockly.FieldDropdown([
              ['enters', 'ENTERS'],
              ['exits', 'EXITS'],
            ]),
            'entersExits',
        )
        .appendField('state')
        .appendField(new Blockly.FieldLabelSerializable(''), 'NAME');
    this.appendStatementInput('statements').setCheck(null);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  /**
     * Returns the state name of this event.
     * @return {string} State name.
     * @this {Blockly.Block}
     */
  getStateName: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
     * Notification that a state is renaming.
     * If the name matches this block's state, rename it.
     * @param {string} oldName Previous name of state.
     * @param {string} newName Renamed state.
     * @this {Blockly.Block}
     */
  renameState: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getStateName())) {
      this.setFieldValue(newName, 'NAME');
    }
  },
  /**
     * Create XML to represent the (non-editable) name.
     * @return {!Element} XML storage element.
     * @this {Blockly.Block}
     */
  mutationToDom: function() {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('name', this.getStateName());
    return container;
  },
  /**
     * Parse XML to restore the (non-editable) name.
     * @param {!Element} xmlElement XML storage element.
     * @this {Blockly.Block}
     */
  domToMutation: function(xmlElement) {
    const name = xmlElement.getAttribute('name');
    this.renameState(this.getStateName(), name);
  },
  /**
     * Event blocks cannot exist without the corresponding state definition.
     * Enforce this link whenever a Blockly event is fired.
     * @param {!Blockly.Events.Abstract} event Change event.
     * @this {Blockly.Block}
     */
  onchange: function(event) {
    if (!this.workspace || this.workspace.isFlyout) {
      // Block is deleted or is in a flyout.
      return;
    }
    if (!event.recordUndo) {
      // Events not generated by user. Skip handling.
      return;
    }
    if (
      event.type == Blockly.Events.BLOCK_CREATE &&
        event.ids.indexOf(this.id) != -1
    ) {
      // Look for the case where an event was created (usually through
      // paste) and there is no matching state.  In this case, create
      // an empty state definition block with the correct name.
      const name = this.getStateName();
      let def = Blast.States.getDefinition(name, this.workspace);
      if (def && def.type != this.defType_) {
        // The signatures don't match.
        def = null;
      }
      if (!def) {
        Blockly.Events.setGroup(event.group);
        /**
           * Create matching definition block.
           * <xml xmlns="https://developers.google.com/blockly/xml">
           *   <block type="state_definition" x="10" y="20">
           *     <field name="NAME">test</field>
           *   </block>
           * </xml>
           */
        const xml = Blockly.utils.xml.createElement('xml');
        const block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', this.defType_);
        const xy = this.getRelativeToSurfaceXY();
        const x = xy.x + Blockly.SNAP_RADIUS * (this.RTL ? -1 : 1);
        const y = xy.y + Blockly.SNAP_RADIUS * 2;
        block.setAttribute('x', x);
        block.setAttribute('y', y);
        const mutation = this.mutationToDom();
        block.appendChild(mutation);
        const field = Blockly.utils.xml.createElement('field');
        field.setAttribute('name', 'NAME');
        let stateName = this.getStateName();
        if (!stateName) {
          // Rename if name is empty string.
          stateName = Blast.States.findLegalName('', this);
          this.renameState('', stateName);
        }
        field.appendChild(Blockly.utils.xml.createTextNode(stateName));
        block.appendChild(field);
        xml.appendChild(block);
        Blockly.Xml.domToWorkspace(xml, this.workspace);
        Blockly.Events.setGroup(false);
      }
    } else if (event.type == Blockly.Events.BLOCK_DELETE) {
      // Look for the case where a state definition has been deleted,
      // leaving this block (an event block) orphaned. In this case, delete
      // the orphan.
      const name = this.getStateName();
      const def = Blast.States.getDefinition(name, this.workspace);
      if (!def) {
        Blockly.Events.setGroup(event.group);
        this.dispose(true);
        Blockly.Events.setGroup(false);
      }
    } else if (
      event.type == Blockly.Events.CHANGE &&
        event.element == 'disabled'
    ) {
      const name = this.getStateName();
      const def = Blast.States.getDefinition(name, this.workspace);
      if (def && def.id == event.blockId) {
        // in most cases the old group should be ''
        const oldGroup = Blockly.Events.getGroup();
        if (oldGroup) {
          // This should only be possible programmatically and may indicate a
          // problem with event grouping. If you see this message please
          // investigate. If the use ends up being valid we may need to reorder
          // events in the undo stack.
          console.log(
              'Saw an existing group while responding to a definition change',
          );
        }
        Blockly.Events.setGroup(event.group);
        if (event.newValue) {
          this.previousEnabledState_ = this.isEnabled();
          this.setEnabled(false);
        } else {
          this.setEnabled(this.previousEnabledState_);
        }
        Blockly.Events.setGroup(oldGroup);
      }
    }
  },
  onDispose: function(event) {
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      if (event.type === Blockly.Events.BLOCK_DELETE && event.ids.indexOf(this.id) !== -1) {
        // Block is being deleted
        Blast.States.removeEventCode(this.event.blockId);
      }
    }
  },
  defType_: 'state_definition',
};

Blockly.Blocks['event_every_minutes'] = {
  /**
   * Block for every x minutes event.
   * @this Blockly.Block
   */
  init: function() {
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField('every');
    this.appendDummyInput('units')
        .appendField(
            new Blockly.FieldDropdown([
              ['seconds', 'seconds'],
              ['minutes', 'minutes'],
              ['hours', 'hours'],
            ]), 'units');
    this.appendStatementInput('statements')
        .appendField('do');
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: async function() {
    Blast.Interpreter.eventInWorkspace.push(this.id);
    // remove event if block is deleted
    Blast.Interpreter.getWorkspace().addChangeListener((event) => this.onDispose(event));
  },
  onchange: function() {
    if (!this.isInFlyout && !this.requested && this.rendered) {
      // Block is newly created
      this.addEvent();
    }
  },
  onDispose: function(event) {
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      if (event.type === Blockly.Events.BLOCK_DELETE && event.ids.indexOf(this.id) !== -1) {
        // Block is being deleted
        this.removeFromEvents();
      }
    }
  },
  /**
     * Remove this block's id from the events array.
     */
  removeFromEvents: function() {
    // remove this block from the events array.
    const index = Blast.Interpreter.eventInWorkspace.indexOf(this.id);
    if (index !== -1) {
      Blast.Interpreter.eventInWorkspace.splice(index, 1);
    }
  },
};
