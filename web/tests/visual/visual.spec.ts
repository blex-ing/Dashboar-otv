import {expect,test} from '@playwright/test';
for(const view of ['inicio','candidatos','comparar','verificar','metodo','fuentes']){
 test(`pantalla ${view} sin desbordamientos`,async({page},info)=>{
  await page.goto(`/?lugar=ciudad-ejemplo&vista=${view}`);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.getByText('La votación pública está cerrada.',{exact:false})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({path:info.outputPath(`${view}.png`),fullPage:true});
 });
}
test('filtros, detalle, documento, historial y enlace directo',async({page},info)=>{
 await page.goto('/?lugar=ciudad-ejemplo&vista=verificar');
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
 await page.goto('/?lugar=ciudad-ejemplo&vista=inicio');await page.getByRole('button',{name:'Simular apoyo a Ana',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'No se ha enviado ni guardado'})).toBeVisible();
 await page.reload();await expect(page.getByRole('button',{name:'Simular apoyo a Ana',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.getByLabel('Localidad').selectOption('ibarra');await expect(page.locator('main h1')).toContainText('Ibarra');expect(writes).toEqual([]);
});
test('teclado y comparación temática',async({page})=>{
 await page.goto('/?lugar=ciudad-ejemplo&vista=comparar');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Saltar al contenido'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 await page.getByLabel('Tema',{exact:true}).selectOption('Economía local');await expect(page.locator('.proposal')).toHaveCount(3);await expect(page.getByRole('heading',{name:'Mercados con oportunidades'})).toBeVisible();
});
test('búsqueda sin resultados, enlace inválido y catálogo no disponible',async({page})=>{
 await page.route('**/api/public/catalog',r=>r.fulfill({status:503,body:'unavailable'}));
 await page.goto('/?lugar=ciudad-ejemplo&vista=verificar');await expect(page.getByText('No se pudo cargar el catálogo remoto.',{exact:false})).toBeVisible();
 await page.getByLabel('Buscar afirmaciones').fill('zz-no-existe');await expect(page.getByRole('heading',{name:'No hay resultados'})).toBeVisible();await page.getByRole('button',{name:'Restablecer'}).click();await expect(page.locator('.claim-card')).toHaveCount(12);
 await page.goto('/?lugar=missing');await expect(page.getByRole('heading',{name:'Localidad no encontrada'})).toBeVisible();
});

test('perfil, propuestas y marcador temporal',async({page},info)=>{
 await page.goto('/?lugar=ciudad-ejemplo&vista=candidatos&c=ana');
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
 await page.goto('/?lugar=ciudad-ejemplo&vista=inicio');
 await expect(page.getByText('No se pudo cargar el catálogo remoto.',{exact:false})).toBeVisible();
 await expect(page.locator('main h1')).toContainText('Ciudad Ejemplo');
 expect(errors).toEqual([]);
});

test('390 px: vistas, foco visible y movimiento reducido',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const view of ['inicio','candidatos','comparar','verificar','metodo','fuentes']){
  await page.goto('/?lugar=ciudad-ejemplo&vista='+view);
  await expect(page.locator('main h1')).toBeVisible();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
 }
 await page.goto('/?lugar=ciudad-ejemplo&vista=inicio');
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
 const demoPlace=data.territories.find(t=>t.id==='ciudad-ejemplo')!;
 const other=structuredClone(demoPlace.editions[0]);
 other.id='segundo';other.label='Segunda edición ficticia';
 other.candidates[0].votes=10;other.candidates[1].votes=0;other.candidates[2].votes=0;
 other.claims=other.claims.slice(0,1);
 other.sources=other.sources.slice(0,1);
 demoPlace.editions.push(other);
 await page.route('**/api/public/catalog',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)}));
 await page.goto('/?lugar=ciudad-ejemplo&vista=inicio');
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

