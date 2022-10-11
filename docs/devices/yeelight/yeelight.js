const YeeDiscovery = require('yeelight-platform').Discovery
const discoveryService = new YeeDiscovery()

discoveryService.on('started', () => {
    console.log('** Discovery Started **')
})

discoveryService.on('didDiscoverDevice', (device) => {
    console.log(device)
})

discoveryService.listen()
