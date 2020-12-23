# Semantics <!-- omit in toc -->

This section explains what happens when a block program gets executed. In order to do so the first section lists and explains all of BLAST's static functions of BLAST and the second section describes block specific functions in detail.

Click the links below to jump to each one of those sections.

- [1. functions](#1-functions)
  - [1.1. general functions](#11-general-functions)
    - [1.1.1. runCode](#111-runcode)
    - [1.1.2. getAllAddresses](#112-getalladdresses)
    - [1.1.3. queryAlliBeacons](#113-queryallibeacons)
    - [1.1.4. stopCode](#114-stopcode)
  - [1.2. block specific functions](#12-block-specific-functions)
    - [1.2.1. displayTable](#121-displaytable)
    - [1.2.2. insertMessage](#122-insertmessage)
    - [1.2.3. playRandomSoundFromCategory](#123-playrandomsoundfromcategory)
  - [1.3. sc-ble-adapter only functions](#13-sc-ble-adapter-only-functions)
    - [1.3.1. switchLights](#131-switchlights)
- [2. block semantics](#2-block-semantics)
  - [2.1. program-blocks semantics](#21-program-blocks-semantics)
    - [2.1.1. setup semantics](#211-setup-semantics)
    - [2.1.2. repeat semantics](#212-repeat-semantics)
  - [2.2. things-blocks semantics](#22-things-blocks-semantics)
    - [2.2.1. iBeacon semantics](#221-ibeacon-semantics)
    - [2.2.2. receiver semantics](#222-receiver-semantics)
    - [2.2.3. iBeacon-data semantics](#223-ibeacon-data-semantics)
  - [2.3. variables blocks semantics](#23-variables-blocks-semantics)
    - [2.3.1. variables set semantics](#231-variables-set-semantics)
    - [2.3.2. variables get semantics](#232-variables-get-semantics)
    - [2.3.3. variables change semantics](#233-variables-change-semantics)
  - [2.4. action blocks semantics](#24-action-blocks-semantics)
    - [2.4.1. display text semantics](#241-display-text-semantics)
    - [2.4.2. display data semantics](#242-display-data-semantics)
    - [2.4.3. switch lights semantics](#243-switch-lights-semantics)
    - [2.4.4. random sound semantics](#244-random-sound-semantics)
    - [2.4.5. halt semantics](#245-halt-semantics)
  - [2.5. logic blocks semantics](#25-logic-blocks-semantics)
    - [2.5.1. comparison semantics](#251-comparison-semantics)
    - [2.5.2. AND / OR semantics](#252-and--or-semantics)
    - [2.5.3. not semantics](#253-not-semantics)
    - [2.5.4. if / if-else semantics](#254-if--if-else-semantics)
    - [2.5.5. event semantics](#255-event-semantics)
  - [2.6. boolean blocks semantics](#26-boolean-blocks-semantics)
    - [2.6.1. boolean-value semantics](#261-boolean-value-semantics)
  - [2.7. text blocks semantics](#27-text-blocks-semantics)
    - [2.7.1. URI semantics](#271-uri-semantics)
    - [2.7.2. MAC semantics](#272-mac-semantics)
    - [2.7.3. text-value semantics](#273-text-value-semantics)
    - [2.7.4. text concatenation semantics](#274-text-concatenation-semantics)
  - [2.8. number blocks semantics](#28-number-blocks-semantics)
    - [2.8.1. number-value semantics](#281-number-value-semantics)
    - [2.8.2. infinity semantics](#282-infinity-semantics)
    - [2.8.3. arithmetic operations semantics](#283-arithmetic-operations-semantics)
    - [2.8.4. random integer semantics](#284-random-integer-semantics)

# 1. functions
BLAST's has a handful of predefined functions in order to execute block programs. These functions can be divided into the tow categories *general* and *specific*. 

The *general* functions perform tasks used by the BLAST environment to handle execution of a block program. The *specific* functions are only used by single blocks and are not needed for execution of a block program without these blocks.

The following describes all functions used by BLAST and it's blocks.

## 1.1. general functions

### 1.1.1. runCode
When a user clicks the execute button the **runCode()** function is called.
This function handles execution of a block program.

Before each iteration of any of the **program blocks**, **setup** and **repeat**, it uses the [**getAllAddresses()**](#212-getalladdresses) function to collect addresses of all resources and then [**queryAlliBeacons()**](#213-queryallibeacons) to query those addresses and store the results. Descriptions of theses functions can be found in their respective section.

**parameters:** *none*  
**returns:** `null`

``` JavaScript
runCode = function() {
    // disable run button and enable stop button
    document.getElementById("stop").disabled = false;
    document.getElementById("run").disabled = true;
    document.getElementById("status").innerHTML = "running... ";

    // stop loop interval
    var prevInterval = interval;
    clearInterval(prevInterval);

    // clear process arrays
    var setup = [];
    var loop = []

    // query data first
    var addresses = getAllAddresses();
    queryAlliBeacons(addresses).then(() => {
        var code = Blockly.JavaScript.workspaceToCode(workspace);

        // pushes the block's code into either setup or loop array 
        eval(code);

        // eval setup
        for (process of setup) {
            eval(process);
        }

        prevResultsMap = new Map(resultsMap);

        //eval loop
        var setupBlock = workspace.getBlockById("setup");
        var addresses = getiBeaconAddressesInBlock(setupBlock);

        // stop condition
        if (!eval(loopCondition)) {
            stopCode('finished');
            return;
        }

        // first iteration
        for (process of loop) {
            eval(process);
        }

        // repeat after n seconds
        interval = setInterval(function() {

            var addresses = getAllAddresses();
            queryAlliBeacons(addresses).then(() => {
                if (!eval(loopCondition)) {
                    stopCode('finished');
                    return;
                }

                for (process of loop) {
                    eval(process);
                }
            });

            prevResultsMap = new Map(resultsMap);
        }, loopTime * 1000)
    })
}
```

### 1.1.2. getAllAddresses

Before executing a block program, BLAST uses `getAllAddresses()` to parse the workspace for **receiver** blocks and saves their addresses.

**parameters:** *none*  
**returns:** `addresses` (*string[]*) array with addresses of receivers

``` JavaScript
getAllAddresses = function() {
    let receivers = workspace.getBlocksByType("receiver_get");
    var addresses = []
    receivers.forEach(block => {
        if (block.type != 'receiver_get') return;
        addresses.push(Blockly.JavaScript.valueToCode(block, 'address', Blockly.JavaScript.ORDER_NONE));
    })
    addresses = eliminateDupilactes(addresses);
    return addresses;
}
```

This enables parsing their RDF before each iteration of a program block, by calling `queryAlliBeacons(addresses)` . 

### 1.1.3. queryAlliBeacons

This function uses [µRDF](https://github.com/vcharpenay/uRDF.js) to query a resource with a predefined SPARQL query and stores the results into a JavaScript Map, enabling blocks to perform JavaScript operations like selecting properties and comparing values of the retrieved data.

**parameters:** 

| parameter   | type       | description                       |
|-------------|------------|-----------------------------------|
| `addresses` | *string[]* | array with addresses of receivers |

**returns:** Promise (*Promise*) empty Promise Object

``` JavaScript
function queryAlliBeacons(addresses) {
    return new Promise((resolve, reject) => {
    if (addresses.length == 0) {
        resolve();
    }
        return Promise.all(addresses.map(address => {
            console.log(address);
            var url = new URL(address);
            var baseUrl = url.protocol + "//" + url.host;
            var path = url.pathname;

            var query =
            `BASE <${baseUrl}>
            PREFIX rdf: <http://w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX sosa: <http://www.w3.org/ns/sosa/>
            PREFIX ble: <http://vocab.rapidthings.eu/ns/ble.ttl#>
            PREFIX a: <http://vocab.rapidthings.eu/ns/ble/adapter.ttl#>

            
            SELECT ?mac ?rssi ?resultTime
            FROM <${path}>
            WHERE 
            {
                ?history ble:entries ?obs .
                ?obs a ble:RssiObservation .
                ?obs sosa:madeBySensor ?mac .
                ?obs sosa:hasSimpleResult ?rssi .
                ?obs sosa:resultTime ?resultTime .
            }`;

            urdf.clear();
            urdf.query(query)
            .then(result => {
                let formattedResult = new Map();
                for (r of result) {
                formattedResult.set(r.mac.value, r);
                }
                resultsMap.set(address, formattedResult);
                resolve();
            })
        }));
    });
}
```

Before each iteration of the **repeat** block if `resultsMap` is not empty BLAST will save a copy of it to enable the **event**#event block to compare values from `resultsMap` with values from previous Results.

### 1.1.4. stopCode

The `stopCode` function stops the execution of a block-program.  
`message` will be displayed next to the stop button.

**parameters:** *none*  
**returns:** `null`

``` JavaScript
stopCode = function(message) {
    // enable run button and disable stop button
    document.getElementById("stop").disabled = true;
    document.getElementById("run").disabled = false;

    // stop interval execution and set status text
    clearInterval(interval)
    document.getElementById("status").innerHTML = message;
}
```

## 1.2. block specific functions

### 1.2.1. displayTable

This helper function creates an HTML table listing iBeacon data. 

**parameters:**

| parameter    | type        | description                           |
|--------------|-------------|---------------------------------------|
| `key` | *string*    | key of the iBeacon data in resultsMap |
| `checkboxes` | *boolean[]* | defines which columns to display      |

**returns:** `null`

``` JavaScript
function displayTable(key, checkboxes) {
promise().then(results => {
    if (results.length == 0) {
        displayText("empty table")
        return;
    }

    // deal with missing values
    let vars = results.reduce((list, res) => {
        for (let v in res) {
        if (list.indexOf(v) === -1) list.push(v);
        }
        return list;
    }, []);

    let html = '<tr>';
    vars.forEach(v => html += '<th>' + v + '</th>');
    html += '</tr>';

    results.forEach(res => {
        html += '<tr>';
        vars.forEach(v => html += '<td>' + (res[v] ? res[v].value : '') + '</td>');
        html += '</tr>';
    });

    let resultsField = document.createElement("table");
    resultsField.innerHTML = html;
    var msgBox = document.getElementById("messageBox");
    msgBox.insertBefore(resultsField, msgBox.firstChild);
    })
    .catch(e => {
        displayText("am error occured, see console for details.")
        console.error(e);
    });

    let vars = ["mac", "rssi", "resultTime"];

    let html = '<tr>';
    vars.forEach(v => html += '<th>' + v + '</th>');
    html += '</tr>';

    results.forEach(res => {
    html += '<tr>';
    vars.forEach(v => {
        html += '<td>' + (res[v] ? res[v].value : '') + '</td>'
    });
    html += '</tr>';
    });

    resultsField.innerHTML = html;

    var div = document.getElementById("messageBox");
    div.insertBefore(resultsField, div.firstChild);
}
```

### 1.2.2. insertMessage

insertMessage is a helper function used by the **display text** block. It creates a HTML div with the desired text and attaches it to the action block output container.

**parameters:** 

| parameter | type     | description     |
|-----------|----------|-----------------|
| text      | *string* | text to display |

**returns:** `null`

``` JavaScript
function insertMessage(text) {
    msg = document.createElement("div");
    msg.classList.add("message");
    msg.id = "message-" + messageCounter;

    textNode = document.createTextNode(text);
    msg.appendChild(textNode);

    timeSpan = document.createElement("span");
    timeSpan.classList.add("time");
    timeSpan.innerHTML = new Date().toLocaleTimeString();
    msg.appendChild(timeSpan);

    msgBox = document.getElementById("messageBox");
    msgBox.insertBefore(msg, msgBox.firstChild);
}
```

### 1.2.3. playRandomSoundFromCategory
This functions is used by the **random sound** block. It plays a random audio file out of two predefined arrays `soundsCheerful` and `soundsSad`.

**parameters:** 

| parameter | type     | description     |
|-----------|----------|-----------------|
| text      | *string* | identifier for the sound array |

**returns:** `null`

```JavaScript
function playRandomSoundFromCategory(category){
    var soundArray;
    switch (category) {
        case "happy":
            soundArray = soundsCheerful;
            break;
        case "sad":
            soundArray = soundsSad;
            break;
    }
    var index = Math.random() * soundArray.length | 0;
    soundArray[index].play();
}
```


## 1.3. sc-ble-adapter only functions
### 1.3.1. switchLights

SwitchLights is a helper function, used by the **switch lights** block. It sends a HTTP-POST request to the [sc-ble-adapter](https://github.com/wintechis/sc-ble-adapter/) which controls the [LED strip controller](https://github.com/arduino12/ble_rgb_led_strip_controller) specified by `mac` .

**parameters:**

| parameter | type      | description                        |
|-----------|-----------|------------------------------------|
| `address` | *string*  | the LED controllers http interface |
| `r` | *boolean* | turns red led on or off            |
| `y` | *boolean* | turns yellow led on or off         |
| `g` | *boolean* | turns green led on or off          |

**returns:** `null`

``` JavaScript
function switchLights(address, r, y, g) {
    var r_byte = r ? "ff" : "00";
    var y_byte = y ? "ff" : "00";
    var g_byte = g ? "ff" : "00";

    var data = {
        type: "WriteWithoutResponse",
        data: "7e000503" + r_byte + g_byte + y_byte + "00ef"
    };

    fetch("http://raspberrypi.local:8000/devices/be5860006ad4/char/0009/", {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify(data)
    }).then(res => {
        console.log("Request complete! response:", res);
    })
}
```

# 2. block semantics

## 2.1. program-blocks semantics

The **setup** and **repeat** blocks control the block programs process order.

### 2.1.1. setup semantics

Every block in the setup-block get's executed once at program start.

To run the blocks in the setup block consecutively the block pushes its containing blocks into an array.

``` JavaScript
var code = `setup.push(\`${statements_onstart.trim()}\`);`;
```

### 2.1.2. repeat semantics

The blocks withing the repeat-block are executed consecutively `n` -times every `x` seconds according to the parameters .

Like with the **setup** block, RDF-data is queried before each execution of the **repeat** block. Then the blocks within the **repeat** block are executed consecutively.  
Additionally the **repeat** block writes each data retrieved from the RDF-graphs to a map to store previous results. This map ( `prevResultsMap` ) is used by the **event** block to compare previous and current results.

``` JavaScript
if(dropdown_dropdown_mode == "mode_until"){
    value_condition = "!" + value_condition
}

var code = `loop.push(\`${statements_loop.trim()}\`); var loopTime = ${value_seconds}; var loopCondition = ${value_condition};`;
return code;
```

## 2.2. things-blocks semantics

There are 3 different blocks in this category: **iBeacon**, **receiver** and **iBeacon-data**.

### 2.2.1. iBeacon semantics

The iBeacon block represents an iBeacon

to create a new iBeacon click the `create new thing` button in the things category.  
Internally, this stores the address of the iBeacon's RDF-graph in a map.

On execution the iBeacon block then retrieves the address of the iBeacon's RDF-graph from this map.

``` JavaScript
var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);

return [value_name, Blockly.JavaScript.ORDER_ATOMIC];
```

### 2.2.2. receiver semantics

The receiver block represents a Bluetooth receiver.

to create a new receiver click the `create new receiver` button in the things category.
Internally, this stores the address of the receiver's RDF-graph in a map.

On execution the receiver block then retrieves the address of the receivers's RDF-graph from this map.

``` JavaScript
var value_address = Blockly.JavaScript.valueToCode(block, 'address', Blockly.JavaScript.ORDER_ATOMIC);

return [value_address, Blockly.JavaScript.ORDER_ATOMIC];
```

### 2.2.3. iBeacon-data semantics

The iBeacon-data block retrieves iBeacon data.

Data is retrieved from the results map created on execution of the setup- or repeat-block. (See [runcode](#211-runcode))

``` JavaScript
var code = `resultsMap.get("${receiver}").get("${iBeacon}")["${value}"].value`;
return code;
```

## 2.3. variables blocks semantics
Blast uses the term variable the same as it is used in mathematics: a named value that can be changed (varies).

### 2.3.1. variables set semantics
The variables set block sets a variable to a number or text value.

```JavaScript
return varName + ' = ' + argument0 + ';\n';
```

### 2.3.2. variables get semantics
Variables get returns the value of the selected variable

```JavaScript
var code = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
return [code, Blockly.JavaScript.ORDER_ATOMIC];
```

### 2.3.3. variables change semantics
This block changes a variable's value to the specified value.
```JavaScript
return varName + ' = ' + argument0 + ';\n';
```

## 2.4. action blocks semantics

There are 3 different blocks in this category: **display text**, **display data** and **switch lights**. 

### 2.4.1. display text semantics

The display text block adds a text container to the action-block output container on the right.

This block calls the [insertMessage](#217-insertmessage) function to insert it's input into a message container in the action-block-output container.

``` JavaScript
var code = `insertMessage(${text_msg})\n`;
return code;
```

### 2.4.2. display data semantics

The display data block prints a table containing all the data received at a receiver to the action-block output container on the right.

When executed this block writes the check-box values into an array and calls the [displayTable](#215-displaytable) function.

``` JavaScript
var value_thing = Blockly.JavaScript.valueToCode(block, 'thing', Blockly.JavaScript.ORDER_NONE);

code = `displayData(${value_thing});`;
return code;
```

### 2.4.3. switch lights semantics

The switch lights block can be used to control the LEDs of a [LED strip controller](https://github.com/arduino12/ble_rgb_led_strip_controller).

This block calls the [switchLights](#216-switchlights) function, which then sends a HTTP-POST request to the [sc-ble-adapter](https://github.com/wintechis/sc-ble-adapter/) in order to controls the [LED strip controller](https://github.com/arduino12/ble_rgb_led_strip_controller) specified by `mac` .

``` JavaScript
var code = `switchLights("${iBeacon}", ${cb_red}, ${cb_yellow}, ${cb_green});`;
return code;
```

### 2.4.4. random sound semantics
This block plays a random sound out of the two predefined sound-sets "happy" and "sad" by calling the [playRandomSoundFromCategory](#218-playrandomsoundfromcategory)function.

```JavaScript
var code = `playRandomSoundFromCategory("${dropdown_category}");\n`;
return code;
```
### 2.4.5. halt semantics
The halt block stops execution of the current block program, by calling the [stopCode](#214-stopcode) function.

```JavaScript
var code = 'stopCode("finished");\n';
return code;
```


## 2.5. logic blocks semantics

Logic blocks are used to implement [boolean logic](https://en.wikipedia.org/wiki/Boolean_algebra).  

If a block expects a Boolean value as an input, it usually interprets an absent input as **false**. Non-Boolean values cannot be directly plugged in where Boolean values are expected.

### 2.5.1. comparison semantics

There are six comparison operators. Each takes two inputs and returns true or false depending on how the inputs compare with each other.

The six operators are: equals, not equals, less than, greater than, less than or equal, greater than or equal.

On execution this block returns JavaScript code, that compares two values when evaluated.

``` JavaScript
// Comparison operator.
var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
};
var operator = OPERATORS[block.getFieldValue('OP')];
var order = (operator == '==' || operator == '!=') ?
    Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
var code = argument0 + ' ' + operator + ' ' + argument1;
return [code, order];
```

### 2.5.2. AND / OR semantics

This block represents the logical operations *and* and *or*.

On execution this block returns JavaScript code, that performs the logic operation selected in the dropdown when evaluated.

``` JavaScript
// Operations 'and', 'or'.
var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
var order = (operator == '&&') ? Blockly.JavaScript.ORDER_LOGICAL_AND :
    Blockly.JavaScript.ORDER_LOGICAL_OR;
var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order);
var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order);
if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
} else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
        argument0 = defaultArgument;
    }
    if (!argument1) {
        argument1 = defaultArgument;
    }
}
var code = argument0 + ' ' + operator + ' ' + argument1;
return [code, order];
```

### 2.5.3. not semantics

The not block converts its Boolean input into its opposite. For example, the result of:  

![not block](images/logic-not-true.png) 

is **false**


The not-block calls a function that negates the boolean in the argument.

``` JavaScript
// Negation.
var order = Blockly.JavaScript.ORDER_LOGICAL_NOT;
var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', order) ||
    'true';
var code = '!' + argument0;
return [code, order];
```

### 2.5.4. if / if-else semantics

The simplest conditional statement is an **if** block, as shown:

![if example](images/if-if.png)

When run, this will compare the RSSI value of the thing **my beacon** to -30. If it is larger, "Beacon is close!" will be displayed. Otherwise, nothing happens.

It is also possible to specify that something should happen if the condition is *not* true, as shown in this example:

![if else example](images/if-else.png)

As with the previous block, "Beacon is close!" will be displayed if the RSSI value of **my beacon** > -30; otherwise, "Beacon is not very close." will be displayed.
An **if** block may have zero or one **else** sections but not more than one.

The underlying function, which is called upon execution returns the JavaScript representation of the if condition defined by the block.

``` JavaScript
Blockly.JavaScript['controls_if'] = function(block) {
    // If/elseif/else condition.
    var n = 0;
    var code = '',
        branchCode, conditionCode;
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
        // Automatic prefix insertion is switched off for this block.  Add manually.
        code += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX,
            block);
    }
    do {
        conditionCode = Blockly.JavaScript.valueToCode(block, 'IF' + n,
            Blockly.JavaScript.ORDER_NONE) || 'false';
        branchCode = Blockly.JavaScript.statementToCode(block, 'DO' + n);
        if (Blockly.JavaScript.STATEMENT_SUFFIX) {
            branchCode = Blockly.JavaScript.prefixLines(
                Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
                    block), Blockly.JavaScript.INDENT) + branchCode;
        }
        code += (n > 0 ? ' else ' : '') +
            'if (' + conditionCode + ') {\n' + branchCode + '}';
        ++n;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE') || Blockly.JavaScript.STATEMENT_SUFFIX) {
        branchCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
        if (Blockly.JavaScript.STATEMENT_SUFFIX) {
            branchCode = Blockly.JavaScript.prefixLines(
                Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX,
                    block), Blockly.JavaScript.INDENT) + branchCode;
        }
        code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
};
```

### 2.5.5. event semantics

The event block is used to describe events.  
iE it returns `true` or `false` when a measurement enters or leaves a specified range.

This block creates JavaScript code, that when evaluated compares the specified measurement's current result with the previous one. Those results are gathered when executing the **setup** and **repeat** blocks.

``` JavaScript
var order = (operator == '==' || operator == '!=') ?
    Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;

var negate = dropdown_startstop == "BECOMES" ? "" : "!";

var code =
    `${negate}(!(prevResultsMap.get("${receiver}").get("${iBeacon}")["${value}"].value ${operator} ${value_name})) &&
${negate} (resultsMap.get("${receiver}").get("${iBeacon}")["${value}"].value ${operator} ${value_name})`;

return [code, Blockly.JavaScript.ORDER_NONE];
```

## 2.6. boolean blocks semantics

### 2.6.1. boolean-value semantics

The value block represents a boolean value

This block returns `true` or `false` depending on the value selected from the dropdown.

``` JavaScript
var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
return [code, Blockly.JavaScript.ORDER_ATOMIC];
```

## 2.7. text blocks semantics

Examples of pieces of text are:

* "thing #1"
* "March 12, 2010"
* "" (the empty text)

Text can contain letters (which may be lower-case or upper-case), numbers, punctuation marks, other symbols, and blank spaces between words.


### 2.7.1. URI semantics
The URI block represents a URI.

On execution this URI is returned
```JavaScript
var text_uri = block.getFieldValue('URI');
return [text_uri, Blockly.JavaScript.ORDER_NONE];
```

### 2.7.2. MAC semantics
The MAc block represents a MAC address.

On execution this MAC address is returned
```JavaScript
var text_mac = block.getFieldValue('MAC');
return [text_mac, Blockly.JavaScript.ORDER_NONE];
```

### 2.7.3. text-value semantics

The following block creates the piece of text "hello".

When executed this block simply returns the entered text as a JavaScript string.

``` JavaScript
var code = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
return [code, Blockly.JavaScript.ORDER_ATOMIC];
```

### 2.7.4. text concatenation semantics

The text concatenation block combines (concatenates) the value of two or more text blocks.

To increase the number of text inputs, click on the gear icon, which changes the view to:

![text create block modification](images/text-create-modify.png)

Additional inputs are added by dragging an "item" block from the gray toolbox on the left into the "join" block.

In order to concatenate strings this block adds all values to an array and then calls the JavaScript function `join()` on that array.

``` JavaScript
switch (block.itemCount_) {
    case 0:
        return ['\'\'', Blockly.JavaScript.ORDER_ATOMIC];
    case 1:
        var element = Blockly.JavaScript.valueToCode(block, 'ADD0',
            Blockly.JavaScript.ORDER_NONE) || '\'\'';
        var code = Blockly.JavaScript.text.forceString_(element);
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    case 2:
        var element0 = Blockly.JavaScript.valueToCode(block, 'ADD0',
            Blockly.JavaScript.ORDER_NONE) || '\'\'';
        var element1 = Blockly.JavaScript.valueToCode(block, 'ADD1',
            Blockly.JavaScript.ORDER_NONE) || '\'\'';
        var code = Blockly.JavaScript.text.forceString_(element0) + ' + ' +
            Blockly.JavaScript.text.forceString_(element1);
        return [code, Blockly.JavaScript.ORDER_ADDITION];
    default:
        var elements = new Array(block.itemCount_);
        for (var i = 0; i < block.itemCount_; i++) {
            elements[i] = Blockly.JavaScript.valueToCode(block, 'ADD' + i,
                Blockly.JavaScript.ORDER_COMMA) || '\'\'';
        }
        var code = '[' + elements.join(',') + '].join(\'\')';
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
}
```

## 2.8. number blocks semantics

Number blocks are used to create and modify numbers.

### 2.8.1. number-value semantics

The number-value block represents a numerical value

This block simply returns the entered value as a JavaScript number

``` JavaScript

var order = code >= 0 ? Blockly.JavaScript.ORDER_ATOMIC :
    Blockly.JavaScript.ORDER_UNARY_NEGATION;
return [code, order];
```

### 2.8.2. infinity semantics

The infinity block represent the *infinity* constant.

On execution this block returns a JavaScript representation of infinity

``` JavaScript
    return [Infinity, Blockly.JavaScript.ORDER_NONE];
```

### 2.8.3. arithmetic operations semantics

The arithmetic operations block is used to create simple arithmetic operations.

The available arithmetic operations are: addition, subtraction, multiplication, division and power.

Below is the function called when executing this block in order to create JavaScript code from the block.

``` JavaScript
// Basic arithmetic operators, and power.
var OPERATORS = {
    'ADD': [' + ', Blockly.JavaScript.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.JavaScript.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.JavaScript.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.JavaScript.ORDER_DIVISION],
    'POWER': [null, Blockly.JavaScript.ORDER_COMMA] // Handle power separately.
};
var tuple = OPERATORS[block.getFieldValue('OP')];
var operator = tuple[0];
var order = tuple[1];
var argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
var argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
var code;
// Power in JavaScript requires a special case since it has no operator.
if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
}
code = argument0 + operator + argument1;
return [code, order];
```

### 2.8.4. random integer semantics

This block creates a random integer in between the defined boundaries.

This block returns JavaScript code utilizing the `Math.random()` function to create a random number in the range specified by the blocks' arguments.

``` JavaScript
// Random integer between [X] and [Y].
var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
    Blockly.JavaScript.ORDER_COMMA) || '0';
var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
    Blockly.JavaScript.ORDER_COMMA) || '0';
var functionName = Blockly.JavaScript.provideFunction_(
    'mathRandomInt',
    ['function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
        '(a, b) {',
        '  if (a > b) {',
        '    // Swap a and b to ensure a is smaller.',
        '    var c = a;',
        '    a = b;',
        '    b = c;',
        '  }',
        '  return Math.floor(Math.random() * (b - a + 1) + a);',
        '}'
    ]);
var code = functionName + '(' + argument0 + ', ' + argument1 + ')';
return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
```
