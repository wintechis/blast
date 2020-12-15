const defaultToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'controls_repeat_ext'},
        {kind: 'BLOCK', type: 'controls_whileUntil'},
        {kind: 'BLOCK', type: 'controls_for'},
      ],
      name: 'Program',
      colour: '120',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'things'},
        {kind: 'BLOCK', type: 'receiver'},
        {kind: 'BLOCK', type: 'ibeacon_data'},
      ],
      name: 'Things',
      colour: '270',
    },
    {
      kind: 'CATEGORY',
      contents: [],
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '330',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'readdw'},
        {kind: 'BLOCK', type: 'writedw'},
        {kind: 'BLOCK', type: 'displayText'},
        {kind: 'BLOCK', type: 'displayTable'},
        {kind: 'BLOCK', type: 'httprequest'},
        {kind: 'BLOCK', type: 'sparql_query'},
        {kind: 'BLOCK', type: 'sparql_ask'},
        {kind: 'BLOCK', type: 'switchlights'},
        {kind: 'BLOCK', type: 'randomsound'},
        {kind: 'BLOCK', type: 'controls_flow_statements'},
        {kind: 'BLOCK', type: 'waitSeconds'},
      ],
      name: 'Actions',
      colour: '0',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'controls_if'},
        {kind: 'BLOCK', type: 'event'},
        {kind: 'BLOCK', type: 'logic_compare'},
        {kind: 'BLOCK', type: 'logic_operation'},
        {kind: 'BLOCK', type: 'logic_negate'},
      ],
      name: 'Logic',
      colour: '210',
    },
    {
      kind: 'CATEGORY',
      contents: [{kind: 'BLOCK', type: 'logic_boolean'}],
      name: 'Booleans',
      colour: '210',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'uri'},
        {kind: 'BLOCK', type: 'mac'},
        {kind: 'BLOCK', type: 'text'},
        {kind: 'BLOCK', type: 'text_join'},
      ],
      name: 'Text',
      colour: '160',
    },
    {
      kind: 'CATEGORY',
      contents: [
        {kind: 'BLOCK', type: 'math_number'},
        {kind: 'BLOCK', type: 'infinity'},
        {kind: 'BLOCK', type: 'math_arithmetic'},
        {kind: 'BLOCK', type: 'math_random_int'},
      ],
      name: 'Numbers',
      colour: '230',
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
