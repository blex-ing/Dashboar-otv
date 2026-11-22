import {expect,test} from '@playwright/test';

test('seguridad vial from the menu stays separated from the electoral demo',async({page})=>{
 const writes:string[]=[];
 page.on('request',request=>{if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());});
 await page.goto('/?lugar=ciudad-ejemplo&vista=inicio');
 await page.getByRole('navigation',{name:'Principal'}).getByRole('link',{name:'Seguridad vial'}).click();
 await expect(page).toHaveURL(/lugar=otavalo/);
 await expect(page).toHaveURL(/vista=seguridad-vial/);
 await expect(page.getByRole('heading',{name:/Seguridad vial: E35/})).toBeVisible();
 await expect(page.getByText('No es una valoración técnica definitiva.',{exact:false})).toBeVisible();
 await expect(page.locator('.podium')).toHaveCount(0);
 await page.reload();
 await expect(page.getByRole('heading',{name:/Seguridad vial: E35/})).toBeVisible();
 await expect(page.locator('main h1')).toHaveCount(1);
 expect(writes).toEqual([]);
});

test('seguridad vial evidence, incidents and checks are documented and interactive',async({page})=>{
 await page.goto('/?lugar=otavalo&vista=seguridad-vial');
 await page.getByRole('button',{name:'Fotografías (10)'}).click();
 await expect(page.locator('[data-evidence-id]')).toHaveCount(10);
 await page.getByRole('combobox',{name:'Filtrar fotografías'}).selectOption('Peatones');
 await expect(page.locator('[data-evidence-id]')).toHaveCount(3);
 await page.getByRole('button',{name:'Riesgos (7)'}).click();
 await expect(page.locator('[data-risk-id]')).toHaveCount(7);
 await page.getByRole('button',{name:'Siniestros y fuentes'}).click();
 await expect(page.getByText('30 de octubre de 2026')).toBeVisible();
 await expect(page.getByText('Colisión entre vehículos', {exact:false})).toBeVisible();
 await expect(page.getByText('atropello confirmado', {exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Inspección de campo'}).click();
 const check=page.getByRole('checkbox',{name:'Reconocer todas las aproximaciones'});
 await check.check(); await expect(check).toBeChecked();
 await page.reload();
 await page.getByRole('button',{name:'Inspección de campo'}).click();
 await expect(page.getByRole('checkbox',{name:'Reconocer todas las aproximaciones'})).not.toBeChecked();
});

test('seguridad vial responsive 320, 390, 1440 and no client storage',async({page,context})=>{
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:850});
  await page.goto('/?lugar=otavalo&vista=seguridad-vial');
  await expect(page.locator('main h1')).toHaveCount(1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow,'overflow at '+width).toBe(false);
 }
 expect(await context.cookies()).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
});
