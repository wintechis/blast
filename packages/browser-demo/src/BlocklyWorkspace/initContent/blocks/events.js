/**
 * @fileoverview Event blocks for Blast.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import Blockly from 'blockly';
const {
  Blocks,
  Events,
  FieldDropdown,
  FieldLabelSerializable,
  FieldTextInput,
  Names,
  SNAP_RADIUS,
  utils,
  Xml,
} = Blockly;
import {findLegalName, getDefinition, rename} from '../../states.js';
import {eventsInWorkspace} from '../../interpreter.ts';

Blocks['state_definition'] = {
  /**
   * Block for defining a state.
   * @this {Blockly.Block}
   */
  init: function () {
    const initName = findLegalName('', this);
    const nameField = new FieldTextInput(initName, rename);
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
  getStateDef: function () {
    const conditions = this.getFieldValue('state_condition');
    return [this.getFieldValue('NAME'), conditions];
  },
  /**
   * Return this state's conditions.
   * @return {string} state conditions.
   * @this {Blockly.Block}
   */
  getConditions: function () {
    return this.getFieldValue('state_condition');
  },
};

Blocks['event'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('when blast')
      .appendField(
        new FieldDropdown([
          ['enters', 'ENTERS'],
          ['exits', 'EXITS'],
        ]),
        'entersExits'
      )
      .appendField('state')
      .appendField(new FieldLabelSerializable(''), 'NAME');
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
  getStateName: function () {
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
  renameState: function (oldName, newName) {
    if (Names.equals(oldName, this.getStateName())) {
      this.setFieldValue(newName, 'NAME');
    }
  },
  /**
   * Create XML to represent the (non-editable) name.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    const container = utils.xml.createElement('mutation');
    container.setAttribute('name', this.getStateName());
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    const name = xmlElement.getAttribute('name');
    this.renameState(this.getStateName(), name);
  },
  /**
   * Event blocks cannot exist without the corresponding state definition.
   * Enforce this link whenever a Blockly event is fired.
   * @param {!Events.Abstract} event Change event.
   * @this {Blockly.Block}
   */
  onchange: function (event) {
    if (!this.workspace || this.workspace.isFlyout) {
      // Block is deleted or is in a flyout.
      return;
    }
    if (!event.recordUndo) {
      // Events not generated by user. Skip handling.
      return;
    }
    if (
      event.type === Events.BLOCK_CREATE &&
      event.ids.indexOf(this.id) !== -1
    ) {
      this.addEvent();
      // Look for the case where an event was created (usually through
      // paste) and there is no matching state.  In this case, create
      // an empty state definition block with the correct name.
      const name = this.getStateName();
      let def = getDefinition(name, this.workspace);
      if (def && def.type !== this.defType_) {
        // The signatures don't match.
        def = null;
      }
      if (!def) {
        Events.setGroup(event.group);
        /**
         * Create matching definition block.
         * <xml xmlns="https://developers.google.com/blockly/xml">
         *   <block type="state_definition" x="10" y="20">
         *     <field name="NAME">test</field>
         *   </block>
         * </xml>
         */
        const xml = utils.xml.createElement('xml');
        const block = utils.xml.createElement('block');
        block.setAttribute('type', this.defType_);
        const xy = this.getRelativeToSurfaceXY();
        const x = xy.x + SNAP_RADIUS * (this.RTL ? -1 : 1);
        const y = xy.y + SNAP_RADIUS * 2;
        block.setAttribute('x', x);
        block.setAttribute('y', y);
        const mutation = this.mutationToDom();
        block.appendChild(mutation);
        const field = utils.xml.createElement('field');
        field.setAttribute('name', 'NAME');
        let stateName = this.getStateName();
        if (!stateName) {
          // Rename if name is empty string.
          stateName = findLegalName('', this);
          this.renameState('', stateName);
        }
        field.appendChild(utils.xml.createTextNode(stateName));
        block.appendChild(field);
        xml.appendChild(block);
        Xml.domToWorkspace(xml, this.workspace);
        Events.setGroup(false);
      }
    } else if (event.type === Events.BLOCK_DELETE) {
      // Remove this blocks eventListeners.
      this.removeFromEvents();

      const name = this.getStateName();
      // Look for the case where a state definition has been deleted,
      // leaving this block (an event block) orphaned. In this case, delete
      // the orphan.
      const def = getDefinition(name, this.workspace);
      if (!def) {
        Events.setGroup(event.group);
        this.dispose(true);
        Events.setGroup(false);
      }
    } else if (event.type === Events.CHANGE && event.element === 'disabled') {
      const name = this.getStateName();
      const def = getDefinition(name, this.workspace);
      if (def && def.id === event.blockId) {
        // in most cases the old group should be ''
        const oldGroup = Events.getGroup();
        if (oldGroup) {
          // This should only be possible programmatically and may indicate a
          // problem with event grouping. If you see this message please
          // investigate. If the use ends up being valid we may need to reorder
          // events in the undo stack.
          console.log(
            'Saw an existing group while responding to a definition change'
          );
        }
        Events.setGroup(event.group);
        if (event.newValue) {
          this.previousEnabledState_ = this.isEnabled();
          this.setEnabled(false);
        } else {
          this.setEnabled(this.previousEnabledState_);
        }
        Events.setGroup(oldGroup);
      }
    }
  },
  /**
   * Add this block's id to the events array.
   */
  addEvent: function () {
    eventsInWorkspace.push(this.id);
  },
  /**
   * Remove this block's id from the events array.
   */
  removeFromEvents: function () {
    // remove this block from the events array.
    const index = eventsInWorkspace.indexOf(this.id);
    if (index !== -1) {
      eventsInWorkspace.splice(index, 1);
    }
  },
  defType_: 'state_definition',
};
