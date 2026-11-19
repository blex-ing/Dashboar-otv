import {expect,test} from '@playwright/test';
for(const view of ['inicio','candidatos','comparar','verificar','metodo','fuentes']){
 test(`pantalla ${view} sin desbordamientos`,async({page},info)=>{
  await page.goto(`/?lugar=otavalo&vista=${view}`);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.getByText('La votación pública está cerrada.',{exact:false})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({path:info.outputPath(`${view}.png`),fullPage:true});
 });
}
test('filtros, detalle, documento, historial y enlace directo',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=verificar');
 await page.getByLabel('Candidatura',{exact:true}).selectOption('ana');
 await page.getByRole('button',{name:'Contradicho 1',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'1 afirmaciones encontradas'})).toBeVisible();
 await page.getByRole('button',{name:/Todos los proyectos registrados/}).click();
 await expect(page.getByRole('heading',{name:'Cómo se interpreta'})).toBeVisible();
 const url=page.url();await page.reload();await expect(page.getByRole('heading',{name:'Cómo se interpreta'})).toBeVisible();
 await page.getByRole('button',{name:'Abrir documento ↗'}).click();await expect(page.getByRole('heading',{name:'Registro de obras de ejemplo'})).toBeVisible();
 await page.goBack();await expect(page.getByRole('heading',{name:'Cómo se interpreta'})).toBeVisible();
 expect(url).toContain('afirmacion=ana-obras');
});
test('simulación no envía votos y cambio de localidad',async({page})=>{
 const writes:string[]=[];page.on('request',r=>{if(r.method()==='POST')writes.push(r.url());});
 await page.goto('/');await page.getByRole('button',{name:'Simular apoyo a Ana',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'No se ha enviado ni guardado'})).toBeVisible();
 await page.reload();await expect(page.getByRole('button',{name:'Simular apoyo a Ana',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByLabel('Localidad').selectOption('ibarra');await expect(page.locator('main h1')).toContainText('Ibarra');expect(writes).toEqual([]);
});
test('teclado y comparación temática',async({page})=>{
 await page.goto('/?vista=comparar');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Saltar al contenido'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 await page.getByLabel('Tema',{exact:true}).selectOption('Economía local');await expect(page.locator('.proposal')).toHaveCount(3);await expect(page.getByRole('heading',{name:'Mercados con oportunidades'})).toBeVisible();
});
test('búsqueda sin resultados, enlace inválido y catálogo no disponible',async({page})=>{
 await page.route('**/api/public/catalog',r=>r.fulfill({status:503,body:'unavailable'}));
 await page.goto('/?vista=verificar');await expect(page.getByText('No se pudo cargar el catálogo remoto.',{exact:false})).toBeVisible();
 await page.getByLabel('Buscar afirmaciones').fill('zz-no-existe');await expect(page.getByRole('heading',{name:'No hay resultados'})).toBeVisible();await page.getByRole('button',{name:'Restablecer'}).click();await expect(page.locator('.claim-card')).toHaveCount(12);
 await page.goto('/?lugar=missing');await expect(page.getByRole('heading',{name:'Localidad no encontrada'})).toBeVisible();
});
