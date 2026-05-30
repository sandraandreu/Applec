# Testing — guía del proyecto

## Stack

- **Vitest** — test runner (nativo de Vite, API compatible con Jest)
- **@testing-library/react** — renderiza componentes y los consulta como lo haría un usuario
- **@testing-library/jest-dom** — matchers extra: `toBeInTheDocument`, `toHaveTextContent`...
- **@testing-library/user-event** — simula interacciones realistas (click, escritura, etc.)
- **jsdom** — navegador falso para que React pueda renderizar en Node

```
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Configuración

### vitest.config.ts

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});
```

### src/setupTests.ts

```ts
import '@testing-library/jest-dom/vitest';
```

### package.json scripts

```json
"test": "vitest",
"test:run": "vitest run",
"test:ui": "vitest --ui"
```

---

## Tipos de test

| Nivel | Qué prueba | Ejemplo |
|---|---|---|
| **Unitario** | Una función aislada, sin dependencias externas | Función de mapeo, lógica de negocio pura |
| **Integración** | Varios elementos juntos: componente + servicio + interacción de usuario | Componente que carga datos y responde a clicks |

Solo hacemos unitarios e integración. No E2E.

---

## Estructura de archivos

```
src/
├── services/
│   ├── auth.service.ts
│   └── auth.service.test.ts
├── pages/auth/login/
│   ├── LoginPage.tsx
│   └── LoginPage.test.tsx
└── setupTests.ts
```

---

## Anatomía de un test

### Las herramientas que se importan de Vitest

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

- **`describe`** — agrupa tests relacionados bajo un nombre
- **`it`** — define un test individual
- **`expect`** — hace la comprobación ("espero que esto sea X")
- **`vi`** — herramientas para crear fakes y espiar funciones
- **`beforeEach`** — ejecuta algo antes de cada test del grupo

### Patrón Arrange – Act – Assert (AAA)

```ts
it('devuelve el perfil del usuario', async () => {
  // Arrange — preparar datos y mocks
  const fakeProfile = { uid: randomString(), email: randomEmail() };
  vi.mocked(getUserProfile).mockResolvedValue(fakeProfile);

  // Act — ejecutar la función a probar
  const result = await getUserProfile(fakeProfile.uid);

  // Assert — comprobar el resultado
  expect(result).toBe(fakeProfile);
});
```

---

## Mocks

### Por qué mockeamos

Los tests no deben llamar a Firebase real, ni a ninguna API externa. Si lo hicieran:
- Serían lentos
- Dependerían de internet
- Podrían fallar por causas ajenas al código

Con mocks, sustituimos Firebase por fakes que controlamos.

### Mockear un módulo completo

```ts
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('../plugins/firebase', () => ({ auth: {} }));
```

`vi.mock` se ejecuta antes que cualquier import, aunque esté escrito después en el archivo. Vitest lo mueve automáticamente al principio.

### vi.mocked() — helper de TypeScript

```ts
vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as any);
```

`vi.mocked()` le dice a TypeScript que esa función es un mock y puede usar `.mockResolvedValue`, `.mockRejectedValue`, etc. Sin él, TypeScript se quejaría.

### El mock siempre debe resolver si la función es async

Si la función es async, el `await` necesita que el mock resuelva — si no, el test explota antes de llegar al `expect`.

```ts
// Uso el resultado → mock con valor concreto
vi.mocked(myFn).mockResolvedValue(fakeValue);
const result = await myFn();
expect(result).toBe(fakeValue);

// No uso el resultado → mock vacío para que resuelva
vi.mocked(myFn).mockResolvedValue({} as any);
await myFn();
expect(myFn).toHaveBeenCalledWith(...);

// Función void → mock sin argumento
vi.mocked(myFn).mockResolvedValue();
await myFn();
```

### Mockear un error

```ts
vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
  new Error('auth/invalid-credential'),
);

await expect(loginUser(randomEmail(), randomString())).rejects.toThrow(
  'auth/invalid-credential',
);
```

Esto verifica que el servicio no silencia el error — que llega al componente.

### Limpiar entre tests

```ts
beforeEach(() => vi.clearAllMocks());
```

Los `vi.fn()` acumulan historial de llamadas. Sin limpiar, el segundo test vería las llamadas del primero y podría dar falsos positivos.

### Espiar un método de servicio (para tests de componente)

```ts
vi.spyOn(authService, 'loginUser').mockResolvedValue(fakeCredential);
```

---

## Comprobar llamadas a un mock

```ts
// se llamó con estos argumentos exactos
expect(myFn).toHaveBeenCalledWith(arg1, arg2);

// se llamó exactamente N veces
expect(myFn).toHaveBeenCalledTimes(1);
```

`toHaveBeenCalledTimes` es útil para asegurarse de que un servicio no hace dos peticiones cuando solo debería hacer una.

---

## Queries del DOM (testing-library)

| Query | Comportamiento | Cuándo usarla |
|---|---|---|
| `getBy*` | Síncrona. Lanza error si no existe | El elemento ya está en el DOM |
| `findBy*` | Asíncrona (devuelve Promise). Espera | El elemento llegará tras un `useEffect` |
| `queryBy*` | Síncrona. Devuelve `null` si no existe | Comprobar que algo **no** está |
| `getAllBy*` | Como `getBy*` pero devuelve array | Hay varios elementos iguales |

