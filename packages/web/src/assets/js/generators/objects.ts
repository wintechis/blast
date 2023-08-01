/**
 * @fileoverview Generating JavaScript for Blast's object blocks.
 * @license https://www.gnu.org/licenses/agpl-3.0.de.html AGPLv3
 */

import {Block} from 'blockly';
import {javascriptGenerator as JavaScript} from 'blockly/javascript';

JavaScript['object_from_json'] = function (block: Block) {
  const jsonValue = JavaScript.valueToCode(
    block,
    'JSON',
    JavaScript.ORDER_ATOMIC
  );
  const code = 'JSON.parse(' + jsonValue + ')';
  return [code, JavaScript.ORDER_NONE];
};

JavaScript['object_to_json'] = function (block: Block) {
  const objectValue = JavaScript.valueToCode(
    block,
    'object',
    JavaScript.ORDER_ATOMIC
  );
  const code = 'JSON.stringify(' + objectValue + ')';
  return [code, JavaScript.ORDER_NONE];
};

JavaScript['object_create'] = function (block: Block) {
  if (!(block as any).numFields) {
    return ['{}', JavaScript.ORDER_NONE];
  }

  let fieldInitCode = '';
  for (let i = 1; i <= (block as any).numFields; i++) {
    if (i > 1) {
      fieldInitCode += ', ';
    }

    const fieldName = block.getFieldValue('field' + i);
    const fieldValue = JavaScript.valueToCode(
      block,
      'field_input' + i,
      JavaScript.ORDER_ATOMIC
    );
    fieldInitCode += '"' + fieldName + '": ' + fieldValue;
  }
  const code = '{ ' + fieldInitCode + ' }';

  return [code, JavaScript.ORDER_NONE];
};

JavaScript['object_keys'] = function (block: Block) {
  const objectValue = JavaScript.valueToCode(
    block,
    'object_input',
    JavaScript.ORDER_ATOMIC
  );
  const code = 'Object.keys(' + objectValue + ')';

  return [code, JavaScript.ORDER_ATOMIC];
};

JavaScript['object_get'] = function (block: Block) {
  const objectValue = JavaScript.valueToCode(
    block,
    'object_input',
    JavaScript.ORDER_ATOMIC
  );
  const property = JavaScript.valueToCode(
    block,
    'property_input',
    JavaScript.ORDER_ATOMIC
  );
  const code = objectValue + '[' + property + ']';

  return [code, JavaScript.ORDER_ATOMIC];
};
