---
paths:
  - "src/services/**"
---

# Patrón de servicios

## Firebase

`auth` y `db` se importan exclusivamente desde `src/plugins/firebase.ts`.
Nunca llamar a `getAuth()` ni `getFirestore()` dentro de un servicio.

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

**Métodos de escritura** → re-lanzan el error en el catch:
```ts
export const saveData = async (...): Promise<void> => {
  try {
    // ...
  } catch (error) {
    throw error;
  }
};
```
