<img src="packages/web/public/assets/media/logo.png" alt="BLAST logo" title="BLAST" align="right" height="200" />

# BLAST - Block Applications For Things
This is a monorepo with two installable packages:
* [`@blast/core`](./packages/core/) is a library enabling usage of [WoT Thing Descriptions](https://www.w3.org/2019/wot/td) for Bluetooth devices in [Node.js](https://nodejs.org/).
* [`@blast/web`](./packages/web/) a programming and execution environment for applications interacting with devices from the Web of Things ([WoT](https://www.w3.org/TR/wot-architecture/)).

## Quick start
In order to use the BLAST web demo open a Terminal and enter the following commands:
1. Clone this repository with `git clone https://github.com/wintechis/blast`
2. Install dependencies: `yarn install` (`yarn install --ignore-engines` on node v17+)
3. Build BLAST: `yarn build`
4. Start BLAST web: `yarn start`
5. Open your Browser and navigate to `https://localhost:3000`

For more detailed descriptions navigate to one of the packages ([`@blast/core`](./packages/core/) or [`@blast/web`](./packages/web/))

> :warning: **BLAST's Bluetooth blocks require you to use Chrome 89 or newer on Windows with `chrome://flags/#enable-experimental-web-platform-features` enabled.**
