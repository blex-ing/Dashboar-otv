# Auditoría técnica Dashboard OTV — 2026-11-19

**Repositorio:** [blex-ing/Dashboar-otv](https://github.com/blex-ing/Dashboar-otv)  
**Referencia:** `develop`, commit `02729b61995ebe541785538cd24efb5305842e55` (merge de sincronización desde master). `master`: `bb9ad9d099407f226e57de5ad2a745b2a519a2a8`; comparación: develop 1 commit por delante, sin archivos distintos.  
**Alcance autorizado:** auditoría documental y estática, sin cambios funcionales, sin despliegues ni merges.  
**Clasificación:** DC = defecto confirmado del código/diseño, R = riesgo condicionado, M = mejora opcional.

## 1. Resumen ejecutivo

El proyecto **v0.3.0 es un laboratorio con contenido ficticio**, no un observatorio con datos electorales reales. La API solo sirve el catálogo demo y salud; `/api/votes` devuelve 503, por lo que **no hay endpoint de votación habilitado**. La selección de apoyo se guarda únicamente en estado React. El Worker separa `/api/*` de assets y configura CSP para assets. La documentación distingue funcionalidades actuales y futuras. No se ha detectado en esta lectura un mecanismo activo que registre votos.

**Prioridades:** validar el JSON remoto y sus relaciones; descomponer el componente visual monolítico sin perder comportamiento; introducir edición como entidad antes de contenido real; fortalecer ensayos de error y accesibilidad. La base compartida y las clases actuales no justifican microservicios ni reescritura completa.

**Importante:** CI verde no significa que el código esté libre de defectos ni que se haya certificado WCAG/seguridad.

## 2. Alcance, versiones, metodología y limitaciones

### Archivos consultados
`web/package.json`, `web/src/observatory/App.tsx`, `web/src/candidates/CandidateProfiles.tsx`, `web/src/styles.css`, `web/scripts/bundle.mjs`, `web/playwright.config.ts`, `web/tests/visual/visual.spec.ts`, `worker/index.ts`, `shared/catalog.ts`, `shared/domain.ts`, `migrations/0001_initial.sql`, `tests/*.test.mjs`, `tests/schema_test.py`, `wrangler.jsonc`, `.github/workflows/{ci,publish-release,cleanup-temporary-branches}.yml`, README y documentos de requisitos, arquitectura, releases, flujo Git y privacidad.

**Versiones declaradas directamente en package.json:** Node `>=24 <25`; React y React DOM `19.3.1`; TypeScript `7.0.2`; esbuild `0.28.2`; Playwright `1.65.1`. Son las versiones fijadas en el manifiesto, no una comprobación independiente de la resolución de cada paquete. Framework: React funcional con hooks; compilación por script esbuild, sin Vite. Cloudflare usa `assets.run_worker_first: true`.

### Evidencia de CI (no ejecutada localmente por el auditor)
GitHub Actions [ejecución 44520944150](https://github.com/blex-ing/Dashboar-otv/actions/runs/44520944150), commit auditado, concluida **success**: jobs `TypeScript, domain, SQL and build` y `Visual QA (Chromium)`; los pasos `npm run check`, `npm audit --audit-level=high` y `npm run test:visual` concluyeron success. La configuración Playwright declara proyectos 1440×900, 320×800 e iPhone 13 emulado con Chromium. Esto no sustituye verificación manual de capturas ni de dispositivos iOS reales.

**Limitaciones:** acceso por conector GitHub, sin clon/instalación de paquetes en runtime de auditoría; intento de clonación local fallido por resolución DNS. No se han corrido instrumentos AST, linters de complejidad, `npm audit` local, escáner de secretos, auditoría WCAG, Lighthouse o navegación visual humana. Tampoco se ha inspeccionado configuración efectiva del panel Cloudflare, cabeceras en producción, métricas de facturación, reglas GitHub ni respuestas reales del sitio. No se atribuyen resultados a ensayos no ejecutados.

### Métricas comprobables y reproducibilidad

| Métrica | Resultado observado | Método y cautela |
|---|---:|---|
| `App.tsx` | 58 líneas físicas, línea más larga observada 3.211 caracteres | Contar saltos de línea y longitud; JSX extremadamente compacto, **no** significa 58 líneas de complejidad |
| `styles.css` | 7 líneas físicas, línea más larga observada 14.583 caracteres | CSS minificado en origen, dificulta revisión y diffs |
| `shared/catalog.ts` | 51 líneas físicas | Código compacto, mezcla modelo, servicios y fixtures |
| `worker/index.ts` | 21 líneas físicas | Servicio API y headers |
| Localidades demo | 2 (`otavalo`, `ibarra`) | Constante `demoCatalog` |
| Candidaturas por localidad | 3 | Fixture compartida y clonada |
| Afirmaciones por localidad | 12 | 4 por candidatura; relaciones comprobadas en test |
| Casos `test(...)` en suite Node | 4 | 2 en `domain.test.mjs`, 2 en `observatory.test.mjs` |
| Casos Playwright definidos | 11 | 6 pantallas + 5 recorridos, repetidos por proyecto |
| Proyectos Playwright | 3 | desktop, narrow, mobile |
| Complejidad ciclomática por función | **No medida** | Requiere parser ESLint/TypeScript y regla `complexity` |
| Complejidad cognitiva y nesting | **No medidos** | Requiere analizador adecuado |
| Duplicación cuantificada, código muerto | **No medidos** | Requiere `jscpd`, análisis estático y revisión de imports |
| Bundle comprimido / consumo Worker | **No medidos** | Requiere build reproducible, gzip/brotli y métricas operativas |

Reproducción propuesta en un clon aislado: `cd web && npm ci && npm run check && npm audit --audit-level=high && npx playwright install chromium && npm run test:visual`; generar `dist` y pesar JS/CSS gzip; añadir temporalmente en una **rama de trabajo futura** ESLint con `complexity: ['warn',10]`, regla de profundidad y plugin de complejidad cognitiva compatible con TypeScript; revisar manualmente las funciones marcadas. No añadir reglas o paquetes sin comprobar compatibilidad y medir antes/después. El umbral >10 es señal de inspección, no rechazo automático.

## 3. Hallazgos priorizados

### OTV-01 — ALTA — R: contrato remoto insuficientemente validado

**Ubicación:** `web/src/observatory/App.tsx:12-16,24-27`; `shared/catalog.ts:2-12,18-26`.  
**Evidencia:** `CatalogClient.load` lee `response.json()` y únicamente exige `mode==='demo'`, `territories` como array y longitud no nula. Luego `ObservatoryService` presupone candidatos, propuestas, claims, sources, entrevistas y valores numéricos íntegros.  
**Impacto/condición:** JSON sintácticamente válido pero incompleto o malformado, introducido por fallo editorial/backend futuro, puede producir error de renderizado (`t.candidates.map`, `t.claims.find`) o clasificaciones erróneas. Hoy el Worker expone un fixture conocida; **no es una vulnerabilidad explotable confirmada en producción**.  
**Propuesta:** validar en runtime al borde de entrada, con límites de tamaño, arrays y campos, enums de veredicto, IDs, relaciones, fechas y valores finitos/no negativos; dar error controlado y mantener fallback explícito. Puede usarse una librería solo si reduce complejidad respecto a validadores manuales; separar contrato válido del parseo sin duplicar tipos. **Alternativa:** validar en Worker y cliente, con pruebas comunes.  
**Esfuerzo:** M (1–2 jornadas). **Cierre:** tests con respuesta nula, objeto vacío, localidad vacía, candidatura sin propuestas, vínculos rotos, votos NaN/negativos, payload masivo; interfaz nunca queda en blanco.

### OTV-02 — MEDIA — DC: responsabilidades y JSX concentrados

**Ubicación:** `web/src/observatory/App.tsx:11-57`.  
**Evidencia:** archivo contiene rutas, cliente de datos, hooks, selección simulada, podio, tarjetas, comparación, entrevista, filtros, detalle y método. JSX y CSS usan líneas de miles de caracteres.  
**Impacto:** mayor coste de revisiones, cambios visuales arriesgados, dificultad de medir complejidad y de aislar pruebas. No se demuestra circularidad entre módulos; **no inventar ciclos**.  
**Propuesta:** extraer `CatalogClient` a módulo de acceso a datos; `readRoute/navigate` a hook de navegación; páginas `Dashboard`, `Comparison`, `Verification`, `Method` por responsabilidad. Reusar Avatar/Badge/Empty sin crear jerarquías de clases. Mantener clase `ObservatoryService` si el comportamiento de cálculo justifica su interfaz; evita reimplementar rankings/filtros en vistas. **Alternativa:** extracción incremental de solo dos piezas prioritarias antes de descomponer todas las vistas.  
**Esfuerzo:** M–L (2–4 jornadas). **Cierre:** pruebas de rutas y filtrado inalteradas, diffs pequeños, sin traslado de complejidad ni dependencia circular nueva.

### OTV-03 — ALTA antes de publicar contenidos reales — R: edición no está normalizada en catálogo

**Ubicación:** `shared/catalog.ts:8,14-15,28-51`; `documentacion/REQUISITOS.md:66-73`; `migrations/0001_initial.sql:2-7`.  
**Evidencia:** `Territory` incluye `edition: string` descriptivo y arrays propios. El esquema SQL, no usado por la API actual, sí tiene campañas y restricciones compuestas. Falta contrato explícito `territoryId + editionId` y un modo `real` versionado.  
**Impacto/condición:** varias elecciones de una localidad, importación de fuentes reales o distintas campañas pueden mezclarse si se amplía la fixture sin introducir un eje de edición. Hoy las dos localidades demo permanecen separadas.  
**Propuesta:** definir entidad de edición con ID estable y metadatos de fechas, estado y procedencia; claves compuestas y controles de aislamiento, API con contrato versionado antes de persistencia. **Alternativa:** mantener catálogo JSON hasta que exista edición real, pero definir invariantes y pruebas de aislamiento ya.  
**Esfuerzo:** M–L (2–4 jornadas). **Cierre:** dos ediciones de una localidad coexistiendo; rutas, filtros y métricas no mezclan resultados; IDs inválidos producen estado recuperable.

### OTV-04 — MEDIA — DC: CSS fuente difícil de mantener

**Ubicación:** `web/src/styles.css:1-6`.  
**Evidencia:** casi todo el CSS en seis líneas extensas (una supera 14.000 caracteres). Media queries a 1150, 850 y 540px y reducción de movimiento presentes.  
**Impacto:** revisiones y conflictos difíciles; mayor riesgo de alterar layouts sin detectar el cambio.  
**Propuesta:** formatear CSS **sin cambiar reglas ni orden de cascada** en PR específico, luego dividir por responsabilidades únicamente cuando haya reutilización real; validación visual antes/después a 320/390/1440. **Alternativa:** formatter automático con diff de tokens CSS y snapshots.  
**Esfuerzo:** S–M (0,5–1,5 jornadas). **Cierre:** CSS equivalente en navegador y capturas comparadas, foco, contrastes y ausencia de overflow sin regresiones.

### OTV-05 — MEDIA — R: pruebas de frontera y UX insuficientes

**Ubicación:** `tests/domain.test.mjs:1-5`, `tests/observatory.test.mjs:1-26`, `web/tests/visual/visual.spec.ts:1-~60`, `web/playwright.config.ts:1-17`.  
**Evidencia:** hay pruebas reales de API cerrada, SQLite, filtros, historial, enlace profundo, no-POST, fallback, 320 y responsive, pero no casos de JSON remoto malformado, recuperaciones de excepciones ni campaña multi-edición; capturas creadas no equivalen a comparación visual automatizada. No se ejecuta axe ni validación de contraste.  
**Impacto:** CI puede seguir verde tras regresiones fuera de recorridos previstos.  
**Propuesta:** tests de contrato Worker/cliente, casos límite y aislamiento por edición, interceptación de errores de página; pruebas de accesibilidad focalizadas y revisión manual real en iOS/safari cuando sea posible. **Alternativa:** cobertura incremental en cada extracción de componente.  
**Esfuerzo:** M (1–3 jornadas). **Cierre:** fixtures adversariales y pruebas de navegación/contexto, reporte de accesibilidad, capturas revisadas; no declarar certificación WCAG.

### OTV-06 — MEDIA — R: API y despliegue preparados solo para lectura demo

**Ubicación:** `worker/index.ts:1-21`, `wrangler.jsonc:1-22`.  
**Evidencia:** GET health/catalog, 503 a votos, 404 a otras rutas API, `Cache-Control: no-store`, `nosniff`; el Worker agrega `Referrer-Policy` y CSP solo a respuestas de assets. `run_worker_first:true` hace atravesar el Worker a cada recurso estático. No hay binding D1 activo; el SQL es diseño futuro.  
**Impacto/condición:** coste de invocaciones mayor que con routing selectivo si el tráfico crece, sin cuantificar; futuras API privadas requerirán auth, límites y validación. No atribuir exposición de datos personales a endpoints que no existen.  
**Propuesta:** evaluar `run_worker_first:['/api/*']` con la política efectiva de cabeceras de assets preservada (`_headers` u otra configuración probada). Mantener closed-by-default para voto. Evaluar cache pública únicamente si el catálogo deja de ser dinámico; nunca cachear respuestas sensibles. **Alternativa:** conservar la implementación simple actual mientras el coste sea irrelevante.  
**Esfuerzo:** S–M (0,5–2 jornadas) para prueba de rutas/cabeceras; L para API real futura. **Cierre:** comprobar CSP/referrer/nosniff en respuestas reales, 404 de API, rutas directas, cache y coste, preview y producción por separado.

### OTV-07 — MEDIA antes de participación real — R: privacidad y autenticación pendientes por diseño

**Ubicación:** `documentacion/VOTACION_Y_PRIVACIDAD.md:1-24`; `worker/index.ts:8-11`; `migrations/0001_initial.sql:2-7`.  
**Evidencia:** no existe auth/admin, TURNSTILE ni almacenamiento de votos activado. Documento describe HMAC de IP/cookie, restricciones UNIQUE y sus limitaciones. El usuario puede pulsar una **simulación local no persistente**.  
**Impacto/condición:** no habilitar captura de opiniones políticas ni datos personales sin base jurídica, responsable, minimización, retención, roles y evaluación específica. Los HMAC son datos seudonimizados.  
**Propuesta:** establecer revisión de privacidad, modelo de autorización por edición y auditoría, pruebas de origen, CSRF, concurrencia, Turnstile verificado servidor, límites y borrado antes de abrir la API. **Alternativa de producto:** mantener únicamente demostración sin participación real.  
**Esfuerzo:** L/XL; estimar al diseñar el alcance. **Cierre:** pruebas negativas, aislamiento D1 preview/prod y revisión documental/jurídica.

### OTV-08 — BAJA — R: cálculo repetido y escalabilidad de catálogo

**Ubicación:** `shared/catalog.ts:20-26`, `web/src/observatory/App.tsx:24,27,55-56`.  
**Evidencia:** servicio construido en cada render; `claims` filtra arrays por consulta; contadores de estados vuelven a filtrar. En `weightedScore` de `shared/domain.ts:7-12` se hace un `filter` de evaluaciones por tarea. Con 12 afirmaciones demo es insignificante.  
**Impacto/condición:** con miles de fuentes/afirmaciones crecería el coste de renderizado y descarga completa.  
**Propuesta:** medir primero; luego memoizar cálculos derivados si hay evidencia, preindexar relaciones o paginar en servidor con filtros coherentes. Evitar microservicios y optimización prematura.  
**Esfuerzo:** S–M para mediciones, M–L si escala. **Cierre:** benchmarks con 100/1.000/10.000 afirmaciones, tamaño gzip y objetivo de respuesta definido.

### OTV-09 — BAJA — M: documentación de operación y consistencia editorial

**Ubicación:** `README.md:1-38`, `documentacion/ARQUITECTURA.md:1-24`, `documentacion/REQUISITOS.md:1-73`, `documentacion/ROADMAP.md`.  
**Evidencia:** README abre con descripción de evaluación de candidatos por tareas, mientras la v0.3.0 principal es comparación/verificación y el cálculo por tareas no aparece en el dashboard actual. `ARQUITECTURA.md` describe el esquema SQL futuro, diferenciándolo correctamente de la API demo. Los requisitos RF11, RF17–RF23 están explícitamente pendientes.  
**Impacto:** confusión entre visión, prototipo y comportamiento existente.  
**Propuesta:** separar `Estado actual`, `Arquitectura objetivo`, `No disponible`, y mapear RF/RNF a test/PR; definir política de fuentes y correcciones antes del contenido real.  
**Esfuerzo:** S (0,5–1 jornada). **Cierre:** matriz RF→implementación→prueba, instrucciones reproducibles y versión coherente.

### OTV-10 — BAJA — M: automatización y seguridad de cadena de suministro

**Ubicación:** `.github/workflows/ci.yml:1-65`, `.github/workflows/publish-release.yml:1-48`, `.github/workflows/cleanup-temporary-branches.yml:1-47`.  
**Evidencia:** `permissions:contents:read` por defecto, permisos write acotados a jobs específicos, acciones fijadas por SHA completo; checkout CI con `persist-credentials:false`; `npm ci` y `npm audit --audit-level=high` pasan en la ejecución examinada. El job de release comprueba el SHA de master y la existencia de notas. No se han inspeccionado permisos/rulesets efectivos del servidor.  
**Impacto/condición:** check verde no demuestra ausencia de CVEs de gravedad menor ni asegura protección de rama configurada. La acción de publicación opera solo tras merge explícito de release; no equivale a despliegue Cloudflare.  
**Propuesta:** revisar reglas efectivas de `develop/master`, Dependabot y procedencia de versiones antes de upgrades; evitar cambios indiscriminados.  
**Esfuerzo:** S (0,5–1 jornada). **Cierre:** evidencias de protecciones, rama y jobs requeridos, y verificación de seguridad con dependencias realmente instaladas.

## 4. Arquitectura, SOLID y decisiones

- **Cohesión:** separar rutas/carga UI es útil porque ya existen responsabilidades independientes. Las abstracciones para candidatos/observatorio sí encapsulan operaciones reales, aunque `CandidateDirectory.find` sobre arrays pequeños podría ser una función si su clase deja de aportar valor; no introducir clases por norma.
- **Acoplamiento:** las vistas conocen `Territory` y `ObservatoryService`, razonable en prototipo. La lectura remota dentro de `App.tsx` es el primer límite a corregir. No se detectó una dependencia circular demostrable en los imports consultados; falta análisis estático exhaustivo.
- **DRY:** candidato, badge, empty y cálculos ya se reutilizan; no duplicarlos al extraer vistas. La fixture de tres candidatos compartida por localidades es **contenido intencional de demo**, no base adecuada para datos reales.
- **Seguridad visible:** React interpola texto; no se encontró `dangerouslySetInnerHTML` en las vistas consultadas. El diseño actual no justifica afirmar XSS confirmado. Validar enlaces de fuentes y YouTube al introducir fuentes externas.
- **No funcional:** tamaño de bundle, profundidad de nesting, complejidad por función, contraste cromático, claves/cookies reales y cabeceras de producción permanecen **sin verificar**, no aprobados ni suspendidos.

## 5. Plan de cambios pequeños, dependencias y puertas de cierre

| Grupo | Rama futura sugerida | Hallazgos | Dependencias | Verificación antes de merge |
|---|---|---|---|---|
| A — Contratos y casos adversariales | `fix/catalog-validation` | 01,05 | Ninguna | malformed JSON/relaciones/errores sin pantalla en blanco |
| B — Extracción de datos y rutas | `feature/separate-client-routing` | 02 | A recomendado | enlaces, historial, filtros y selección sin regresión |
| C — CSS legible + QA | `fix/format-responsive-css` | 04,05 | Independiente | diff de reglas, capturas y teclado 320/390/1440 |
| D — Modelo de ediciones | `feature/edition-contract` | 03 | A y B | aislamiento por edición y localidad |
| E — Worker y límites operativos | `fix/worker-routing-headers` | 06 | Independiente | cabeceras, rutas, preview y producción |
| F — Documentación y trazabilidad | `feature/requirements-traceability` | 09,10 | A–E si se quiere estado final | RF→prueba y límites actuales |
| G — Persistencia y participación | **no empezar sin diseño aprobado** | 07,08 | A,D,E,F | autorización, privacidad, abuso, backups y carga |

**Orden recomendado:** A → B (C paralelo) → D → E → F. G queda bloqueado para una fase posterior. No abrir un PR grande que mezcle validación, diseño visual, modelos y despliegue.

**Flujo conservado:** `feature/*` o `fix/*` → PR a `develop` → `release/vX.Y.Z` → PR a `master` → GitHub Release → sincronización a `develop`. El **presente informe** puede entrar por un PR exclusivamente documental a `develop`; no fusionarlo ni crear release como parte de la auditoría.

## 6. Referencias técnicas actuales consultadas

- Cloudflare, Static Assets y `run_worker_first`: https://developers.cloudflare.com/workers/static-assets/ y https://developers.cloudflare.com/workers/static-assets/binding/
- Cloudflare, cabeceras de assets: https://developers.cloudflare.com/workers/static-assets/headers/
- GitHub, SHA completo y seguridad de Actions: https://docs.github.com/en/actions/reference/security/secure-use

**Conclusión:** la demo puede continuar como demostración, pero el paso a contenido real requiere primero contratos verificables, separación por edición, proceso editorial y validación de seguridad/privacidad. Las mediciones no ejecutadas quedan pendientes y no se reportan como números inventados.
