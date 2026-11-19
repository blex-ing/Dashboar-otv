# Dashboard OTV

Base para evaluar candidatos por tareas y medir apoyo público. Repositorio: `blex-ing/Dashboar-otv` (nombre remoto conservado).

## Inicio local

Node.js 24 y Python 3. Desde `web/` ejecutar `npm ci`, `npm run check` y `npm run dev`. Abrir http://127.0.0.1:4173. El servidor local muestra el frontend; la API requiere Cloudflare Workers.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| web/ | React, estilos y compilación esbuild |
| worker/ | API y cabeceras de seguridad |
| shared/ | Tipos y cálculo de notas |
| migrations/ | Esquema D1 versionado |
| tests/ | Dominio, API cerrada e integridad SQL |
| documentacion/ | Requisitos, arquitectura, seguridad, operación y releases |
| .github/ | CI, Dependabot, publicación y limpieza |

## Documentación

- [Requisitos](documentacion/REQUISITOS.md)
- [Arquitectura](documentacion/ARQUITECTURA.md)
- [Votación y privacidad](documentacion/VOTACION_Y_PRIVACIDAD.md)
- [Git y releases](documentacion/FLUJO_GIT_Y_RELEASES.md)
- [Cloudflare](documentacion/DESPLIEGUE_CLOUDFLARE.md)
- [Plan de implementación](documentacion/ROADMAP.md)

Estado actual: observatorio ciudadano de demostración para Otavalo e Ibarra, con dashboard neón, podio simulado, perfiles, comparador de propuestas, afirmaciones y documentos sintéticos. Sin votación pública, administración ni verificación automática por IA.

- [Análisis de referencia y recorridos](documentacion/ANALISIS_REFERENCIA.md)
- [Requisitos y límites por función](documentacion/REQUISITOS.md)

El catálogo se lee desde `/api/public/catalog`; en desarrollo estático se señala el fallback a la misma demostración local. La simulación de apoyo solo vive en memoria y no modifica las cifras de ejemplo.

Desde `web/`: `npx playwright install chromium` y `npm run test:visual`. CI valida escritorio, móvil y 320 px, filtros, enlaces directos, historial, comparación, simulación sin POST y fallo del catálogo. Las capturas quedan en los artifacts de Visual QA.
