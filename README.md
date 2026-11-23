# Dashboard OTV

Observatorio ciudadano configurable para conocer candidaturas, comparar propuestas y consultar evidencias. La instalación publicada es un laboratorio con contenido sintético: no ofrece resultados electorales ni registra votos reales. Repositorio: `blex-ing/Dashboar-otv` (nombre remoto conservado).

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
- [Matriz verificable de trazabilidad](documentacion/TRAZABILIDAD.md)
- [Cadena de suministro y controles GitHub](documentacion/CADENA_SUMINISTRO.md)

Estado actual (v0.7.0): observatorio ciudadano de demostración para Otavalo e Ibarra, con ediciones aisladas, dashboard neón, podio simulado, perfiles, comparador de propuestas, afirmaciones y documentos sintéticos. Sin votación pública, administración ni verificación automática por IA. Desde v0.4.0 incluye aviso legal, privacidad y política de cookies accesibles en todas las vistas, sin introducir cookies opcionales ni rastreadores. La revisión jurídica operativa sigue pendiente antes de cualquier tratamiento nuevo.

- [Alcance legal y privacidad de la demostración](documentacion/CUMPLIMIENTO_UE.md)
- [Investigación electoral: Otavalo 29N 2026](documentacion/investigaciones/OTAVALO_2026_ALCALDIA.md)
- [Análisis de referencia y recorridos](documentacion/ANALISIS_REFERENCIA.md)
- [Requisitos y límites por función](documentacion/REQUISITOS.md)

El catálogo se lee desde `/api/public/catalog`; en desarrollo estático se señala el fallback a la misma demostración local. La simulación de apoyo solo vive en memoria y no modifica las cifras de ejemplo.

Al entrar en **Otavalo** el Dashboard muestra seis candidaturas reales en orden alfabético, sin podio ni apoyos inventados; «Candidaturas» enlaza al directorio documental. Selecciona **Ciudad Ejemplo** para recorrer los perfiles ficticios, los datos sintéticos y el podio de demostración.

El módulo **Elecciones 2026** es un directorio separado de la demo: seis candidaturas reales contrastadas con dos fuentes periodísticas, enlace al CNE y aviso de planes individuales pendientes de contraste primario. No presenta clasificaciones, encuestas, recomendaciones ni votación real; no debe confundirse la corroboración de identidad con la verificación de propuestas. Las seis candidaturas cuentan con fichas individuales accesibles por URL. La participación real sigue deshabilitada; el podio con cifras simuladas pertenece únicamente al laboratorio ficticio.

Desde `web/`: `npx playwright install chromium` y `npm run test:visual`. CI valida escritorio, móvil y 320 px, filtros, enlaces directos, historial, comparación, simulación sin POST y fallo del catálogo. Las capturas quedan en los artifacts de Visual QA.

`npm run traceability:check` comprueba que todos los RF/RNF declarados estén clasificados y que las evidencias referenciadas existan. La matriz distingue implementación, cobertura parcial, política y trabajo pendiente; una referencia a una prueba no equivale por sí sola a certificación legal, de seguridad o WCAG.

## Módulo documental de seguridad vial (v0.7.0)

Desde v0.7.0, el Dashboard incorpora una nueva sección no electoral accesible desde **Seguridad vial** en el menú o mediante `?lugar=otavalo&vista=seguridad-vial`. Presenta diez fichas de observaciones fotográficas históricas, siete líneas de investigación, incidentes documentados y una checklist temporal; no recopila información personal ni habilita votaciones. Las capturas originales de Google Street View permanecen en el expediente local hasta revisar condiciones de publicación. [Contrato](documentacion/seguridad-vial/CONTRATO.md) · [Expediente](documentacion/seguridad-vial/EXPEDIENTE_E35.md).

### Demostración vial integrada (issue #76)

La sección `?lugar=otavalo&vista=seguridad-vial` integra el diseño del archivo HTML aportado, con visor de fotos, filtros, riesgos, campo, fuentes y cronología, sin alterar la aplicación electoral. Las capturas de Street View se importan **localmente** desde el JSON contenido en el ZIP del usuario; no se redistribuyen en producción. [Instrucciones de uso y privacidad](documentacion/seguridad-vial/USO_DEMO_INTEGRADA.md).
