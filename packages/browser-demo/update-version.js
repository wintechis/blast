/**
 * Stamps the current git revision into src/Version.jsx, which the demo shows in a snackbar.
 * Replaces the former gulp + gulp-replace + git-rev-sync task.
 *
 * Uses --short=7 to match the 7-character revision git-rev-sync's short() produced, so the
 * displayed version string does not change format.
 *
 * The stamp inherently lags one commit, and no arrangement of the build can avoid it: it
 * is written from the sha of HEAD at build time, but the file carrying it only acquires a
 * sha of its own once it is committed, and a commit cannot contain its own hash. So when
 * Version.jsx and the build/ output are committed together, both consistently name the
 * *previous* commit.
 *
 * The practical consequence: `bun run build` on a clean tree always dirties Version.jsx
 * (and, through the changed content hash, build/index.html and build/asset-manifest.json).
 * That is expected, not a broken build. Either commit the result - which re-stamps to the
 * commit you just made, so the lag stays at exactly one - or `git restore` the three
 * files. Do not chase a fixed point; there isn't one.
 */
import {$} from 'bun';

// Bun.file/Bun.write take a URL directly, so no manual path juggling is needed, and
// anchoring on import.meta.dir keeps the script correct whatever the caller's cwd is.
const TARGET = new URL('./src/Version.jsx', import.meta.url);

const rev = (await $`git rev-parse --short=7 HEAD`.cwd(import.meta.dir).text()).trim();
const source = await Bun.file(TARGET).text();
const updated = source.replace(/const rev = '#\w+';/g, `const rev = '#${rev}';`);

if (updated === source) {
  console.log(`Version.jsx already at #${rev}`);
} else {
  await Bun.write(TARGET, updated);
  console.log(`Version.jsx updated to #${rev}`);
}
