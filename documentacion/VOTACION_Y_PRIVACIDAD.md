# Votación, abuso y privacidad

## Estado

La participación real **no está habilitada**. `/api/votes` continúa respondiendo 503 y la selección visible solo existe en memoria. El diseño para una futura fase técnica está en [DISEÑO_PARTICIPACION_REAL.md](DISENO_PARTICIPACION_REAL.md); aprobar el documento no autoriza el tratamiento de datos ni el despliegue.

## Decisiones principales

1. No guardar IP cruda, fingerprint ni una relación entre identificador seudónimo y candidatura.
2. Separar controles anti-duplicado de totales agregados y escribirlos en una única transacción D1.
3. Tratar HMAC, cookie y participación como datos personales seudonimizados hasta que una evaluación competente determine otra cosa.
4. Verificar Turnstile exclusivamente en servidor, origen exacto y token CSRF ligado a una cookie segura.
5. Mantener D1, secretos, claves HMAC y Turnstile separados entre preview y producción.
6. No afirmar “una persona, un voto”: la medida limita abuso, pero redes compartidas, cambio de red/cookie y VPN producen falsos positivos y evasiones.
7. Publicar solo agregados con umbral mínimo; no exponer guardas, cookies, HMAC ni eventos individuales.

## Puertas que siguen bloqueando la implementación

- Responsable, finalidad, base jurídica y ámbito territorial definidos por escrito.
- EIPD/análisis de riesgo y revisión jurídica/privacidad aprobados.
- Texto informativo, derechos, canal de contacto, retención y supresión aprobados.
- Modelo de amenazas y pruebas negativas ejecutados en preview.
- D1 y secretos distintos por ambiente; restauración ensayada.
- Revisión explícita antes de cambiar `/api/votes` de 503 a escritura.

Mientras alguna puerta permanezca pendiente, la única alternativa autorizada es mantener la demostración sin persistencia.
