import {Buffer} from 'buffer';
import * as processPolyfill from 'process';

// node-wot (ProtocolHelpers.readStreamFully), the stream-http polyfill and the readable-stream
// polyfill reference `Buffer` and `process` as bare globals. Bun's browser target substitutes
// polyfills for explicit `buffer`/`process` imports but, unlike node-polyfill-webpack-plugin,
// does not provide the globals, so install them here. index.ts imports this module first,
// before anything from @blast/core is evaluated.
globalThis.Buffer ??= Buffer;

// Bun's process polyfill (as of 1.3.14) queues nextTick callbacks as {fun, args} but drains
// them with `item.fun.apply(null, item.array)`, silently dropping every argument after the
// callback. readable-stream schedules nearly all of its work as nextTick(fn, stream, state),
// so stream reads hang. Replace nextTick with one that forwards its arguments.
//
// The host page may already define a partial `process` - the demo installs {exit} for its
// terminate block - so check for nextTick rather than for `process`, and keep whatever the
// page defined on top of the polyfill.
if (typeof globalThis.process?.nextTick !== 'function') {
  globalThis.process = {
    ...processPolyfill,
    ...globalThis.process,
    nextTick: (callback: (...args: unknown[]) => void, ...args: unknown[]) =>
      queueMicrotask(() => callback(...args)),
  } as unknown as NodeJS.Process;
}
