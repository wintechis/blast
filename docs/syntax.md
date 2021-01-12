# Syntax <!-- omit in toc -->

This section gives an overview of the syntax used in BLAST.
For a formal description using [EBNF](https://www.w3.org/TR/2010/REC-xquery-20101214/#EBNFNotation), see [Extended Backus-Naur Form](#extended-backus-naur-form). For a quick overview of each blocks' inputs and outputs check out the [block syntax](#block-syntax) section below. 

- [Extended Backus-Naur Form](#extended-backus-naur-form)
  - [block programs](#block-programs)
  - [control flow](#control-flow)
  - [actions](#actions)
  - [boolean expressions](#boolean-expressions)
  - [strings](#strings)
  - [numbers](#numbers)
  - [booleans](#booleans)
  - [symbols](#symbols)
- [block syntax](#block-syntax)
  - [control flow](#control-flow-1)
    - [repeat](#repeat)
    - [while_until](#while_until)
    - [for](#for)
  - [actions](#actions-1)
  - [variables blocks syntax](#variables-blocks-syntax)
    - [variables set syntax](#variables-set-syntax)
    - [variables get syntax](#variables-get-syntax)
    - [variables change syntax](#variables-change-syntax)
  - [action blocks syntax](#action-blocks-syntax)
    - [display string syntax](#display-string-syntax)
    - [display table syntax](#display-table-syntax)
    - [switch lights syntax](#switch-lights-syntax)
    - [random sound syntax](#random-sound-syntax)
    - [halt syntax](#halt-syntax)
  - [logic blocks syntax](#logic-blocks-syntax)
    - [comparison syntax](#comparison-syntax)
    - [AND / OR syntax](#and--or-syntax)
    - [not syntax](#not-syntax)
    - [if / if-else syntax](#if--if-else-syntax)
    - [event syntax](#event-syntax)
  - [boolean blocks syntax](#boolean-blocks-syntax)
    - [boolean_value syntax](#boolean_value-syntax)
  - [string blocks syntax](#string-blocks-syntax)
      - [URI syntax](#uri-syntax)
      - [mac syntax](#mac-syntax)
    - [string_value syntax](#string_value-syntax)
    - [string_concat syntax](#string_concat-syntax)
  - [number blocks syntax](#number-blocks-syntax)
    - [number_value syntax](#number_value-syntax)
    - [infinity syntax](#infinity-syntax)
    - [arithmetic operations syntax](#arithmetic-operations-syntax)
    - [random integer syntax](#random-integer-syntax)

# Extended Backus-Naur Form

The following describes BLAST's syntax using the [W3C EBNF Notation](https://www.w3.org/TR/2010/REC-xquery-20101214/#EBNFNotation).

## block programs

<pre>
<a name='ebnf-block_program'></a>block_program            ::= <a href='#ebnf-statement'>statement</a>+
<a name='ebnf-statement'></a>statement                ::= ( <a href='#ebnf-control_flow_flow_statement'>control_flow_statement</a> | <a href='ebnf-action_statement'>action_statement</a> | <a href='ebnf-function'>function</a> )
</pre>

## control flow
<pre>
<a name='ebnf-flow_statement'></a>control_flow_statement   ::= ( <a href='ebnf-repeat'>repeat</a> | <a href='ebnf-while_until'>while_until</a> | <a href='ebnf-for'>for</a> | <a href='ebnf-conditional_statement'>conditional_statement</a> | <a href=''>break</a>)
<a name='ebnf-conditional_statement'></a>conditional_statement    ::= if <a href='#ebnf-boolean_expression'>boolean_expression</a> then do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-repeat'></a>repeat                   ::= repeat <a href='#ebnf-number'>number</a> times do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-while_until'></a>while_until              ::= repeat ( while | until ) <a href='#ebnf-conditional_statement'>conditional_statement</a> do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-for'></a>for                      ::= count with var from <a href='#ebnf-number'>number</a> to <a href='#ebnf-number'>number</a> by <a href='#ebnf-number'>number</a> do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf_break'></a>break                    ::= ( break; | continue; )
</pre>

## actions
<pre>
<a name='ebnf-action_statement'></a>action_statement         ::= ( <a href='#ebnf-display_text'>display_text</a> | <a href='#ebnf-display_table'>display_table</a> | <a href='#ebnf-switch_lights'>switch_lights</a> | <a href='#ebnf-play_sound'>play_sound</a> | <a href='#ebnf-halt'>halt</a> | <a href='ebnf-wait'>wait</a> )
<a name='ebnf-display_text'></a>display_text             ::= displayText ( ( <a href='#ebnf-string'>string</a> | <a href='#ebnf-number'>number</a> ) )
<a name='ebnf-display_table'></a>display_table            ::= displayData ( <a href='#ebnf-table'>table</a> )
<a name='ebnf-switch_lights'></a>switch_lights            ::= switchLights ( <a href='#ebnf-mac'>mac</a> , <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a> , <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a> , <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a> )
<a name='ebnf-play_sound'></a>play_sound               ::= playRandomSoundFromCategory ( ( 'happy' | 'sad') )
<a name='ebnf_wait'></a>wait                     ::= waitForSeconds( <a href='#ebnf-number'>number</a> )
<a name='ebnf-http_request'></a>http_request             ::= sendHttpRequest( <a href='ebnf-URI'>URI</a>, ( 'GET' | 'PUT' | 'POST' | 'DELETE' ), <a href='#ebnf-string_value'>string_value</a>, <a href='#ebnf-string_value'>string_value</a>, ( 'status' | 'response' ) )
<a name='ebnf-sparql_query'></a>sparql_query             ::= urdfQueryWrapper( <a href='ebnf-URI'>URI</a>, <a href='#ebnf-string'>string</a> )
<a name='ebnf-sparql_ask'></a>sparql_ask               ::= urdfQueryWrapper( <a href='ebnf-URI'>URI</a>, <a href='#ebnf-string'>string</a> )
</pre>

## boolean expressions
<pre>
<a name='ebnf-boolean_expression'></a>boolean_expression       ::= ( <a href='#ebnf-comparison'>comparison</a> | <a href='#ebnf-logical-comparison'>logical_operation</a> | <a href='#ebnf-boolean_value'>boolean_value</a> | <a href='#ebnf-not'>not</a> )
<a name='ebnf-comparison'></a>comparison               ::= ( <a href='#ebnf-number'>number</a> | <a href='#ebnf-string'>string</a> ) ( <a href='#ebnf-number'>number</a> | <a href='#ebnf-string'>string</a> )
<a name='ebnf-logical-comparison'></a>logical_operation        ::= <a href='#ebnf-boolean_expression'>boolean_expression</a> <a href='#ebnf-boolean_expression'>boolean_expression</a>
<a name='ebnf-not'></a>not                      ::= <a href='#ebnf-boolean_expression'>boolean_expression</a>
</pre>

## strings
<pre>
<a name='ebnf-string'></a>string                   ::= ( <a href='#ebnf-string_value'>string_value</a> | <a href='#ebnf-string_operation'>string_operation</a> )
<a name='ebnf-string_value'></a>string_value             ::= <a href='#ebnf-String_Literal'>String_Literal</a>  
<a name='ebnf-string_operation'></a>string_operation         ::= ( <a href='string_concat'>string_concat</a> | <a href='string_length'>string_length</a> | <a href='ebnf-string_index_of'>string_index_of</a> | <a href='ebnf-string_char_at'>string_char_at</a> | <a href='ebnf-string_substring'>string_substring</a> | <a href='ebnf-string_change_case'>string_change_case</a> | <a href='ebnf-string_replace'>string_replace</a> )
<a name='ebnf-string_concat'></a>string_concat            ::= <a href='#ebnf-string'>string</a> (<a href='#ebnf-string'>string</a>)+
<a name='ebnf-string_length'></a>string_length            ::= <a href='ebnf-string'>string</a>
<a name='ebnf-string_index_of'></a>string_index_of          ::= <a href='ebnf-string'>string</a> <a href='ebnf-string'>string</a>
<a name='ebnf-string_char_at'></a>string_char_at           ::= <a href='ebnf-string'>string</a> <a href='#ebnf-number'>number</a>
<a name='ebnf-string_substring'></a>string_substring         ::= <a href='ebnf-string'>string</a> <a href='#ebnf-number'>number</a> <a href='#ebnf-number'>number</a>
<a name='ebnf-string_change_case'></a>string_change_case       ::= <a href='ebnf-string'>string</a>
<a name='ebnf-string_replace'></a>string_replace           ::= <a href='ebnf-string'>string</a> <a href='ebnf-string'>string</a> <a href='ebnf-string'>string</a>
</pre>


## numbers
<pre>
<a name='ebnf-number'></a>number                   ::= ( <a href='#ebnf-number_value'>number_value</a> | <a href='#ebnf-number_infinity'>number_infinity</a> | <a href='#ebnf-number_arithmetic'>number_arithmetic</a> | <a href='#ebnf-number_random'>number_random</a> )
<a name='ebnf-number_value'></a>number_value             ::= <a href='#ebnf-Double_Literal'>Double_Literal</a>
<a name='ebnf-infinity'></a>number_infinity          ::= <a href='#ebnf-Double_Literal'>Double_Literal</a>
<a name='ebnf-arithmeti-operations'></a>number_arithmetic        ::= <a href='#ebnf-number'>number</a> '+' | '-' | 'x' | '÷' | '^' <a href='#ebnf-number'>number</a>
<a name='ebnf-number_random'></a>number_random            ::= <a href='#ebnf-number'>number</a> <a href='#ebnf-number'>number</a>
</pre>

## booleans
<pre>
<a name='ebnf-boolean_value'></a>boolean_value            ::= <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a>
</pre>

## symbols
<pre>
<a name='ebnf-URI'></a>URI                      ::= <a href='#ebnf-String_Literal'>String_Literal</a>
<a name='ebnf-MAC'></a>MAC                      ::= <a href='#ebnf-String_Literal'>String_Literal</a>
<a name='ebnf-String_Literal'></a>String_Literal           ::= /* any visible character and the white-space character, no termination characters */
<a name='ebnf-Double_Literal'></a>Double_Literal           ::= (('.' <a href='#ebnf-Digits'>Digits</a>) | (<a href='#ebnf-Digits'>Digits</a> ('.' [0-9]*)?)) [eE] [+-]? <a href='#ebnf-Digits'>Digits</a>
<a name='ebnf-Digits'></a>Digits                   ::= [0-9]+
<a name='ebnf-Boolean_Literal'></a>Boolean_Literal          ::= true | false
</pre>

# block syntax

TODO