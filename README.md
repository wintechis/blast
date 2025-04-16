<img src="packages/browser-demo/public/assets/media/logo.png" alt="BLAST logo" title="BLAST" align="right" height="200" />

# BLAST - Block Applications For Things
This is a monorepo with five packages:
* [`@blast/core`](./packages/core/) is a library enabling usage of Web of Things ([WoT](https://www.w3.org/TR/wot-architecture/)) Thing Descriptions ([TDs](https://www.w3.org/2019/wot/td)) for Bluetooth devices in [Node.js](https://nodejs.org/).
* [`@blast/node`](./packages/node/) bundle for Node.js, using [node-ble-host](https://github.com/Emill/node-ble-host) and [node-hid](https://github.com/node-hid/node-hid).
* [`@blast/browser`](./packages/browser/) BLAST browser bundle utilizing [Web Bluetooth](https://webbluetoothcg.github.io/web-bluetooth/) and [WebHID](https://wicg.github.io/webhid/).
* [`@blast/browser-demo`](./packages/browser-demo/) a programming and execution environment for applications interacting with WoT devices from within the web-browser
* [`@blast/tds`](./packages/tds/) Collection of WoT Thing Descriptions tested with BLAST

For more detailed descriptions navigate to one of the packages ([`@blast/core`](./packages/core/) or [`@blast/web`](./packages/web/))

## Quick start
In order to use the BLAST web demo open a Terminal and enter the following commands:
1. Clone this repository with `git clone https://github.com/wintechis/blast`
2. Install dependencies: `yarn install`
4. Build BLAST: `yarn build`
5. Start BLAST web: `yarn start`
6. Open your Browser and navigate to `https://localhost:3000`

> [!NOTE]
> You might have to set yarn version using `yarn set version berry` before installing

## Installing individual packages
Yarn 2+ supports installing packages from a private git monorepo. To set packages of BLAST as dependecies in your project follow the steps below:

1. Set yarn version using `yarn set version berry` (or any verion newer than 2.0.0)
2. Disable pnp: `yarn config set nodeLinker node-modules` (because of this [bug](https://github.com/yarnpkg/berry/issues/4545))
3. Add the following lines to your `package.json` and replace `@blast/node` and `@blast/tds` with the desired package.
```json
  "dependencies": {
    "@blast/node": "git+https://github.com/wintechis/blast.git#workspace=@blast/node",
    "@blast/tds": "git+https://github.com/wintechis/blast.git#workspace=@blast/tds"
  },
  "resolutions": {
    "@blast/core": "git+https://github.com/wintechis/blast.git#workspace=@blast/core"
  },
  "type": "module"
```

Now, you can import the packages in your project code, i.e.:
```javascript
import {createThing} from '@blast/node';
import {BleRgbController} from '@blast/tds';
```
Don't forget to execute ``sudo setcap cap_net_admin=ep $(eval readlink -f `which node`)`` to allow Node.js to access Bluetooth devices.


# Publications
[Freund, M., Fries, J., Wehr, T., & Harth, A. (2023). Generating Visual Programming Blocks based on Semantics in W3C Thing Descriptions. In SWoCoT@ ESWC (pp. 1-15).](https://ceur-ws.org/Vol-3412/paper1.pdf)
[Freund, M., Wehr, T., & Harth, A. (2022). Blast: Block applications for things. In European Semantic Web Conference (pp. 68-72).](https://2022.eswc-conferences.org/wp-content/uploads/2022/05/pd_Freund_et_al_paper_225.pdf)
[Wehr, T., Freund, M., & Harth, A. (2024). Taking Control of Your Health Data: A Solid-Based Mobile App for Wearable Data Collection and RDF Visualization. In European Semantic Web Conference (pp. 336-339).](https://2024.eswc-conferences.org/wp-content/uploads/2024/05/77770325.pdf)
