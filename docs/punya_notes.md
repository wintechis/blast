# Notes on [Punya](https://punya.mit.edu/#overview)

Punya is an Android App development Application based on the [MIT App Inventor](https://appinventor.mit.edu/) adding basic Linked Data capability by enabling the app to work as a LDP-CoAP client and cloud services.

BLAST in contrast is a web application focued on easing communication with external sensors and devices communicating with Bluetooth (webBluetooth), HTTP (WoTS), and USB (webHID).

### LDP-CoAP Client
Punya apps can communicate with external CoAP servers to publish and access data.

### Sensors
The app building platform enables access to sensors of the smartphone, i.e. GPS, taking photos, receiving SMS and sending tweets.

### Cloud services 
Punya also enables adding push notification services from Linked Data Clouds.

# Differences to BLAST

## Autosave/restore
Punya automatically generates an ID for every program built. With this ID programs are saved to the cloud and can be restored on visiting `http://punya.appinventor.mit.edu/#{id}`

## Unique blocks in Punya  

* Control
    * `evaluate but ignore result` - evaluates the input block without reading its output
* SPARQL
    * Queries are divided into many blocks (`SELECT DISTINCT ⬜ WHERE ⬜ MODIFIERS ⬜`, `Define rule`, `isLiteral`, `isBNode`,...)
* Math
    * `isNumber`
* Text
    * `is a string`
* Colors
* Variable
    * `global var`
    * `scope`

In Punya, every blocks containing a dropbox appears multiple times in the toolbox, displaying every possible option.

