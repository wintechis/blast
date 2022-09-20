/**
 * @fileoverview Blocks definitions for the WebSpeech API, see
 * (https://wicg.github.io/speech-api/).
 * @author derwehr@gmail.com(Thomas Wehr)
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

'use strict';

import Blockly from 'blockly';
const {ALIGN_RIGHT, Blocks, dialog, FieldDropdown} = Blockly;
import {addBlock} from '../../blast_toolbox.js';

Blocks['text_to_speech'] = {
  /**
   * Block for outputting a string over audio output.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendValueInput('text')
      .appendField('text to speech')
      .setCheck('String');
    this.appendDummyInput()
      .appendField('language')
      .appendField(
        new FieldDropdown(
          [
            ['Afrikaans', 'af-ZA'],
            ['አማርኛ', 'am-ET'],
            ['Azərbaycanca', 'az-AZ'],
            ['বাংলা', 'bn'],
            ['Bahasa Indonesia', 'id-ID'],
            ['Bahasa Melayu', 'ms-MY'],
            ['Català', 'ca-ES'],
            ['Čeština', 'cs-CZ'],
            ['Dansk', 'da-DK'],
            ['Deutsch', 'de-DE'],
            ['English', 'en'],
            ['Español', 'es'],
            ['Euskara', 'eu'],
            ['Filipino', 'fil-PH'],
            ['Français', 'fr-FR'],
            ['Galego', 'gl-ES'],
            ['ગુજરાતી', 'gu-IN'],
            ['Hrvatski', 'hr-HR'],
            ['IsiZulu', 'zu-ZA'],
            ['Íslenska', 'is-IS'],
            ['Italiano', 'it'],
            ['ಕನ್ನಡ', 'kn-IN'],
            ['ភាសាខ្មែរ', 'km-KH'],
            ['Latviešu', 'lv-LV'],
            ['Lietuvių', 'lt-LT'],
            ['മലയാളം', 'ml-IN'],
            ['मराठी', 'mr-IN'],
            ['Magyar', 'hu-HU'],
            ['ລາວ', 'lo-LA'],
            ['Nederlands', 'nl-NL'],
            ['नेपाली भाषा', 'ne-NP'],
            ['Norsk bokmål', 'nb-NO'],
            ['Polski', 'pl-PL'],
            ['Português', 'pt'],
            ['Română', 'ro-RO'],
            ['සිංහල', 'si-LK'],
            ['Slovenščina', 'sk-SK'],
            ['Basa Sunda', 'su-ID'],
            ['Slovenčina', 'sk-SK'],
            ['Suomi', 'fi-FI'],
            ['Svenska', 'sv-SE'],
            ['Kiswahili', 'sw'],
            ['ქართული', 'ka-GE'],
            ['Հայերեն', 'hy-AM'],
            ['தமிழ்', 'ta'],
            ['తెలుగు', 'te-IN'],
            ['Tiếng Việt', 'vi-VN'],
            ['Türkçe', 'tr-TR'],
            ['اُردُو', 'ur'],
            ['Ελληνικά', 'el-GR'],
            ['български', 'bg-BG'],
            ['Pусский', 'ru-RU'],
            ['Српски', 'sr-RS'],
            ['한국어', 'ko-KR'],
            ['中文', 'cmn'],
            ['日本語', 'ja-JP'],
            ['हिन्दी', 'hi-IN'],
            ['ภาษาไทย', 'th-TH'],
          ],
          this.languageValidator
        ),
        'language'
      );
    this.appendDummyInput('bn')
      .appendField(
        new FieldDropdown([
          ['বাংলাদেশ', 'bn-BD'],
          ['ভারত', 'bn-IN'],
        ]),
        'bn'
      )
      .setVisible(false);
    this.appendDummyInput('en')
      .appendField(
        new FieldDropdown([
          ['Australia', 'en-AU'],
          ['Canada', 'en-CA'],
          ['India', 'en-IN'],
          ['Kenya', 'en-KE'],
          ['Tanzania', 'en-TZ'],
          ['Ghana', 'en-GH'],
          ['New Zealand', 'en-NZ'],
          ['Nigeria', 'en-NG'],
          ['South Africa', 'en-ZA'],
          ['Philippines', 'en-PH'],
          ['United Kingdom', 'en-GB'],
          ['United States', 'en-US'],
        ]),
        'en'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('es')
      .appendField(
        new FieldDropdown([
          ['Argentina', 'es-AR'],
          ['Bolivia', 'es-BO'],
          ['Chile', 'es-CL'],
          ['Colombia', 'es-CO'],
          ['Costa Rica', 'es-CR'],
          ['Ecuador', 'es-EC'],
          ['El Salvador', 'es-SV'],
          ['España', 'es-ES'],
          ['Estados Unidos', 'es-US'],
          ['Guatemala', 'es-GT'],
          ['Honduras', 'es-HN'],
          ['México', 'es-MX'],
          ['Nicaragua', 'es-NI'],
          ['Panamá', 'es-PA'],
          ['Paraguay', 'es-PY'],
          ['Perú', 'es-PE'],
          ['Puerto Rico', 'es-PR'],
          ['República Dominicana', 'es-DO'],
          ['Uruguay', 'es-UY'],
          ['Venezuela', 'es-VE'],
        ]),
        'es'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('it')
      .appendField(
        new FieldDropdown([
          ['Italia', 'it-IT'],
          ['Svizzera', 'it-CH'],
        ]),
        'it'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('pt')
      .appendField(
        new FieldDropdown([
          ['Brasil', 'pt-BR'],
          ['Portugal', 'pt-PT'],
        ]),
        'pt'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('sw')
      .appendField(
        new FieldDropdown([
          ['Tanzania', 'sw-TZ'],
          ['Kenya', 'sw-KE'],
        ]),
        'sw'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('ta')
      .appendField(
        new FieldDropdown([
          ['இந்தியா', 'ta-IN'],
          ['சிங்கப்பூர்', 'ta-SG'],
          ['இலங்கை', 'ta-LK'],
          ['மலேசியா', 'ta-MY'],
        ]),
        'ta'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('ur')
      .appendField(
        new FieldDropdown([
          ['پاکستان', 'ur-PK'],
          ['بھارت', 'ur-IN'],
        ]),
        'ur'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('cmn')
      .appendField(
        new FieldDropdown([
          ['普通话 (中国大陆)', 'cmn-Hans-CN'],
          ['普通话 (香港)', 'cmn-Hans-HK'],
          ['中文 (台灣)', 'cmn-Hant-TW'],
          ['粵語 (香港)', 'yue-Hant-HK'],
        ]),
        'cmn'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  countrySelectors: ['bn', 'en', 'es', 'it', 'pt', 'sw', 'ta', 'ur', 'cmn'],
  languageValidator: function (newValue) {
    this.getSourceBlock().updateCountrySelector(newValue);
    return newValue;
  },
  updateCountrySelector: function (value) {
    // hide all country selectors
    for (const selector of this.countrySelectors) {
      this.getInput(selector).setVisible(false);
    }
    // show the one for the language
    const input = this.getInput(value);
    if (input) {
      input.setVisible(true);
    }
  },
};

// Add the block to the toolbox.
addBlock('text_to_speech', 'Text Interface');

Blocks['web_speech'] = {
  /**
   * Block converting mic input into a string.
   * @this {Blockly.Block}
   */
  init: function () {
    this.appendDummyInput().appendField('speech to text');
    this.appendDummyInput()
      .appendField('language')
      .appendField(
        new FieldDropdown(
          [
            ['Afrikaans', 'af-ZA'],
            ['አማርኛ', 'am-ET'],
            ['Azərbaycanca', 'az-AZ'],
            ['বাংলা', 'bn'],
            ['Bahasa Indonesia', 'id-ID'],
            ['Bahasa Melayu', 'ms-MY'],
            ['Català', 'ca-ES'],
            ['Čeština', 'cs-CZ'],
            ['Dansk', 'da-DK'],
            ['Deutsch', 'de-DE'],
            ['English', 'en'],
            ['Español', 'es'],
            ['Euskara', 'eu'],
            ['Filipino', 'fil-PH'],
            ['Français', 'fr-FR'],
            ['Galego', 'gl-ES'],
            ['ગુજરાતી', 'gu-IN'],
            ['Hrvatski', 'hr-HR'],
            ['IsiZulu', 'zu-ZA'],
            ['Íslenska', 'is-IS'],
            ['Italiano', 'it'],
            ['ಕನ್ನಡ', 'kn-IN'],
            ['ភាសាខ្មែរ', 'km-KH'],
            ['Latviešu', 'lv-LV'],
            ['Lietuvių', 'lt-LT'],
            ['മലയാളം', 'ml-IN'],
            ['मराठी', 'mr-IN'],
            ['Magyar', 'hu-HU'],
            ['ລາວ', 'lo-LA'],
            ['Nederlands', 'nl-NL'],
            ['नेपाली भाषा', 'ne-NP'],
            ['Norsk bokmål', 'nb-NO'],
            ['Polski', 'pl-PL'],
            ['Português', 'pt'],
            ['Română', 'ro-RO'],
            ['සිංහල', 'si-LK'],
            ['Slovenščina', 'sk-SK'],
            ['Basa Sunda', 'su-ID'],
            ['Slovenčina', 'sk-SK'],
            ['Suomi', 'fi-FI'],
            ['Svenska', 'sv-SE'],
            ['Kiswahili', 'sw'],
            ['ქართული', 'ka-GE'],
            ['Հայերեն', 'hy-AM'],
            ['தமிழ்', 'ta'],
            ['తెలుగు', 'te-IN'],
            ['Tiếng Việt', 'vi-VN'],
            ['Türkçe', 'tr-TR'],
            ['اُردُو', 'ur'],
            ['Ελληνικά', 'el-GR'],
            ['български', 'bg-BG'],
            ['Pусский', 'ru-RU'],
            ['Српски', 'sr-RS'],
            ['한국어', 'ko-KR'],
            ['中文', 'cmn'],
            ['日本語', 'ja-JP'],
            ['हिन्दी', 'hi-IN'],
            ['ภาษาไทย', 'th-TH'],
          ],
          this.languageValidator
        ),
        'language'
      );
    this.appendDummyInput('bn')
      .appendField(
        new FieldDropdown([
          ['বাংলাদেশ', 'bn-BD'],
          ['ভারত', 'bn-IN'],
        ]),
        'bn'
      )
      .setVisible(false);
    this.appendDummyInput('en')
      .appendField(
        new FieldDropdown([
          ['Australia', 'en-AU'],
          ['Canada', 'en-CA'],
          ['India', 'en-IN'],
          ['Kenya', 'en-KE'],
          ['Tanzania', 'en-TZ'],
          ['Ghana', 'en-GH'],
          ['New Zealand', 'en-NZ'],
          ['Nigeria', 'en-NG'],
          ['South Africa', 'en-ZA'],
          ['Philippines', 'en-PH'],
          ['United Kingdom', 'en-GB'],
          ['United States', 'en-US'],
        ]),
        'en'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('es')
      .appendField(
        new FieldDropdown([
          ['Argentina', 'es-AR'],
          ['Bolivia', 'es-BO'],
          ['Chile', 'es-CL'],
          ['Colombia', 'es-CO'],
          ['Costa Rica', 'es-CR'],
          ['Ecuador', 'es-EC'],
          ['El Salvador', 'es-SV'],
          ['España', 'es-ES'],
          ['Estados Unidos', 'es-US'],
          ['Guatemala', 'es-GT'],
          ['Honduras', 'es-HN'],
          ['México', 'es-MX'],
          ['Nicaragua', 'es-NI'],
          ['Panamá', 'es-PA'],
          ['Paraguay', 'es-PY'],
          ['Perú', 'es-PE'],
          ['Puerto Rico', 'es-PR'],
          ['República Dominicana', 'es-DO'],
          ['Uruguay', 'es-UY'],
          ['Venezuela', 'es-VE'],
        ]),
        'es'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('it')
      .appendField(
        new FieldDropdown([
          ['Italia', 'it-IT'],
          ['Svizzera', 'it-CH'],
        ]),
        'it'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('pt')
      .appendField(
        new FieldDropdown([
          ['Brasil', 'pt-BR'],
          ['Portugal', 'pt-PT'],
        ]),
        'pt'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('sw')
      .appendField(
        new FieldDropdown([
          ['Tanzania', 'sw-TZ'],
          ['Kenya', 'sw-KE'],
        ]),
        'sw'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('ta')
      .appendField(
        new FieldDropdown([
          ['இந்தியா', 'ta-IN'],
          ['சிங்கப்பூர்', 'ta-SG'],
          ['இலங்கை', 'ta-LK'],
          ['மலேசியா', 'ta-MY'],
        ]),
        'ta'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('ur')
      .appendField(
        new FieldDropdown([
          ['پاکستان', 'ur-PK'],
          ['بھارت', 'ur-IN'],
        ]),
        'ur'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.appendDummyInput('cmn')
      .appendField(
        new FieldDropdown([
          ['普通话 (中国大陆)', 'cmn-Hans-CN'],
          ['普通话 (香港)', 'cmn-Hans-HK'],
          ['中文 (台灣)', 'cmn-Hant-TW'],
          ['粵語 (香港)', 'yue-Hant-HK'],
        ]),
        'cmn'
      )
      .setAlign(ALIGN_RIGHT)
      .setVisible(false);
    this.setOutput(true, 'String');
    this.setColour(160);
    this.setTooltip('outputs speech command from microphone as a string');
    this.setHelpUrl('');
    this.firstTime = true;
  },
  countrySelectors: ['bn', 'en', 'es', 'it', 'pt', 'sw', 'ta', 'ur', 'cmn'],
  languageValidator: function (newValue) {
    this.getSourceBlock().updateCountrySelector(newValue);
    return newValue;
  },
  updateCountrySelector: function (value) {
    // hide all country selectors
    for (const selector of this.countrySelectors) {
      this.getInput(selector).setVisible(false);
    }
    // show the one for the language
    const input = this.getInput(value);
    if (input) {
      input.setVisible(true);
    }
  },
  onchange: function () {
    // on creating this block check speech API availability
    if (!this.isInFlyout && this.firstTime && this.rendered) {
      this.firstTime = false;
      if (!('webkitSpeechRecognition' in window)) {
        dialog.alert(`Web Speech API is not supported by this browser.
        Upgrade to <a href="//www.google.com/chrome">Chrome</a>
        version 25 or later.`);
        this.dispose();
      }
    }
  },
};

// Add the block to the toolbox.
addBlock('web_speech', 'Text Interface');
