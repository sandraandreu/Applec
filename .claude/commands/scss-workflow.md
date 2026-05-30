Workflow para aplicar SCSS a una página o componente desde un diseño Figma. Sigue estos pasos en orden.

## Paso 1 — Recibir el diseño

El usuario proporciona:
- Enlace de Figma con el node-id del frame (`?node-id=XXX-XXXX`)
- Captura de pantalla del diseño

## Paso 2 — Analizar el diseño

Inspecciona el diseño usando ambas fuentes:

**Desde Figma via MCP** (`figma_execute` / `figma_get_component_for_development_deep`):
- Dimensiones exactas del frame y sus hijos
- Colores hex de fills y strokes
- Tipografía: font-size, font-weight, text-align
- Spacing: padding, margin, gap (itemSpacing)
- Border-radius, border-color
- Gradientes: dirección y color stops
- Layout: layoutMode (VERTICAL/HORIZONTAL), alignment

**Desde la captura de pantalla:**
- Confirmar estructura visual general
- Detectar elementos que quizás no se capturan bien por MCP

## Paso 3 — Proponer cambios de HTML/JSX

Si el diseño requiere cambios estructurales en el componente (nuevas clases BEM, elementos añadidos, estructura diferente):
- Describir los cambios necesarios
- **Esperar confirmación explícita del usuario antes de escribir ningún código**

## Paso 4 — Entregar especificación SCSS

Una vez aprobada la estructura HTML, proporcionar los datos para que el usuario escriba el SCSS.

**Formato de entrega:**

```
## .nombre-bloque
- propiedad: valor

## .nombre-bloque__elemento
- propiedad: valor

## .nombre-bloque--modificador
- propiedad: valor
```

**Reglas de los valores:**
- Colores: hex exacto extraído de Figma
- Unidades px: siempre valores pares (nunca 11px, 13px → usar 12px, 14px)
- No proponer variables CSS — valores directos
- Font-size mínimo: 16px — avisar si Figma usa menos y el usuario decide
- BEM obligatorio: `.block`, `.block__element`, `.block--modifier`

## Paso 5 — Textos

- Usar por defecto los textos que ya existen en el código
- Solo señalar si hay un elemento en el diseño que no tiene correspondencia en el código

## Paso 6 — SCSS

Claude solo escribe el SCSS si el usuario lo pide explícitamente.
