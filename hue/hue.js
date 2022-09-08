const {createBluetooth} = require('node-ble')
const {bluetooth, destroy} = createBluetooth()

// main, mandatory
async function main() {
    console.log('awaiting adapter...')
    const adapter = await bluetooth.defaultAdapter()

    // the mac address
    var MAC = 'FF:AB:61:04:33:9C'
    // the service
    var SERVICE = '932c32bd-0000-47a2-835a-a8d455b859dd'
    // the characteristic
    var CHARACTERISTIC = '932c32bd-0002-47a2-835a-a8d455b859dd'
    // ON
    var ON = Buffer.from('01', 'hex')
    // OFF
    var OFF = Buffer.from('00', 'hex')

    console.log('starting discovering...')
    if (! await adapter.isDiscovering())
	await adapter.startDiscovery()

    console.log('waiting for gatt...')
    const device = await adapter.waitDevice(MAC)
    await device.connect()
    const gattServer = await device.gatt()

    console.log('selecting service/characteristics...')
    const s1 = await gattServer.getPrimaryService(SERVICE)
    const c1 = await s1.getCharacteristic(CHARACTERISTIC)

    console.log('writing value...')
    await c1.writeValue(ON)

    console.log('reading value...')
    const buffer = await c1.readValue()
    console.log(buffer)

    console.log('disconnecting...')
    await device.disconnect()
    destroy()
}

main()
