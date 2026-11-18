# Dashboard OTV — reglas de trabajo

- Leer README y documentación antes de modificar el proyecto.
- feature/* y fix/* salen de develop. PR hacia develop; release/vX.Y.Z hacia master; sincronizar después mediante PR.
- Nunca fusionar con CI fallida ni forzar ramas permanentes. No afirmar que hay protecciones activas sin comprobarlas.
- Node 24, React/TypeScript y esbuild. Reutilizar shared/ y componentes existentes; añadir dependencias solo cuando aporten una función necesaria.
- Antes de integrar: cd web && npm ci && npm run check && npm audit --audit-level=high.
- Cambios visuales requieren comprobar móvil y escritorio; documentar cualquier límite de verificación.
- Mantener requisitos, roadmap y notas alineados con el comportamiento real.
- No habilitar votos sin D1, Turnstile verificado en servidor, control de origen, cookie segura, HMAC y pruebas de concurrencia.
- No almacenar IP cruda, claves ni información personal real en Git, frontend o logs.
- Preview y producción usan recursos y secretos separados.
