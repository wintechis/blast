# Integration
BLAST allows developers to overwrite its in- and output methods and hook custom methods to events in order to integrate BLAST into their own system. The following describes how to do this:

## STDOUT, STDINFO, STDERROR
The steps below describe how to overwrite BLAST's default `STDOUT`, `STDINFO` or `STERROR` methods.
1. Import the respective setter (`setStdError`, `setStdInfo` or `setStdOut` from `blast_interpreter.js`)
    ```JavaScript
    import {setStdOut} from './blast_interpreter.js';
    ```
2. Define own output method
   ```JavaScript
   const myOutputMethod = function(message) {
       ...
   };
3. Set it as default
   ```JavaScript
   setStdOut(myOutputMethod);
   ```

### Error handling
Errors occuring during execution of a BLAST program should be thrown using `throwError` from `blast_interpreter.js`, like below.

`throwError` Stops execution, resets the interpreter and prints an error message to stdError.

Parameter
 * `text` [string] (optional) the error message to print to stdError, defaults to 'Error executing program - See console for details.'

```JavaScript
import {throwError} from './blast_interpreter.js';

const myErrornousFunction = function(param) {
    ...
    throwError('an error occured invoking myErrornousFunction');
}
```

## onStatusChange
The `onStatusChange` objects contains the arrays `ready`, `running`, `stopped` and `error`. All functions in these arrays will be executed everytime BLAST's status changes to the respective value. The example below shows how to add a new function to one of these arrays. 

```JavaScript
import {onStatusChange} from './blast_interpreter.js';

const onReady = function() {
    console.log('We are ready!');
};

onStatusChange.ready.push(onReady);
```
