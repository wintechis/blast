# Bill of Materials
This tracks lists all dependencies used to build and run BLAST.

## Libraries used at run-time
| Name | Description | License |
| --- | --- | --- |
| [joy-con-webhid](https://github.com/tomayac/joy-con-webhid) | A WebHID driver for Nintendo Joy-Cons | Apache-2.0 |
| [node-elgato-stream-deck/webhid](https://github.com/Julusian/node-elgato-stream-deck/tree/master/packages/webhid) | shared library for interfacing with the various models of the Elgato Stream Deck | MIT |
| [buffer](https://github.com/feross/buffer) | buffer module from node.js, for the browser. Needed for node-elgato-stream-deck | MIT |
| [FileSaver.js](https://github.com/eligrey/FileSaver.js) | library for saving files on the client-side | MIT |
| [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) | A sandboxed JavaScript interpreter used to execute BLAST programs | Apache-2.0 |
| [Acorn](https://github.com/acornjs/acorn) | A JavaScript parser used by JS-Interpreter | MIT |
| [Blockly](https://github.com/google/blockly) | Blockly Library | Apache-2.0 |
| [µRDF Store](https://github.com/vcharpenay/uRDF.js) | An RDF Store | MIT |

## Libraries used at compile time
| Name | Description | License |
| --- | --- | --- |
| [del](https://github.com/sindresorhus/del) | Delete files and directories using globs |  MIT |
| [ESLint](https://eslint.org/) | JavaScript linter | MIT |
| [eslint-config-google](https://github.com/google/eslint-config-google) | ESLint config | Apache-2.0 |
| [Closure Compiler](https://developers.google.com/closure/compiler/) | Tool for parsing and analyzing JavaScript, removing dead code, rewriting and minimizing what's left. Also checks syntax, variable references, and types, and warns about common JavaScript pitfalls. | Apache-2.0 |
| [gulp](https://gulpjs.com/) | A toolkit for automating & enhance workflows | MIT |
| [gulp-rev](https://github.com/sindresorhus/gulp-rev) | provides asset revisioning | MIT |
| [gulp-rev-rewrite](https://github.com/TheDancingCode/gulp-rev-rewrite) | rewrites references to assets revisioned by gulp-rev | MIT |
| [gulp-shell](https://github.com/sun-zheng-an/gulp-shell) | command line interface for gulp | MIT |
| [JSDoc](https://github.com/jsdoc/jsdoc) | API documentation generator for JavaScript | Apache-2.0 |
| [Workbox CLI](https://developers.google.com/web/tools/workbox/modules/workbox-cli) | provides a [workbox](https://developers.google.com/web/tools/workbox) command line build process | MIT |