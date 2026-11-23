# Plan por entregas

- v0.1.0: base de frontend/Worker, esquema y flujo Git.
- v0.1.1: configuración de producción y previews Cloudflare.
- v0.2.0: perfiles y propuestas de demostración.
- v0.3.0: observatorio neón, localidades configurables, dashboard/podio simulado, perfiles, comparador, afirmaciones filtrables, evidencia enlazable, método y fuentes. API pública de lectura. Sin votos reales.
- v0.3.1–v0.3.7: contrato remoto validado, responsabilidades separadas, CSS mantenible, ediciones aisladas, Worker endurecido, QA ampliado y análisis formal de complejidad con baseline.
- v0.3.8: documentación coherente con el producto, matriz RF/RNF verificable y controles de CI/cadena de suministro documentados.
- v0.3.9: diseño minimizado de participación real, privacidad, amenazas, retención, entornos y recuperación; implementación todavía bloqueada.
- v0.4.0: aviso legal, privacidad y cookies visibles; controles CI preventivos y contacto de derechos. Alcance limitado a la demostración, con revisión jurídica por confirmar para nuevas funcionalidades.
- v0.4.1: coherencia documental posrelease y comprobación automática del estado de versión en README, changelog y roadmap; sin cambios funcionales.
- v0.5.0: guía documental inicial para las seis candidaturas reales a la Alcaldía de Otavalo (29-11-2026), fuentes periodísticas contrastadas, enlace al directorio del CNE y límites explícitos de verificación primaria; separada del laboratorio ficticio.
- v0.5.1: fichas individuales enlazables de candidaturas reales, participación claramente bloqueada y pruebas de no persistencia. No se presentan podios de apoyos reales ni se habilita votación pública sin las puertas de seguridad y privacidad.
- v0.6.0: dashboard público de Otavalo con seis candidaturas reales, metadatos de elección y tarjetas accesibles; laboratorio y podio ficticio visibles mediante Ciudad Ejemplo. Sin recuentos ni apoyos no verificables en la vista real.
- v0.7.0: expediente ciudadano de seguridad vial E35 Eugenio Espejo accesible desde Dashboard Otavalo, evidencias históricas F01–F10, riesgos como hipótesis, cronología verificada y checklist sin persistencia. No sustituye estudio técnico.
- v0.8.0: integración del diseño E35, galería y carga de imágenes local desde JSON del usuario, visor accesible, filtros y tareas de campo, fuentes y siniestros; sin redistribución pública de Street View ni votación real.
- Fichas individuales para las candidaturas reales de Otavalo: navegación directa, mismas fuentes por perfil y módulo de participación bloqueado; **sin podio real** mientras no exista una recogida legal y segura de apoyos. La simulación existente permanece exclusiva del catálogo ficticio.
- Primera fase de contenidos electorales Otavalo 2026: directorio neutral con seis candidaturas contrastadas en prensa local y fuentes enlazadas, separado del laboratorio; **planes y documentos primarios todavía pendientes de revisión individual**.
- Siguiente fase de contenidos: cotejar las seis fichas y planes originales del CNE, registrar apartados/páginas, competencia municipal, presupuesto y responsables editoriales; incorporar luego vídeos autorizados y transcripciones verificadas.
- Persistencia/editorial: migraciones D1, administración autenticada, historial y correcciones. Previews con bases propias.
- Verificación asistida: extracción/transcripción con coste limitado, fuentes abiertas y revisiones registradas. No se automatiza una recomendación de voto.
- Participación: Turnstile servidor, cookie segura/HMAC, origen, unicidad atómica, concurrencia, ventanas temporales, retención y límites claramente comunicados.
- Estadísticas reales: evolución de apoyos agregados y exportaciones con contexto; nunca mezclar popularidad y veracidad.

Cada entrega pasa por feature/fix → develop → release → master → sincronización, pruebas y notas verificables. Las fases pendientes no se declaran implementadas por existir una interfaz de demostración.
