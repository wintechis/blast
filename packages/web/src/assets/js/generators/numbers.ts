/**
 * @fileoverview Generating JavaScript for numbers blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

JavaScript['number_value'] = JavaScript['math_number'];
JavaScript['number_arithmetic'] = JavaScript['math_arithmetic'];
JavaScript['number_single'] = JavaScript['math_single'];
JavaScript['number_trig'] = JavaScript['math_trig'];
JavaScript['number_constant'] = JavaScript['math_constant'];
JavaScript['number_property'] = JavaScript['math_number_property'];
JavaScript['number_round'] = JavaScript['math_round'];
JavaScript['number_on_list'] = JavaScript['math_on_list'];
JavaScript['number_modulo'] = JavaScript['math_modulo'];
JavaScript['number_constrain'] = JavaScript['math_constrain'];
JavaScript['number_random'] = JavaScript['math_random_int'];
JavaScript['number_random_float'] = JavaScript['math_random_float'];
JavaScript['number_atan2'] = JavaScript['math_atan2'];

JavaScript['parse_int'] = function (block: Block): [string, number] {
  const valueNumber = JavaScript.valueToCode(
    block,
    'number',
    JavaScript.ORDER_ATOMIC
  );
  const code = `parseInt(${valueNumber})`;
  return [code, JavaScript.ORDER_NONE];
};
