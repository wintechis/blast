function initApi(interpreter, globalObject) {
    // Ensure function names do not conflict with variable names.
    Blockly.JavaScript.addReservedWords('highlightBlock', 'queryReceiver', 'getTableCell', 'displayText', 'displayTable',);

    // API function for highlighting blocks.
    var wrapper = function (id) {
        return workspace.highlightBlock(id);
    };
    interpreter.setProperty(globalObject, 'highlightBlock', interpreter.createNativeFunction(wrapper));

    // API function for urdf querying.
    var wrapper = function (address, callback) {
        var url = new URL(address);
        var baseUrl = url.protocol + "//" + url.host;
        var path = url.pathname;
        var query =
            `BASE <${baseUrl}>
          PREFIX sosa: <http://www.w3.org/ns/sosa/>
  
          SELECT ?mac ?rssi ?resultTime
          FROM <${path}>
          WHERE {
            ?obs sosa:hasSimpleResult ?rssi .
            ?obs sosa:resultTime ?resultTime .
            BIND (substr(?obs, 38, 12) AS ?mac)
          } ORDER BY DESC(?rssi)`;

        urdf.clear();
        urdf.query(query).then(result => {
            callback(result);
        })

    }
    interpreter.setProperty(globalObject, 'queryReceiver', interpreter.createAsyncFunction(wrapper));

    // API function for the ibeacon-data block.
    var wrapper = function (table, key, value, retValue) {
        for (row of table) {
            if (row[key].value == value) {
                return row[retValue].value;
            }
        }

    }
    interpreter.setProperty(globalObject, 'getTableCell', interpreter.createNativeFunction(wrapper));

    // API function for the displayText block.
    var wrapper = function (text) {
        return displayText(text);
    };
    interpreter.setProperty(globalObject, 'displayText', interpreter.createNativeFunction(wrapper));

    // API function for the displayTable block.
    var wrapper = function (text) {
        return displayTable(text);
    };
    interpreter.setProperty(globalObject, 'displayTable', interpreter.createNativeFunction(wrapper));

    // API function for the httpRequestBlock.
    var wrapper = function (url, method, headersString, body, output, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        var headers = headersString.replace(/"/g, "").split(',');

        // parse headers from comma separated string
        for (header of headers) {
            values = header.split(':');

            xhr.setRequestHeader(values[0].trim(), values[1].trim());
        }

        xhr.addEventListener('load', (e) => {
            if (output == "status") {
                callback(xhr[output]);
            } else {
                urdf.clear();
                urdf.load(xhr.response)
                    .then(() => {
                        urdf.query('SELECT * WHERE {?s ?p ?o}')
                            .then((result) => {
                                callback(result);
                            })
                    })
            }
        });

        if (body) {
            xhr.send(JSON.stringify(body));

        } else {
            xhr.send();
        }

    }
    interpreter.setProperty(globalObject, 'sendHttpRequest', interpreter.createAsyncFunction(wrapper));

    // API function for urdf querying.
    var wrapper = function (uri, query, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", uri);
        xhr.addEventListener('load', (e) => {
            urdf.clear();
            urdf.load(xhr.response)
                .then(() => {
                    urdf.query(query)
                        .then((result) => {
                            callback(result);
                        })
                })
        })
        xhr.send();
    }
    interpreter.setProperty(globalObject, 'urdfQueryWrapper', interpreter.createAsyncFunction(wrapper));

    // API function for the switchLights block.
    var wrapper = function (mac, r, y, g, callback) {
        var r_byte = r ? "ff" : "00";
        var y_byte = y ? "ff" : "00";
        var g_byte = g ? "ff" : "00";

        var data = { 
            "type": "ble:Write", 
            "handle": "0009", 
            "data": {
                "@value": "7e000503" + r_byte + g_byte + y_byte + "00ef", 
                "@type": "xsd:hexBinary" 
            } 
        };

        fetch(`http://dw-station-5.local:8000/devices/${mac}/gatt/instruction`, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(data)
        }).then(res => {
            callback();
        })
    }
    interpreter.setProperty(globalObject, 'switchLights', interpreter.createAsyncFunction(wrapper))

    // API function for highlighting blocks.
    var wrapper = function (cat) {
        return playRandomSoundFromCategory(cat);
    };
    interpreter.setProperty(globalObject, 'playRandomSoundFromCategory', interpreter.createNativeFunction(wrapper));

    // API function for the event blocks.
    let eventValues = new Map();
    var wrapper = function (measurement, negate, operator, value, blockId) {



        prev_measurement = eventValues.get(blockId);

        // The first time eventblock with id blockId is executed, there's no stored values so return false
        if (eventValues.get(blockId) != undefined) {
            var s = `${negate}(!(${prev_measurement} ${operator} ${value})) && ${negate} (${measurement} ${operator} ${value})`;
            var event = eval(s);
            console.log(s);
            console.log(event);
            eventValues.set(blockId, measurement);
    
            return event;
        } else {
            eventValues.set(blockId, measurement);
            return false;
        }

    };
    interpreter.setProperty(globalObject, 'eventChecker', interpreter.createNativeFunction(wrapper));
}
