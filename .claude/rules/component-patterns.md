---
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/ui-kit/**"
---

# Patrones de componentes y organización

## Dónde va cada componente

- **`src/ui-kit/`** — primitivas UI sin lógica de dominio (button, input, search)
- **`src/components/`** — componentes reutilizados en 2 o más páginas
- **Carpeta de la página** — componentes usados exclusivamente en una página

Si un componente solo lo usa una página, va dentro de esa página. No moverlo a `components/` hasta que una segunda página lo necesite.

## Nombres de archivo

No repetir el nombre de la carpeta en el archivo:
- `alert/alert.tsx` ✓
- `alert/alert-component.tsx` ✗
- `loading/loading.tsx` ✓
- `loading/loading-spinner-component.tsx` ✗

## Nombres de carpeta

Usar nombres directos y semánticos. Prohibido:
- `common/` → usar el nombre concreto del componente
- `feedback/` → usar `alert/` o `loading/` según corresponda

## Co-ubicación

Cada componente tiene su carpeta propia con el `.tsx` y el `.scss` juntos, ambos con el mismo nombre que la carpeta.
