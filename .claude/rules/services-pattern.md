---
paths:
  - "src/services/**"
---

# Patrón de servicios

## Firebase

`auth` y `db` se importan exclusivamente desde `src/plugins/firebase.ts`.
Nunca llamar a `getAuth()` ni `getFirestore()` dentro de un servicio.

## Sin console.error en los catch

El logging es responsabilidad del componente, no del servicio. Nunca añadir `console.error` dentro de un catch de servicio. El componente decide qué hacer con el error.

## Try/catch obligatorio en todos los métodos

**Métodos de lectura** → devuelven `null` en el catch:
```ts
export const getData = async (...): Promise<T | null> => {
  try {
    // ...
    return data;
  } catch {
    return null;
  }
};
```

**Métodos de escritura** → sin try/catch. El error sube solo al componente:
```ts
export const saveData = async (...): Promise<void> => {
  await doSomething();
};
```
