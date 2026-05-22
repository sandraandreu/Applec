# Capacitor — Plan de integración

## Cambios previos ya aplicados (rama `feature/capacitor-prep`)

- `firebase.ts` — `initializeAuth` con `indexedDBLocalPersistence` + `browserLocalPersistence`
- `index.html` — `viewport-fit=cover` en el meta viewport
- `index.html` — `color-scheme: light` (solo claro, evita fondo negro en WKWebView)
- `_reset.scss` — `overscroll-behavior: none` en `html` y `body` (elimina el bounce de iOS)

---

## Paso 1 — Instalar Capacitor

```bash
npm install @capacitor/core
npm install --save-dev @capacitor/cli
npx cap init
```

Durante `cap init` pedirá:
- **App name:** Applec
- **App ID:** com.applec.app (o el que se decida definitivo)
- **Web asset directory:** `build`

Esto genera `capacitor.config.ts` en la raíz.

### Añadir plataformas

```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

---

## Paso 2 — Script de build + sync

Cada vez que haya cambios hay que hacer build y sincronizar:

```bash
npm run build
npx cap sync
```

`cap sync` copia la carpeta `build/` al proyecto nativo y actualiza los plugins.

---

## Paso 3 — Plugins necesarios

### Back button de Android (`@capacitor/app`)

Sin esto, el botón atrás de Android cierra la app o se comporta de forma inesperada.

```bash
npm install @capacitor/app
npx cap sync
```

Conectarlo con React Router en `App.tsx` (o en un hook `useAndroidBack`):

```ts
import { App } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';

App.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) {
    window.history.back();
  } else {
    App.exitApp();
  }
});
```

### Status bar (`@capacitor/status-bar`)

Permite controlar el color y estilo de la barra de estado del móvil.

```bash
npm install @capacitor/status-bar
npx cap sync
```

Uso básico al arrancar la app:

```ts
import { StatusBar, Style } from '@capacitor/status-bar';

StatusBar.setStyle({ style: Style.Light }); // texto oscuro sobre fondo claro
StatusBar.setBackgroundColor({ color: '#FFFFFF' }); // solo Android
```

### Keyboard (`@capacitor/keyboard`)

Evita que el teclado tape los inputs de la parte inferior.

```bash
npm install @capacitor/keyboard
npx cap sync
```

Configuración en `capacitor.config.ts`:

```ts
plugins: {
  Keyboard: {
    resize: 'body',     // iOS: redimensiona el body al subir el teclado
    resizeOnFullScreen: true,
  },
},
```

---

## Paso 4 — Abrir en Xcode / Android Studio

```bash
npx cap open ios      # abre Xcode
npx cap open android  # abre Android Studio
```

Desde ahí se hace el build nativo y se instala en el dispositivo o simulador.

---

## Notas

- Las carpetas `android/` e `ios/` que existen ahora son de un proyecto Ionic anterior. Hay que borrarlas antes de hacer `npx cap add ios/android` para empezar limpio.
- Si en el futuro se añade Google Sign-in u otro OAuth, hay que usar `@capacitor-firebase/authentication` en vez del SDK web nativo de Firebase Auth.
- Las fuentes (Google Fonts, Fontshare) se cargan de CDN. Para soportar offline hay que auto-hostarlas en `public/`.
