import {test, expect, type Page} from '@playwright/test';

/**
 * Mirrors the `samples` array in src/toolbar/Toolbar.jsx. Kept as a literal
 * copy (not an import) so the "dropdown lists exactly these samples" test
 * below fails loudly if the two drift apart, instead of trivially passing.
 */
const ALL_SAMPLES = [
  './samples/events.xml',
  './samples/everyMinutes.xml',
  './samples/gamble.xml',
  './samples/helloWorld.xml',
  './samples/lNdW.xml',
  './samples/objects.xml',
  './samples/playAudio.xml',
  './samples/requests.xml',
  './samples/rgbLights.xml',
  './samples/ruuviProperties.xml',
  './samples/signalStrength.xml',
  './samples/sounds.xml',
  './samples/streamdeck.xml',
  './samples/toggle.xml',
  './samples/webSpeech.xml',
];

/** Samples whose `things_*` blocks require pairing a real Bluetooth/HID/microphone device. */
const HARDWARE_SAMPLES: Record<string, string> = {
  './samples/lNdW.xml': 'connects a Sphero, a Hue lamp and a Stream Deck',
  './samples/rgbLights.xml': 'controls a physical Bluetooth LED strip',
  './samples/ruuviProperties.xml': 'reads a physical RuuviTag over Web Bluetooth',
  './samples/signalStrength.xml': 'reads RSSI from a physical Bluetooth device',
  './samples/streamdeck.xml': 'requires a physical Stream Deck over WebHID',
  './samples/toggle.xml': 'requires a physical Stream Deck and Bluetooth LED strip',
  './samples/webSpeech.xml': 'speech recognition requires a real microphone',
};

function statusLocator(page: Page) {
  return page.locator('header').getByText(/^(ready|running|stopped|error)$/);
}

function output(page: Page) {
  return page.locator('#outputContainer');
}

async function loadSample(page: Page, path: string) {
  await page.locator('#load-sample').click();
  await page.getByRole('option', {name: path, exact: true}).click();
}

/** The toolbar's run/stop control is a single button; clicking it again stops execution. */
async function toggleRun(page: Page) {
  await page.getByRole('button', {name: 'run'}).click();
}

test.beforeEach(async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#load-sample')).toBeVisible();
});

test('the sample dropdown still offers exactly the samples this suite accounts for', async ({
  page,
}) => {
  await page.locator('#load-sample').click();
  const options = await page.getByRole('option').allTextContents();
  expect(options.sort()).toEqual([...ALL_SAMPLES].sort());
});

for (const [path, reason] of Object.entries(HARDWARE_SAMPLES)) {
  test.skip(`${path} is not covered (${reason})`, async () => {});
}

test('helloWorld.xml displays "Hello World!"', async ({page}) => {
  await loadSample(page, './samples/helloWorld.xml');
  await toggleRun(page);

  await expect(statusLocator(page)).toHaveText('stopped', {timeout: 10_000});
  await expect(output(page)).toContainText('Hello World!');
});

test('gamble.xml runs the lottery loop to a jackpot', async ({page}) => {
  test.setTimeout(75_000);
  await loadSample(page, './samples/gamble.xml');
  await toggleRun(page);

  // The loop redraws until it rolls above 90 (~10% per draw), so its length is
  // random and long-tailed. A generous budget absorbs unlucky runs; CI's retry
  // re-rolls the RNG, making a spurious timeout vanishingly unlikely there.
  await expect(statusLocator(page)).toHaveText('stopped', {timeout: 60_000});
  await expect(output(page)).toContainText('jackpot!');
});

test('objects.xml reads keys and nested values off a created object', async ({
  page,
}) => {
  await loadSample(page, './samples/objects.xml');
  await toggleRun(page);

  await expect(statusLocator(page)).toHaveText('stopped', {timeout: 10_000});
  await expect(output(page)).toContainText('foo,bar,nested');
  await expect(output(page)).toContainText('baz');
  await expect(output(page)).toContainText('42');
});

test('playAudio.xml plays an audio file without error', async ({page}) => {
  await loadSample(page, './samples/playAudio.xml');
  await toggleRun(page);

  await expect(statusLocator(page)).toHaveText('stopped', {timeout: 15_000});
});

test('sounds.xml plays a sequence of audio clips without error', async ({
  page,
}) => {
  await loadSample(page, './samples/sounds.xml');
  await toggleRun(page);

  await expect(statusLocator(page)).toHaveText('stopped', {timeout: 20_000});
});

test('events.xml fires odd/even state events as its counter changes', async ({
  page,
}) => {
  await loadSample(page, './samples/events.xml');
  await toggleRun(page);

  // event/state_definition blocks keep the interpreter running indefinitely,
  // so this program never reaches "stopped" on its own - it has to be
  // stopped from the toolbar once its output is in.
  await expect(statusLocator(page)).toHaveText('running');
  await expect(output(page).getByText('10 is even.', {exact: true})).toBeVisible({
    timeout: 10_000,
  });
  await expect(output(page)).toContainText('1 is odd');
  await expect(output(page)).toContainText('2 is even.');
  await expect(output(page)).toContainText('9 is odd');

  await toggleRun(page);
  await expect(statusLocator(page)).toHaveText('stopped');
});

test('everyMinutes.xml starts its every_seconds intervals', async ({page}) => {
  await loadSample(page, './samples/everyMinutes.xml');
  await toggleRun(page);

  // every_seconds blocks also keep the interpreter running indefinitely.
  await expect(statusLocator(page)).toHaveText('running');
  await expect(
    output(page).getByText('2 seconds passed', {exact: true}).first()
  ).toBeVisible({timeout: 10_000});

  await toggleRun(page);
  await expect(statusLocator(page)).toHaveText('stopped');
});

test('requests.xml runs its HTTP requests to a terminal state', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await loadSample(page, './samples/requests.xml');
  await toggleRun(page);

  // The GET/PUT/POST/DELETE calls to httpbin each display their HTTP status
  // early in the run, before the trailing SPARQL blocks.
  await expect(output(page)).toContainText('200', {timeout: 20_000});

  // http_request now aborts after 10s (requests.ts), so the run can no longer
  // hang: it settles into a terminal state once the SPARQL calls to harth.org
  // resolve or fail. This depends on httpbin.org and harth.org being reachable;
  // note the SPARQL path (urdfQueryWrapper) still has no fetch timeout of its own.
  await expect(statusLocator(page)).toHaveText(/^(stopped|error)$/, {
    timeout: 50_000,
  });
});
