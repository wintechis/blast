# Samples

This folder contains different examples demonstrating the BLAST core functionalities. These are very simple programs, for more complex use cases, see [useCases folder](./useCases). Each sample is described below.

  - [events.xml](#eventsxml)
  - [gamble.xml](#gamblexml)
  - [helloWorld.xml](#helloworldxml)
  - [playAudio.xml](#playaudioxml)
  - [requests.xml](#requestsxml)
  - [rgbLights.xml](#rgblightsxml)
  - [ruuviProperties.xml](#ruuvipropertiesxml)
  - [rygLights.xml](#ryglightsxml)
  - [signalStrength](#signalstrength)
  - [sounds.xml](#soundsxml)
  - [streamdeck.xml](#streamdeckxml)
  - [toggle.xml](#togglexml)
  - [webSpeech.xml](#webspeechxml)

## events.xml
Demonstrates the `state_definition` and `event` blocks. In this program a counter variable number is incremented from 1 to 9 and each time its value is even, an event is triggered.

## gamble.xml
Lottery simulation, keeps generating random numbers between 1 and 100. The program terminates the random number reaches a value above 90.

## helloWorld.xml
Outputs the string `hello world`.

## playAudio.xml
Outputs an audio signal.

## requests.xml
Executes each block of the `Requests and Queries` category.

## rgbLights.xml
Toggles an RGB light controlled by [this Bluetooth LED controller](https://github.com/arduino12/ble_rgb_led_strip_controller) off, red, green, blue, and off again in sequence.

## ruuviProperties.xml
Prints out each property advertised by a [Ruuvi Tag](https://ruuvi.com/ruuvitag/)

## rygLights.xml
Toggles an RYG light controlled by [this Bluetooth LED controller](https://github.com/arduino12/ble_rgb_led_strip_controller) off, red, ,yellow, green, and off again in sequence.

## signalStrength
Prints out the signal strength (RSSI) of a Bluetooth device.

## sounds.xml
A collection of different audio resources.

## streamdeck.xml
Demonstrates [Streamdeck mini](https://www.elgato.com/de/stream-deck-mini) button pushes, and how they interrupt the exectuion of BLAST programs.

## toggle.xml
Uses a [Streamdeck mini](https://www.elgato.com/de/stream-deck-mini) button to Toggle an LED controlled by [this Bluetooth LED controller](https://github.com/arduino12/ble_rgb_led_strip_controller)

## webSpeech.xml
This program showcases BLASTS implementation of the webSpeech API, enabling text-to-speech and speech-to-text.