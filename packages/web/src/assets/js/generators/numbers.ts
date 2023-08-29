/**
 * @fileoverview Generating JavaScript for numbers blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

JavaScript.forBlock['number_value'] = JavaScript.forBlock['math_number'];
JavaScript.forBlock['number_arithmetic'] =
  JavaScript.forBlock['math_arithmetic'];
JavaScript.forBlock['number_single'] = JavaScript.forBlock['math_single'];
JavaScript.forBlock['number_trig'] = JavaScript.forBlock['math_trig'];
JavaScript.forBlock['number_constant'] = JavaScript.forBlock['math_constant'];
JavaScript.forBlock['number_property'] =
  JavaScript.forBlock['math_number_property'];
JavaScript.forBlock['number_round'] = JavaScript.forBlock['math_round'];
JavaScript.forBlock['number_on_list'] = JavaScript.forBlock['math_on_list'];
JavaScript.forBlock['number_modulo'] = JavaScript.forBlock['math_modulo'];
JavaScript.forBlock['number_constrain'] = JavaScript.forBlock['math_constrain'];
JavaScript.forBlock['number_random'] = JavaScript.forBlock['math_random_int'];
JavaScript.forBlock['number_random_float'] =
  JavaScript.forBlock['math_random_float'];
JavaScript.forBlock['number_atan2'] = JavaScript.forBlock['math_atan2'];

JavaScript.forBlock['parse_int'] = function (block: Block): [string, number] {
  const valueNumber = JavaScript.valueToCode(
    block,
    'number',
    JavaScript.ORDER_ATOMIC
  );
  const code = `parseInt(${valueNumber})`;
  return [code, JavaScript.ORDER_NONE];
};

JavaScript.forBlock['timestamp'] = function (block: Block): [string, number] {
  const code = 'Date.now()';
  return [code, JavaScript.ORDER_NONE];
};
