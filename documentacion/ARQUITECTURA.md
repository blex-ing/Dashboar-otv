# Arquitectura y mantenimiento

Se reutiliza el patrón comprobado en mini_podcast y martes_fc: frontend separado, build esbuild sin Vite, Worker Cloudflare, D1, ramas de integración y releases versionadas. No se copian componentes de fútbol, audio, datos ni secretos.

React/TypeScript en web/ presenta la interfaz. shared/ contiene tipos y cálculo puro de notas. worker/ reserva /api/* y sirve assets con cabeceras. La API actual expone GET /api/health, devuelve 503 para /api/votes y 404 JSON para otras rutas API. No hay endpoints de escritura activos.

El esquema representa convocatorias, candidatos, tareas, evaluaciones y votos. Claves compuestas impiden asociar evaluación o voto a candidatos de otra convocatoria. Dos UNIQUE independientes bloquean repeticiones por IP o navegador. No se implementa read-then-write para decidir duplicados.

La calificación es sum(nota × peso) / sum(peso), redondeada a dos decimales. Falta de tareas o de una evaluación devuelve pendiente. Antes de publicar evaluaciones se validarán IDs, duplicados y pesos de toda la configuración. Las tareas se congelarán al abrir la convocatoria.

La versión inicial permite una nota oficial por candidato/tarea; si se requieren varios jueces, una futura migración añadirá evaluadores y una regla explícita de agregación. El apoyo no altera la nota técnica.

Capas previstas por módulo: candidates, campaigns, evaluations y voting. Crear componentes compartidos cuando haya uso real repetido, sin abstracciones vacías. Imágenes futuras deberán tener alternativas y tamaños responsivos. Listas y modales deberán permitir scroll interno y acciones visibles en móvil.

Validación disponible: tipos frontend/worker, cálculo, API cerrada, restricciones SQL y build. QA visual automatizada y prueba de Worker/D1 real quedan para la implementación de interacciones; no se declara cobertura que todavía no existe.
