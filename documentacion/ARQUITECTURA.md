# Arquitectura y mantenimiento

Se reutiliza el patrón comprobado en mini_podcast y martes_fc: frontend separado, build esbuild sin Vite, Worker Cloudflare, D1, ramas de integración y releases versionadas. No se copian componentes de fútbol, audio, datos ni secretos.

React/TypeScript en web/ presenta la interfaz. shared/ contiene tipos y cálculo puro de notas. worker/ reserva /api/* y sirve assets con cabeceras. La API actual expone GET /api/health, devuelve 503 para /api/votes y 404 JSON para otras rutas API. No hay endpoints de escritura activos.

El esquema representa convocatorias, candidatos, tareas, evaluaciones y votos. Claves compuestas impiden asociar evaluación o voto a candidatos de otra convocatoria. Dos UNIQUE independientes bloquean repeticiones por IP o navegador. No se implementa read-then-write para decidir duplicados.

La calificación es sum(nota × peso) / sum(peso), redondeada a dos decimales. Falta de tareas o de una evaluación devuelve pendiente. Antes de publicar evaluaciones se validarán IDs, duplicados y pesos de toda la configuración. Las tareas se congelarán al abrir la convocatoria.

El esquema inicial permite una sola nota por candidato y tarea. La evaluación pública prevista requerirá una migración para guardar múltiples valoraciones y calcular sus medias. La clasificación combinará evaluación pública y porcentaje de apoyo con pesos por convocatoria.

Capas previstas por módulo: candidates, campaigns, evaluations y voting. Crear componentes compartidos cuando haya uso real repetido, sin abstracciones vacías. Imágenes futuras deberán tener alternativas y tamaños responsivos. Listas y modales deberán permitir scroll interno y acciones visibles en móvil.

Las fichas React reutilizan el tipo compartido de candidato. La clase `CandidateDirectory` proporciona la lectura de los perfiles ficticios durante la iteración visual.

Validación disponible: tipos frontend/worker, cálculo, API cerrada, restricciones SQL y build. Playwright verifica fichas, cambio de candidato, teclado y ausencia de desbordamiento en Chromium de escritorio y móvil. La prueba de persistencia Worker/D1 real queda pendiente.

## Observatorio v0.3.0

`shared/catalog.ts` define contratos de localidad, candidatura, propuesta, entrevista, afirmación y fuente. `CandidateDirectory` se reutiliza desde `ObservatoryService`; este calcula métricas, clasificación y filtros. El Worker publica el catálogo demo en `/api/public/catalog`; el cliente carga la API y señala cuando usa la copia demo local. No hay escritura ni almacenamiento de preferencias. Los parámetros `lugar`, `vista`, `c` y `afirmacion` permiten recarga y navegación atrás/adelante sin depender de reglas SPA de rutas. El componente de perfil de v0.2.0 se reutiliza; se retira el selector anterior duplicado. La simulación no altera el catálogo ni sus cifras.

La selección temporal navega capítulos y evidencias de un guion sintético. No hay un iframe falso ni un reproductor desconectado: se explica que falta el vídeo. La incorporación de vídeos reales y sincronización queda descrita en RF11.
