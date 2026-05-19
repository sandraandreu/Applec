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

## useReducer vs useState — cuándo usar cada uno

El criterio no es el número de estados — es si forman una **máquina de estados con transiciones coordinadas**.

**Usar `useReducer` cuando:**
- Múltiples estados cambian juntos ante una misma acción (`LOGIN_START` → `isLoading=true, error=""`)
- Existe una secuencia clara de fases: idle → loading → success / error
- La lógica de transición tiene valor semántico al nombrarla (formularios de auth, wizards multi-paso, operaciones async con feedback)
- El reducer vive en un archivo separado `[nombre].reducer.ts` en la misma carpeta

**Usar `useState` cuando:**
- Los estados son independientes entre sí — cambiar uno no implica cambiar los otros
- Son toggles simples: `showMenu`, `showVoteSheet`, `isExpanded`
- El estado no tiene fases ni transiciones — solo se setea a un valor

**Agrupar en un único useState (objeto)** cuando dos o tres valores siempre se actualizan juntos pero no justifican un reducer completo:
```ts
// ✓ Bien — isLoading y error siempre cambian juntos
const [deleteState, setDeleteState] = useState({ isLoading: false, error: null });

// ✗ Mal — agrupar booleanos independientes solo complica las actualizaciones
const [uiState, setUiState] = useState({ showMenu: false, showVoteSheet: false, showAlert: false });
```

**Regla práctica:** si al ver las acciones del reducer puedes dar nombres claros como `SUBMIT_START`, `SUBMIT_ERROR`, `DISMISS` — es un buen candidato. Si las "acciones" serían solo `SET_SHOW_MENU` o `SET_FILTER` — usa `useState` directamente.
