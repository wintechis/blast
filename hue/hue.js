const {createBluetooth} = require('node-ble')
const {bluetooth, destroy} = createBluetooth()

// TODO: error handling, that is, catch exceptions, e.g., the DBusError, and re-try or fail cleanly

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

    console.log('starting discovering...')
    if (! await adapter.isDiscovering()) {
	await adapter.startDiscovery()
    }

    console.log('waiting for gatt...')
    const device = await adapter.waitDevice(MAC)
    await device.connect()
    const gattServer = await device.gatt()

    console.log('selecting service/characteristics...')
    const s1 = await gattServer.getPrimaryService(SERVICE)
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
    try {
	await c1.writeValue(buffer)
    } catch (e) {
	if (e instanceof DBusError) {
	    console.log('DBusError: ', e.message)
	}
    }

    console.log('disconnecting...')
    await device.disconnect()
    destroy()
}

main()
