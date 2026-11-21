# Cadena de suministro y controles GitHub

Revisión reproducible realizada el 21-11-2026 para la issue #21. Este documento registra hechos observados; no convierte controles inaccesibles en controles aprobados.

## GitHub Actions

| Acción | Tag declarado | SHA fijado | Verificación |
| --- | --- | --- | --- |
| `actions/checkout` | `v7.0.1` | `3d3c42e5aac5ba805825da76410c181273ba90b1` | El ref oficial del repositorio `actions/checkout` resolvió al mismo commit |
| `actions/setup-node` | `v7.1.0` | `949feb2413d6458794dcd2491c4babbbce0c15c1` | El ref oficial del repositorio `actions/setup-node` resolvió al mismo commit |
| `actions/upload-artifact` | `v7.0.2` | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` | El ref oficial del repositorio `actions/upload-artifact` resolvió al mismo commit |

Los workflows conceden `contents: read` por defecto. La escritura se limita a publicar una release o eliminar de forma segura la rama temporal después de un merge. CI desactiva la persistencia de credenciales del checkout. No se actualizó ninguna Action durante esta revisión porque los SHA y tags declarados coincidían.

## Dependencias npm

`package-lock.json` es obligatorio y CI usa `npm ci`, Node 24 y `npm audit --audit-level=high`. Dependabot revisa npm y GitHub Actions semanalmente contra `develop`, con siete días de enfriamiento. Una auditoría limpia no garantiza ausencia de defectos ni de vulnerabilidades futuras.

npm detectó un único script de instalación: `esbuild@0.28.2` ejecuta `node install.js`. Se comprobó en el manifiesto oficial de esbuild que ese `postinstall` pertenece a la versión fijada y valida/prepara su binario. Se añadió una autorización **limitada a `esbuild@0.28.2`** en `allowScripts`; no se autorizan paquetes o versiones futuras de forma global. Al actualizar esbuild se debe revisar de nuevo el script antes de cambiar esa aprobación.

## Ramas y rulesets

- Ramas observadas: únicamente `master` y `develop`.
- PR abiertas al comenzar la revisión: ninguna.
- Rulesets visibles mediante la API: ninguno.
- Endpoints de protección de `master` y `develop`: la integración recibió HTTP 403, así que su estado no pudo verificarse.

Acción manual pendiente para el propietario: abrir Settings → Rules → Rulesets o Branches y comprobar PR obligatorio, checks requeridos, bloqueo de force push y bloqueo de borrado. Hasta disponer de esa evidencia, la documentación no afirma que las protecciones estén activas.

## Fuentes primarias comprobadas

- Refs oficiales de `actions/checkout`, `actions/setup-node` y `actions/upload-artifact` mediante la API de GitHub.
- Configuración versionada en `.github/workflows/` y `.github/dependabot.yml`.
- Estado del propio repositorio mediante API de ramas, PR y rulesets.
