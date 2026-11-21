# Git, integración y releases

## Ramas y secuencia

- master: estable y producción prevista.
- develop: integración y preview.
- feature/* y fix/*: desde develop, PR a develop con CI verde.
- release/vX.Y.Z: desde develop, notas y versión; PR a master.
- Sincronizar master hacia develop por PR después de cada release.

La primera escritura de README es la única excepción de bootstrap porque no existía ningún commit ni rama. El resto se integra mediante PR. El repositorio remoto conserva su nombre original Dashboar-otv.

## Comprobaciones

En web/: npm ci; npm run check; npm audit --audit-level=high. CI cubre tipos frontend/Worker, dominio, API cerrada, integridad SQL y build. Cambios visuales interactivos requieren QA móvil/escritorio antes de integrarse. Validar diferencias, documentación y estado real de Actions antes de cada merge.

## Publicación y limpieza

publish-release.yml publica tag y GitHub Release solo tras merge de release/v* hacia master del mismo repositorio, comprobando SHA exacto y notas versionadas. No equivale a despliegue Cloudflare.

cleanup-temporary-branches.yml elimina feature/* y fix/* solo después del merge a develop y release/* tras merge a master. Usa lease del SHA original; preserva ramas avanzadas, permanentes y PR cerradas sin fusionar. No usar borrado global automático que pueda eliminar develop tras sincronizarlo.

## Reglas de GitHub

La rama predeterminada es `master` y las únicas ramas permanentes son `master` y `develop`. El 21-11-2026 la API accesible devolvió cero rulesets; la lectura específica de protección de ramas devolvió 403 por permisos de la integración, por lo que **no se afirma que exista protección activa**. Debe comprobarse manualmente en Settings: PR obligatorio, checks de CI, bloqueo de force push y borrado para ambas ramas. Un solo mantenedor no debe exigir autoaprobación imposible. El workflow de limpieza no sustituye las reglas del servidor.

Actions reutiliza SHA completos comprobados contra sus tags oficiales; el registro de la revisión está en [CADENA_SUMINISTRO.md](CADENA_SUMINISTRO.md). Dependabot propone actualizaciones semanales hacia develop, con revisión de compatibilidad. Nunca copiar secretos ni credenciales de otros proyectos.