### Por qué `findBy*` necesita `await`

Cuando un componente carga datos en un `useEffect`, el render ocurre en dos fases:
1. Primer render → HTML vacío (los datos aún no han llegado)
2. `useEffect` se ejecuta → llama al servicio → datos llegan → segundo render

`getByText` es síncrono: se ejecuta en la fase 1 y el elemento no existe todavía → falla aunque el código esté bien.

`findByText` espera hasta que el elemento aparece en el DOM. Por eso necesita `await`.

```ts
render(<MyComponent />);
screen.debug(); // → HTML vacío, useEffect aún no ha resuelto

expect(await screen.findByText('resultado')).toBeInTheDocument();
screen.debug(); // → HTML con los datos pintados

// A partir de aquí getBy* es seguro
expect(screen.getByText('otro dato')).toBeInTheDocument();
```

El primer `findBy*` con `await` sincroniza el test con el ciclo async del componente. Los `getBy*` siguientes ya son seguros.

---

## Simular interacciones del usuario

```ts
const user = userEvent.setup();

await user.click(button);
await user.type(input, 'texto a escribir');
```

`userEvent` imita cómo interactúa un humano real — no solo lanza un evento click, sino toda la secuencia (mousedown, mouseup, click, focus...). Siempre `await` porque es asíncrono.

### Patrón para tests de interacción: estado antes → acción → estado después

```ts
it('marca el pokemon como favorito al pulsar Fav', async () => {
  const user = userEvent.setup();
  render(<App />);

  await screen.findByText('pikachu'); // esperar a que carguen los datos

  const favButtons = screen.getAllByRole('button', { name: /fav/i });
  expect(favButtons[1]).toHaveStyle({ color: 'rgb(0, 0, 0)' }); // antes

  await user.click(favButtons[1]);

  expect(favButtons[1]).toHaveStyle({ color: 'rgb(255, 0, 0)' }); // después
});
```

---

## Matchers de jest-dom más usados

```ts
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();
expect(element).toHaveTextContent('texto');
expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
expect(element).toBeDisabled();
expect(element).toHaveValue('valor del input');
```

## Matchers de Vitest más usados

```ts
expect(result).toBe(value);        // mismo valor Y misma referencia en memoria
expect(result).toEqual(value);     // mismo contenido (para objetos/arrays)
expect(result).toContain(item);    // array o string contiene el elemento
expect(fn).toHaveBeenCalledWith(); // mock fue llamado con estos argumentos
expect(fn).toHaveBeenCalledTimes(1);
await expect(promise).rejects.toThrow('mensaje');
```

`toBe` vs `toEqual`:
- `toBe` — comprueba que son el mismo objeto en memoria (más estricto)
- `toEqual` — comprueba que tienen el mismo contenido aunque sean objetos distintos

---

## Datos de test — usar strings aleatorios

Nunca usar strings hardcodeados (`'test'`, `'admin'`, `'es'`). Un string fijo puede hacer que un test pase por casualidad si coincide con algo en el código.

```ts
const randomString = () => Math.random().toString(36).substring(2);
const randomEmail = () => `${randomString()}@test.com`;
```

Cuando el valor concreto importa para la comprobación, guárdalo en una variable:

```ts
const email = randomEmail();
await sendPasswordReset(email);
expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, email);
```

---

## Verificar que un test está bien escrito

Un test verde no garantiza que esté bien. Puede pasar por razones equivocadas.

**Técnica: romper el código a propósito**

Modifica temporalmente el código de producción para que haga algo mal y comprueba que el test se pone rojo. Si sigue verde, el test no está vigilando lo que crees.

```ts
// Cambio temporal en el servicio para verificar el test
export const loginUser = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email); // eliminamos password
};
```

El test `toHaveBeenCalledWith(auth, email, password)` debería fallar. Si no lo hace, hay un problema en el test.

Revierte el cambio → el test vuelve a verde → confirmado que funciona.

**Regla: un test que nunca has visto en rojo no es de fiar.**

---

## Firebase — notas específicas del proyecto

- `auth` y `db` solo se exportan desde `src/plugins/firebase.ts`
- Mockear siempre a ese nivel: `vi.mock('../plugins/firebase', () => ({ auth: {} }))`
- Nunca mockear `getAuth()` o `getFirestore()` directamente

---

## Buenas prácticas

- Un test, una cosa — si falla, sabes exactamente qué se rompió
- Nombres descriptivos: `it('muestra error cuando el login falla')` no `it('test 1')`
- Testea comportamiento, no implementación — lo que ve el usuario, no el estado interno
- `queryBy*` para aserciones negativas, nunca `getBy*`
- Sin llamadas reales a Firebase — siempre mockear
- Al arreglar un bug: primero escribe el test que lo reproduce, luego el fix

---

## Causas de flaky tests a evitar

- Llamadas reales a la red → mockear Firebase
- Aserciones síncronas sobre datos async → usar `findBy*`
- Estado compartido entre tests → limpiar en `beforeEach`
- Reloj del sistema para lógica con fechas → usar `vi.setSystemTime`
