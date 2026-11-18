# Dashboard OTV

Base para evaluar candidatos por tareas y medir apoyo público. Repositorio: `blex-ing/Dashboar-otv` (nombre remoto conservado).

## Inicio local

Node.js 24 y Python 3. Desde `web/` ejecutar `npm ci`, `npm run check` y `npm run dev`. Abrir http://127.0.0.1:4173. El servidor local muestra el frontend; la API requiere Cloudflare Workers.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| web/ | React, estilos y compilación esbuild |
| worker/ | API y cabeceras de seguridad |
| shared/ | Tipos y cálculo de notas |
| migrations/ | Esquema D1 versionado |
| tests/ | Dominio, API cerrada e integridad SQL |
| documentacion/ | Requisitos, arquitectura, seguridad, operación y releases |
| .github/ | CI, Dependabot, publicación y limpieza |

## Documentación

- [Requisitos](documentacion/REQUISITOS.md)
- [Arquitectura](documentacion/ARQUITECTURA.md)
- [Votación y privacidad](documentacion/VOTACION_Y_PRIVACIDAD.md)
- [Git y releases](documentacion/FLUJO_GIT_Y_RELEASES.md)
- [Cloudflare](documentacion/DESPLIEGUE_CLOUDFLARE.md)
- [Plan de implementación](documentacion/ROADMAP.md)

Estado v0.1.0: estructura funcional, pantalla vacía sin datos ficticios, API de salud y votación deshabilitada. No incluye administración, evaluaciones persistidas ni votos reales.
