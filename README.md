<img src="packages/web/public/assets/media/logo.png" alt="BLAST logo" title="BLAST" align="right" height="200" />

# BLAST - Block Applications For Things
This is a monorepo with two installable packages:
* [`@blast/core`](./packages/core/) is a library enabling usage of Web of Things ([WoT](https://www.w3.org/TR/wot-architecture/)) Thing Descriptions ([TDs](https://www.w3.org/2019/wot/td)) for Bluetooth devices in [Node.js](https://nodejs.org/).
* [`@blast/web`](./packages/web/) a programming and execution environment for applications interacting with WoT devices from within the web-browser utilizing [Web Bluetooth](https://webbluetoothcg.github.io/web-bluetooth/) and [WebHID](https://wicg.github.io/webhid/).

## Quick start
In order to use the BLAST web demo open a Terminal and enter the following commands:
1. Clone this repository with `git clone https://github.com/wintechis/blast`
2. Install dependencies: `yarn install`
4. Build BLAST: `yarn build`
5. Start BLAST web: `yarn start`
6. Open your Browser and navigate to `https://localhost:3000`

> :warning: You might have to set yarn version using `yarn set version berry` before installing

For more detailed descriptions navigate to one of the packages ([`@blast/core`](./packages/core/) or [`@blast/web`](./packages/web/))
