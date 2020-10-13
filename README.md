# BLAST - Block Applications For Things 
This project aims to provide an easy to use Blockly-interface for creating IoT-applications.  

The blocks provide capabilites to create simple querying applications or more complex ones that trigger state-dependent or event-based actions.

For a detailed desribtion of the blocks see [Blocks.md](docs/Blocks.md)

## Requirements
This Application currently works with IoT-Systems that offer a RDF/Turtle interface similiar to the one below.

```turtle
@prefix scp: <https://github.com/aharth/supercool/>.
@prefix accesspoint: <http://static.rapidthings.eu/accesspoint/>.
@prefix ibeacon: <../../a_one_rapidthings_eu/ibeacon/>.
@prefix en: <../../a_one_rapidthings_eu/envirophat/>.
@prefix sosa: <http://www.w3.org/ns/sosa/>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix qudt: <http://qudt.org/1.1/schema/qudt#>.

_:b1 a sosa:Observation;
    sosa:madeBySensor <http://testserver.local#Bluetooth>;
    sosa:observedProperty "http://static.rapidthings.eu/properties/rssi";
    sosa:hasResult _:b2.
_:b2 a sosa:Result;
    qudt:unit <http://qudt.org/1.1/vocab/unit#DecibelReferredToOneMilliwatt>;
    qudt:numericValue "-70"^^xsd:decimal;
    scp:MacAddress "f0346fbf4875";
    sosa:resultTime "2020-03-13T22:49:51.355Z"^^xsd:dateTimeStamp;
    scp:measuredPower "-58"^^xsd:decimal;
    scp:major "1"^^xsd:decimal;
    scp:minor "1"^^xsd:decimal;
    scp:accuracy "2.1623117971054153"^^xsd:decimal;
    scp:proximity "near".
```

## Usage
This code works out of the box. Just open the index.html file in your favorite Browser.

## Planned features
* **documentation** - improve docs