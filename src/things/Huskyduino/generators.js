Blockly.JavaScript['huskylens_choosealgo'] = function(block) {
    
    const algorithm = block.getFieldValue('Algorithms');
    const thing = Blockly.JavaScript.valueToCode(
        block, 
        'Thing', 
        Blockly.JavaScript.ORDER_ATOMIC
    );

    const dic = { };
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
};