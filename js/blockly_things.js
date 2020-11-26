/**
 * @fileoverview Utility functions for handling (internet of) things
 */

Blockly.Things.saveButtonHandler = async function (
    workspace, type, opt_callback) {
    Blockly.hideChaff();
    if (!loggedIn) {
        await popupLogin();
    }
    let url = document.getElementById("loadWorkspace-input").value;
    save(url);
};

/**
 * saves the current workspace to solid pod
 * @param {string} url new url of the workspace
 */
function save(url) {
    // object to save relevant data in (blocks and variables)
    var workSpaceSaveObj = {};

    // save blocks in workspace
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);

    // upload workspace file to pod
    fileClient.createFile(url, xmlDom, "text/xml")
        .then(() => {
            Blockly.alert("workspace uploaded!")
        })
        .catch(err => {
            Blockly.alert("Something went wrong. Do you have permission to write on this server?")
        })
}

Blockly.Things.loadButtonHandler = async function () {
    Blockly.hideChaff();
    let url = document.getElementById("loadWorkspace-input").value;
    fileClient.readFile(url)
        .then((content) => {
            restore(content);
        })
    // .catch(err => {
    //     console.error(`Error: ${err}`);
    //     Blockly.alert("Error: File either doesnt exists or you dont have permission to read it.");
    // });
};

/**
 * restores a workspace from JSON
 * @param {string} name name of the workspace
 */
function restore(xmlText) {
    stopCode("stopped");

    // clear blocks
    Blockly.mainWorkspace.clear();

    var xmlDom = Blockly.Xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
}