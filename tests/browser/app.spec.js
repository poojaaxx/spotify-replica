import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('playback, search, library, queue controls, seeking, and saved tracks', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Play Midnight Motion', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await expect.poll(() => page.locator('audio').evaluate(a => a.currentTime)).toBeGreaterThan(0.2);
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await page.getByRole('searchbox').fill('paper');
  await expect(page.getByRole('button', { name: 'Listen to A Little Space by Paper Satellites' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Listen to Midnight Motion by Studio North' })).toHaveCount(0);
  await page.getByRole('searchbox').fill('nonexistent');
  await expect(page.getByText('No tracks found')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('button', { name: 'Save A Little Space', exact: true }).click();
  await page.getByRole('button', { name: 'Your Library', exact: true }).click();
  await page.locator('.liked-banner').click();
  await expect(page.getByRole('button', { name: 'Listen to A Little Space by Paper Satellites' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Listen to A Little Space by Paper Satellites' })).toBeVisible();
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await page.locator('.quick-grid button').first().click();
  await expect(page.getByRole('heading', { name: 'After Hours' })).toBeVisible();
  await page.getByRole('button', { name: 'Play After Hours', exact: true }).click();
  await page.getByRole('button', { name: 'Next track', exact: true }).click();
  await expect(page.locator('.now-playing strong')).toHaveText('Between the Lines');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const seek = page.getByRole('slider', { name: 'Seek playback' });
  await seek.fill('12');
  await expect.poll(() => page.locator('audio').evaluate(a => a.currentTime)).toBeGreaterThan(11);
  await seek.fill('0');
  await page.getByRole('button', { name: 'Previous track', exact: true }).click();
  await expect(page.locator('.now-playing strong')).toHaveText('Midnight Motion');
  await page.getByRole('button', { name: 'Repeat track', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Repeat track', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Shuffle', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Shuffle', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await expect.poll(() => page.locator('audio').evaluate(a => a.muted)).toBe(true);
  await page.getByRole('slider', { name: 'Volume' }).fill('0.3');
  await expect.poll(() => page.locator('audio').evaluate(a => a.volume)).toBe(0.3);
  await expect(page.getByRole('button', { name: 'Go back' })).toBeEnabled();
  await page.getByRole('button', { name: 'Go back' }).click();
  await expect(page.getByRole('heading', { name: 'Music for your moment.' })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const [name, width, height] of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844],['small-mobile',320,740]]) {
  test(`${name}: layout, images, navigation, and keyboard`, async ({ page }) => {
    await page.setViewportSize({width,height});
    await page.goto('/');
    await expect(page.getByRole('heading', {name:'Music for your moment.'})).toBeVisible();
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.main-panel').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.screenshot({path:`.tools/screenshots/${name}-home.png`,fullPage:true});
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await page.getByRole('button',{name:'Your Library',exact:true}).click();
    await page.locator('.playlist-card').first().click();
    await expect(page.getByRole('heading',{name:'After Hours'})).toBeVisible();
    await page.screenshot({path:`.tools/screenshots/${name}-playlist.png`,fullPage:true});
    expect(await page.locator('.main-panel').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.getByRole('button',{name:'Play After Hours',exact:true}).click();
    await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Search',exact:true}).click();
    await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
    await page.screenshot({path:`.tools/screenshots/${name}.png`,fullPage:true});
  });
}

test('audio errors and browser restrictions produce useful messages',async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => {HTMLMediaElement.prototype.play=() => Promise.reject(new DOMException('Blocked','NotAllowedError'));});
  await page.getByRole('button',{name:'Play Midnight Motion',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('Your browser paused playback');
  await page.evaluate(() => document.querySelector('audio').dispatchEvent(new Event('error')));
  await expect(page.getByRole('alert')).toContainText('Audio unavailable');
});

test('ended events repeat or advance through the selected queue', async ({page}) => {
  await page.goto('/#after-hours');
  await page.getByRole('button',{name:'Play After Hours',exact:true}).click();
  await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
  await page.locator('audio').evaluate(a => a.dispatchEvent(new Event('ended')));
  await expect(page.locator('.now-playing strong')).toHaveText('Between the Lines');
  await page.getByRole('button',{name:'Repeat track',exact:true}).click();
  await page.locator('audio').evaluate(a => a.dispatchEvent(new Event('ended')));
  await expect(page.locator('.now-playing strong')).toHaveText('Between the Lines');
  await page.getByRole('button',{name:'Repeat track',exact:true}).click();
  await page.getByRole('button',{name:'Shuffle',exact:true}).click();
  await page.getByRole('button',{name:'Next track',exact:true}).click();
  await expect(page.locator('.now-playing strong')).not.toHaveText('Between the Lines');
});

for (const width of [1440,390]) {
  test(`accessible home, playlist, search, and library at ${width}px`,async ({page}) => {
    await page.setViewportSize({width,height:1000});
    for (const view of ['home','after-hours','search','library','liked']) {
      await page.goto(`/#${view}`);
      const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      expect(result.violations,`${view}: ${JSON.stringify(result.violations.map(v => ({id:v.id,nodes:v.nodes.map(n => n.target)})))}`).toEqual([]);
    }
  });
}
