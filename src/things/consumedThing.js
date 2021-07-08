/* eslint-disable no-unused-vars */
/**
 * @fileoverview Interface for classes that represent ConsumedThings
 * (https://www.w3.org/TR/wot-scripting-api/#the-consumedthing-interface).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';
// TODO remove these classes, to ease things?
goog.provide('Blast.Things.ConsumedThing');

/**
 * Interface for a ConsumedThing, partially implementation of
 * (https://www.w3.org/TR/wot-scripting-api/#the-consumedthing-interface).
 * Not full
 * @interface
 * @public
 */
Blast.Things.ConsumedThing = function() {
};


/**
     * Reads a Property value.
     * @param {String} propertyName name of the property to read.
     * @param {Object=} options options.
     * @return {Promise} Promise Object, that resolves with a Property value
     */
Blast.Things.ConsumedThing.prototype.readProperty = async function(propertyName, options) {
  throw new Error('Method readProperty is not implemented.');
};

/**
   * Writes a single Property.
   * @param {String} propertyName name of the property to write to.
   * @param {String} value value to write.
   * @param {Object=} options options.
   * @return {Promise} Promise Object, that resolves on success and rejects on failure
   */
Blast.Things.ConsumedThing.prototype.writeProperty = async function(propertyName, value, options) {
  throw new Error('Method writeProperty is not implemented.');
};

/**
   * Makes a request for invoking an Action and return the result.
   * @param {String} actionName name of the action to invoke.
   * @param {Object=} params parameters for action to invoke.
   * @param {OBject=} options options.
   * @return {Promise} Promise Object, that resolves with the result of the Action.
   */
Blast.Things.ConsumedThing.prototype.invokeAction = async function(actionName, params, options) {
  throw new Error('Method invokeAction is not implemented.');
};

/**
   * Makes a request for subscribing to Event notifications.
   * @param {String} eventName name of the event.
   * @param {listener} listener the event listener.
   * @param {function=} onError function to invoke on error.
   * @param {Object=} options options.
   * @return {Promise} Promise Object signaling success or failure.
   */
Blast.Things.ConsumedThing.prototype.subscribeEvent = async function(
    eventName,
    listener,
    onError,
    options,
) {
  throw new Error('Method subscribeEvent is not implemented.');
};
