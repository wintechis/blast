/**
 * defines an API for the JS Interpreter.
 * For more information, see
 * https://github.com/NeilFraser/JS-Interpreter
 * @param {!Interpreter} interpreter interpreter object.
 * @param {!Interpreter.Object} globalObject global scope object.
 */
function initApi(interpreter, globalObject) {
  // Ensure function names do not conflict with letiable names.
  Blockly.JavaScript.addReservedWords(
      'highlightBlock',
      'queryReceiver',
      'getTableCell',
      'displayText',
      'displayTable',
  );

  // Add an API function for highlighting blocks.
  let wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(Blast.highlightBlock(id));
  };
  interpreter.setProperty(
      globalObject,
      'highlightBlock',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the ibeacon-data block.
  wrapper = function(address, key, value, retValue, callback) {
    const url = new URL(address);
    const baseUrl = url.protocol + '//' + url.host;
    const path = url.pathname;
    const query = `BASE <${baseUrl}>
          PREFIX sosa: <http://www.w3.org/ns/sosa/>
  
          SELECT ?mac ?rssi ?resultTime
          FROM <${path}>
          WHERE {
            ?obs sosa:hasSimpleResult ?rssi .
            ?obs sosa:resultTime ?resultTime .
            BIND (substr(?obs, 31, 12) AS ?mac)
          } ORDER BY DESC(?rssi)`;

    urdf.clear();
    urdf.query(query).then((result) => {
      for (const row of result) {
        if (row[key].value == value) {
          callback(row[retValue].value);
        }
      }
    });
  };

  interpreter.setProperty(
      globalObject,
      'getTableCell',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the displayText block.
  wrapper = function(text) {
    return Blast.displayText(text);
  };
  interpreter.setProperty(
      globalObject,
      'displayText',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the displayTable block.
  wrapper = function(text) {
    return Blast.displayTable(text);
  };
  interpreter.setProperty(
      globalObject,
      'displayTable',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the httpRequestBlock.
  wrapper = function(uri, method, headersString, body, output, callback) {
    const headersJSON = JSON.parse(headersString);
    const requestOptions = {
      method: method,
      headers: new Headers(headersJSON),
    };

    if (body) {
      requestOptions.body = body;
    }

    fetch(uri, requestOptions)
        .then((res) => {
          if (output == 'status') {
            callback(res.status);
            Promise.resvole();
          }
          return res.text();
        })
        .then((resData) => {
          urdf.clear();
          urdf.load(resData).then(() => {
            urdf
                .query('SELECT * WHERE {?subject ?predicate ?object}')
                .then((result) => {
                  callback(result);
                });
          });
        });
  };
  interpreter.setProperty(
      globalObject,
      'sendHttpRequest',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for urdf querying.
  wrapper = function(uri, query, callback) {
    fetch(uri)
        .then((res) => {
          return res.text();
        })
        .then((graph) => {
          urdf.clear();
          urdf.load(graph).then(() => {
            urdf.query(query).then((result) => {
              callback(result);
            });
          });
        });
  };
  interpreter.setProperty(
      globalObject,
      'urdfQueryWrapper',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the switch_lights block.
  wrapper = function(mac, r, y, g, callback) {
    const redByte = r ? 'ff' : '00';
    const yellowByte = y ? 'ff' : '00';
    const greenByte = g ? 'ff' : '00';

    const data = {
      type: 'ble:Write',
      handle: '0009',
      data: {
        '@value': '7e000503' + redByte + greenByte + yellowByte + '00ef',
        '@type': 'xsd:hexBinary',
      },
    };

    fetch(`http://dwpi4.local:8000/devices/${mac}/instruction`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: '{ "type": "ble:Connect" }',
    }).then(() => {
      fetch(`http://dwpi4.local:8000/devices/${mac}/gatt/instruction`, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      }).then(() => {
        fetch(`http://dwpi4.local:8000/devices/${mac}/instruction`, {
          method: 'PUT',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: '{ "type": "ble:Disconnect" }',
        }).then(() => {
          callback();
        });
      });
    });
  };

  interpreter.setProperty(
      globalObject,
      'switchLights',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for waitSeconds block.
  wrapper = interpreter.createAsyncFunction(function(timeInSeconds, callback) {
    // Delay the call to the callback.
    setTimeout(callback, timeInSeconds * 1000);
  });
  interpreter.setProperty(globalObject, 'waitForSeconds', wrapper);

  // API function for highlighting blocks.
  wrapper = function(cat) {
    return playRandomSoundFromCategory(cat);
  };
  interpreter.setProperty(
      globalObject,
      'playRandomSoundFromCategory',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the event blocks.
  const eventValues = new Map();
  wrapper = function(measurement, negate, operator, value, blockId) {
    const prevMeasurement = eventValues.get(blockId);

    // The first time eventblock with id blockId is executed,
    // there's no stored values so return false
    if (eventValues.get(blockId) != undefined) {
      const wasNotBefore = `!(${prevMeasurement} ${operator} ${value})`;
      const isNow = `${negate} (${measurement} ${operator} ${value}`;
      const s = `${negate}(${wasNotBefore}) && ${isNow})`;
      const event = eval(s);
      eventValues.set(blockId, measurement);

      return event;
    } else {
      eventValues.set(blockId, measurement);
      return false;
    }
  };
  interpreter.setProperty(
      globalObject,
      'eventChecker',
      interpreter.createNativeFunction(wrapper),
  );

  // API function for the readDw block.
  wrapper = function(mac, callback) {
    const url = `http://192.168.178.22:8000/devices/${mac}/gatt/instruction`;
    let headers = 'Content-Type: application/json';
    const body = {handle: '001f', type: 'ble:Read'};

    headers = headers.split(':');

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader(headers[0].trim(), headers[1].trim());

    xhr.addEventListener('load', (e) => {
      callback(JSON.parse(xhr.response).result.utf8);
    });

    if (body) {
      console.log(JSON.stringify(body));
      return xhr.send(JSON.stringify(body));
    } else {
      return xhr.send();
    }
  };
  interpreter.setProperty(
      globalObject,
      'getDwValuesOfMac',
      interpreter.createAsyncFunction(wrapper),
  );

  // API function for the readDw block.
  wrapper = function(mac, value, callback) {
    const url = `http://192.168.178.22:8000/devices/${mac}/gatt/instruction`;
    let headers = 'Content-Type: application/json';
    const body = {
      handle: '001f',
      type: 'ble:Write',
      data: {'@type': 'xsd:string', '@value': value},
    };

    headers = headers.split(':');

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader(headers[0].trim(), headers[1].trim());

    xhr.addEventListener('load', (e) => {
      callback(xhr.status);
    });

    if (body) {
      console.log(JSON.stringify(body));
      return xhr.send(JSON.stringify(body));
    } else {
      return xhr.send();
    }
  };
  interpreter.setProperty(
      globalObject,
      'setDwValuesOfMac',
      interpreter.createAsyncFunction(wrapper),
  );
}
