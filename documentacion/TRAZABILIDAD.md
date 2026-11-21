# Trazabilidad de requisitos y pruebas

La matriz canónica está en [`trazabilidad.json`](trazabilidad.json). Cada entrada clasifica el requisito como `implemented`, `partial`, `policy`, `pending` o `blocked` y enlaza evidencia versionada. `npm run traceability:check` compara automáticamente sus IDs con `REQUISITOS.md`, comprueba duplicados y valida que cada archivo y cada nombre de prueba referenciado existan.

## Interpretación

- **implemented:** comportamiento disponible y cubierto por evidencia automatizada.
- **partial:** existe una parte verificable, pero no todo el objetivo o no hay certificación completa.
- **policy:** regla documental del producto; exige aplicación editorial u operativa además del código.
- **pending:** funcionalidad no construida.
- **blocked:** no debe iniciarse hasta aprobar las puertas indicadas.

La matriz no transforma pruebas automatizadas en certificación WCAG, revisión jurídica, pentest ni garantía de protección configurada en GitHub. Los requisitos pendientes permanecen visibles para evitar confundir el laboratorio con el producto futuro.

## Uso

Desde `web/`:

```sh
npm run traceability:check
```

Para añadir o cambiar un RF/RNF, actualizar en el mismo PR `REQUISITOS.md`, `trazabilidad.json` y la evidencia correspondiente. CI rechazará omisiones y rutas o nombres de prueba inexistentes.
