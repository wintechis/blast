# BLAST - Block Applications For Things 
This project aims to provide a visual programming environment for creating and executing applications, that communicate and interact with the Web of Things [WoT](https://www.w3.org/TR/wot-architecture/).

Check [./docs/](docs/) for detailed documentation.

## Usage
Most of this application works out of the box. Just open the `index.html` file in your favorite Browser.
If you want to use the save/load features, however you have to host the files on a server, see [Saving & loading](#saving--loading) for more info on this.

> :warning: **Blocks that perform fetch request, like the http-request or the SPARQL-blocks, require BLAST to be hosted on a server.**  

> :warning: **Some of BLAST's blocks require you to use Chrome 89 or newer on Windows with `chrome://flags/#enable-experimental-web-platform-features` enabled.**

The build pipeline deploys the current version to https://paul.ti.rw.fau.de/~qa60fyri/testing/blast/.

### Saving & Loading
Saving and loading block programs requires BLAST to be hosted on a server. In addition, if you want to save block programs you'll need to create a directory that allows HTTP-PUT requests, see [here](https://github.com/wintechis/wilde13/blob/master/FAQ.md#how-can-i-create-a-read-write-linked-data-server-based-on-the-apache-http-server) for instructions. 

### Building
In order to build BLAST yourself, follow these steps:
1. install [node.js](https://nodejs.org/en/)
2. run `npm run build` from within the root directory.
This will create the `js/blast.min.js`, which is imported in the `index.html`.

## Planned features
* **auto generate things blocks** - automatically generate `property`, `action`, and `event` blocks from its [things description](https://www.w3.org/TR/wot-thing-description/)
* **unit testing** add unit tests
  
For smaller planned improvements see [issues](https://github.com/wintechis/blast/issues)

## Contributing
Please see [.CONTRIBUTING.md](CONTRIBUTING.md).
