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

The shortcut notation is problematic when readProperty/writeProperty has more than one parameter.
For example, the Blinkstick requires to add the number of the LED as parameter:

````
blinkstick.writeProperty('colour', #000000, 1);
````

## Actions

Instead of

````
hue.invokeAction('dim')
````

we could write

````
hue.dim()
````

Instead of

````
console.invokeAction('log', 'hello world!')
````

we could write

````
console.log('hello world!')
````

## Events

Instead of

````
xiaomi.subscribe('update', function(?temp, ?hum) { divoo.print("values update") })

xiaomi.subscribe('update', function(?temp, ?hum) { divoo.print(`values update: ${temp} ${hum}`) })
````
`
we could write

````
@@@
````

Example of an event of the StreamDeck device:

````
streamDeck.onEvent('buttonUp', [False, False, False, True, False, False])
````