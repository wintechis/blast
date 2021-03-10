Blockly.Blocks['robot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('robot')
        .appendField(
            new Blockly.FieldDropdown([
              ['red', 'RED'],
              ['green', 'green'],
              ['blue', 'BLUE'],
              ['yellow', 'YELLOW'],
            ]),
            'box',
        );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['strip'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('LED strip')
        .appendField(
            new Blockly.FieldDropdown([
              ['red', 'RED'],
              ['yellow', 'YELLOW'],
              ['green', 'green'],
            ]),
            'color',
        );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['signal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Signal light')
        .appendField(
            new Blockly.FieldDropdown([
              ['red', 'RED'],
              ['yellow', 'YELLOW'],
              ['green', 'green'],
            ]),
            'color',
        );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

Blockly.Blocks['submit'] = {
  init: function() {
    this.appendValueInput('challenge')
        .setCheck('Number')
        .appendField('submit solution for challenge #');
    this.appendDummyInput()
        .appendField('and challenger')
        .appendField(new Blockly.FieldTextInput('enter name here'), 'NAME');
    this.appendStatementInput('solution').setCheck(null);
    this.setInputsInline(false);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
