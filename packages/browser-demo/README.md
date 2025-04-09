# BLAST browser-demo

`@blast/browser-demo` offers a visual programming environment (VPE) for creating and executing applications, that communicate and interact with devices from the Web of Things ([WoT](https://www.w3.org/TR/wot-architecture/)).

Employing a VPE, BLAST makes creating WoT Applications more accessible: Without knowing any details of the technologies or communication protocols used by a device, users can create complete Programs that read or write its properties, invoke actions on it and listen to its events. Programs can then be executed on desktop pcs, smartphones and tablets.

## Usage
To serve BLAST on your local network, execute the commands below:
1. (If not done already) Install the dependencies `yarn install`
2. `yarn start`

> [!IMPORTANT]
> **The Browser Demo's Bluetooth blocks require you to use Chrome 89 or newer on Windows with `chrome://flags/#enable-experimental-web-platform-features` enabled.**

### WebHID on Linux
On most Linux systems, the udev subsystem blocks write access to HID devices. In order to unblock access, each device requires its own udev rule. See the [device section](https://github.com/wintechis/blast/wiki/Devices) of the wiki for step by step instructions for all devices used by BLAST.

### Compatibility
This table displays all blocks with limited compatibility, assuming you're using **google chrome version 85, or newer**, and have the **`experimental web platform features flag` enabled**.

| block | Windows | Linux | Mac | Android |
|---|---|---|---|---|
| read signal strength | :heavy_check_mark: | :x:[^1] | :heavy_check_mark: | :heavy_check_mark: |
| read ruuvi property | :heavy_check_mark: | :x:[^2] | :heavy_check_mark: | :heavy_check_mark: |

[^1]: https://bugs.chromium.org/p/chromium/issues/detail?id=897312
[^2]: https://bugs.chromium.org/p/chromium/issues/detail?id=654897

If you need Linux compatibility, it might help to star this [watchAdvertisement implementation issue](https://bugs.chromium.org/p/chromium/issues/detail?id=654897&q=watchAdvertisements&can=2) and to help us implement new features, star the [Bluetooth Scanning issue](https://bugs.chromium.org/p/chromium/issues/detail?id=897312).

### Requirements
* [Android](https://crbug.com/471536): Requires Android 6.0 Marshmallow or later.
* [Mac](https://crbug.com/364359): Requires OS X Yosemite or later.
  * Some MacBooks may not work: Check "About this Mac" / "System Report" / "Bluetooth" and verify that Low Energy is supported.
* [Linux](https://crbug.com/570344): Requires Kernel 3.19+ and [BlueZ](http://www.bluez.org/) 5.41+ installed. Read [How to get Chrome Web Bluetooth working on Linux](https://acassis.wordpress.com/2016/06/28/how-to-get-chrome-web-bluetooth-working-on-linux/).
  * Note that Bluetooth daemon needs to run with experimental interfaces if BlueZ version is lower than 5.43: `sudo /usr/sbin/bluetoothd -E`
* [Windows](https://crbug.com/507419): Requires Windows 10 version 1706 (Creators Update) or later.
