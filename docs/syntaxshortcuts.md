# Syntax shortcuts

Reading and writing .readProperty(), .writeProperty(), .invokeAction() is tedious.

Instead of hue.readProperty('colour'), we could write hue.colour.

Instead of hue.writeProperty('colour', '0xff0000'), we could write hue.colour = 0xff0000.

Instead of hue.invokeAction('dim'), we could write hue.dim().

@@@events?