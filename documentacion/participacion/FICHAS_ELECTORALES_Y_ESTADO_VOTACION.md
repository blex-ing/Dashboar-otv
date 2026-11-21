# Fichas electorales reales y participación futura — alcance de la feature

## Integrado en la feature

- La página `?lugar=otavalo&vista=elecciones` muestra las seis candidaturas reales en orden alfabético con igual acceso a fuente, sin transferirles los votos ficticios del laboratorio.
- Cada candidatura tiene URL directa `?lugar=otavalo&vista=elecciones&c=<id>`, información pública ya atribuida y enlaces de procedencia.
- Un panel anuncia que la participación pública **no está habilitada**. El botón «Votar en OTV» está deshabilitado; no hay POST, almacenamiento web, cookies, contadores electorales, ranking ni podio de políticos reales.
- URL inválida devuelve estado recuperable. El diseño se comprueba en móvil y escritorio.

## Fuera de alcance: votación pública real

Los votos a personas reales pueden reflejar opiniones políticas. No puede reactivarse RF17 ni mostrarse una clasificación de apoyos de personas reales sin un proceso de autorización y garantías independientes.

Se conserva `documentacion/DISENO_PARTICIPACION_REAL.md` como contrato de seguridad: aprobación jurídica, revisión del artículo 9 RGPD y normativa ecuatoriana aplicable, aviso y retención, D1 transaccional con agregados separados de guardas, Turnstile validado en servidor, sesión y CSRF, origen exacto, HMAC de red y cookie, controles de abuso/concurrencia, entornos separados, copia/restauración y rollback. No se reutilizan cookies/IPs del laboratorio, ni se abren endpoints.

Un posible módulo estadístico posterior deberá diferenciar participaciones autoseleccionadas de cualquier encuesta representativa y de resultados oficiales, indicar denominador, período y limitaciones, sin evaluar qué candidatura es mejor. El podio actual solo opera sobre **personas y apoyos ficticios** de demostración y no se traslada a las fichas reales.

## Pruebas de aceptación

1. Seis fichas iguales en estructura, enlaces directos, recarga correcta y regreso a directorio.
2. Cada ficha tiene fuente de prensa y acceso al CNE, sin atribuir propuestas no revisadas.
3. Votación deshabilitada, cero POST, cero cookies y almacenamiento, cero valores ficticios presentados como reales.
4. Sin podio ni clasificación de personas reales. No se altera el demo anterior.
5. URL inválida y anchura 320px recuperables.
6. CI Node/TS, trazabilidad, seguridad y Playwright verdes antes de merge.

La investigación documental #62 y su PR borrador #63 siguen independientes de esta feature.
