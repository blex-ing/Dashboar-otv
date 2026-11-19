# Referencia y decisiones de producto — 19 noviembre 2026

## Alcance observado

Inspección directa de https://felinastudio.es/verificador-elecciones, las tres variantes de candidatura (`?c=colau`, `?c=feijoo`, `?c=sanchez`) y `/metodo`, incluidos sus apartados desplegables. Se probaron selección, filtro y apertura de una evidencia. No se auditó su backend ni la exactitud de sus conclusiones, ni se recorrieron los destinos externos de todas sus fuentes.

La portada introduce el servicio y dirige a entrevistas. Cada candidatura reúne reproductor, capítulos, marcadores temporales, recuentos y filtros. El detalle conecta cita, contexto, explicación, minuto y documentos. Método explica alcance, estados, fuentes, límites y revisión; incluye normas y fuentes desplegables. Las candidaturas comparten plantilla. La página declara un proceso con dos IA, algo no comprobado independientemente. No se observó una votación o un podio. Una navegación mostró contenido previo durante la carga; la metodología requirió recarga.

## Interpretación para OTV

OTV combina esa consulta documental con comparación de propuestas y participación. Su interfaz y contenido son propios: no se copian código, vídeos, fotografías, marcas, citas ni veredictos del sitio. La estética neón procede del encargo del usuario. Se conserva trazabilidad sin atribuir a OTV un proceso de IA que no existe.

## Inventario de recorridos OTV

| Ruta por parámetros | Objetivo | Resultado |
| --- | --- | --- |
| `?lugar=otavalo&vista=inicio` | Panorama y podio | Resumen derivado del catálogo y acceso a candidaturas |
| `?lugar=otavalo&vista=candidatos&c=ana` | Perfil | Propuestas por tema, capítulos y momentos |
| `?lugar=otavalo&vista=comparar` | Contraste horizontal | Mismo tema para todas las candidaturas |
| `?lugar=otavalo&vista=verificar` | Consulta de afirmaciones | Filtros combinables y búsqueda |
| `?lugar=otavalo&vista=verificar&c=ana&afirmacion=ana-obras` | Evidencia compartible | Cita, explicación, documentos y contexto temporal |
| `?lugar=otavalo&vista=fuentes` | Documentos | Texto de ejemplo y vínculo a afirmación |
| `?lugar=otavalo&vista=metodo` | Transparencia | Proceso propuesto, leyenda y límites |

## Límite de esta entrega

Se construye el observatorio navegable con datos sintéticos y API pública de lectura. No hay información real de candidaturas ni fuentes municipales, vídeos autorizados, credenciales de IA, D1 o Turnstile. Esos elementos no pueden darse por implementados mediante una maqueta. La simulación de apoyo solo modifica memoria de la pestaña: no es un sondeo y no registra preferencias.
