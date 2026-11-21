# Alcance de cumplimiento legal y privacidad — OTV

Fecha de evaluación: 21 de noviembre de 2026. Estado: borrador técnico pendiente de completar la identidad del responsable y de revisión jurídica antes de producción.

## Objetivo y límite

Este bloque reduce riesgos previsibles de transparencia, privacidad y cookies para la demostración pública de OTV. No constituye asesoramiento jurídico ni garantiza la ausencia de sanciones. La obligación exacta depende de quién explota el servicio, si existe actividad económica, qué datos reales se tratan, los proveedores configurados y el país desde el que se opera.

## Estado observado

- Sitio público de demostración, sin cuentas, formularios, votos reales ni base de datos de visitantes.
- La selección simulada se mantiene únicamente en memoria y desaparece al recargar.
- No hay cookies propias, `localStorage`, `sessionStorage`, analítica, publicidad, píxeles ni contenido embebido de terceros.
- Cloudflare entrega y protege el sitio y puede tratar metadatos técnicos de red.
- Las candidaturas, apoyos y fuentes actuales son sintéticos y se identifican como tales.

## Alcance implementado

1. Aviso legal permanentemente accesible con identidad del titular, naturaleza del servicio, reglas de uso, responsabilidad y correcciones.
2. Política de privacidad por capas: responsable, datos técnicos, finalidades, bases, conservación, destinatarios, transferencias, derechos y reclamación ante la AEPD.
3. Política de cookies con inventario verificable. Al no existir tecnologías opcionales, no se muestra un falso banner de consentimiento.
4. Regla preventiva: cualquier futura tecnología no esencial debe permanecer bloqueada hasta consentimiento informado, revocable y con rechazo tan sencillo como la aceptación.
5. Versionado y fecha de revisión de textos legales.
6. Enlaces accesibles desde todas las vistas y pruebas a 320, 390 y 1440 píxeles.
7. Control de CI para detectar almacenamiento o rastreadores conocidos y puerta de release que rechaza datos legales vacíos o textos en borrador.

## Datos que debe confirmar el responsable

- Nombre completo o razón social.
- NIF/CIF.
- Domicilio o dirección pública válida para contacto legal.
- Correo específico para privacidad y ejercicio de derechos.
- Si existen actividad económica, publicidad, patrocinios, afiliación o servicios de pago.
- Datos registrales o profesionales, si resultan aplicables.
- Configuración contractual y de conservación de registros en Cloudflare.

## Fuera de alcance hasta que exista la función

- Consentimiento para analítica, publicidad, vídeos embebidos o mapas.
- Registro de usuarios, boletines, formularios y autenticación.
- Votación real, datos de opinión política o perfiles. Antes de abrirla se requiere análisis específico del artículo 9 RGPD, minimización, retención, seguridad, base jurídica y evaluación de impacto cuando proceda.
- Términos de participación, moderación, menores, encargados adicionales y transferencias derivadas de nuevos proveedores.
- Declaración formal de accesibilidad del sector público; OTV mantiene un objetivo técnico WCAG 2.2 AA, no una certificación.

## Criterio de publicación

No se crea una rama `release/*` ni se fusiona a `master` mientras `npm run legal:check:release` detecte identidad vacía o versión de texto en borrador. Después de completar esos datos se ejecutan CI, pruebas visuales, revisión del diff y el flujo normal feature → develop → release → master.
