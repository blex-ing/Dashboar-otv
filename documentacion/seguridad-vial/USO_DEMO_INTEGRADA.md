# Seguridad vial E35 — Uso de la demo integrada en OTV

## Acceso
El módulo es una página del **Dashboard OTV existente**, no una segunda web. Selecciona Otavalo y el menú **Seguridad vial**, o abre `?lugar=otavalo&vista=seguridad-vial`. Dentro de la sección se muestran cinco apartados: Resumen, Evidencias, Riesgos, Trabajo de campo y Fuentes. La cronología de siniestros de la v0.7.0 está incluida en **Fuentes**.

## Visualización de las 10 capturas originales del usuario
Las imágenes iniciales proceden de Google Maps/Street View y no se redistribuyen públicamente como assets de OTV. El ZIP aportado por el usuario `Expediente_E35_Eugenio_Espejo_v01.zip` contiene `datos/expediente_completo.json`, que incluye imágenes en formato data URI. Para verlas en un navegador:
1. Descomprime el ZIP **en tu propio dispositivo**.
2. Abre **Evidencias → Importar expediente JSON** y selecciona `datos/expediente_completo.json`.
3. Las diez fichas F01–F10 mostrarán su imagen original importada, con visor grande, filtro de tema y observación; también se verá F10 en la portada.
4. Las imágenes no se envían a Cloudflare ni a OTV. Al recargar se borran de la sesión salvo que actives expresamente **Guardar fotos en este dispositivo**.

## Fotos nuevas e intercambio local
El formulario permite añadir JPG/PNG/WebP de hasta 20 MB; el navegador reduce la foto a un máximo de 1500 px y genera una vista JPEG antes de guardarla en memoria. El usuario introduce título, categoría, fecha, observación y tarea de verificación; no hay moderación ni publicación automática. Las fotografías adicionales tienen ID N... y quedan diferenciadas del material histórico F01–F10.

- **Exportar expediente JSON** crea una copia portable con ficha, imagen local si existe, checklist y fecha. Quien la comparta debe revisar permisos y datos personales.
- **Importar expediente JSON** acepta archivos limitados a 16 MB y 70 imágenes, solo `data:image/jpeg|png|webp;base64`, con metadatos acotados. No admite URLs externas ni HTML.
- **Guardar fotos en este dispositivo** activa IndexedDB de manera voluntaria. Al desactivarlo cesan nuevos guardados; **Borrar fotos locales** limpia la sesión y el almacenamiento del módulo. Las fichas F01–F10 nunca se borran.
- La checklist se mantiene en memoria, con progreso y exportación específica. No se escribe automáticamente en el navegador.

## Seguridad y límites
No utilizar el croquis sin escala como plano real de circulación. Las 10 capturas son de febrero-marzo de 2025. R01–R07 son **prioridades de estudio**, no índices de riesgo calculados. Las noticias de 30/10/2026 documentan una colisión entre vehículos con tres fallecidos y una persona herida en el sector, sin confirmar atropello peatonal ni ubicación exacta del siniestro en el semáforo.

**Referencias internas:** [Contrato de integración](CONTRATO_INTEGRACION_DEMO.md), [Expediente previo](EXPEDIENTE_E35.md), [Contrato original](CONTRATO.md). Consulta la política de privacidad/cookies del sitio antes de activar IndexedDB.

## Desarrollo
Arquitectura: `RoadSafetyPage` (orquestación), `SafetyDiagram` (SVG), `SafetyPhotos` (galería/visor/importación/formulario), `SafetyPanels` (riesgos/campo/fuentes), `useEvidenceAlbum` (consentimiento y estado local), `evidence-data` (validación de JSON y persistencia), `road-safety-supplement` (cuatro fuentes del dossier y dos noticias posteriores).

QA: `cd web && npm ci && npm run check && npm run test:visual && npm audit --audit-level=high`, incluyendo pruebas del expediente anterior. CSS aislado para no afectar las páginas electorales.
