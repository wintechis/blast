# Syntax shortcuts

Reading and writing code with thing.readProperty(), thing.writeProperty(), thing.invokeAction() and thing.subscribeEvent() is tedious.

Assume the following devices:

* hue: a Philips Hue lamp
* xiaomi: a Xioami thermometer
* divoo: a Divoom pixel digital frame

## Properties

Instead of

````
hue.readProperty('colour')
````

we could write

````
hue.colour
````

Instead of

````
hue.writeProperty('colour', '0xff0000')
````

we could write

````
hue.colour = 0xff0000
````

## Actions

Instead of

````hue.invokeAction('dim')````

we could write

````
hue.dim()
````

## Events

Instead of

````
xiaomi.subscribe('update', function(?temp, ?hum) { divoo.print("values update") })

xiaomi.subscribe('update', function(?temp, ?hum) { divoo.print(`values update: ${temp} ${hum}`) })
````

we could write

````
@@@
````