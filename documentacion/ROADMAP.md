# Plan por entregas

- v0.1.0: base de frontend/Worker, esquema y flujo Git.
- v0.1.1: configuración de producción y previews Cloudflare.
- v0.2.0: perfiles y propuestas de demostración.
- v0.3.0: observatorio neón, localidades configurables, dashboard/podio simulado, perfiles, comparador, afirmaciones filtrables, evidencia enlazable, método y fuentes. API pública de lectura. Sin votos reales.
- Siguiente fase de contenidos: aportar candidaturas reales, programas, vídeos autorizados, documentos primarios y transcripciones; seleccionar edición y responsables de revisión.
- Persistencia/editorial: migraciones D1, administración autenticada, historial y correcciones. Previews con bases propias.
- Verificación asistida: extracción/transcripción con coste limitado, fuentes abiertas y revisiones registradas. No se automatiza una recomendación de voto.
- Participación: Turnstile servidor, cookie segura/HMAC, origen, unicidad atómica, concurrencia, ventanas temporales, retención y límites claramente comunicados.
- Estadísticas reales: evolución de apoyos agregados y exportaciones con contexto; nunca mezclar popularidad y veracidad.

Cada entrega pasa por feature/fix → develop → release → master → sincronización, pruebas y notas verificables. Las fases pendientes no se declaran implementadas por existir una interfaz de demostración.
