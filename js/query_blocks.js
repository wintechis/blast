Blockly.defineBlocksWithJsonArray([
  {
    type: 'display_text',
    message0: 'display text: %1',
    args0: [
      {
        type: 'input_value',
        name: 'text',
        check: ['String', 'Number', 'Boolean', 'URI'],
      },
    ],
    previousStatement: ['state', 'config', 'action'],
    nextStatement: ['state', 'config', 'action'],
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'ibeacon_data',
    message0: 'get %3 of MAC %1 at URI %2',
    args0: [
      {
        type: 'input_value',
        name: 'MAC',
        check: 'mac',
      },
      {
        type: 'input_value',
        name: 'URI',
        check: 'URI',
      },
      {
        type: 'field_dropdown',
        name: 'value',
        options: [
          // ['mac address', 'mac'],
          ['rssi', 'rssi'],
          ['resultTime', 'resultTime'],
        ],
      },
    ],
    output: ['String', 'Number'],
    colour: 330,
    inputsInline: true,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'display_table',
    message0: 'display table %1',
    args0: [
      {
        type: 'input_value',
        name: 'table',
        check: 'table',
      },
    ],
    previousStatement: 'action',
    nextStatement: 'action',
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'number_infinity',
    message0: 'infinity',
    output: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'switch_lights',
    message0: 'switch lights with mac: %1 %2 red %3 yellow %4 green %5',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'mac',
        check: 'mac',
      },
      {
        type: 'field_checkbox',
        name: 'cb_red',
        checked: true,
      },
      {
        type: 'field_checkbox',
        name: 'cb_yellow',
        checked: true,
      },
      {
        type: 'field_checkbox',
        name: 'cb_green',
        checked: true,
      },
    ],
    previousStatement: 'action',
    nextStatement: 'action',
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'play_audio',
    message0: 'play audio from URI %1',
    args0: [
      {
        type: 'input_value',
        name: 'URI',
        check: 'URI',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'uri',
    message0: 'URI %1',
    args0: [
      {
        type: 'field_input',
        name: 'URI',
        text: 'http://192.168.178.22/ble/current',
      },
    ],
    output: 'URI',
    colour: 60,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'mac',
    message0: 'mac %1',
    args0: [
      {
        type: 'field_input',
        name: 'MAC',
        text: 'deadbeef',
      },
    ],
    output: 'mac',
    colour: 60,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'wait_seconds',
    message0: ' wait %1 seconds',
    args0: [
      {
        type: 'field_number',
        name: 'SECONDS',
        min: 0,
        max: 600,
        value: 1,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 0,
  },
  // Temporary dw blocks for demonstration on 22.1.2021
  {
    type: 'readdw',
    message0: 'Read DW Values from MAC %1',
    args0: [
      {
        type: 'input_value',
        name: 'MAC',
        check: 'mac',
      },
    ],
    output: 'String',
    colour: 45,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'writedw',
    message0: 'Write value %1 to mac %2',
    args0: [
      {
        type: 'input_value',
        name: 'value',
        check: 'String',
      },
      {
        type: 'input_value',
        name: 'MAC',
        check: 'mac',
      },
    ],
    output: 'String',
    colour: 45,
    tooltip: '',
    helpUrl: '',
  },
]);

// renaming blockly blocks for consistency withing blast
Blockly.Blocks['repeat'] = Blockly.Blocks['controls_repeat_ext'];
Blockly.Blocks['while_until'] = Blockly.Blocks['controls_whileUntil'];
Blockly.Blocks['for'] = Blockly.Blocks['controls_for'];
Blockly.Blocks['break_continue'] = Blockly.Blocks['controls_flow_statements'];
Blockly.Blocks['conditional_statement'] = Blockly.Blocks['controls_if'];
Blockly.Blocks['number_value'] = Blockly.Blocks['math_number'];
Blockly.Blocks['number_arithmetic'] = Blockly.Blocks['math_arithmetic'];
Blockly.Blocks['number_random'] = Blockly.Blocks['math_random_int'];
Blockly.Blocks['string'] = Blockly.Blocks['text'];
Blockly.Blocks['string_join'] = Blockly.Blocks['text_join'];
Blockly.Blocks['string_length'] = Blockly.Blocks['text_length'];
Blockly.Blocks['string_indexOf'] = Blockly.Blocks['text_indexOf'];
Blockly.Blocks['string_charAt'] = Blockly.Blocks['text_charAt'];
Blockly.Blocks['string_getSubstring'] = Blockly.Blocks['text_getSubstring'];
Blockly.Blocks['string_changeCase'] = Blockly.Blocks['text_changeCase'];
Blockly.Blocks['string_replace'] = Blockly.Blocks['text_replace'];

// setting math_change to null to omi it's creation in variable category
Blockly.Blocks['math_change'] = null;

Blockly.Constants.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.LOOP_TYPES.push(
    'repeat',
    'while_until',
    'for',
);

Blockly.Blocks['sparql_query'] = {
  init: function() {
    this.appendValueInput('uri')
        .appendField('run SPARQL Query from URI')
        .setCheck('URI');
    this.appendDummyInput().appendField(
        new Blockly.FieldMultilineInput(`SELECT *
WHERE { 
  ?s ?p ?o
}`),
        'query',
    );
    this.setInputsInline(false);
    this.setColour(0);
    this.setOutput(true, 'table');
  },
};

Blockly.Blocks['sparql_ask'] = {
  init: function() {
    this.appendValueInput('uri')
        .appendField('run SPARQL ASK Query from URI')
        .setCheck('URI');
    this.appendDummyInput().appendField(
        new Blockly.FieldMultilineInput(`PREFIX sosa: <http://www.w3.org/ns/sosa/>
ASK 
WHERE {
  ?node sosa:hasSimpleResult ?rssiValue 
  FILTER (?rssiValue > -40)
}`),
        'query',
    );
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(0);
  },
};

Blockly.Blocks['http_request'] = {
  httpRequestValidator: function(newValue) {
    this.getSourceBlock().updateInputs(newValue);
    return newValue;
  },

  httpRequestOutputValidator: function(output) {
    this.getSourceBlock().updateOutput(output);
    return output;
  },

  init: function() {
    this.appendValueInput('uri')
        .appendField('send HTTP request to URI')
        .setCheck('URI');
    this.appendDummyInput()
        .appendField('output')
        .appendField(
            new Blockly.FieldDropdown(
                [
                  ['status (text)', 'status'],
                  ['response (table)', 'body'],
                ],
                this.httpRequestOutputValidator,
            ),
            'OUTPUT',
        );
    this.appendDummyInput()
        .appendField('method')
        .appendField(
            new Blockly.FieldDropdown(
                [
                  ['GET', 'GET'],
                  ['PUT', 'PUT'],
                  ['POST', 'POST'],
                  ['DELETE', 'DELETE'],
                ],
                this.httpRequestValidator,
            ),
            'METHOD',
        );
    this.appendDummyInput().appendField('headers (comma separated)');
    this.appendDummyInput().appendField(
        new Blockly.FieldTextInput(
            '"Content-Type": "application/json", "Accept": "application/json"',
        ),
        'HEADERS',
    );
    this.setOutput(true, 'String');
    this.setColour(0);
  },

  updateInputs: function(newValue) {
    this.removeInput('BODYINPUT', /* no error */ true);

    if (newValue != 'GET') {
      this.appendDummyInput('BODYINPUT').appendField('body').appendField(
          new Blockly.FieldMultilineInput(`{
"object": {
  "a": "b",
  "c": "d",
  "e": "f"
},
"array": [
  1,
  2
],
"string": "Hello World"
}`),
          'BODY',
      );
    }
  },

  updateOutput: function(outputValue) {
    if (outputValue == 'status') {
      this.outputConnection.setCheck('String');
    } else if (outputValue == 'body') {
      this.outputConnection.setCheck('table');
    }
  },
};

Blockly.Blocks['http_request_new'] = {
  httpRequestValidator: function(newValue) {
    this.getSourceBlock().updateInputs(newValue);
    return newValue;
  },

  httpRequestOutputValidator: function(output) {
    return output;
  },

  init: function() {
    this.appendValueInput('uri')
        .appendField('send HTTP request to URI')
        .setCheck(['URI', 'String']);
    this.appendDummyInput()
        .appendField('output')
        .appendField(
            new Blockly.FieldDropdown(
                [
                  ['status (string)', 'status'],
                  ['response (string)', 'body'],
                ],
                this.httpRequestOutputValidator,
            ),
            'OUTPUT',
        );
    this.appendDummyInput()
        .appendField('method')
        .appendField(
            new Blockly.FieldDropdown(
                [
                  ['GET', 'GET'],
                  ['PUT', 'PUT'],
                  ['POST', 'POST'],
                  ['DELETE', 'DELETE'],
                ],
                this.httpRequestValidator,
            ),
            'METHOD',
        );
    this.appendDummyInput().appendField('headers (comma separated)');
    this.appendDummyInput().appendField(
        new Blockly.FieldTextInput(
            '"Content-Type": "application/json", "Accept": "application/json"',
        ),
        'HEADERS',
    );
    this.setOutput(true, 'String');
    this.setColour(0);
  },

  updateInputs: function(newValue) {
    this.removeInput('BODYINPUT', /* no error */ true);

    if (newValue != 'GET') {
      this.appendValueInput('body').setCheck('String').appendField('body');
    }
  },
};

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
        .setCheck(null)
        .appendField('define state')
        .appendField(nameField, 'NAME');
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
    this.conditions_ = [];
  },
  /**
   * Return the name and condition of this state.
   * @return {!Array} Tuple containing two elements:
   *    - the name of the defined state,
   *    - this state's conditions.
   * @this {Blockly.Block}
   */
  getStateDef: function() {
    return [this.getFieldValue('NAME'), this.conditions_];
  },
  /**
   * Returns the name of this state.
   * @return {string} State name.
   * @this {Blockly.Block}
   */
  getStateName: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Return this state's conditions.
   * @return {string} state conditions.
   * @this {Blockly.Block}
   */
  getConditions: function() {
    return this.conditions_;
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
      console.log(def);
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
          // This should only be possible programmatically and may indicate a problem
          // with event grouping. If you see this message please investigate. If the
          // use ends up being valid we may need to reorder events in the undo stack.
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
  defType_: 'state_definition',
};
