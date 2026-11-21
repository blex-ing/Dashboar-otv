# Requisitos vivos — Observatorio ciudadano OTV

## Objetivo

Portal neutral para conocer candidaturas, contrastar propuestas y consultar evidencias, inicialmente ambientado en Otavalo y configurable para otras localidades. La audiencia es general; no se personaliza contenido político por perfil, origen ni preferencias. Edición v0.3.0: laboratorio público con datos sintéticos, sin encuesta ni resultados oficiales.

## Alcance y trazabilidad

La fuente comprobable de estado y evidencias es [TRAZABILIDAD.md](TRAZABILIDAD.md), respaldada por `trazabilidad.json`. CI ejecuta `npm run traceability:check` para impedir que un RF/RNF desaparezca de la matriz o apunte a un archivo inexistente.

| ID | Requisito y criterio verificable | Estado actual |
| --- | --- | --- |
| RF01 | Elegir localidad y conservarla en enlaces internos; un ID desconocido muestra recuperación | Otavalo e Ibarra de demostración |
| RF02 | Dashboard con candidaturas, propuestas, afirmaciones y documentos calculados sobre catálogo activo | Implementado |
| RF03 | Podio por apoyos descendentes y porcentajes sobre el total; total cero no divide por cero | Simulado; no pronóstico |
| RF04 | Perfil por URL con nombre, grupo, descripción, propuestas por tema y acceso a evidencias | Implementado con personas ficticias |
| RF05 | Comparar todas las candidaturas por un tema y mostrar plazo, alcance y ausencia de datos | Implementado |
| RF06 | Listado de afirmaciones con búsqueda, candidatura, tema y estado combinables | Implementado |
| RF07 | Recuentos de filtros derivados del conjunto visible; búsqueda sin coincidencias recuperable | Implementado |
| RF08 | Detalle compartible con cita, contexto, minuto, explicación, revisión y documentos | Implementado con ejemplos sintéticos |
| RF09 | Catálogo de documentos con editor, fecha, fragmento e identificación de su naturaleza | Implementado; fuentes reales pendientes |
| RF10 | Entrevista con capítulos y marcadores que seleccionan un momento sin fingir reproducción | Navegación temporal de ejemplo; vídeo pendiente |
| RF11 | Vídeo real autorizado con reproducción sincronizada, pregunta y cita exactas | Pendiente de contenidos reales e integración del reproductor |
| RF12 | Método público, leyenda, limitaciones y reglas desplegables | Implementado |
| RF13 | URL directa, recarga, atrás/adelante y navegación con teclado coherentes | Implementado |
| RF14 | Catálogo público de solo lectura en `/api/public/catalog` | Implementado; modo demo explícito |
| RF15 | Error remoto con copia de demostración identificada y reintento | Implementado |
| RF16 | Simular una selección de apoyo, cambiarla o reiniciarla sin tráfico POST ni persistencia | Implementado solo en memoria |
| RF17 | Voto público real con plazo, control de origen, Turnstile servidor, cookie segura, HMAC y unicidad atómica | Cerrado; pendiente |
| RF18 | Administración autenticada de localidades, ediciones, candidaturas, propuestas, fuentes y entrevistas | Pendiente |
| RF19 | Historial editorial, aportaciones y correcciones revisadas | Pendiente |
| RF20 | Canal de transcripción y verificación asistida con versiones, costes, revisión y desacuerdos | Pendiente; no se ejecutan IA |
| RF21 | Aplicar una política idéntica a todas las candidaturas de una edición | Regla de producto; canal editorial pendiente |
| RF22 | Exportación de datos con fecha, metodología y procedencia | Pendiente |
| RF23 | Integración estadística de apoyos reales por periodo, sin datos identificables | Pendiente |
| RF24 | Mostrar desde todas las vistas enlaces permanentes a aviso legal, privacidad, cookies y método | Implementado |
| RF25 | Explicar responsable, tratamientos reales, finalidades, bases, conservación, destinatarios, transferencias, derechos y AEPD | Implementado con información declarada por el responsable |
| RF26 | Publicar inventario de cookies y tecnologías similares; sin tecnologías opcionales no mostrar consentimiento, y bloquear las futuras hasta consentimiento válido | Implementado para el estado actual |
| RF27 | Versionar y fechar los textos legales, revisándolos cuando cambien responsable, proveedor, finalidades o tecnologías | Implementado |
| RF28 | Ofrecer un canal público para derechos de privacidad y correcciones editoriales | Implementado mediante correo específico |
| RF29 | Mostrar candidaturas reales de Alcaldía de Otavalo 2026 sin confundirlas con la demo, con procedencia enlazada y fecha de revisión; no atribuir programas sin fuente primaria | Parcial: seis identidades contrastadas en dos medios; planes originales y datos finales CNE por validar |
| RF30 | Publicar propuestas por candidatura con fuente primaria, apartado/página, cotejo factual y correcciones editoriales | Pendiente: examen individual de seis planes CNE |

## Reglas del producto

