# Notes Related to SPARQL Blocks

## Structure

SPARQL queries consist of:

* prefix declarations (PREFIX)
* a query form (SELECT, CONSTRUCT, ASK, DESCRIBE)
* a dataset clause (FROM, FROM NAMED)
* graph patterns (inside the WHERE clause)
* solution modifiers (ORDER BY, LIMIT, OFFSET)

Graph patterns can be:

* basic graph patterns, consisting of one or more triple patterns
* alternative graph patterns (UNION)
* optional graph patterns (OPTIONAL)

Triple patterns consist of:

* a subject, which can be a URI, blank node or variable
* a predicate, which can be a URI or variable
* an object, which can be a URI, blank node, literal or variable

A literal can be:

* a string (xsd:string)
* a number (xsd:integer, xsd:decimal, xsd:float, xsd:double)
* a boolean (xsd:boolean)
* and more (xsd:dateTimeStamp and such)

## Related Work

Punya (see punya_doc.md), https://punya.mit.edu/ has SPARQL blocks

See also https://github.com/wintechis/blast/issues/118