# Semantics <!-- omit in toc -->
This document explains what happens when a block program gets executed.

# Code generation
Everytime the workspace changes, i.e. a block is added, moved or removed, BLAST generates JavaScript code.

In order to generate this code, each block returns either a String with code-snippets, or a tuple consisting of such a string and an Integer value defining the [Operator Precedence](https://developers.google.com/blockly/guides/create-custom-blocks/operator-precedence). 

For example the code generation for the `play_audio` block looks as follows:
```JavaScript
Blockly.JavaScript['wait_seconds'] = function(block) {
  const seconds = Number(block.getFieldValue('SECONDS'));
  const code = 'waitForSeconds(' + seconds + ');\n';
  return code;
};
```

The JavaScript file responsible for Block's code generation can be found at [block_generators.js](../js/block_generators.js)

# Execution
When a user clicks the execute button, BLAST uses a [JSInterpreter](https://neil.fraser.name/software/JS-Interpreter/docs.html) instance to execute the generated JavaScript in a completely isolated JavaScript environment.

# Event blocks
The event Blocks' code is evaluated in parallel. In order to do so their code is executed by a second instance of the JSInterpreter. 