test('electoral guide uses six real candidates without simulated votes',async({page})=>{
 const writes:string[]=[];
 page.on('request',request=>{if(request.method()==='POST')writes.push(request.url());});
 await page.goto('/?lugar=otavalo&vista=elecciones');
 await expect(page.getByRole('heading',{name:'Candidaturas a la Alcaldía de Otavalo'})).toBeVisible();
 const cards=page.locator('.electoral-card');
 await expect(cards).toHaveCount(6);
 for(const name of ['Franklin Hermosa','Jorge Luis Morocho','Juan Carlos Lema Conejo',
 'Karen Daniela Guerrón Valencia','Lourdes Marisol Alta Lima','Tupac Amaru Anrango']){
  await expect(cards.getByRole('heading',{name})).toHaveCount(1);
 }
 await expect(cards.getByText('pendiente de lectura y contraste directo',{exact:false})).toHaveCount(6);
 await expect(page.getByRole('link',{name:/Consultar Voto Informado del CNE/})).toHaveAttribute('href','https://votoinformado.cne.gob.ec/');
 await expect(page.getByText('La votación pública está cerrada.',{exact:false})).toHaveCount(0);
 await expect(page.locator('.podium')).toHaveCount(0);
 await expect(page.locator('.vote-button')).toHaveCount(0);
 await expect(page.locator('.candidate-card')).toHaveCount(0);
 await page.reload();
 await expect(cards).toHaveCount(6);
 expect(writes).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test('electoral guide stays in Otavalo and preserves old demo navigation',async({page})=>{
 await page.goto('/?lugar=ibarra&vista=inicio');
 await page.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Elecciones 2026'}).click();
 await expect(page).toHaveURL(/lugar=otavalo/);
 await expect(page).toHaveURL(/vista=elecciones/);
 await expect(page.getByRole('heading',{name:'Candidaturas a la Alcaldía de Otavalo'})).toBeVisible();
 await page.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Dashboard'}).click();
 await expect(page.getByRole('heading',{name:'Otavalo: conoce las candidaturas'})).toBeVisible();
 await expect(page.locator('.real-candidate-card')).toHaveCount(6);
 await expect(page.locator('.podium')).toHaveCount(0);
});

test('electoral guide is legible without horizontal overflow on small mobile',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/?lugar=otavalo&vista=elecciones');
 await expect(page.locator('main h1')).toBeVisible();
 await expect(page.locator('.electoral-card')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('real candidates have equal deep-linkable profiles with disabled public participation',async({page,context})=>{
 const posts:string[]=[];
 page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.goto('/?lugar=otavalo&vista=elecciones');
 await expect(page.locator('.electoral-card')).toHaveCount(6);
 await expect(page.getByRole('heading',{name:'Participación pública'})).toBeVisible();
 await expect(page.getByText('No hay recuentos reales disponibles.',{exact:false})).toBeVisible();
 await expect(page.locator('.electoral-podium-candidate')).toHaveCount(0);
 for(const name of ['Franklin Hermosa','Jorge Luis Morocho','Juan Carlos Lema Conejo','Karen Daniela Guerrón Valencia','Lourdes Marisol Alta Lima','Tupac Amaru Anrango']){
  const card=page.locator('.electoral-card').filter({has:page.getByRole('heading',{name})});
  await card.getByRole('link',{name:'Consultar ficha'}).click();
  await expect(page.locator('main h1')).toHaveText(name);
  await expect(page.getByText('Votación no habilitada')).toBeVisible();
  const participate=page.getByRole('button',{name:'Votar en OTV'});
  await expect(participate).toBeDisabled();
  await expect(page.getByText('Sin datos de apoyos reales')).toBeVisible();
  await page.reload();
  await expect(page.locator('main h1')).toHaveText(name);
  await page.getByRole('link',{name:'Volver a las seis candidaturas'}).click();
 }
 expect(posts).toEqual([]);
 expect(await context.cookies()).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
});

test('unknown real candidate profile is recoverable on mobile with no false podium',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/?lugar=otavalo&vista=elecciones&c=unknown-candidate');
 await expect(page.getByRole('heading',{name:'Candidatura no encontrada'})).toBeVisible();
 await page.getByRole('link',{name:'Volver a las seis candidaturas'}).click();
 await expect(page.locator('.electoral-card')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('Otavalo dashboard presents six real candidates without invented votes or podium',async({page})=>{
 const writes:string[]=[];page.on('request',r=>{if(r.method()==='POST') writes.push(r.url());});
 await page.goto('/?lugar=otavalo&vista=inicio');
 await expect(page.getByRole('heading',{name:'Otavalo: conoce las candidaturas'})).toBeVisible();
 await expect(page.locator('.real-candidate-card')).toHaveCount(6);
 await expect(page.getByText('Ana Rivera')).toHaveCount(0);
 await expect(page.locator('.podium')).toHaveCount(0);
 await expect(page.getByText('2.675 apoyos ficticios')).toHaveCount(0);
 await expect(page.getByText('Votación no habilitada',{exact:false})).toBeVisible();
 await page.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Candidaturas'}).click();
 await expect(page.getByRole('heading',{name:'Candidaturas a la Alcaldía de Otavalo'})).toBeVisible();
 await expect(page.locator('.electoral-card')).toHaveCount(6);
 expect(writes).toEqual([]);
});

test('example city exclusively presents the existing fictional podium and demo candidates',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=inicio');
 await page.getByLabel('Localidad').selectOption('ciudad-ejemplo');
 await expect(page).toHaveURL(/lugar=ciudad-ejemplo/);
 await expect(page.locator('.podium')).toHaveCount(1);
 await expect(page.locator('.candidate-card')).toHaveCount(3);
 await expect(page.getByText('Ana Rivera').first()).toBeVisible();
 await page.getByLabel('Localidad').selectOption('otavalo');
 await expect(page.locator('.real-candidate-card')).toHaveCount(6);
 await expect(page.locator('.podium')).toHaveCount(0);
});

test('real candidate dashboard is responsive and individual profiles remain linked',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/?lugar=otavalo&vista=inicio');
 await expect(page.locator('.real-candidate-card')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await page.locator('.real-candidate-card').first().getByRole('link',{name:'Consultar ficha'}).click();
 await expect(page.locator('main h1')).toHaveText('Franklin Hermosa');
 await expect(page.getByRole('button',{name:'Votar en OTV'})).toBeDisabled();
});
