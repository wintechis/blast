/**
 * @fileoverview sc-ble-adapter thing implementation, see
 * github.com/wintechis/sc-ble-adapter.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
goog.provide('Blast.Things.ConsumedThing.sc_ble_adapter');

goog.require('Blast.Things.ConsumedThing');
 
/**
  * Class representing the sc-ble-adapter
  * @param {String} URI the sc-ble-adapter's URI.
  * @constructor
  * @implements {ConsumedThing}
  */
Blast.Things.ConsumedThing.sc_ble_adapter = function(URI) {
  this.URI = URI;
};
 
Blast.Things.ConsumedThing.sc_ble_adapter.prototype.readProperty = function(propertyName, options) {
  const requestOptions = {
    method: 'GET',
  };

  return fetch(this.URI, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        const currentGraph = JSON.parse(resData)['@graph'];
        console.log(currentGraph);
        let found = false;
        for (const node of currentGraph) {
          if (node.id == '#' + options.mac) {
            found = true;
            return node[propertyName];
          }
        }
        if (!found) {
          Blast.throwError(`${mac} not found.`);
        }
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};
 
