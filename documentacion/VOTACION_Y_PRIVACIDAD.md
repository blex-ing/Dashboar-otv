# Votación, abuso y privacidad

## Diseño previsto; no habilitado

1. El Worker emite una cookie aleatoria opaca Secure, HttpOnly, SameSite=Lax, Path=/ y sin Domain (prefijo __Host-). El servidor valida formato y firma. No usar fingerprint de hardware.
2. Obtener IP exclusivamente de la cabecera de Cloudflare en el despliegue Worker. Nunca aceptar X-Forwarded-For del usuario como autoridad. Canonicalizar IPv4/IPv6 y definir el tratamiento de IPv6 antes de abrir votos.
3. Derivar ip_hmac y device_hmac con HMAC-SHA-256, secreto en Worker y separación de dominio y convocatoria. Un hash simple de IP no es suficiente. Mantener estable la clave durante toda la convocatoria.
4. Validar método POST, origen exacto permitido, Content-Type, tamaño máximo del cuerpo, campos y convocatoria abierta en UTC. Rechazar solicitudes sin origen, sin cookie válida o sin configuración de seguridad.
5. Verificar Turnstile en servidor con Siteverify y comprobar hostname y action. Nunca confiar solo en el widget. Aplicar límites de peticiones antes del trabajo costoso y devolver 429 con Retry-After.
6. INSERT atómico contra las dos restricciones UNIQUE. Mapear exclusivamente el conflicto de duplicado a 409; otros errores no deben presentarse como votos existentes. No incrementar contadores separados susceptibles de desincronización.
7. Publicar solo agregados por candidato; no exponer hashes, cookies ni IP. Cabeceras no-store en respuestas de voto. Un voto no recibido o rechazado no puede cambiar el resultado.

## Garantías y límites

La regla es un voto por convocatoria si ya coincide la IP O el identificador del navegador. No utilizar UNIQUE(campaign_id, ip_hmac, device_hmac): permitiría cambiar uno de ellos y votar otra vez.

Una IP compartida puede impedir votar a varias personas de una familia, oficina o red móvil. Cambiar red y borrar cookies permite evadir el control; distintos navegadores del mismo dispositivo no son identificables de forma fiable. VPN, proxies e IPv6 requieren políticas de abuso. Este diseño limita duplicados, no certifica identidad ni una persona/un voto. Para garantías mayores habrá que definir autenticación o verificación adicional.

## Antes de recoger datos reales

Definir responsable, finalidad, información al participante, periodo de retención y borrado de identificadores al terminar la revisión de resultados. HMAC es seudonimización, no anonimización garantizada. Documentar accesos a D1 y tratamiento de logs de infraestructura. La política y los plazos son decisiones pendientes; no habilitar recopilación mientras falten.

Fuentes técnicas: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ y https://developers.cloudflare.com/workers/static-assets/ .
