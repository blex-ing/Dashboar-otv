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
test('filtros, detalle, documento, historial y enlace directo',async({page},info)=>{
 await page.goto('/?lugar=otavalo&vista=verificar');
 await page.getByLabel('Candidatura',{exact:true}).selectOption('ana');
 await page.getByRole('button',{name:'Contradicho 1',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'1 afirmaciones encontradas'})).toBeVisible();
 await page.getByRole('button',{name:/Todos los proyectos registrados/}).click();
 await expect(page.getByRole('heading',{name:'Cómo se interpreta'})).toBeVisible();
 await page.screenshot({path:info.outputPath('detalle.png'),fullPage:true});
 const url=page.url();await page.reload();await expect(page.getByRole('heading',{name:'Cómo se interpreta'})).toBeVisible();
 await page.getByRole('button',{name:'Abrir documento ↗'}).click();await expect(page.getByRole('heading',{name:'Registro de obras de ejemplo'})).toBeVisible();
 await page.screenshot({path:info.outputPath('documento.png'),fullPage:true});
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

test('perfil, propuestas y marcador temporal',async({page},info)=>{
 await page.goto('/?lugar=otavalo&vista=candidatos&c=ana');
 await expect(page.locator('main h1')).toHaveText('Ana Rivera');
 await expect(page.getByRole('heading',{name:'Agua con seguimiento público'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
 await page.screenshot({path:info.outputPath('perfil.png'),fullPage:true});
 await page.getByRole('button',{name:'Momento 7:00: Todos los proyectos registrados están terminados.',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Cómo se interpreta'})).toBeVisible();
 await expect(page.getByText('Momento seleccionado 7:00 / 15:00')).toBeVisible();
});

test('catálogo estructuralmente inválido muestra fallback demo sin error de React',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/public/catalog',r=>r.fulfill({
  status:200,
  contentType:'application/json',
  body:JSON.stringify({mode:'demo',territories:[{id:'otavalo',name:'Otavalo',candidates:null}]})
 }));
 await page.goto('/?lugar=otavalo&vista=inicio');
 await expect(page.getByText('No se pudo cargar el catálogo remoto.',{exact:false})).toBeVisible();
 await expect(page.locator('main h1')).toContainText('Otavalo');
 expect(errors).toEqual([]);
});

test('390 px: vistas, foco visible y movimiento reducido',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const view of ['inicio','candidatos','comparar','verificar','metodo','fuentes']){
  await page.goto('/?lugar=otavalo&vista='+view);
  await expect(page.locator('main h1')).toBeVisible();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
 }
 await page.goto('/?lugar=otavalo&vista=inicio');
 await page.keyboard.press('Tab');
 const skip=page.getByRole('link',{name:'Saltar al contenido'});
 await expect(skip).toBeFocused();
 const styles=await skip.evaluate(el=>({
  outline:getComputedStyle(el).outlineStyle,
  scroll:getComputedStyle(document.documentElement).scrollBehavior
 }));
 expect(styles.outline).not.toBe('none');
 expect(styles.scroll).toBe('auto');
});

test('multi-edition deep links, isolated counts and old URLs',async({page})=>{
 const {demoCatalog}=await import('../../../shared/catalog');
 const data=structuredClone(demoCatalog);
 const other=structuredClone(data.territories[0].editions[0]);
 other.id='segundo';other.label='Segunda edición ficticia';
 other.candidates[0].votes=10;other.candidates[1].votes=0;other.candidates[2].votes=0;
 other.claims=other.claims.slice(0,1);
 other.sources=other.sources.slice(0,1);
 data.territories[0].editions.push(other);
 await page.route('**/api/public/catalog',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)}));
 await page.goto('/?lugar=otavalo&vista=inicio');
 await expect(page.getByLabel('Edición')).toHaveValue('laboratorio');
 await page.getByLabel('Edición').selectOption('segundo');
 await expect(page).toHaveURL(/edicion=segundo/);
 await expect(page.getByText('10 apoyos ficticios')).toBeVisible();
 await page.getByRole('link',{name:/Verificaciones/}).click();
 await expect(page.locator('.claim-card')).toHaveCount(1);
 await page.reload();await expect(page.locator('.claim-card')).toHaveCount(1);
 await page.goBack();await expect(page.getByText('10 apoyos ficticios')).toBeVisible();
 await page.getByLabel('Edición').selectOption('laboratorio');
 await expect(page.getByText('2.675 apoyos ficticios')).toBeVisible();
 await page.goto('/?lugar=ibarra&edicion=segundo&vista=inicio');
 await expect(page.getByRole('heading',{name:'Localidad no encontrada'})).toBeVisible();
});
