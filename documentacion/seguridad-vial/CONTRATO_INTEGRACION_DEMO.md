# Issue #76 — Contrato de integración de demo E35 en OTV

Fuentes entregadas: captura e35_desktop.png, HTML autónomo (v0.1), ZIP (10 capturas, JSON completo, metadatos), INFORME_PRELIMINAR. El módulo existente desde v0.7.0 es el punto de integración; no se añade una segunda aplicación ni se reemplaza el enrutamiento.

## Requisitos verificables previos al desarrollo

- **RF37 — Pantalla unificada:** cabecera y hero «Una vía rápida. Una comunidad a ambos lados», tarjeta de ubicación con enlace a Maps y copia de coordenadas, cuatro métricas (10 fichas iniciales, 7 investigaciones, fuentes de contexto, 0 mediciones técnicas), cinco observaciones visibles, croquis conceptual y notas; CSS aislado del dashboard.
- **RF38 — Evidencia interactiva:** diez F01–F10 en catálogo con categoría, fecha, observación y por verificar; filtro, galería, modal ampliado con teclado/Escape/flechas, enlaces de riesgo a evidencias, incorporación local con control de tamaño/tipo y previsualización; exportar/importar JSON. No inventar imágenes ni publicar capturas originales de Google sin autorización.
- **RF39 — Matriz y campo:** mostrar R01–R07, filtro, prioridad de INSPECCIÓN (no probabilidad), estado de evidencia y fuente relacionada; checklist de diez tareas con progreso, reinicio y exportación JSON. El checklist sigue siendo transitorio por compatibilidad con RNF14 y sus pruebas; importar JSON puede restaurarlo solo mediante acción explícita.
- **RF40 — Fuentes:** conservar fuentes de la demo: medio 2023, La Hora 2007, Gobernación y GAD; integrar los dos artículos de colisión 30/10/2026 y el testimonio sin corroborar sin atribuir atropello al choque; mantener cronología existente (4 registros).
- **RF41 — Navegación y compatibilidad:** conservar ruta `?lugar=otavalo&vista=seguridad-vial`, menú OTV, deep links, demás páginas y pruebas preexistentes; pestañas visibles Resumen, Evidencias, Riesgos, Trabajo de campo y Fuentes, con nombres accesibles compatibles con controles existentes.
- **RNF15 — Privacidad, rendimiento y accesibilidad:** sin API nuevas, votos, estadísticas ficticias, rastreadores, llamadas externas automáticas ni cookies. Evidencia importada por el usuario permanece en su navegador. IndexedDB para fotos añadidas solo si la persona activa explícitamente «Guardar fotos en este dispositivo»; no guardar checklist automáticamente. Validar JSON importado, tamaño, URI segura (data:image/jpeg|png|webp), y limitar carga. Teclado, 320/390/1440, un H1, sin overflow ni aumento de complejidad permitido en CI.

## Pruebas inmutables antes de desarrollar
- `web/tests/visual/road-safety-integration.spec.ts`: hero/diseño, filtros/modales/risks, import/export, checklist, fuente, sin almacenamiento inesperado, responsive y enlaces, conservar casos antiguos.
- `tests/road-safety-integration.test.mjs`: origen del dossier y contratos de fuente sobre los datos compartidos.
- Se mantienen íntegros `tests/road-safety.test.mjs` y `web/tests/visual/road-safety.spec.ts`.

## Condición editorial de publicación
El ZIP contiene diez capturas de Google Maps/Street View suministradas por el usuario. Se registra su existencia, procedencia, metadatos, y se admite importación privada local del JSON con imágenes; **no se suben imágenes de Google como recursos públicos del Worker** sin derechos de republicación comprobados. La pantalla por defecto usa marcadores visuales y enlace a Maps. No hacer pasar esta ausencia de publicación pública por un error de carga.

## Salida y proceso
Feature PR → develop con CI y visual QA verdes; release únicamente mediante procedimiento existente si se verifican los checks y se documenta la limitación de las capturas.
