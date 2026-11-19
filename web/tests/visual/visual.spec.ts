import { expect, test } from '@playwright/test';

test('muestra la ficha y las propuestas por tema', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Candidatos y propuestas' })).toBeVisible();
  const profile = page.getByRole('region', { name: 'Ana Rivera' });
  await expect(profile.getByRole('heading', { name: 'Formación' })).toBeVisible();
  await expect(profile.getByRole('heading', { name: 'Talleres entre participantes' })).toBeVisible();
  await expect(profile.getByRole('heading', { name: 'Participación' })).toBeVisible();
  await expect(page.getByText('La votación está cerrada.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({ path: testInfo.outputPath('candidate-profile.png'), fullPage: true });
});

test('permite cambiar de ficha mediante el selector y el teclado', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('radio', { name: 'Luis Mendoza' }).check();
  await expect(page.getByRole('heading', { name: 'Guías prácticas' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('candidate-luis.png'), fullPage: true });

  await page.getByRole('radio', { name: 'Luis Mendoza' }).focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('radio', { name: 'Ana Rivera' })).toBeChecked();
  await expect(page.getByRole('heading', { name: 'Talleres entre participantes' })).toBeVisible();
});
