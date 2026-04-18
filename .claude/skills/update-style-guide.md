---
name: update-style-guide
description: Añade un componente recién terminado a la Style Guide. Úsala cuando un componente tenga su .tsx y su .scss listos.
---

Vas a añadir un componente a la Style Guide del proyecto Falles App.

## Pasos

1. **Lee el componente** — lee el `.tsx` y el `.scss` del componente indicado.

2. **Identifica las variantes** — extrae de las props y los modificadores BEM del SCSS todas las combinaciones relevantes a mostrar (roles, tamaños, estados, variantes).

3. **Determina la sección** — si el componente está en `src/ui-kit/` va bajo la sección `UI Kit`; si está en `src/components/` va bajo `Components`.

4. **Lee `StyleGuide.tsx`** — lee `src/pages/style-guide/StyleGuide.tsx` completo antes de tocar nada.

5. **Añade el import** — añade el import del componente en el bloque de imports correspondiente (ui-kit o components), en orden alfabético dentro del bloque.

6. **Añade la subsección** — dentro de la sección correcta, añade:
   ```tsx
   <div className="style-guide__component">
     <h3 className="style-guide__component-name">NombreComponente</h3>
     {/* renders de ejemplo cubriendo todas las variantes */}
   </div>
   ```
   Usa datos de ejemplo realistas (nombres valencianos/catalanes, emails de falla, etc.).
   Si el componente necesita estado local (como Alert), añade un `useState` al componente StyleGuide.

7. **Comprueba px pares** — todos los valores px del SCSS generado deben ser pares.

8. **No toques** secciones existentes, imports que ya estén, ni el SCSS de `style-guide.scss` salvo que sea estrictamente necesario para el nuevo componente.
