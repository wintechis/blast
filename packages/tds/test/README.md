# Thing Description tests

The `*.spec.ts` files under `tds/` assert the structure of each shipped Thing Description:
that it parses, and that its properties, actions and events carry the interaction
affordances, data types and binary-encoding annotations (`ex:bitOffset`, `ex:bitLength`,
`scale`, `signed`, …) that the bindings rely on.

They run as part of the root `bun run test`.

## History

These files existed for years without ever executing. `@blast/tds` had no `test` script, so
the root test run skipped the package entirely, and three separate problems had accumulated
unnoticed: twelve of the thirteen imported `../../src/td/<Name>.json` when the directory is
`src/tds/`; every file imported `parseTD` and `Thing` from `@node-wot/td-tools`, which
node-wot removed in 0.9.x; and the move from jest to `bun test` left them importing
`@jest/globals`, which is no longer installed.

Reviving them needed only those three import rewrites plus a `tsconfig.json`, a
`@node-wot/core` devDependency and a `test` script — the assertions themselves were sound.

Exactly one had drifted from the Thing Description it describes. `RuuviTag.spec.ts` expected
the `UART data` event to carry ten properties with a 16-bit `power-info`. The Thing
Description has eleven, splitting bits 104-119 into an 11-bit `power-info` and a 5-bit
`tx-power`, which is what Ruuvi's RAWv2 format actually specifies. The Thing Description was
the correct side: decoding Ruuvi's published test vector through that schema yields 1377
(1377 + 1600 mV = 2.977 V) and 22 (-40 + 22*2 = +4 dBm), both matching Ruuvi's documented
values. `packages/core/test/codecs/OctetstreamCodec.spec.ts` pins that decode. The
assertions were updated to match; the Thing Description was not changed.

The lesson worth keeping: a test suite that no runner picks up rots silently, and nothing
about its presence in the tree signals that. If you add a package with tests, give it a
`test` script in the same commit.
