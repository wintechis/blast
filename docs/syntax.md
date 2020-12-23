# Syntax <!-- omit in toc -->

This section gives an overview of the syntax used in BLAST.

- [1. Extended Backus-Naur Form](#1-extended-backus-naur-form)
  - [1.1. block programs](#11-block-programs)
  - [loops](#loops)
  - [1.4. actions](#14-actions)
  - [1.5. conditions](#15-conditions)
  - [1.6. text blocks](#16-text-blocks)
  - [1.7. number blocks](#17-number-blocks)
  - [1.8. booleans blocks](#18-booleans-blocks)
  - [1.9. Symbols](#19-symbols)
- [2. block syntax TODO](#2-block-syntax-todo)
  - [2.1. program-blocks syntax](#21-program-blocks-syntax)
    - [2.1.1. setup-syntax](#211-setup-syntax)
    - [2.1.2. repeat-syntax](#212-repeat-syntax)
  - [2.2. things-blocks syntax](#22-things-blocks-syntax)
    - [2.2.1. iBeacon-syntax](#221-ibeacon-syntax)
    - [2.2.2. receiver-syntax](#222-receiver-syntax)
    - [2.2.3. iBeacon-data](#223-ibeacon-data)
  - [2.3. variables blocks syntax](#23-variables-blocks-syntax)
    - [2.3.1. variables set syntax](#231-variables-set-syntax)
    - [2.3.2. variables get syntax](#232-variables-get-syntax)
    - [2.3.3. variables change syntax](#233-variables-change-syntax)
  - [2.4. action blocks syntax](#24-action-blocks-syntax)
    - [2.4.1. display text syntax](#241-display-text-syntax)
    - [2.4.2. display table syntax](#242-display-table-syntax)
    - [2.4.3. switch lights syntax](#243-switch-lights-syntax)
    - [2.4.4. random sound syntax](#244-random-sound-syntax)
    - [2.4.5. halt syntax](#245-halt-syntax)
  - [2.5. logic blocks syntax](#25-logic-blocks-syntax)
    - [2.5.1. comparison syntax](#251-comparison-syntax)
    - [2.5.2. AND / OR syntax](#252-and--or-syntax)
    - [2.5.3. not syntax](#253-not-syntax)
    - [2.5.4. if / if-else syntax](#254-if--if-else-syntax)
    - [2.5.5. event syntax](#255-event-syntax)
  - [2.6. boolean blocks syntax](#26-boolean-blocks-syntax)
    - [2.6.1. boolean_value syntax](#261-boolean_value-syntax)
  - [2.7. text blocks syntax](#27-text-blocks-syntax)
      - [2.7.0.1. URI syntax](#2701-uri-syntax)
      - [2.7.0.2. mac syntax](#2702-mac-syntax)
    - [2.7.1. text_value syntax](#271-text_value-syntax)
    - [2.7.2. text_concat syntax](#272-text_concat-syntax)
  - [2.8. number blocks syntax](#28-number-blocks-syntax)
    - [2.8.1. number_value syntax](#281-number_value-syntax)
    - [2.8.2. infinity syntax](#282-infinity-syntax)
    - [2.8.3. arithmetic operations syntax](#283-arithmetic-operations-syntax)
    - [2.8.4. random integer syntax](#284-random-integer-syntax)

# 1. Extended Backus-Naur Form

The following describes BLAST's syntax using the [W3C EBNF Notation](https://www.w3.org/TR/2010/REC-xquery-20101214/#EBNFNotation).

## 1.1. block programs

<pre>
<a name='ebnf-block_program'></a>block_program            ::= <a href='#ebnf-statement'>statement</a>+
<a name='ebnf-statement'></a>statement                ::= ( <a href='#ebnf-loop'>loop</a> | <a href='ebnf-action_statement'>action_statement</a> | <a href='ebnf-conditional_statement'>conditional_statement</a> | <a href='ebnf-function'>function</a> )
</pre>

## loops
<pre>
<a name='ebnf-loop'></a>loop                     ::= ( <a href='ebnf-loops_repeat'>loops_repeat</a> | <a href='ebnf-loops_while_until'>loops_while_until</a> | <a href='ebnf-loops_for'>loops_for</a> )
<a name='ebnf-loops_repeat'></a>loops_repeat                   ::= repeat <a href='#ebnf-number'>number</a> times do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-loops_while_until'></a>loops_while_until               ::= repeat ( while | until ) <a href='#ebnf-conditional_statement'>conditional_statement</a> do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-loops_for'></a>loops_for                      ::= count with var from <a href='#ebnf-number'>number</a> to <a href='#ebnf-number'>number</a> by <a href='#ebnf-number'>number</a> do <a href='#ebnf-statement'>statement</a>*
</pre>

## 1.4. actions
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

## 1.5. conditions
<pre>
<a name='ebnf-conditional_statement'></a>conditional_statement    ::= if <a href='#ebnf-boolean_expression'>boolean_expression</a> then do <a href='#ebnf-statement'>statement</a>*
<a name='ebnf-boolean_expression'></a>boolean_expression       ::= ( <a href='#ebnf-comparison'>comparison</a> | <a href='#ebnf-logical-comparison'>logical_operation</a> | <a href='#ebnf-boolean_value'>boolean_value</a> | <a href='#ebnf-not'>not</a> )
<a name='ebnf-comparison'></a>comparison               ::= ( <a href='#ebnf-number'>number</a> | <a href='#ebnf-text'>text</a> ) ( <a href='#ebnf-number'>number</a> | <a href='#ebnf-text'>text</a> )
<a name='ebnf-logical-comparison'></a>logical_operation        ::= <a href='#ebnf-boolean_expression'>boolean_expression</a> <a href='#ebnf-boolean_expression'>boolean_expression</a>
<a name='ebnf-not'></a>not                      ::= <a href='#ebnf-boolean_expression'>boolean_expression</a>
</pre>

## 1.6. text blocks
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


## 1.7. number blocks
<pre>
<a name='ebnf-number'></a>number                   ::= ( <a href='#ebnf-number_value'>number_value</a> | <a href='#ebnf-number_infinity'>number_infinity</a> | <a href='#ebnf-number_arithmetic'>number_arithmetic</a> | <a href='#ebnf-number_random'>number_random</a> )
<a name='ebnf-number_value'></a>number_value             ::= <a href='#ebnf-Double_Literal'>Double_Literal</a>
<a name='ebnf-infinity'></a>number_infinity          ::= <a href='#ebnf-Double_Literal'>Double_Literal</a>
<a name='ebnf-arithmeti-operations'></a>number_arithmetic    ::= <a href='#ebnf-number'>number</a> <a href='#ebnf-number'>number</a>
<a name='ebnf-number_random'></a>number_random            ::= <a href='#ebnf-number'>number</a> '+' | '-' | 'x' | '÷' | '^' <a href='#ebnf-number'>number</a>
</pre>

## 1.8. booleans blocks
<pre>
<a name='ebnf-boolean_value'></a>boolean_value            ::= <a href='#ebnf-Boolean_Literal'>Boolean_Literal</a>
</pre>

## 1.9. Symbols
<pre>
<a name='ebnf-URI'></a>URI                      ::= <a href='#ebnf-String_Literal'>String_Literal</a>
<a name='ebnf-MAC'></a>MAC                      ::= <a href='#ebnf-String_Literal'>String_Literal</a>
<a name='ebnf-String_Literal'></a>String_Literal            ::= /* any visible character and the white-space character, no termination characters */
<a name='ebnf-Double_Literal'></a>Double_Literal            ::= (('.' <a href='#ebnf-Digits'>Digits</a>) | (<a href='#ebnf-Digits'>Digits</a> ('.' [0-9]*)?)) [eE] [+-]? <a href='#ebnf-Digits'>Digits</a>
<a name='ebnf-Digits'></a>Digits                   ::= [0-9]+
<a name='ebnf-Boolean_Literal'></a>Boolean_Literal           ::= true | false
</pre>

# 2. block syntax TODO

## 2.1. program-blocks syntax

### 2.1.1. setup-syntax
![setup block](images/process-setup.png)

**input:** *action* or *conditional statement*  
**output:** *no output*

### 2.1.2. repeat-syntax
![repeat block](images/process-loop.png)

**input:** *number* *number*  
**output:** *no output*

## 2.2. things-blocks syntax

There are 3 different blocks in this category: **iBeacon**, **receiver** and **iBeacon-data**.

### 2.2.1. iBeacon-syntax
![iBeacon block](images/things-ibeacon.png)

**input:** *URI*  
**output:** *thing*

### 2.2.2. receiver-syntax
![receiver block](images/things-receiver.png)

**input:** *MAC*  
**output:** *receiver*

### 2.2.3. iBeacon-data
![iBeacon-data block](images/things-ibeacon-data.png)![iBeacon-data block output](images/things-ibeacon-data-outputs.png)

**input:** *thing*  *receiver*  
**output:** *string* | *number* - the retrieved data

## 2.3. variables blocks syntax

### 2.3.1. variables set syntax
![variables set block](images/variables-set.png)

**input:** *text* | *number*  
**output:** *no output*

### 2.3.2. variables get syntax
![variables get block](images/variables-get.png)

**input:** *no input*  
**output:** *text* | *number*

### 2.3.3. variables change syntax
![variables change block](images/variables-change.png)

**input:** *text* | *number*  
**output:** *no output*

## 2.4. action blocks syntax

There are 5 different blocks in this category: **display text**, **display data**, **switch lights**, **random sound** and **halt**

### 2.4.1. display text syntax
![display text block](images/action-display-text.png)

**input:** *text* | *number*  
**output:** *no output*

### 2.4.2. display table syntax
![display table block](images/action-display-table.png)

**input:** *receiver*  
**output:** *no output*

### 2.4.3. switch lights syntax
![switch lights block](images/action-switch-lights.png)

**input:** *iBeacon*  
**output:** *no output*

### 2.4.4. random sound syntax
![random sound block](images/action-sound.png)

**input:** *no input*
**output:** *no output*

### 2.4.5. halt syntax
![halt block](images/action-stop.png)

**input:** *no input*
**output:** *no output*


## 2.5. logic blocks syntax

### 2.5.1. comparison syntax
![comparison blocks](images/logic-compare.png)

**input:** (*text* | *number*), (*text* | *number*)  
**output:** *boolean*

### 2.5.2. AND / OR syntax
![logical and block](images/logic-and.png)

![logical or block](images/logic-or.png)

**input:** *boolean*, *boolean*  
**output:** *boolean*

### 2.5.3. not syntax
![not block](images/logic-not.png)

**input:** *boolean*  
**output:** *boolean*

### 2.5.4. if / if-else syntax
![if example](images/if.png)

![if else example](images/logic-if-else.png)

**input:** *boolean* (*action* | *conditional_statement*)*  
**output:** *conditional_statement*

### 2.5.5. event syntax
![event block](images/logic-event.png)

**input:** *URI* ( *text* | *number* )  
**output:** *boolean*

## 2.6. boolean blocks syntax

### 2.6.1. boolean_value syntax
![value block](images/logic-true-false.png)

**input:** *no input*  
**output:** *boolean*

## 2.7. text blocks syntax

#### 2.7.0.1. URI syntax
![uri block](images/text-uri.png)

**input:** *no input*  
**output:** *URI*

#### 2.7.0.2. mac syntax
![mac block](images/text-mac.png)

**input:** *no input*  
**output:** *MAC*

### 2.7.1. text_value syntax
![text creation block](images/text-text.png)

**input:** *no input*  
**output:** *text*

### 2.7.2. text_concat syntax
![text concatenation block](images/text-create.png)

**input:** { *text* }  
**output** *text*

## 2.8. number blocks syntax

### 2.8.1. number_value syntax
![number block](images/number.png)

**input:** *no input*  
**output:** *number*

### 2.8.2. infinity syntax
![infinity block](images/number_infinity.png)

**input:** *no input*  
**output:** *number*

### 2.8.3. arithmetic operations syntax
![arithmetic operations block](images/number-operations.png)

**input:** *number* *number*  
**output:** *number*

### 2.8.4. random integer syntax
![random block](images/number-random.png)

**input:** *number* *number*  
**output:** *number*