1. Propuestas y promesas no reciben veredictos de hechos. Las opiniones no cuentan como afirmaciones contrastadas.
2. La etiqueta de una afirmación exige evidencia y explicación; ausencia de documentos conserva estado pendiente. No se infiere intención de engaño.
3. Popularidad y verificación permanecen separadas. El podio solo ordena apoyos. La fórmula previa 70/30 se mantiene como idea de evaluación por tareas, no se aplica a veracidad ni a esta entrega.
4. Ante empate de apoyos, el nombre sirve solo como orden estable de presentación; no acredita un ganador. La aplicación no presenta una simulación como resultado electoral.
5. Las cifras de una localidad nunca se agregan implícitamente con otra. Las ediciones tendrán identificador y fechas propias antes de aceptar votos reales.
6. Los ejemplos se identifican en banner, detalle, fuente y método. No se usan personas políticas reales con afirmaciones inventadas ni documentos oficiales que no respalden los datos.
7. No se afirma que dos IA han verificado una ficha sin registros de las dos ejecuciones y su revisión. Una futura automatización propondrá comprobaciones; la política editorial decidirá publicación.
8. Se respetan derechos de los vídeos y documentos. Un futuro reproductor se cargará mediante acción del visitante, sin autoplay y con contexto de privacidad.
9. Las futuras fuentes reales enlazarán al documento concreto, no solo a una portada institucional. Deben conservar fecha consultada, periodo del dato y correcciones.

## Requisitos no funcionales

- RNF01: React/TypeScript, Node 24 y esbuild existentes; clases para catálogo y servicios; componentes compartidos. No añadir frameworks para resolver funciones ya cubiertas.
- RNF02: lectura útil a 320, 390 y 1440 px, sin desplazamiento horizontal de página; textos completos y botones de 44 px donde sean acciones principales. Navegación, etiquetas, foco visible y enlace de salto; objetivo WCAG 2.2 AA, no certificación.
- RNF03: colores de estado acompañados de texto; animación prescindible y respeto a movimiento reducido. Sin recursos tipográficos externos obligatorios.
- RNF04: contenido público sin secretos. CSP, cabeceras, API JSON independiente del fallback HTML; no abrir votación por añadir botones visuales.
- RNF05: no recoger preferencias políticas en localStorage, cookies o logs de esta entrega. La simulación se pierde al recargar. Antes de participación real, definir datos mínimos, retención, acceso y aviso de privacidad.
- RNF06: producción y previews aisladas. Los futuros IDs de D1 y secretos serán propios de cada entorno; no aplicar migraciones a producción desde ramas de prueba.
- RNF07: dependencias bloqueadas y auditoría; Actions fijadas por SHA; CI verde antes de merge. feature → develop → release → master → sincronización.
- RNF08: configuración de localidades en catálogo; no duplicar componentes por municipio. API y cliente reutilizan el mismo contrato de tipos.
- RNF09: estadísticas, filtros y detalle usan el mismo conjunto de datos. Relaciones candidatura/afirmación/fuente verificadas en pruebas. Cero resultados, enlace inválido y fallo remoto no dejan pantalla en blanco.
- RNF10: coste de los futuros proveedores de IA limitado por presupuesto y trabajos de fondo; sin claves en frontend ni llamadas sin control por cada visitante.
- RNF11: CI detecta almacenamiento web, escritura de cookies o rastreadores conocidos y bloquea una release con identidad legal vacía o textos en borrador.
- RNF12: las páginas legales tienen un único `h1`, navegación por teclado, tablas desplazables dentro de su región y lectura sin desbordamiento a 320 px.
- RNF13: las páginas de información electoral real deben distinguirse visual y semánticamente del catálogo ficticio, no recoger preferencias políticas, no presentar rankings y conservar cobertura equivalente para cada candidatura; verificar 320 px y enlaces.

## Datos y arquitectura objetivo

`Localidad → Edición → Candidatura → Propuesta / Entrevista → Afirmación → Revisión → Fuente`.

La edición real añadirá entidades persistentes y administración. En v0.3.0 un catálogo tipado alimenta una API de lectura; `ObservatoryService` calcula orden, porcentajes, métricas y filtros. `CandidateDirectory` conserva la búsqueda reutilizable de perfiles. `CatalogClient` gestiona lectura remota y fallback identificado. La presentación no decide un veredicto ni escribe votos.

## Puertas antes de una edición real

- Incorporar candidatos y programas autorizados, vídeos y transcripciones revisadas.
- Migraciones D1, administración con autorización verificada en servidor, auditoría y respaldo/restauración ensayados.
- Revisión editorial con documentos originales y trazabilidad de cambios; discrepancias explícitas.
- Abrir participación solo tras pruebas de origen, Turnstile inválido, duplicados, carreras concurrentes, cierre de plazo y separación entre entornos.
- No prometer una persona/un voto mediante IP y navegador: existen redes compartidas, borrado de cookies y otros límites.

## Adición v0.3.4 — separación de ediciones

- RF01a: cada localidad dispone de una o más ediciones con identificador estable; `?lugar=...&edicion=...` permite seleccionar una edición. Sin `edicion`, los enlaces v0.3.3 conservan la edición por defecto.
- RF01b: un ID de edición desconocido produce un estado recuperable; no se cambia de edición silenciosamente.
- RF03a: rankings, apoyos y porcentajes se calculan únicamente en la edición seleccionada; no hay total agregado por localidad.
- RF08a: afirmaciones, fuentes y entrevistas de una edición deben referirse a candidaturas y fuentes de esa misma edición.
- RF16a: la selección simulada se aísla por la pareja `localidad:edición` y se elimina al recargar.
- Prueba mínima: dos ediciones sintéticas en Otavalo con recuentos diferentes y una edición inexistente en Ibarra; comprobar navegación, URL, recarga, historial y ausencia de escrituras.

**Límite:** son contratos y fixtures de laboratorio; ni el origen de los datos ni los veredictos son todavía publicaciones electorales reales.
