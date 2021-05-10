# BLAST - Block Applications For Things 
This project aims to provide an easy to use [Blockly](https://developers.google.com/blockly) Application to communicate with the Web of Things [WoT](https://www.w3.org/TR/wot-architecture/).  

Check [./docs/](docs/) for detailed documentation.

## Usage
This application works out of the box. Just open the index.html file in your favorite Browser.
If you want to use the save/load features, however you have to host the files on a server, see [Saving & loading](#saving--loading) for more infos on this.

**Some of BLAST's block require you to use Chrome 89 or newer on Windows with `chrome://flags/#enable-experimental-web-platform-features` enabled.**

### Saving & Loading
Saving and loading block programs requires BLAST to be hosted on a server. In addition, if you want to save block programs you'll need to create a directory that allows HTTP-PUT requests, see [here](https://github.com/wintechis/wilde13/blob/master/FAQ.md#how-can-i-create-a-read-write-linked-data-server-based-on-the-apache-http-server) for instructions. 

## Planned features
* **auto generate things blocks** - automatically generate `property`, `action`, and `event` blocks from its [things description](https://www.w3.org/TR/wot-thing-description/)
* **unit testing** add unit tests
  
For smaller planned improvements see [issues](https://github.com/wintechis/blast/issues)



