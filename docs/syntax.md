# Syntax <!-- omit in toc -->

This section gives an overview of the syntax used in BLAST.
For a formal description using [EBNF](https://www.w3.org/TR/2010/REC-xquery-20101214/#EBNFNotation), see [Extended Backus-Naur Form](#extended-backus-naur-form). For a quick overview of each blocks' inputs and outputs check out the [block syntax](#block-syntax) section below. 

- [1. Extended Backus-Naur Form](#1-extended-backus-naur-form)
  - [1.1. block programs](#11-block-programs)
  - [1.2. loops](#12-loops)
  - [1.3. actions](#13-actions)
  - [1.4. conditions](#14-conditions)
  - [1.5. text blocks](#15-text-blocks)
  - [1.6. number blocks](#16-number-blocks)
  - [1.7. booleans blocks](#17-booleans-blocks)
  - [1.8. Symbols](#18-symbols)
- [2. block syntax](#2-block-syntax)

# 1. Extended Backus-Naur Form

The following describes BLAST's syntax using the [W3C EBNF Notation](https://www.w3.org/TR/2010/REC-xquery-20101214/#EBNFNotation).

## 1.1. block programs

<pre>
<a name='ebnf-block_program'></a>block_program            ::= <a href='#ebnf-statement'>statement</a>+
<a name='ebnf-statement'></a>statement                ::= ( <a href='#ebnf-loop'>loop</a> | <a href='ebnf-action_statement'>action_statement</a> | <a href='ebnf-conditional_statement'>conditional_statement</a> | <a href='ebnf-function'>function</a> )
</pre>

## 1.2. loops
<pre>
<a name='ebnf-loop'></a>loop                     ::= ( <a href='ebnf-loops_repeat'>loops_repeat</a> | <a href='ebnf-loops_while_until'>loops_while_until</a> | <a href='ebnf-loops_for'>loops_for</a> )
<a name='ebnf-loops_repeat'></a>loops_repeat                   ::= repeat <a href='#ebnf-number'>number</a> times do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-loops_while_until'></a>loops_while_until               ::= repeat ( while | until ) <a href='#ebnf-conditional_statement'>conditional_statement</a> do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-loops_for'></a>loops_for                      ::= count with var from <a href='#ebnf-number'>number</a> to <a href='#ebnf-number'>number</a> by <a href='#ebnf-number'>number</a> do <a href='#ebnf-statement'>statement</a>*
</pre>

## 1.3. actions
<pre>
<a name='ebnf-action_statement'></a>action_statement         ::= ( <a href='#ebnf-display_text'>display_text</a> | <a href='#ebnf-display_table'>display_table</a> | <a href='#ebnf-switch_lights'>switch_lights</a> | <a href='#ebnf-play_sound'>play_sound</a> | <a href='#ebnf-halt'>halt</a> | <a href='ebnf-break'>break</a> | <a href='ebnf-wait'>wait</a> )
<a name='ebnf-display_text'></a>display_text             ::= displayText ( ( <a href='#ebnf-text'>text</a> | <a href='#ebnf-number'>number</a> ) )
<a name='ebnf-display_table'></a>display_table            ::= displayData ( <a href='#ebnf-table'>table</a> )
<a name='ebnf-switch_lights'></a>switch_lights            ::= switch_lights ( <a href='#ebnf-mac'>mac</a> , <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a> , <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a> , <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a> )
<a name='ebnf-play_sound'></a>play_sound               ::= playRandomSoundFromCategory ( ( 'happy' | 'sad') )
<a name='ebnf_break'></a>break                    ::= ( break | continue )
<a name='ebnf_wait'></a>wait                     ::= waitForSeconds( <a href='#ebnf-number'>number</a> )
<a name='ebnf-http_request'></a>http_request             ::= sendHttpRequest( <a href='ebnf-URI'>URI</a>, ( 'GET' | 'PUT' | 'POST' | 'DELETE' ), <a href='#ebnf-text_value'>text_value</a>, <a href='#ebnf-text_value'>text_value</a>, ( 'status' | 'response' ) )
<a name='ebnf-sparql_query'></a>sparql_query             ::= urdfQueryWrapper( <a href='ebnf-URI'>URI</a>, <a href='#ebnf-text'>text</a> )
<a name='ebnf-sparql_ask'></a>sparql_ask               ::= urdfQueryWrapper( <a href='ebnf-URI'>URI</a>, <a href='#ebnf-text'>text</a> )
</pre>

## 1.4. conditions
<pre>
<a name='ebnf-conditional_statement'></a>conditional_statement    ::= if <a href='#ebnf-boolean_expression'>boolean_expression</a> then do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-boolean_expression'></a>boolean_expression       ::= ( <a href='#ebnf-comparison'>comparison</a> | <a href='#ebnf-logical-comparison'>logical_operation</a> | <a href='#ebnf-boolean_value'>boolean_value</a> | <a href='#ebnf-not'>not</a> )
<a name='ebnf-comparison'></a>comparison               ::= ( <a href='#ebnf-number'>number</a> | <a href='#ebnf-text'>text</a> ) ( <a href='#ebnf-number'>number</a> | <a href='#ebnf-text'>text</a> )
<a name='ebnf-logical-comparison'></a>logical_operation        ::= <a href='#ebnf-boolean_expression'>boolean_expression</a> <a href='#ebnf-boolean_expression'>boolean_expression</a>
<a name='ebnf-not'></a>not                      ::= <a href='#ebnf-boolean_expression'>boolean_expression</a>
</pre>

## 1.5. text blocks
<pre>
<a name='ebnf-text'></a>text                     ::= ( <a href='#ebnf-text_value'>text_value</a> | <a href='#ebnf-text_operation'>text_operation</a> )
<a name='ebnf-text_value'></a>text_value               ::= <a href='#ebnf-String_Literal'>String_Literal</a>  
<a name='ebnf-text_operation'></a>text_operation           ::= ( <a href='text_concat'>text_concat</a> | <a href='text_length'>text_length</a> | <a href='ebnf-text_index_of'>text_index_of</a> | <a href='ebnf-text_char_at'>text_char_at</a> | <a href='ebnf-text_substring'>text_substring</a> | <a href='ebnf-text_change_case'>text_change_case</a> | <a href='ebnf-text_replace'>text_replace</a> )
<a name='ebnf-text_concat'></a>text_concat              ::= <a href='#ebnf-text'>text</a> (<a href='#ebnf-text'>text</a>)+
<a name='ebnf-text_length'></a>text_length              ::= <a href='ebnf-text'>text</a>
<a name='ebnf-text_index_of'></a>text_index_of            ::= <a href='ebnf-text'>text</a> <a href='ebnf-text'>text</a>
<a name='ebnf-text_char_at'></a>text_char_at             ::= <a href='ebnf-text'>text</a> <a href='#ebnf-number'>number</a>
<a name='ebnf-text_substring'></a>text_substring           ::= <a href='ebnf-text'>text</a> <a href='#ebnf-number'>number</a> <a href='#ebnf-number'>number</a>
<a name='ebnf-text_change_case'></a>text_change_case         ::= <a href='ebnf-text'>text</a>
<a name='ebnf-text_replace'></a>text_replace             ::= <a href='ebnf-text'>text</a> <a href='ebnf-text'>text</a> <a href='ebnf-text'>text</a>
</pre>


## 1.6. number blocks
<pre>
<a name='ebnf-number'></a>number                   ::= ( <a href='#ebnf-number_value'>number_value</a> | <a href='#ebnf-number_infinity'>number_infinity</a> | <a href='#ebnf-number_arithmetic'>number_arithmetic</a> | <a href='#ebnf-number_random'>number_random</a> )
<a name='ebnf-number_value'></a>number_value             ::= <a href='#ebnf-Double_Literal'>Double_Literal</a>
<a name='ebnf-infinity'></a>number_infinity          ::= <a href='#ebnf-Double_Literal'>Double_Literal</a>
<a name='ebnf-arithmeti-operations'></a>number_arithmetic    ::= <a href='#ebnf-number'>number</a> <a href='#ebnf-number'>number</a>
<a name='ebnf-number_random'></a>number_random            ::= <a href='#ebnf-number'>number</a> '+' | '-' | 'x' | '÷' | '^' <a href='#ebnf-number'>number</a>
</pre>

## 1.7. booleans blocks
<pre>
<a name='ebnf-boolean_value'></a>boolean_value            ::= <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a>
</pre>

## 1.8. Symbols
<pre>
<a name='ebnf-URI'></a>URI                      ::= <a href='#ebnf-String_Literal'>String_Literal</a>
<a name='ebnf-MAC'></a>MAC                      ::= <a href='#ebnf-String_Literal'>String_Literal</a>
<a name='ebnf-String_Literal'></a>String_Literal            ::= /* any visible character and the white-space character, no termination characters */
<a name='ebnf-Double_Literal'></a>Double_Literal            ::= (('.' <a href='#ebnf-Digits'>Digits</a>) | (<a href='#ebnf-Digits'>Digits</a> ('.' [0-9]*)?)) [eE] [+-]? <a href='#ebnf-Digits'>Digits</a>
<a name='ebnf-Digits'></a>Digits                   ::= [0-9]+
<a name='ebnf-Boolean_Literal'></a>Boolean_Literal           ::= true | false
</pre>

# 2. block syntax
TODO