import {expect,test} from '@playwright/test';

test('diseño E35 integrado mantiene la ruta, cabecera y cinco observaciones',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=seguridad-vial');
 await expect(page.getByRole('main')).toHaveCount(1);
 await expect(page.locator('main h1')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:/Una vía rápida/})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Estado visual identificado'})).toBeVisible();
 await expect(page.locator('[data-visible-observation]')).toHaveCount(5);
 await expect(page.getByRole('heading',{name:'Lectura simplificada del espacio'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Copiar coordenadas'})).toBeVisible();
 await expect(page.getByRole('link',{name:/Abrir ubicación/})).toHaveAttribute('href',/maps\.app\.goo\.gl/);
 for(const name of ['Resumen','Evidencias','Riesgos','Trabajo de campo','Fuentes'])
   await expect(page.getByRole('navigation',{name:'Apartados de seguridad vial'}).getByText(name,{exact:true})).toBeVisible();
});

test('filtrado y visor con teclado, controles anterior siguiente y navegación desde riesgos',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=seguridad-vial');
 await page.getByRole('button',{name:'Fotografías (10)'}).click();
 await expect(page.locator('[data-evidence-id]')).toHaveCount(10);
 await page.getByRole('combobox',{name:'Filtrar fotografías'}).selectOption('Peatones');
 await expect(page.locator('[data-evidence-id]')).toHaveCount(3);
 await page.locator('[data-evidence-id="F05"]').getByRole('button',{name:/Abrir F05/}).click();
 await expect(page.getByRole('dialog',{name:/F05/})).toBeVisible();
 await expect(page.getByRole('dialog').getByText('Por comprobar')).toBeVisible();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('dialog',{name:/F07/})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Riesgos (7)'}).click();
 await page.getByRole('combobox',{name:'Filtrar riesgos'}).selectOption('Peatones');
 await expect(page.locator('[data-risk-id]')).toHaveCount(2);
 await page.locator('[data-risk-id="R02"]').getByRole('button',{name:/Ver evidencias relacionadas/}).click();
 await expect(page.getByRole('dialog',{name:/F05/})).toBeVisible();
});

test('importación privada de imagen JSON sin modificar las diez fichas originales',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=seguridad-vial');
 await page.getByRole('button',{name:'Fotografías (10)'}).click();
 const tiny='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/ZUsAAAAASUVORK5CYII=';
 const payload={images:[{id:'Nlocal01',name:'Imagen local de prueba',category:'Entorno',observation:'Observación de laboratorio',verify:'Comprobar en terreno',period:'2026-11-23',source:'Prueba del navegador',src:tiny}]};
 await page.getByLabel('Importar expediente JSON').setInputFiles({name:'expediente.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});
 await expect(page.locator('[data-evidence-id]')).toHaveCount(11);
 await expect(page.getByText('Imagen local de prueba')).toBeVisible();
 await expect(page.getByText('11', {exact:true})).toBeVisible();
 const download=page.waitForEvent('download');
 await page.getByRole('button',{name:'Exportar expediente JSON'}).click();
 const d=await download;
 expect(d.suggestedFilename()).toContain('E35_');
 await page.reload();
 await page.getByRole('button',{name:'Fotografías (10)'}).click();
 await expect(page.locator('[data-evidence-id]')).toHaveCount(10);
});

test('checklist conserva progreso y exportación sin persistencia',async({page,context})=>{
 await page.goto('/?lugar=otavalo&vista=seguridad-vial');
 await page.getByRole('button',{name:'Inspección de campo'}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 await page.getByRole('checkbox',{name:'Reconocer todas las aproximaciones'}).check();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
 const download=page.waitForEvent('download');
 await page.getByRole('button',{name:'Exportar lista JSON'}).click();
 expect((await download).suggestedFilename()).toContain('Inspeccion');
 await page.reload();
 await page.getByRole('button',{name:'Inspección de campo'}).click();
 await expect(page.getByRole('checkbox',{name:'Reconocer todas las aproximaciones'})).not.toBeChecked();
 expect(await context.cookies()).toEqual([]);
 expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
});

test('fuentes y cronología distinguen colisión de atropello sin estadísticas ficticias',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=seguridad-vial');
 await page.getByRole('button',{name:'Siniestros y fuentes'}).click();
 await expect(page.getByRole('heading',{name:'Fuentes y límites del estudio'})).toBeVisible();
 await expect(page.getByText('Gobernación de Imbabura',{exact:false})).toBeVisible();
 await expect(page.getByText('GAD parroquial Eugenio Espejo',{exact:false})).toBeVisible();
 await expect(page.getByText('30 de octubre de 2026')).toBeVisible();
 await expect(page.getByText('Colisión entre vehículos',{exact:false})).toBeVisible();
 await expect(page.getByText('atropello confirmado',{exact:true})).toHaveCount(0);
 await expect(page.locator('.podium')).toHaveCount(0);
});

test('diseño integrado responsive 320/390/1440 y preferencias movimiento reducido',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:800});
  await page.goto('/?lugar=otavalo&vista=seguridad-vial');
  await expect(page.getByRole('main')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
 }
});
