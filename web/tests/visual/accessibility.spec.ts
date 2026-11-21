import {expect,test} from '@playwright/test';

// Lightweight automated accessibility guardrails (not a WCAG audit).
for(const view of ['inicio','candidatos','comparar','verificar','metodo','fuentes','elecciones','aviso-legal','privacidad','cookies']){
 test(`accessible structure and control names: ${view}`,async({page})=>{
  await page.goto(`/?lugar=${['inicio','candidatos','comparar','verificar','fuentes'].includes(view)?'ciudad-ejemplo':'otavalo'}&vista=${view}`);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('navigation',{name:'Principal'})).toHaveCount(1);
  await expect(page.getByRole('link',{name:'Saltar al contenido'})).toHaveAttribute('href','#main');
  const issues=await page.evaluate(()=>{
   const visible=(element:Element)=>{const box=element.getBoundingClientRect();
     const style=getComputedStyle(element);
     return box.width>0&&box.height>0&&style.visibility!=='hidden'&&style.display!=='none';};
   const controls=[...document.querySelectorAll('button, a[href], input, select, textarea')].filter(visible);
   const unnamed=controls.filter(el=>{
     const label=el.getAttribute('aria-label')?.trim() ||
       el.getAttribute('aria-labelledby')?.split(/\s+/).map(id=>document.getElementById(id)?.textContent?.trim()||'').join(' ').trim() ||
       (el instanceof HTMLElement?el.innerText.trim():'') ||
       (el instanceof HTMLInputElement?el.value.trim():'');
     if(el instanceof HTMLSelectElement||el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement) {
       return !label && !el.labels?.length;
     }
     return !label;
   }).map(el=>el.outerHTML.slice(0,180));
   const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
   const duplicateIds=ids.filter((id,index)=>ids.indexOf(id)!==index);
   const headings=[...document.querySelectorAll('main h1')].filter(visible).length;
   return {unnamed,duplicateIds,headings};
  });
  expect(issues.unnamed,'controls lacking accessible names').toEqual([]);
  expect(issues.duplicateIds,'duplicate DOM ids').toEqual([]);
  expect(issues.headings,'single visible main heading').toBe(1);
 });
}

test('keyboard skip navigation and focus visible in mobile layout',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/?lugar=ciudad-ejemplo&vista=inicio');
 await page.keyboard.press('Tab');
 const skip=page.getByRole('link',{name:'Saltar al contenido'});
 await expect(skip).toBeFocused();
 await expect(skip).toHaveCSS('outline-style','solid');
 await page.keyboard.press('Enter');
 await expect(page.getByRole('main')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('legal navigation and current storage disclosure stay consistent',async({page,context})=>{
 await page.goto('/?lugar=otavalo&vista=inicio');
 await expect(page.getByRole('navigation',{name:'Información legal'})).toBeVisible();
 await page.getByRole('link',{name:'Cookies',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Política de cookies'})).toBeVisible();
 expect(await context.cookies()).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
});
