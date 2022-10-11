import time
from bluetooth.ble import GATTRequester

req = GATTRequester("11:75:58:3C:06:4D", False)
print("requester created")
req.connect(True)

#req._wait_until_connected()

print("connected")

characteristics = req.discover_characteristics()
#print('GATT characteristics: %s', characteristics)

for li in characteristics:
    print (li)
#    try:
#        data = req.read_by_uuid(li['uuid'])
#        print(data)
#    except:
#        print("Exception")
    print(req.read_by_handle(li['handle']))
        
time.sleep(2)

requester.disconnect(True)
