# Git, integración y releases

## Ramas y secuencia

- master: estable y producción prevista.
- develop: integración y preview.
- feature/* y fix/*: desde develop, PR a develop con CI verde.
- release/vX.Y.Z: desde develop, notas y versión; PR a master.
- Sincronizar master hacia develop por PR después de cada release.
- main: bootstrap del repositorio vacío. Conservar hasta cambiar la rama predeterminada a master y verificar que no tiene trabajo exclusivo.

La primera escritura de README es la única excepción de bootstrap porque no existía ningún commit ni rama. El resto se integra mediante PR. El repositorio remoto conserva su nombre original Dashboar-otv.

## Comprobaciones

En web/: npm ci; npm run check; npm audit --audit-level=high. CI cubre tipos frontend/Worker, dominio, API cerrada, integridad SQL y build. Cambios visuales interactivos requieren QA móvil/escritorio antes de integrarse. Validar diferencias, documentación y estado real de Actions antes de cada merge.

## Publicación y limpieza

publish-release.yml publica tag y GitHub Release solo tras merge de release/v* hacia master del mismo repositorio, comprobando SHA exacto y notas versionadas. No equivale a despliegue Cloudflare.

cleanup-temporary-branches.yml elimina feature/* y fix/* solo después del merge a develop y release/* tras merge a master. Usa lease del SHA original; preserva ramas avanzadas, permanentes y PR cerradas sin fusionar. No usar borrado global automático que pueda eliminar develop tras sincronizarlo.

## Reglas de GitHub

Configurar en Settings la rama predeterminada master y protección de master/develop: PR obligatorio, checks de CI, bloqueo de force push y borrado. Un solo mantenedor no debe exigir autoaprobación imposible. En repositorios públicos GitHub Free permite protección; el workflow no sustituye las reglas del servidor. Estas reglas no se consideran activas hasta verificarlas en GitHub; el conector disponible no permite administrarlas.

Actions reutiliza SHA de checkout/setup-node comprobados en los repositorios de referencia. Dependabot propone actualizaciones semanales hacia develop, con revisión de compatibilidad. Nunca copiar secretos ni credenciales de los otros proyectos.
