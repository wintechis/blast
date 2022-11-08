B4:60:ED:14:E6:0E

$ telnet 192.168.0.100 55443

{"id":0,"method":"set_ct_abx","params":[1000,"smooth",300]}h



import logging
logging.basicConfig(level=logging.DEBUG)
from yeelight import Bulb
bulb = Bulb("192.168.0.100")
bulb.set_color_temp(4700)
bulb.set_rgb(255, 0, 0)
bulb.set_brightness(10)
bulb.get_capabilities()
bulb.turn_on()
bulb.turn_off()
