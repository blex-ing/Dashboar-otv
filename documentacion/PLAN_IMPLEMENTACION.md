# Plan de evolución del observatorio

## Recorridos y decisiones de diseño

Este documento desarrolla los requisitos propios de OTV. La inspección y sus límites se recogen en [ANALISIS_REFERENCIA.md](ANALISIS_REFERENCIA.md); no constituye una auditoría de las conclusiones de la web de referencia.

| Recorrido | Pregunta del visitante | Decisión para OTV | Criterio de aceptación |
| --- | --- | --- | --- |
| Inicio | ¿Qué puedo consultar en mi localidad? | Resumen calculado, accesos a propuestas y evidencia; podio separado | Cambiar localidad actualiza catálogo, enlaces y métricas |
| Candidatura | ¿Quién propone y qué ofrece? | Perfil reutilizable, temas comunes, plazos, acceso a afirmaciones | Un enlace directo identifica un perfil sin pasos previos |
| Comparador | ¿Qué alternativas hay para el mismo problema? | Comparar tema, alcance y plazo; no puntuar promesas como hechos | El mismo filtro se aplica a todas las columnas |
| Entrevista | ¿Dónde y en qué contexto se dijo? | Capítulos y momentos; reproductor real en la siguiente fase | Un minuto permite regresar al contexto original, sin autoplay |
| Verificador | ¿Qué puedo contrastar? | Búsqueda y filtros combinables; contadores derivados | Candidato, tema y estado reducen el mismo conjunto de datos |
| Detalle | ¿Por qué se asignó ese estado? | Cita, explicación, revisión, minuto y documentos | La recarga y el historial conservan el caso seleccionado |
| Documento | ¿Qué dato sostiene la explicación? | Editor, fecha, extracto y relación con afirmación | No basta un enlace a la portada de una institución |
| Método | ¿Cómo se decide y qué límites existen? | Reglas visibles y versionadas; mismas condiciones para todos | El visitante distingue hecho, opinión, propuesta y apoyo |
| Participación | ¿Mi apoyo se ha registrado? | En demo solo selección temporal; en producción confirmación del servidor | No incrementar cifras sin una escritura aceptada y contabilizada |

## Modelo para cualquier lugar

La configuración actual contiene país, región, localidad, nombre de edición y sus contenidos. La interfaz no se duplica por municipio. Antes de una elección real, separar `localidad` de `edición`: un mismo lugar puede tener distintas elecciones y periodos de participación.

La siguiente migración deberá introducir identificadores estables para edición, candidatura, propuesta, entrevista, afirmación, revisión y fuente. Cada consulta y voto se asociará explícitamente a una edición. La configuración editorial añadirá idioma, zona horaria, apertura y cierre; no se trasladan cifras o candidaturas entre territorios automáticamente. Una eventual versión en kichwa necesita traducción revisada, no textos inventados.

## Ingesta y publicación real

1. Registrar localidad y edición, con fechas y responsables editoriales.
2. Incorporar candidaturas, programas y su procedencia; marcar ausencia de datos sin completar con suposiciones.
3. Registrar vídeo, autor, fecha, permiso o modalidad de inserción; transcribir con pregunta y marcas temporales.
4. Separar afirmaciones comprobables de opiniones y promesas. Una promesa se añade al comparador.
5. Buscar el documento concreto y conservar organismo, periodo, fecha de consulta y localización del dato.
6. Preparar una explicación y una revisión. Una IA futura puede asistir; sus ejecuciones, versión y desacuerdos se registran. El voto del público no determina un veredicto.
7. Publicar solo con la política editorial aplicada de forma uniforme. Conservar revisiones anteriores y ofrecer una vía de corrección moderada.

La ausencia de evidencia mantiene un caso pendiente. Una fuente que contradice un dato no acredita por sí sola intención de engañar. La cobertura desigual debe mostrarse como cobertura, sin convertir el porcentaje de afirmaciones revisadas en una clasificación de honestidad.

## Entregas

| Fase | Resultado | Dependencia para considerarla completa |
| --- | --- | --- |
| v0.3.0 | Observatorio navegable, API de lectura y ejercicios sintéticos | Compilación, dominio/API/SQL, auditoría y pruebas visuales |
| Contenido real | Una primera edición documentada de Otavalo | Programas, vídeos y fuentes concretas; revisión editorial |
| Gestión | Administración autenticada, D1 e historial | Autorización servidor, migraciones separadas, copia y restauración |
| Verificación asistida | Trabajos de transcripción y análisis con presupuesto | Proveedor configurado, trazabilidad y revisión antes de publicar |
| Participación | Apoyos persistentes y estadísticas por edición | Turnstile servidor, origen, cookie segura, HMAC, unicidad atómica y pruebas concurrentes |
| Expansión | Nuevas localidades e idiomas | Configuración, contenido revisado y separación de ediciones |

El orden evita que una interfaz aparente una capacidad que todavía no tiene. La v0.3.0 no incluye administración, reproducción real, IA ni recepción de votos; esos módulos no están ocultos detrás de los botones de demostración.

## Validación y operación

Los recorridos se verifican a 320, 390 y 1440 px, incluyendo enlace directo, filtros, historial, teclado, error remoto, vacío y selección de apoyo sin POST. Las capturas son evidencia de revisión visual, no certifican por sí solas accesibilidad completa.

Para contenido real se añadirán pruebas de permisos editoriales, revisión de enlaces y documentos, sincronización del vídeo, aislamiento entre ediciones, duplicados y concurrencia de votos. El despliegue conserva el flujo feature → develop → release → master y sincronización; los secretos y bases de producción nunca se copian a previews.
