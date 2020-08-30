/**
 * @fileoverview Utility functions for handling (internet of) things
 */


Blockly.Things = {};
Blockly.Things.thingsMap = new Map();


/**
 * Create blocks in thing category.
 * @param {!Blockly.workpace} workspace The workspace containing things category.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.Things.flyoutCallback = function (workspace) {
    var xmlList = [];

    var beacon_button = document.createElement('button');
    beacon_button.setAttribute('text', 'Create new iBeacon');
    beacon_button.setAttribute('callbackKey', 'CREATE_IBEACON');

    var receiver_button = document.createElement('button');
    receiver_button.setAttribute('text', 'Create new receiver');
    receiver_button.setAttribute('callbackKey', 'CREATE_RECEIVER');

    workspace.registerButtonCallback('CREATE_IBEACON', function (button) {
        Blockly.Things.createThingButtonHandler(button.getTargetWorkspace(), "iBeacon");
    });

    workspace.registerButtonCallback('CREATE_RECEIVER', function (button) {
        Blockly.Things.createThingButtonHandler(button.getTargetWorkspace(), "receiver");
    });

    xmlList.push(beacon_button);
    xmlList.push(receiver_button);

    var blockList = Blockly.Things.flyoutCategoryBlocks(workspace);
    xmlList = xmlList.concat(blockList);
    return xmlList;
};

/**
 * Construct the blocks required by the flyout for the thing category.
 * @param {!Blockly.Workspace} workspace The workspace containing things category.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.Things.flyoutCategoryBlocks = function (workspace) {
    var ibeaconsExist = Blockly.Things.thingsMap.get("iBeacon") != undefined;
    var receiverExists = Blockly.Things.thingsMap.get("receiver") != undefined;

    var xmlList = [];
    if (ibeaconsExist) {
        var block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'ibeacon_get');
        block.setAttribute('gap', 8);
        xmlList.push(block);
    }
    if (receiverExists) {
        var block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'receiver_get');
        block.setAttribute('gap', 8);
        xmlList.push(block);
    }
    var block = Blockly.utils.xml.createElement('block');
    block.setAttribute('type', 'ibeacon_data');
    block.setAttribute('gap', 8);
    xmlList.push(block);
    return xmlList;
};

Blockly.Extensions.register('dynamic_ibeacon_menu_extension', function () {
    var ibeacons = Blockly.Things.thingsMap.get("iBeacon");
    this.getInput('INPUT')
        .appendField(new Blockly.FieldDropdown(
            function () {
                var options = [];
                ibeacons.forEach(thing => {
                    if (thing.type == "iBeacon") {
                        options.push([thing.name, thing.name]);
                    }
                })
                return options;
            }), "thing"
        );
});

Blockly.Extensions.register('dynamic_receiver_menu_extension', function () {
    var receivers = Blockly.Things.thingsMap.get("receiver");
    this.getInput('INPUT')
        .appendField(new Blockly.FieldDropdown(
            function () {
                var options = [];
                receivers.forEach(thing => {
                    if (thing.type == "receiver") {
                        options.push([thing.name, thing.name]);
                    }
                })
                return options;
            }), "thing"
        );
});

/**
 * Generate DOM objects representing a thing field.
 * @param {} thing The thing to represent.
 * @return {Element} The generated DOM.
 * @public
 */
Blockly.Things.generateThingFieldDom = function (thing) {
    var field = Blockly.utils.xml.createElement('field');
    field.setAttribute('name', 'THING');
    field.setAttribute('thing_type', thing.type);
    field.setAttribute('thing_address', thing.address);
    var name = Blockly.utils.xml.createTextNode(thing.name);
    field.appendChild(name);
    return field;
};


Blockly.Things.createThingButtonHandler = function (
    workspace, type, opt_callback) {
    Blockly.hideChaff();
    var promptAndCheckWithAlert = function (defaultName) {
        let newThing = {};
        newThing.type = type;

        Blockly.Things.promptName("Give your thing a name", defaultName,
            function (text) {
                if (text) {
                    var existing = Blockly.Things.nameUsed_(text, workspace, type);
                    if (existing) {
                        var msg = "The name %1 already exists.".replace(
                            '%1', existing.name);
                        Blockly.alert(msg,
                            function () {
                                promptAndCheckWithAlert(text);  // Recurse
                            });
                    } else {
                        // No conflict
                        newThing.name = text;
                        let promptText;
                        let promptDefault;
                        if(type == "iBeacon"){
                            promptText = "What is your beacon's MAC address";
                            promptDefault = "deadbeef";
                        } else if(type == "receiver"){
                            promptText = "What is your receiver's address";
                            promptDefault = "http://example.com/ibeacon/";
                        }
                        Blockly.Things.promptAddress(promptText, promptDefault, function (address) {
                            if (address) {
                                newThing.address = address;
                                if (Blockly.Things.thingsMap.get(type) == undefined) {
                                    // map for type has to be created first
                                    Blockly.Things.thingsMap.set(type, new Map());
                                }
                                Blockly.Things.thingsMap.get(type).set(newThing.name, newThing);
                            } else {
                                // User canceled prompt.
                                if (opt_callback) {
                                    opt_callback(null);
                                }
                            }
                        });
                        if (opt_callback) {
                            opt_callback(text);
                        }
                    }
                } else {
                    // User canceled prompt.
                    if (opt_callback) {
                        opt_callback(null);
                    }
                }
            });
    };
    promptAndCheckWithAlert('');
};


/**
* Prompt the user for a new Thing name.
* @param {string} promptText The string of the prompt.
* @param {string} defaultText The default value to show in the prompt's field.
* @param {function(?string)} callback A callback. It will return the new
*     thing name, or null if the user picked something illegal.
*/
Blockly.Things.promptName = function (promptText, defaultText, callback) {
    Blockly.prompt(promptText, defaultText, function (newThing) {
        // Merge runs of whitespace.  Strip leading and trailing whitespace.
        // Beyond this, all names are legal.
        if (newThing) {
            newThing = newThing.replace(/[\s\xa0]+/g, ' ').trim();

            // TODO are there illegal names?
        }
        callback(newThing);
    });
};

/**
* Prompt the user for a new Thing address.
* @param {string} promptText The string of the prompt.
* @param {string} defaultText The default value to show in the prompt's field.
* @param {function(?string)} callback A callback. It will return the new
*     thing address, or null if the user picked something illegal.
*/
Blockly.Things.promptAddress = function (promptText, defaultText, callback) {
    Blockly.prompt(promptText, defaultText, function (newThing) {
        // Merge runs of whitespace.  Strip leading and trailing whitespace.
        // Beyond this, all names are legal.
        if (newThing) {
            newThing = newThing.replace(/[\s\xa0]+/g, ' ').trim();

            // TODO maybe check if address is valid
        }
        callback(newThing);
    });
};

/**
* Check whether there exists a thing with the given name of any type.
* @param {string} name The name to search for.
* @param {!Blockly.Workspace} workspace The workspace to search for the thing.
* @return {} The thing with the given name,
*     or null if none was found.
* @private
*/
Blockly.Things.nameUsed_ = function (name, workspace, type) {
    var names = Blockly.Things.thingsMap.get(type);
    if (names == undefined) {
        return null;
    }

    name = name.toLowerCase();

    if (names.has(name)) {
        return names.get(name);
    }

    return null;
};