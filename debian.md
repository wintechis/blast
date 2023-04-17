# BLAST on Debian

Debian Bookworm

Change package.json from Node "18.12.0" to ">=18.12.0" (or another version?).

````
# apt-get install yarnpkg node
````

````
$ yarnpkg set version latest
$ yarnpkg cache clean  # optional
````

````
$ yarnpkg build
➤ YN0000: node:internal/modules/cjs/loader:1042
➤ YN0000:   throw err;
➤ YN0000:   ^
➤ YN0000: 
➤ YN0000: Error: Cannot find module '/home/pi/blast/packages/core/.yarn/cache/rimraf-npm-3.0.2-2cb7dac69a-87f4164e39.zip/node_modules/rimraf/bin.js'
➤ YN0000:     at Module._resolveFilename (node:internal/modules/cjs/loader:1039:15)
➤ YN0000:     at Module._load (node:internal/modules/cjs/loader:885:27)
➤ YN0000:     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
➤ YN0000:     at node:internal/main/run_main_module:23:47 {
➤ YN0000:   code: 'MODULE_NOT_FOUND',
➤ YN0000:   requireStack: []
➤ YN0000: }
➤ YN0000: 
➤ YN0000: Node.js v18.13.0
➤ YN0000: node:internal/modules/cjs/loader:1042
➤ YN0000:   throw err;
➤ YN0000:   ^
➤ YN0000: 
➤ YN0000: Error: Cannot find module '/home/pi/blast/packages/web/.yarn/cache/copyfiles-npm-2.4.1-d8750b5d88-aea69873bb.zip/node_modules/copyfiles/copyfiles'
➤ YN0000:     at Module._resolveFilename (node:internal/modules/cjs/loader:1039:15)
➤ YN0000:     at Module._load (node:internal/modules/cjs/loader:885:27)
➤ YN0000:     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
➤ YN0000:     at node:internal/main/run_main_module:23:47 {
➤ YN0000:   code: 'MODULE_NOT_FOUND',
➤ YN0000:   requireStack: []
➤ YN0000: }
➤ YN0000: 
➤ YN0000: Node.js v18.13.0
➤ YN0000: Done in 20s 197ms
````