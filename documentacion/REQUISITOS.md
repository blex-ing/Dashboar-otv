# Requisitos vivos

## Alcance

Dashboard público de candidatos con notas por tareas y votos de apoyo. La naturaleza de los candidatos no está definida todavía. No se presupone una elección oficial ni un proceso de contratación.

| ID | Requisito | Estado v0.1.0 |
| --- | --- | --- |
| RF01 | Convocatorias con estado y fechas UTC | Modelo SQL |
| RF02 | Candidatos y tareas asociados a convocatoria | Modelo SQL |
| RF03 | Nota de 0 a 10 y peso positivo por tarea | Dominio y restricciones SQL |
| RF04 | Media ponderada; incompleto se muestra pendiente | Función compartida probada |
| RF05 | Mostrar nota técnica y apoyo separados | Decisión documentada; UI pendiente |
| RF06 | Un voto total por convocatoria, IP y navegador | Restricciones SQL; API cerrada |
| RF07 | Votar solo mientras la convocatoria esté abierta | Pendiente |
| RF08 | Administración autenticada y auditoría de cambios | Pendiente |
| RF09 | Ranking, filtros y desglose de tareas | Pendiente |
| RF10 | Estados vacíos, error y carga accesibles | Pantalla vacía inicial |

Regla inicial pendiente de validación de producto: cada persona apoya a un candidato por convocatoria, sin cambio de voto. No es un voto diario ni un voto por candidato. No hay fórmula que mezcle popularidad y evaluación.

## Requisitos no funcionales

- RNF01: validación y autoridad del servidor; nunca confiar en localStorage para el recuento.
- RNF02: diseño responsive desde 320 px, navegación con teclado, foco visible y etiquetas semánticas; objetivo WCAG 2.2 AA, sin certificación actual.
- RNF03: datos y secretos separados entre preview y producción; mínimo permiso en Actions.
- RNF04: restricciones SQL atómicas y pruebas ante solicitudes simultáneas antes de activar votos.
- RNF05: HMAC de IP y cookie por convocatoria; sin huella invasiva ni IP en logs de aplicación.
- RNF06: dependencias bloqueadas, auditoría automática y acciones fijadas por SHA.
- RNF07: migraciones versionadas y respaldo/restauración ensayados antes de datos reales.

## Criterios de aceptación de la siguiente versión

Crear convocatoria, candidatos y tareas desde administración protegida; mostrar calificaciones completas y pendientes; registrar un voto válido; rechazar duplicados por cada identificador independientemente, carrera concurrente, origen incorrecto, convocatoria cerrada y Turnstile inválido. Sin estos criterios, no habilitar votos públicos.
