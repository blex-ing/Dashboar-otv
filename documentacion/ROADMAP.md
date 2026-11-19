# Plan por entregas

1. v0.1.0: estructura, documentación, pantalla inicial, esquema, CI y flujo Git. Votos cerrados.
2. Fichas públicas: selector de candidatos, perfil y propuestas por tema. Vista con datos ficticios para validar móvil y escritorio. Sin escritura de datos.
3. Convocatorias y evaluación pública: autenticación administrativa, auditoría, API D1 y una valoración por candidato y tarea. Confirmar naturaleza de la convocatoria.
4. Apoyo público: un candidato por convocatoria, cookie segura, HMAC, Turnstile, origen, límites, SQL atómico, retención y avisos. Ensayar concurrencia real contra Worker/D1 antes de abrir votos.
5. Dashboard: medias y recuentos por tarea, cuota de apoyo y evolución. Clasificación calculada en servidor con pesos iniciales de 70 % para evaluación pública y 30 % para apoyo. Guardar la fórmula aplicada por convocatoria.
6. Operación: Cloudflare vinculado, previews aisladas, respaldo/restauración, reglas GitHub verificadas y observabilidad sin identificadores privados.

Cada entrega usa feature/fix → develop → release → master → sincronización, con criterios y notas de release. No se atribuyen funcionalidades pendientes a v0.1.0.
