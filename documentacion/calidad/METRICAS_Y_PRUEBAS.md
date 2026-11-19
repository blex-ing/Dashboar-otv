# Calidad medible de Dashboard OTV — issue #20

## Alcance

La issue aporta instrumentación y regresiones; **no declara conformidad WCAG** ni califica subjetivamente la complejidad. No se modifican datos reales, diseño, API ni votación.

## Comandos reproducibles

Desde `web/`, usando Node 24 e instalación con `npm ci`:

```bash
npm run check
npm run test:visual
npm run quality:metrics > quality-metrics.json
```

GitHub Actions ejecuta `npm run check`, `npm run quality:metrics` y `npm run test:visual`, y adjunta los informes JSON y Playwright como artefactos conservados 14 días.

## Métricas: definiciones y límites

| Medida | Método | Interpretación |
| --- | --- | --- |
| Tamaño bundle JS/CSS | Bytes reales de `web/dist` y gzip estándar de Node `gzipSync` | Tamaño de referencia del build, no transferencia HTTP real ni tiempo de carga |
| Complejidad | Indicadores léxicos por archivo: cuenta tokens `if`/`for`/`while`/`catch`/`case`/`&&`/`||`/`??` después de retirar comentarios y cadenas habituales | **Indicador de decisiones**, no complejidad ciclomática formal ni cognitiva Sonar; la sintaxis TSX y las cadenas complejas pueden producir aproximaciones imperfectas |
| Rendimiento del catálogo | 30 calentamientos, 300 repeticiones en memoria; mediana y percentil 95 de parseo, resumen, ranking y filtros | Microbenchmark sintético del proceso CI, no latencia real del navegador ni garantía de escalado |
| Accesibilidad | Playwright en seis vistas: landmark principal, navegación etiquetada, enlace de salto, nombres de controles, IDs únicos y heading principal; teclado móvil 320 px | Guardarraíl básico, no auditoría integral de contraste, orden de lectura, lector de pantalla o WCAG 2.2 AA |

## Umbrales y decisión de CI

- **Bloqueantes desde esta versión:** build, TypeScript, Node/Python, validación adversarial del catálogo, estructura semántica y foco Playwright. Un error de estas pruebas bloquea el merge.
- **Diagnóstico inicial sin fallo por umbral:** gzip, indicadores léxicos de complejidad y tiempos. No existe una serie histórica homogénea para fijar presupuestos estadísticos válidos sin arriesgar falsos positivos.
- **Propuesta para próxima revisión:** tras al menos tres ejecuciones repetidas del mismo entorno y tamaño de fixture, fijar umbrales de regresión de bytes gzip y número de decisiones por archivo, priorizando extraer componentes extensos y añadiendo un analizador formal cuando exista una integración estable. Para microbenchmarks, comparar distribuciones y variar la escala del catálogo antes de establecer un límite de tiempo. Esto es una propuesta, **no un umbral actualmente validado**.

## Evidencia

Los valores numéricos se generan en cada ejecución real de CI y se almacenan en el artefacto `dashboard-otv-quality-<run_id>`. No se insertan cifras ficticias ni se afirma que el proyecto ya superó todas las pruebas hasta que el workflow del commit correspondiente termine.

## Riesgos pendientes

Revisión manual de contraste/zoom, herramientas automatizadas especializadas como axe-core tras evaluación de dependencias, teclado en todos los estados, lectores de pantalla y pruebas de rendimiento móvil real. Los indicadores léxicos no sustituyen un analizador AST de complejidad ciclomática y cognitiva. TypeScript 7.0 no expone la API clásica JS; la alternativa oficial temporal `@typescript/typescript6` se valorará en una mejora independiente sin alterar el compilador de la aplicación.
