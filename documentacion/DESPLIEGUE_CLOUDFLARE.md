# Cloudflare Workers y previews

## Base preparada

wrangler.jsonc define Worker y assets web/dist, con run_worker_first para aplicar cabeceras y reservar API. Producción prevista: dashboard-otv. Preview explícita: dashboard-otv-preview. Todavía no se ha vinculado el repositorio ni desplegado recursos.

## Configuración Workers Builds

Conectar blex-ing/Dashboar-otv. Raíz: repositorio. Rama de producción: master. Build: `npm --prefix web ci && npm --prefix web run build`. Deploy producción: `npx wrangler deploy`. Habilitar previews de ramas; usar el comando de preview que ofrezca Workers Builds (`npx wrangler versions upload` para versiones de preview), comprobando la URL real devuelta. No afirmar que una preview existe sin verificarla.

Antes de utilizar npx en automatización añadir Wrangler como dependencia de desarrollo fijada y bloqueada tras verificar la versión vigente; no se instala todavía porque esta entrega no publica infraestructura. El build local no necesita Wrangler.

Las previews del mismo Worker NO aíslan automáticamente D1. Antes de añadir datos usar un Worker preview separado mediante `wrangler deploy --env preview`, con binding D1 y secretos propios; proteger previews de ramas no confiables. Nunca conectar previews a producción.

## D1 y secretos: fase siguiente

Crear dos bases, añadir sus IDs reales a d1_databases (y env.preview.d1_databases), binding DB, migrations_dir migrations. No hay IDs ficticios ni enlace a una base existente. Revisar esquema y ejecutar migraciones en preview primero, validar respaldo/restauración y después producción. Migrar en un paso controlado; no en cada build de ramas.

Crear secretos de HMAC y Turnstile de manera independiente por entorno. No guardarlos en GitHub, wrangler.jsonc ni variables frontend. Administración futura con Cloudflare Access y verificación de JWT en servidor; ocultar botones no es autenticación.

## Verificación y rollback

Comprobar GET /api/health, versión, respuestas JSON de errores API y que POST /api/votes sigue 503. Probar móvil/escritorio, cabeceras y ausencia de datos reales. Restaurar una versión previa del Worker solo si es compatible con el esquema actual; una reversión de código no revierte D1. No abrir votación hasta completar criterios y pruebas del roadmap.
