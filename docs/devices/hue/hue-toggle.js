//import DBusError from 'dbus-next'
const {DBusError} = require('dbus-next')
const {createBluetooth} = require('node-ble')
const {bluetooth, destroy} = createBluetooth()

// main, mandatory
async function main() {
    console.log('awaiting adapter...')
    const adapter = await bluetooth.defaultAdapter()

    // the mac address
    const MAC = 'FF:AB:61:04:33:9C'
    // the service
    const SERVICE = '932c32bd-0000-47a2-835a-a8d455b859dd'
    // the characteristic
    const CHARACTERISTIC = '932c32bd-0002-47a2-835a-a8d455b859dd'
    // ON
    const ON = Buffer.from('01', 'hex')
    // OFF
    const OFF = Buffer.from('00', 'hex')

    try {
	console.log('starting discovering...')
	if (! await adapter.isDiscovering()) {
	    await adapter.startDiscovery()
	}

	console.log('connecting to device...')
	const device = await adapter.waitDevice(MAC)
	await device.connect()

	console.log('waiting for gatt...')
    	const gattServer = await device.gatt()

	console.log('selecting service...')
	const s1 = await gattServer.getPrimaryService(SERVICE)

	console.log('selecting characteristics...')
	const c1 = await s1.getCharacteristic(CHARACTERISTIC)

	console.log('reading value...')
	var buffer = await c1.readValue()
	console.log(buffer)

	// toggle
	// Buffer.compare(buffer, ON)
	if (buffer.compare(ON) == 0) {
	    buffer = OFF
	} else {
	    buffer = ON
	}

	console.log('writing value...', buffer)
	await c1.writeValue(buffer)

	console.log('disconnecting...')
	await device.disconnect()
	destroy()
    } catch (e) {
	if (e instanceof DBusError) {
	    // FIXME if error abort by local, mitigation strategy is to try again
	    // abort by local could be type: 3 or body: [ 'le-connection-abort-by-local' ], but not sure
	    console.log('DBusError: ', e.message)
	} else {
	    console.log('Error: ', e.message)
	}
	console.log('exiting with return code 1')
	process.exit(1)
    }
}

main()
