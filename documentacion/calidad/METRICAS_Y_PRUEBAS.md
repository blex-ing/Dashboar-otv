# Calidad medible de Dashboard OTV — issue #20

## Alcance

La issue aporta instrumentación y regresiones; **no declara conformidad WCAG** ni califica subjetivamente la complejidad. No se modifican datos reales, diseño, API ni votación.

## Comandos reproducibles

Desde `web/`, usando Node 24 e instalación con `npm ci`:

```bash
npm run check
npm run test:visual
npm run --silent quality:metrics:check > quality-metrics.json
```

GitHub Actions ejecuta `npm run check`, `npm run quality:metrics` y `npm run test:visual`, y adjunta los informes JSON y Playwright como artefactos conservados 14 días.

## Métricas: definiciones y límites

| Medida | Método | Interpretación |
| --- | --- | --- |
| Tamaño bundle JS/CSS | Bytes reales de `web/dist` y gzip estándar de Node `gzipSync` | Tamaño de referencia del build, no transferencia HTTP real ni tiempo de carga |
| Complejidad ciclomática | AST TypeScript 6 oficial: base 1 por función, más `if`, bucles, `catch`, casos no predeterminados, condicionales y operadores lógicos | Caminos de decisión estructurales por función; no equivale a cobertura ni dificultad cognitiva |
| Complejidad cognitiva OTV | AST TypeScript 6: rupturas estructurales más nivel de anidamiento, `else`, `break`/`continue` y secuencias lógicas | Métrica formal y determinista del proyecto; está inspirada en principios de complejidad cognitiva, pero **no afirma equivalencia con Sonar** |
| Clases | Agregación de métricas de sus métodos, incluyendo máximos por método | Ayuda a detectar responsabilidades acumuladas; no obliga a convertir funciones React en clases |
| Rendimiento del catálogo | 30 calentamientos, 300 repeticiones en memoria; mediana y percentil 95 de parseo, resumen, ranking y filtros | Microbenchmark sintético del proceso CI, no latencia real del navegador ni garantía de escalado |
| Accesibilidad | Playwright en seis vistas: landmark principal, navegación etiquetada, enlace de salto, nombres de controles, IDs únicos y heading principal; teclado móvil 320 px | Guardarraíl básico, no auditoría integral de contraste, orden de lectura, lector de pantalla o WCAG 2.2 AA |

## Umbrales y decisión de CI

- **Bloqueantes desde esta versión:** build, TypeScript, Node/Python, validación adversarial del catálogo, estructura semántica y foco Playwright. Un error de estas pruebas bloquea el merge.
- **Bloqueo de regresión de complejidad:** `web/quality-baseline.json` conserva el baseline de v0.3.6. CI falla si aumenta el máximo ciclomático, el máximo cognitivo o el número de funciones que superan las señales históricas `>10` y `>15`. Los valores proceden del código medido; no califican automáticamente una función como incorrecta.
- **Diagnóstico sin umbral:** tamaño gzip, totales de complejidad y tiempos. Los totales se publican para observar tendencia, pero no bloquean nuevas funciones simples. Para microbenchmarks se compararán distribuciones y escalas antes de establecer límites.

## Evidencia

Los valores numéricos se generan en cada ejecución real de CI y se almacenan como JSON válido en el artefacto `dashboard-otv-quality-<run_id>`. CI valida el JSON antes de subirlo. No se insertan cifras ficticias ni se afirma que el proyecto ya superó todas las pruebas hasta que el workflow del commit correspondiente termine.

### Método formal y reproducibilidad

`@typescript/typescript6` se utiliza únicamente dentro de `complexity-analyzer.mjs` para leer el AST. El build y el typecheck continúan con TypeScript 7. El analizador informa todas las funciones —incluidos callbacks— y agrega los métodos de cada clase. Las funciones anidadas se miden por separado para evitar atribuir dos veces sus decisiones a la función contenedora.

La complejidad cognitiva OTV suma `1 + anidamiento` para `if`, bucles, `catch`, `switch` y condicionales; suma uno para `else`, `break` y `continue`, y uno por secuencia lógica ininterrumpida. Esta definición queda versionada con el script y protegida por fixtures unitarios. Cambiarla exige crear un nuevo baseline y documentar que las series no son directamente comparables.

## Riesgos pendientes

Revisión manual de contraste/zoom, herramientas automatizadas especializadas como axe-core tras evaluación de dependencias, teclado en todos los estados, lectores de pantalla y pruebas de rendimiento móvil real. La métrica cognitiva OTV no sustituye una revisión humana ni se presenta como el algoritmo de Sonar. El baseline global detecta regresiones de máximos y recuentos; una futura evolución podrá añadir presupuestos por función cuando sus identificadores sean estables frente a movimientos de líneas.
