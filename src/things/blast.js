/**
 * @fileoverview blast thing implementation,
 * provides access to blast's properties, actions and events.
 * @author derwehr@gmail.com (Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */
goog.provide('Blast.Things.ConsumedThing.Blast');

goog.require('Blast.Things.ConsumedThing');

/**
  * Class representing blast.
  * @constructor
  * @implements {ConsumedThing}
  */
Blast.Things.ConsumedThing.Blast = function() {
};

Blast.Things.ConsumedThing.Blast.prototype.invokeAction =
async function(actionName, params, options) {
  const action = Blast.Things.ConsumedThing.Blast.actions.get(actionName);
  const returnVal = await action(...params);
  return returnVal;
};

/**
 * Sends a HTTP request to URI returning the status or the response
 * depending on the output parameter.
 * @param {string} uri URI to request.
 * @param {string} method HTTP request method.
 * @param {string} headersString JSON string containing headers.
 * @param {string=} body JSON string containing body, optional.
 * Not needed when method is GET.
 * @param {string} output Output can be status or response.
 * @returns {string} the response status code or body, depending on output parameter.
 * @private
 */
Blast.Things.ConsumedThing.Blast.sendHttpRequest = async function(
    uri, method, headersString, body, output) {
  if (uri == null || uri == undefined || uri == '') {
    Blast.throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: method,
    headers: new Headers(headersJSON),
  };

  if (body) {
    requestOptions.body = body;
  }

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        if (output == 'status') {
          return res.status;
        }
        return res.text();
      })
      .then((resData) => {
        urdf.clear();
        urdf.load(resData).then(() => {
          urdf.query('SELECT * WHERE {?subject ?predicate ?object}').then((result) => {
            return result;
          });
        });
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};

// temporary method for the th-praxistag works for getting integer values only
// TODO remove or fix after praxistag
Blast.Things.ConsumedThing.Blast.getRequest = async function(uri, headersString) {
  if (uri == null || uri == undefined || uri == '') {
    Blast.throwError('URI input of HttpRequest blocks must not be empty');
  }

  const headersJSON = JSON.parse(headersString);
  const requestOptions = {
    method: 'GET',
    headers: new Headers(headersJSON),
  };

  fetch(uri, requestOptions)
      .then(Blast.handleFetchErrors)
      .then((res) => {
        return res.text();
      })
      .then((resData) => {
        console.log(resData);
        callback(parseInt(resData));
      })
      .catch((error) => {
        Blast.throwError(`${error.message}\nSee console for details.`);
      });
};

/**
 * Wrapper for urdf's query function.
 * @param {*} uri URI to query.
 * @param {*} query Query to execute.
 * @public
 */
Blast.Things.ConsumedThing.Blast.urdfQueryWrapper = async function(uri, query) {
  urdf.clear();

  // write uri into FROM clause of the query as a workaround for
  // https://github.com/vcharpenay/uRDF.js/issues/21#issuecomment-802860330
  const fromClause = `\n FROM <${uri}>\n`;
  query = query.slice(0, query.indexOf('WHERE')) + fromClause + query.slice(query.indexOf('WHERE'));

  urdf.query(query).then((result) => {
    return result;
  });
};

/**
 * Plays an audio file provided by URI.
 * @param {string} uri URI of the audio file to play.
 * @returns {Promise} resolves on end of audio playback.
 * @public
 */
Blast.Things.ConsumedThing.Blast.playAudio = async function(uri) {
  console.log(uri);
  await new Promise((resolve, reject) => {
    const audio = new Audio(uri);
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.onerror = ((error) => {
      Blast.throwError(`Error trying to play audio from \n${uri}\n See console for details`);
      console.error(error);
      reject(error);
    });
    audio.onended = resolve;
  });
  return;
};

/**
 * Invokes a SpeechSynthesisUtterance to read out a text.
 * @param {string} text text that will be synthesised when the utterance is spoken.
 * @param {SpeechSynthesisVoice=} voice voice that will be used to speak the utterance.
 * @param {Number=} rate speed at which the utterance will be spoken at
 * @param {Number=} volume volume that the utterance will be spoken at.
 * @param {Number=} pitch pitch at which the utterance will be spoken at
 * @param {string} lang language of the utterance.
 */
Blast.Things.ConsumedThing.Blast.textToSpeech = async function(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  window.speechSynthesis.speak(speech);
  // return after speaking has ended
  await new Promise((resolve) => {
    speech.onend = resolve;
  });
};

/**
 * Instance of a Blast-Thing, used by methods in src/blast_blockmethods.js.
 */
Blast.Things.ConsumedThing.Blast.blast = new Blast.Things.ConsumedThing.Blast();

/**
 * Maps actionName to function name.
 */
Blast.Things.ConsumedThing.Blast.actions = new Map([
  ['displayText', Blast.Ui.addMessage],
  ['displayTable', Blast.Ui.addElementToOutputContainer],
  ['sendHttpRequest', Blast.Things.ConsumedThing.Blast.sendHttpRequest],
  ['getRequest', Blast.Things.ConsumedThing.Blast.getRequest],
  ['queryRDF', Blast.Things.ConsumedThing.Blast.urdfQueryWrapper],
  ['playAudioFromURI', Blast.Things.ConsumedThing.Blast.playAudio],
  ['textToSpeech', Blast.Things.ConsumedThing.Blast.textToSpeech],
]);
