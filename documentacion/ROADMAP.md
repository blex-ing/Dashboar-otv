# Plan por entregas

1. v0.1.0: estructura, documentación, pantalla inicial, esquema, CI y flujo Git. Votos cerrados.
2. Convocatorias y evaluación: autenticación administrativa, auditoría, API D1, candidatos, tareas, criterios congelados y desglose de notas. Definir naturaleza de convocatoria y número de jueces.
3. Apoyo público: cookie segura, HMAC, Turnstile, origen, límites, SQL atómico, retención y avisos. Ensayar concurrencia real contra Worker/D1 y ataques de duplicación antes de abrir votos.
4. Dashboard: ranking y filtros separados por nota/apoyo, estados de carga/error, QA visual responsive y accesibilidad.
5. Operación: Cloudflare vinculado, previews aisladas, respaldo/restauración, reglas GitHub verificadas y observabilidad sin identificadores privados.

Cada entrega usa feature/fix → develop → release → master → sincronización, con criterios y notas de release. No se atribuyen funcionalidades pendientes a v0.1.0.
