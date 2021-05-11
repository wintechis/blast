# Semantics <!-- omit in toc -->
This document explains what happens when a block program gets executed.

# Code generation
Every time the workspace changes, i.e. a block is added, moved or removed, BLAST generates JavaScript code.

In order to generate this code, each block returns either a String with code-snippets, or a tuple consisting of such a string and an Integer value defining the [Operator Precedence](https://developers.google.com/blockly/guides/create-custom-blocks/operator-precedence). 

For example the code generation for the `play_audio` block looks as follows:
```JavaScript
Blockly.JavaScript['play_audio'] = function(block) {
  const uri = Blockly.JavaScript.valueToCode(
      block,
      'URI',
      Blockly.JavaScript.ORDER_NONE,
  );
  const code = `playAudioFromURI(${uri});\n`;
  return code;
};
```

The JavaScript files responsible for Block's code generation can be found at [src/generators/](../src/generators/)

# Execution
When a user clicks the execute button, BLAST uses a [JSInterpreter](https://neil.fraser.name/software/JS-Interpreter/docs.html) instance to execute the generated JavaScript in a sand-boxed JavaScript environment.

# Events vs State transitions
In addition to the sequential block code, Blast evaluates events emitted by things and state transitions.  

### Events
Events are emitted by WOT things, see [event description of the W3C](https://www.w3.org/TR/wot-architecture/#events). When an event occurs, BLAST execution is interrupted until the code triggered by the event has finished.

The example below, will display `BLAST execution time: 0`, `BLAST execution time: 1`, `BLAST execution time: 2`,... every second until the top left button on the connected streamdeck mini is pushed.
Then the message `interrupt` is displayed and after 5 seconds the output is going to continue where interrupted.

![](images/event-example.png)

Here's an example output, button is pushed after 3 seconds:

`BLAST execution time: 0`  
`BLAST execution time: 1`  
`BLAST execution time: 2`  
`BLAST execution time: 3`  
`interupt`  
`BLAST execution time: 4`  
`BLAST execution time: 5`  
...


### State transitions
The state blocks enable checking for state transitions. To continuously check for those, BLAST's state transition checker is executed in parallel by a 2nd instance of the JSInterpreter.

TODO add parallel Example