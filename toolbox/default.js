const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'repeat'},
        {kind: 'BLOCK', type: 'while_until'},
        {kind: 'BLOCK', type: 'for'},
        {kind: 'BLOCK', type: 'break_continue'},
      ],
      name: 'Control Flow',
      colour: '120',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'http_request'},
        {kind: 'BLOCK', type: 'sparql_query'},
        {kind: 'BLOCK', type: 'sparql_ask'},
        {kind: 'BLOCK', type: 'display_text'},
        {kind: 'BLOCK', type: 'display_table'},
        {kind: 'BLOCK', type: 'switch_lights'},
        {kind: 'BLOCK', type: 'random_sound'},
        {kind: 'BLOCK', type: 'wait_seconds'},
      ],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'ibeacon_data'},
      ],
      name: 'Things',
      colour: '330',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'conditional_statement'},
        {kind: 'BLOCK', type: 'event'},
        {kind: 'BLOCK', type: 'logic_compare'},
        {kind: 'BLOCK', type: 'logic_operation'},
        {kind: 'BLOCK', type: 'logic_negate'},
      ],
      name: 'Conditions',
      colour: '210',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'string'},
        {kind: 'BLOCK', type: 'string_join'},
        {kind: 'BLOCK', type: 'string_length'},
        {kind: 'BLOCK', type: 'string_indexOf'},
        {kind: 'BLOCK', type: 'string_charAt'},
        {kind: 'BLOCK', type: 'string_getSubstring'},
        {kind: 'BLOCK', type: 'string_changeCase'},
        {kind: 'BLOCK', type: 'string_replace'},
      ],
      name: 'Strings',
      colour: '160',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'uri'},
        {kind: 'BLOCK', type: 'mac'},
      ],
      name: 'Identifiers',
      colour: '60',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'number_value'},
        {kind: 'BLOCK', type: 'number_infinity'},
        {kind: 'BLOCK', type: 'number_arithmetic'},
        {kind: 'BLOCK', type: 'number_random'},
      ],
      name: 'Numbers',
      colour: '230',
    },
    {
      kind: 'CATEGORY',
      contents: [{kind: 'BLOCK', type: 'logic_boolean'}],
      name: 'Booleans',
      colour: '210',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '330',
    },
    {
      kind: 'sep',
      gap: '32',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Functions',
      colour: '290',
      custom: 'PROCEDURE',
    },
  ],
};
